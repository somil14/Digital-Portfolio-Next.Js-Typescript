import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  Object3D,
  Points,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  type Camera,
} from "three";
import { sections } from "@/content/sections";
import { clusters, endpoints } from "@/content/syntheticData";
import { buildConstellation } from "@/lib/constellation";
import type { ScenePalette } from "./palette";

const { nodes, edges } = buildConstellation(endpoints, clusters);
const COUNT = nodes.length;

/** World positions. SVG y points down, three.js y points up. */
const positions = nodes.map((node) => new Vector3(node.x, -node.y, node.z));
const distances = positions.map((position) => position.length());
const shadowIds = nodes.flatMap((node, i) =>
  node.endpoint.documented ? [] : [i],
);
const hubIds = nodes.flatMap((node, i) => (node.hub ? [i] : []));

/** Five cluster hubs double as navigation to these sections. */
export const sceneLinks = [
  "whoami",
  "work",
  "projects",
  "experience",
  "contact",
]
  .map((id) => sections.find((section) => section.id === id))
  .flatMap((section, i) => (section ? [{ section, node: hubIds[i] }] : []));
const linkByNode = new Map(
  sceneLinks.map((link) => [link.node, link.section.id]),
);

const CALLOUT = nodes.findIndex(
  (node) => node.endpoint.id === "GET /internal/v0/export",
);
export const calloutText = "⚠ GET /internal/v0/export — not in spec";

const WAVE_PERIOD = 4;
const WAVE_SPEED = 0.62;
const WAVE_MAX = 1.35;
const NODE_RADIUS = 0.013;

const glowVertex = /* glsl */ `
  attribute vec3 color;
  attribute float size;
  varying vec3 vColor;
  uniform float uPixelRatio;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * uPixelRatio * (3.2 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const glowFragment = /* glsl */ `
  varying vec3 vColor;
  uniform float uStrength;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, alpha * alpha * uStrength);
  }
`;
const waveVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const waveFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float rim = 1.0 - abs(dot(vNormal, vView));
    gl_FragColor = vec4(uColor, pow(rim, 3.0) * uOpacity);
  }
`;

export interface SceneOverlay {
  links: (HTMLElement | null)[];
  hover: HTMLElement | null;
  callout: HTMLElement | null;
}

interface FrameInput {
  delta: number;
  pointerX: number;
  pointerY: number;
  camera: Camera;
  width: number;
  height: number;
  pixelRatio: number;
}

/**
 * The hero graph as plain three.js objects. All per-frame work happens in
 * `update`, with no allocations: every vector, colour and matrix is reused.
 */
export class ConstellationScene {
  readonly group = new Group();

  private readonly overlay: SceneOverlay = {
    links: [],
    hover: null,
    callout: null,
  };
  /** Called once if the scene cannot hold roughly 40fps. */
  private onSlow?: () => void;
  private onFirstFrame?: () => void;

  private readonly mesh: InstancedMesh<SphereGeometry, MeshBasicMaterial>;
  private readonly glow: Points<BufferGeometry, ShaderMaterial>;
  private readonly wave: Mesh<SphereGeometry, ShaderMaterial>;
  private readonly lines: LineSegments<BufferGeometry, LineBasicMaterial>;
  private readonly glowColors: BufferAttribute;

  private palette: ScenePalette;
  private lowQuality = false;
  private time = 0;
  private started = false;
  private frames = 0;
  private frameTime = 0;
  private hovered = -1;
  private calloutUntil = -1;
  private readonly touchedCycle = new Int32Array(COUNT).fill(-1);
  private readonly pulseAt = new Float32Array(COUNT).fill(-10);
  private readonly flipped = new Uint8Array(COUNT);

  private readonly object = new Object3D();
  private readonly vector = new Vector3();
  private readonly color = new Color();

