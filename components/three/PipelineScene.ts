import {
  BoxGeometry,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
} from "three";
import type { ScenePalette } from "./palette";

/** Layers a request passes through; the platform plate sits underneath. */
const HOPS = 5;
const TILT_X = 0.32;
const TILT_Y = -0.72;

export interface TraceState {
  packetAt: number | null;
  returning: boolean;
  active: number | null;
}

/**
 * Request pipeline as translucent slabs with a packet passing through them.
 * Drawn with an orthographic camera so slab centres line up with the five
 * evenly spaced layer buttons in the DOM below the canvas.
 */
export class PipelineScene {
  readonly group = new Group();

  private readonly slabs: Mesh<BoxGeometry, MeshBasicMaterial>[] = [];
  private readonly outlines: LineSegments<EdgesGeometry, LineBasicMaterial>[] =
    [];
  private readonly platform: Mesh<BoxGeometry, MeshBasicMaterial>;
  private readonly packet: Mesh<SphereGeometry, MeshBasicMaterial>;
  private readonly halo: Mesh<SphereGeometry, MeshBasicMaterial>;

  private palette: ScenePalette;
  private trace: TraceState = {
    packetAt: null,
    returning: false,
    active: null,
  };
  private packetX = 0;
  private time = 0;

  constructor(palette: ScenePalette) {
    this.palette = palette;
    const box = new BoxGeometry(1, 1.5, 0.14);
    const edges = new EdgesGeometry(box);

    for (let i = 0; i < HOPS; i++) {
      const slab = new Mesh(
        box,
        new MeshBasicMaterial({
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
        }),
      );
      const outline = new LineSegments(
        edges,
        new LineBasicMaterial({ transparent: true, opacity: 0.5 }),
      );
      slab.rotation.set(TILT_X, TILT_Y, 0);
      slab.add(outline);
      this.slabs.push(slab);
      this.outlines.push(outline);
      this.group.add(slab);
    }

    this.platform = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial({
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      }),
    );
    this.packet = new Mesh(
      new SphereGeometry(0.09, 20, 20),
      new MeshBasicMaterial({ toneMapped: false }),
    );
    this.halo = new Mesh(
      new SphereGeometry(0.2, 20, 20),
      new MeshBasicMaterial({
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    );
    this.packet.add(this.halo);
    this.packet.visible = false;
    this.group.add(this.platform, this.packet);
    this.setPalette(palette);
  }

  setPalette(palette: ScenePalette) {
    this.palette = palette;
    for (let i = 0; i < HOPS; i++) {
      this.slabs[i].material.color.copy(palette.signal);
      this.outlines[i].material.color.copy(palette.signal);
    }
    this.platform.material.color.copy(palette.muted);
  }

  setTrace(trace: TraceState) {
    this.trace = trace;
  }

  /** `viewWidth` is the visible width in world units. */
  update(delta: number, viewWidth: number) {
    const step = Math.min(delta, 0.05);
    this.time += step;
    const spacing = viewWidth * 0.2;
    const size = Math.min(spacing * 0.42, 0.95);
    const ease = 1 - Math.exp(-step * 9);
    const { packetAt, returning, active } = this.trace;

    for (let i = 0; i < HOPS; i++) {
      const slab = this.slabs[i];
      const lit = active === i;
      slab.position.x = (i - 2) * spacing;
      slab.scale.setScalar(size);
      slab.material.opacity +=
        ((lit ? 0.34 : 0.09) - slab.material.opacity) * ease;
      const outline = this.outlines[i].material;
      outline.opacity += ((lit ? 1 : 0.42) - outline.opacity) * ease;
    }

    // The platform plate spans the three backend layers.
    this.platform.position.set(spacing, -0.92 * size, 0);
    this.platform.scale.set(spacing * 2 + size * 1.5, 0.05, size * 0.9);
    this.platform.rotation.set(TILT_X, 0, 0);

    this.packet.visible = packetAt !== null;
    if (packetAt !== null) {
      const target = (packetAt - 2) * spacing;
      this.packetX += (target - this.packetX) * (1 - Math.exp(-step * 7));
      this.packet.position.set(
        this.packetX,
        Math.sin(this.time * 5) * 0.035,
        0.9,
      );
      const colour = returning ? this.palette.ok : this.palette.signal;
      this.packet.material.color.copy(colour);
      this.halo.material.color.copy(colour);
      this.halo.scale.setScalar(1 + Math.sin(this.time * 6) * 0.12);
    }
  }

  dispose() {
    this.slabs[0].geometry.dispose();
    this.outlines[0].geometry.dispose();
    for (const slab of this.slabs) slab.material.dispose();
    for (const outline of this.outlines) outline.material.dispose();
    for (const mesh of [this.platform, this.packet, this.halo]) {
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
  }
}
