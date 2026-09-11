"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function Core() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.28;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
    if (ring.current) ring.current.rotation.z -= delta * 0.22;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.05, 2]} />
        <meshBasicMaterial color="#bdf7ff" wireframe transparent opacity={0.9} />
      </mesh>
      <mesh scale={0.72}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#6ae8ff" wireframe transparent opacity={0.28} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.2, 0.1, 0]}>
        <torusGeometry args={[1.5, 0.018, 12, 96]} />
        <meshBasicMaterial color="#a98fff" transparent opacity={0.8} />
      </mesh>
      <pointLight color="#76edff" intensity={12} distance={8} />
    </group>
  );
}

function Threads() {
  const nodes = useMemo(() =>
    Array.from({ length: 26 }, (_, i) => {
      const angle = (i / 26) * Math.PI * 2;
      const radius = 2.55 + (i % 5) * 0.25;
      return new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.35) * (1.55 + (i % 4) * 0.15),
        Math.sin(angle) * radius * 0.5,
      );
    }),
  []);

  return (
    <group>
      {nodes.map((node, index) => (
        <group key={index} position={node}>
          <mesh>
            <sphereGeometry args={[index % 4 === 0 ? 0.1 : 0.065, 12, 12]} />
            <meshBasicMaterial color={index % 3 === 0 ? "#a58cff" : "#72ecff"} />
          </mesh>
          {index % 2 === 0 ? (
            <Line
              points={[node.toArray(), [node.x * -0.42, node.y * -0.42, node.z * -0.42]]}
              color="#75eaff"
              transparent
              opacity={0.14}
              lineWidth={1}
            />
          ) : null}
        </group>
      ))}
    </group>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  useFrame(({ camera, clock }) => {
    if (reducedMotion) {
      camera.position.x = 0;
      camera.position.y = 0;
    } else {
      camera.position.x = Math.sin(clock.elapsedTime * 0.08) * 0.7;
      camera.position.y = Math.cos(clock.elapsedTime * 0.1) * 0.18;
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function ThreadGraph() {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 8.4], fov: 48 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.45} />
      <pointLight position={[3, 2, 4]} color="#76edff" intensity={7} />
      <pointLight position={[-3, -2, 2]} color="#9b82ff" intensity={5} />
      <Sparkles count={reducedMotion ? 60 : 170} scale={[11, 7, 6]} size={1.2} speed={reducedMotion ? 0 : 0.18} opacity={0.6} />
      <CameraRig reducedMotion={reducedMotion} />
      <Core />
      <Threads />
    </Canvas>
  );
}