  constructor(palette: ScenePalette) {
    this.palette = palette;

    const linePositions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      positions[a].toArray(linePositions, i * 6);
      positions[b].toArray(linePositions, i * 6 + 3);
    });
    const lineGeometry = new BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new BufferAttribute(linePositions, 3),
    );
    this.lines = new LineSegments(
      lineGeometry,
      new LineBasicMaterial({
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
      }),
    );

    const glowPositions = new Float32Array(COUNT * 3);
    const glowSizes = new Float32Array(COUNT);
    positions.forEach((position, i) => {
      position.toArray(glowPositions, i * 3);
      glowSizes[i] = nodes[i].hub ? 46 : nodes[i].endpoint.documented ? 26 : 40;
    });
    this.glowColors = new BufferAttribute(new Float32Array(COUNT * 3), 3);
    const glowGeometry = new BufferGeometry();
    glowGeometry.setAttribute(
      "position",
      new BufferAttribute(glowPositions, 3),
    );
    glowGeometry.setAttribute("size", new BufferAttribute(glowSizes, 1));
    glowGeometry.setAttribute("color", this.glowColors);
    this.glow = new Points(
      glowGeometry,
      new ShaderMaterial({
        vertexShader: glowVertex,
        fragmentShader: glowFragment,
        uniforms: { uPixelRatio: { value: 1 }, uStrength: { value: 0.5 } },
        transparent: true,
        depthWrite: false,
      }),
    );
    // Points are for glow only; picking goes through the instanced spheres.
    this.glow.raycast = () => {};

    this.mesh = new InstancedMesh(
      new SphereGeometry(NODE_RADIUS, 12, 12),
      new MeshBasicMaterial({ toneMapped: false }),
      COUNT,
    );
    for (let i = 0; i < COUNT; i++) this.place(i, nodes[i].hub ? 1.7 : 1);

    this.wave = new Mesh(
      new SphereGeometry(1, 40, 24),
      new ShaderMaterial({
        vertexShader: waveVertex,
        fragmentShader: waveFragment,
        uniforms: { uColor: { value: new Color() }, uOpacity: { value: 0 } },
        transparent: true,
        depthWrite: false,
        side: BackSide,
      }),
    );
    this.wave.visible = false;
    this.wave.raycast = () => {};
    this.lines.raycast = () => {};

    this.group.add(this.lines, this.glow, this.mesh, this.wave);
    this.setPalette(palette);
  }

  setHandlers(handlers: { onFirstFrame: () => void; onSlow: () => void }) {
    this.onFirstFrame = handlers.onFirstFrame;
    this.onSlow = handlers.onSlow;
  }

  /** DOM labels that follow nodes: a link by index, or a named label. */
  setLabel(slot: number | "hover" | "callout", element: HTMLElement | null) {
    if (typeof slot === "number") this.overlay.links[slot] = element;
    else this.overlay[slot] = element;
  }

  setPalette(palette: ScenePalette) {
    this.palette = palette;
    const blending = palette.light ? NormalBlending : AdditiveBlending;
    for (let i = 0; i < COUNT; i++) this.paint(i);
    this.lines.material.color.copy(palette.signal);
    this.glow.material.blending = blending;
    this.glow.material.uniforms.uStrength.value = palette.light ? 0.28 : 0.5;
    this.wave.material.blending = blending;
    this.wave.material.uniforms.uColor.value.copy(palette.signal);
  }

  setLowQuality(low: boolean) {
    this.lowQuality = low;
    this.glow.visible = !low;
  }

  update(frame: FrameInput) {
    const step = Math.min(frame.delta, 0.05);
    this.time += step;
    const time = this.time;

    if (!this.started) {
      this.started = true;
      this.onFirstFrame?.();
    }
    if (this.frames < 120) {
      this.frames++;
      this.frameTime += frame.delta;
      if (this.frames === 120 && this.frameTime / 120 > 1 / 40) this.onSlow?.();
    }

    // Slow sway plus pointer parallax, eased.
    const ease = 1 - Math.exp(-step * 3);
    const targetY = Math.sin(time * 0.16) * 0.42 + frame.pointerX * 0.22;
    const targetX = frame.pointerY * -0.14;
    this.group.rotation.y += (targetY - this.group.rotation.y) * ease;
    this.group.rotation.x += (targetX - this.group.rotation.x) * ease;
    this.group.updateMatrixWorld();

    // Scan wave: an expanding shell that finds the undocumented nodes.
    const cycle = Math.floor(time / WAVE_PERIOD);
    const radius = (time % WAVE_PERIOD) * WAVE_SPEED;
    const waveVisible = !this.lowQuality && radius < WAVE_MAX;
    this.wave.visible = waveVisible;
    if (waveVisible) {
      this.wave.scale.setScalar(Math.max(radius, 0.001));
      this.wave.material.uniforms.uOpacity.value =
        (1 - radius / WAVE_MAX) * 0.55;
    }
    this.glow.material.uniforms.uPixelRatio.value = frame.pixelRatio;

    let moved = false;
    for (const i of shadowIds) {
      if (radius >= distances[i] && this.touchedCycle[i] !== cycle) {
        this.touchedCycle[i] = cycle;
        this.pulseAt[i] = time;
        if (!this.flipped[i]) {
          this.flipped[i] = 1;
          this.paint(i);
        }
        if (i === CALLOUT) this.calloutUntil = time + 1.9;
      }
      const since = time - this.pulseAt[i];
      if (since < 2) {
        this.place(i, 1.25 + 1.6 * Math.exp(-since * 3));
        moved = true;
      }
    }
    if (moved) this.mesh.instanceMatrix.needsUpdate = true;

    // DOM labels follow their nodes.
    sceneLinks.forEach((link, i) =>
      this.project(link.node, this.overlay.links[i], frame),
    );
    const { callout, hover } = this.overlay;
    if (callout) {
      this.project(CALLOUT, callout, frame);
      callout.style.opacity = time < this.calloutUntil ? "1" : "0";
    }
    if (hover && this.hovered >= 0) this.project(this.hovered, hover, frame);
  }

  /** Returns the section a node links to, if any. */
  linkFor(instanceId: number | undefined): string | undefined {
    return instanceId === undefined ? undefined : linkByNode.get(instanceId);
  }

  hover(instanceId: number | undefined) {
    const label = this.overlay.hover;
    if (instanceId === undefined || !label || instanceId === this.hovered)
      return;
    this.hovered = instanceId;
    const { method, path } = nodes[instanceId].endpoint;
    label.textContent = `${method} ${path}`;
    label.style.opacity = "1";
    document.body.style.cursor = linkByNode.has(instanceId) ? "pointer" : "";
  }

  unhover() {
    this.hovered = -1;
    if (this.overlay.hover) this.overlay.hover.style.opacity = "0";
    document.body.style.cursor = "";
  }

  dispose() {
    this.unhover();
    for (const item of [this.lines, this.glow, this.mesh, this.wave]) {
      item.geometry.dispose();
      item.material.dispose();
    }
  }

  private paint(i: number) {
    const { palette, color } = this;
    if (nodes[i].endpoint.documented) color.copy(palette.signal);
    else color.copy(this.flipped[i] ? palette.warn : palette.muted);
    this.mesh.setColorAt(i, color);
    this.glowColors.setXYZ(i, color.r, color.g, color.b);
    this.glowColors.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  private place(i: number, scale: number) {
    this.object.position.copy(positions[i]);
    this.object.scale.setScalar(scale);
    this.object.updateMatrix();
    this.mesh.setMatrixAt(i, this.object.matrix);
  }

  private project(
    index: number,
    element: HTMLElement | null,
    frame: FrameInput,
  ) {
    if (!element) return;
    this.vector
      .copy(positions[index])
      .applyMatrix4(this.group.matrixWorld)
      .project(frame.camera);
    const x = (this.vector.x * 0.5 + 0.5) * frame.width;
    const y = (-this.vector.y * 0.5 + 0.5) * frame.height;
    element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }
}
