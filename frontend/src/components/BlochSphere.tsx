import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

interface BlochSphereProps {
  alpha: number; // |α| amplitude
  beta: number;  // |β| amplitude
  prediction: 'PASS' | 'FAIL' | null;
}

function StateVector({ alpha, prediction }: { alpha: number; beta?: number; prediction: 'PASS' | 'FAIL' | null }) {
  const ref = useRef<THREE.ArrowHelper>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  // Bloch sphere angles from amplitudes
  const theta = 2 * Math.acos(Math.min(1, Math.abs(alpha))); // polar
  const phi = 0; // azimuthal (simplified)

  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.cos(theta);
  const z = Math.sin(theta) * Math.sin(phi);

  const color = prediction === 'PASS' ? '#10B981' : prediction === 'FAIL' ? '#F43F5E' : '#00F5FF';

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const dir = new THREE.Vector3(x, y, z).normalize();
  const origin = new THREE.Vector3(0, 0, 0);

  return (
    <group ref={groupRef}>
      {/* Latitude rings */}
      {[-0.5, 0, 0.5].map((yPos, i) => {
        const r = Math.sqrt(1 - yPos * yPos);
        const pts = Array.from({ length: 65 }, (_, j) => {
          const a = (j / 64) * Math.PI * 2;
          return new THREE.Vector3(r * Math.cos(a), yPos, r * Math.sin(a));
        });
        return <Line key={i} points={pts} color="#1e3a5f" lineWidth={0.5} />;
      })}

      {/* Longitude lines */}
      {[0, 60, 120].map((deg, i) => {
        const angle = (deg * Math.PI) / 180;
        const pts = Array.from({ length: 65 }, (_, j) => {
          const theta2 = (j / 64) * Math.PI;
          return new THREE.Vector3(
            Math.sin(theta2) * Math.cos(angle),
            Math.cos(theta2),
            Math.sin(theta2) * Math.sin(angle)
          );
        });
        return <Line key={i} points={pts} color="#1e3a5f" lineWidth={0.5} />;
      })}

      {/* Axes */}
      <Line points={[new THREE.Vector3(0, -1.3, 0), new THREE.Vector3(0, 1.3, 0)]} color="#ffffff22" lineWidth={1} />
      <Line points={[new THREE.Vector3(-1.3, 0, 0), new THREE.Vector3(1.3, 0, 0)]} color="#ffffff22" lineWidth={1} />
      <Line points={[new THREE.Vector3(0, 0, -1.3), new THREE.Vector3(0, 0, 1.3)]} color="#ffffff22" lineWidth={1} />

      {/* Pole labels */}
      <Html position={[0, 1.5, 0]}><span style={{ color: '#00F5FF', fontSize: 10, fontFamily: 'monospace' }}>|0⟩</span></Html>
      <Html position={[0, -1.5, 0]}><span style={{ color: '#BD00FF', fontSize: 10, fontFamily: 'monospace' }}>|1⟩</span></Html>

      {/* State vector arrow */}
      <primitive object={new THREE.ArrowHelper(dir, origin, 0.95, color, 0.15, 0.08)} ref={ref} />

      {/* Tip glow sphere */}
      <Sphere args={[0.06, 16, 16]} position={[x * 0.95, y * 0.95, z * 0.95]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </Sphere>
    </group>
  );
}

function WireframeSphere() {
  return (
    <Sphere args={[1, 24, 24]}>
      <meshBasicMaterial color="#0d2144" wireframe transparent opacity={0.15} />
    </Sphere>
  );
}

export function BlochSphere({ alpha, beta, prediction }: BlochSphereProps) {
  return (
    <div className="glass rounded-xl border border-cyan-500/20 overflow-hidden" style={{ height: 220 }}>
      <div className="text-xs text-slate-500 font-mono uppercase tracking-widest px-4 pt-3 pb-1">
        3D Bloch Sphere — |ψ⟩ State Vector
      </div>
      <Canvas camera={{ position: [2.5, 1.5, 2.5], fov: 45 }} style={{ height: 180 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[2, 2, 2]} intensity={1} color="#00F5FF" />
        <pointLight position={[-2, -2, -2]} intensity={0.5} color="#BD00FF" />
        <Suspense fallback={null}>
          <WireframeSphere />
          <StateVector alpha={alpha} beta={beta} prediction={prediction} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
