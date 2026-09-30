"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { goToSection } from "@/components/layout/CommandMenu";
import {
  ConstellationScene,
  calloutText,
  sceneLinks,
} from "./ConstellationScene";
import { readPalette, watchPalette } from "./palette";
import { useSceneActive } from "./useSceneActive";

type Quality = "high" | "medium" | "low";

function Graph({ scene }: { scene: ConstellationScene }) {
  const router = useRouter();

  useFrame((state, delta) =>
    scene.update({
      delta,
      pointerX: state.pointer.x,
      pointerY: state.pointer.y,
      camera: state.camera,
      width: state.size.width,
      height: state.size.height,
      pixelRatio: state.viewport.dpr,
    }),
  );

  return (
    <primitive
      object={scene.group}
      onPointerMove={(event: ThreeEvent<PointerEvent>) =>
        scene.hover(event.instanceId)
      }
      onPointerOut={() => scene.unhover()}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        const target = scene.linkFor(event.instanceId);
        if (target) goToSection(target, router.push);
      }}
    />
  );
}

interface EndpointConstellationProps {
  onReady: () => void;
  onLost: () => void;
}

/**
 * Hero scene: the synthetic endpoints as a slowly turning graph. A scan wave
 * passes through and turns undocumented nodes amber. Decorative; the page
 * carries a text equivalent and real navigation.
 */
export default function EndpointConstellation({
  onReady,
  onLost,
}: EndpointConstellationProps) {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const active = useSceneActive(container);
  const [quality, setQuality] = useState<Quality>("high");
  const [scene] = useState(() => new ConstellationScene(readPalette()));

  useEffect(() => {
    scene.setHandlers({
      onFirstFrame: onReady,
      onSlow: () =>
        setQuality((current) => (current === "high" ? "medium" : "low")),
    });
    const stopWatching = watchPalette((palette) => scene.setPalette(palette));
    return () => {
      stopWatching();
      scene.dispose();
    };
  }, [scene, onReady]);

  useEffect(() => scene.setLowQuality(quality === "low"), [scene, quality]);

  return (
    <div ref={container} aria-hidden="true" className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={quality === "high" ? [1, 1.75] : 1}
        camera={{ position: [0, 0, 3.2], fov: 34, near: 0.1, far: 20 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", onLost, {
            once: true,
          });
        }}
      >
        <Graph scene={scene} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sceneLinks.map((link, i) => (
          <button
            key={link.section.id}
            ref={(element) => scene.setLabel(i, element)}
            type="button"
            tabIndex={-1}
            onClick={() => goToSection(link.section.id, router.push)}
            className="label text-muted hover:text-signal pointer-events-auto absolute top-0 left-0 -mt-8 ml-3 inline-flex min-h-6 items-center whitespace-nowrap transition-colors duration-150"
          >
            → {link.section.label}
          </button>
        ))}
        <span
          ref={(element) => scene.setLabel("callout", element)}
          className="label text-warn absolute top-0 left-0 mt-3 ml-4 whitespace-nowrap normal-case opacity-0 transition-opacity duration-300"
        >
          {calloutText}
        </span>
        <span
          ref={(element) => scene.setLabel("hover", element)}
          className="label border-line bg-surface text-text absolute top-0 left-0 mt-3 ml-3 border px-2 py-1 whitespace-nowrap normal-case opacity-0 transition-opacity duration-150"
        />
      </div>
    </div>
  );
}
