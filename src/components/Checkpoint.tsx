import { Html } from '@react-three/drei';
import type { Stop } from '../data/stops';
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CheckpointProps {
    stop: Stop;
    rotation?: THREE.Euler;
}

export function Checkpoint({ stop, rotation }: CheckpointProps) {
    const [hovered, setHovered] = useState(false);
    const markerRef = useRef<THREE.Group>(null);
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
        <group position={stop.position} rotation={rotation}>
            {/* Holographic Gate */}
            <group ref={markerRef}>
                {/* Outer Ring */}
                <mesh rotation={[0, 0, 0]}>
                    <torusGeometry args={[5, 0.15, 16, 100]} />
                    <meshStandardMaterial
                        color={hovered ? "#ff00ff" : "#00ffff"}
                        emissive={hovered ? "#ff00ff" : "#00ffff"}
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>

                {/* Inner Energy Field (Subtle) */}
                <mesh rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[4.8, 4.8, 0.1, 64]} />
                    <meshBasicMaterial
                        color={hovered ? "#ff00ff" : "#00ffff"}
                        opacity={0.1}
                        transparent
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>

            {/* Label */}
            <Html position={[0, 6.5, 0]} center distanceFactor={20}>
                <div className={`
                    px-4 py-2 rounded-lg border-2 
                    ${hovered ? 'border-fuchsia-500 bg-fuchsia-900/80 text-fuchsia-100 shadow-fuchsia-500/50' : 'border-cyan-500 bg-cyan-900/80 text-cyan-100 shadow-cyan-500/50'}
                    text-lg font-bold whitespace-nowrap shadow-lg backdrop-blur-sm transition-all duration-300
                `}>
                    {stop.year}
                </div>
            </Html>
        </group>
    );
}
