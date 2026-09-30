"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { PipelineScene, type TraceState } from "./PipelineScene";
import { readPalette, watchPalette } from "./palette";
import { useSceneActive } from "./useSceneActive";

function Slabs({ scene }: { scene: PipelineScene }) {
  useFrame((state, delta) => scene.update(delta, state.viewport.width));
  return <primitive object={scene.group} />;
}

interface RequestPipelineProps extends TraceState {
  onLost: () => void;
}

/** WebGL view of the pipeline trace. Decorative: the DOM carries the content. */
export default function RequestPipeline({
  packetAt,
  returning,
  active,
  onLost,
}: RequestPipelineProps) {
  const container = useRef<HTMLDivElement>(null);
  const running = useSceneActive(container);
  const [scene] = useState(() => new PipelineScene(readPalette()));

  useEffect(() => {
    const stopWatching = watchPalette((palette) => scene.setPalette(palette));
    return () => {
      stopWatching();
      scene.dispose();
    };
  }, [scene]);

  useEffect(
    () => scene.setTrace({ packetAt, returning, active }),
    [scene, packetAt, returning, active],
  );

  return (
    <div ref={container} aria-hidden="true" className="absolute inset-0">
      <Canvas
        orthographic
        frameloop={running ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ zoom: 100, position: [0, 0, 10], near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", onLost, {
            once: true,
          });
        }}
      >
        <Slabs scene={scene} />
      </Canvas>
    </div>
  );
}
