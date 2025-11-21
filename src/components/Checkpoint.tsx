import { Html } from '@react-three/drei';
import type { Stop } from '../data/stops';
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CheckpointProps {
    stop: Stop;
}

export function Checkpoint({ stop }: CheckpointProps) {
    const [hovered, setHovered] = useState(false);
    const markerRef = useRef<THREE.Mesh>(null);
    const poleRef = useRef<THREE.Mesh>(null);

    // Pulsing animation
    useFrame((state) => {
        if (markerRef.current) {
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
            markerRef.current.scale.setScalar(pulse);
        }
        if (poleRef.current) {
            const material = poleRef.current.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 1.5;
        }
    });

    return (
        <group position={stop.position}>
            {/* Visual Marker with pulsing animation */}
            <mesh
                ref={markerRef}
                position={[0, 2, 0]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial
                    color={hovered ? "#ff00ff" : "#00ffff"}
                    emissive={hovered ? "#ff00ff" : "#00ffff"}
                    emissiveIntensity={3}
                    toneMapped={false}
                />
            </mesh>

            {/* Glowing pole with pulsing emissive */}
            <mesh ref={poleRef} position={[0, 1, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 2]} />
                <meshStandardMaterial
                    color="#00ffff"
                    emissive="#00ffff"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>

            {/* Label with better visibility */}
            <Html position={[0, 3, 0]} center distanceFactor={10}>
                <div className="bg-black/90 text-cyan-400 px-3 py-1.5 rounded border-2 border-cyan-500 text-sm font-bold whitespace-nowrap shadow-lg shadow-cyan-500/50">
                    {stop.year}
                </div>
            </Html>
        </group>
    );
}
