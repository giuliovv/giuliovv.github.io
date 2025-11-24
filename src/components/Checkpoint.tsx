import { Text } from '@react-three/drei';
import type { Stop } from '../data/stops';
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface CheckpointProps {
    stop: Stop;
    rotation?: THREE.Euler;
}

export function Checkpoint({ stop, rotation }: CheckpointProps) {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const markerRef = useRef<THREE.Group>(null);
    const poleRef = useRef<THREE.Mesh>(null);

    // Detect if we're on desktop (md breakpoint and up)
    const isDesktop = useMediaQuery('(min-width: 768px)');

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

    // Show label if: desktop OR (mobile AND clicked)
    const showLabel = isDesktop || clicked;

    return (
        <group position={stop.position} rotation={rotation}>
            {/* Holographic Gate */}
            <group
                ref={markerRef}
                onClick={() => setClicked(!clicked)}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                {/* Outer Ring */}
                <mesh rotation={[0, 0, 0]}>
                    <torusGeometry args={[5, 0.15, 16, 100]} />
                    <meshStandardMaterial
                        color="#00ffff"
                        emissive="#00ffff"
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>

                {/* Inner Energy Field (Subtle) */}
                <mesh rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[4.8, 4.8, 0.1, 64]} />
                    <meshBasicMaterial
                        color="#00ffff"
                        opacity={0.1}
                        transparent
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>

            {/* 3D Text Label - conditionally rendered */}
            {showLabel ? (
                <group position={[0, 6.5, 0]}>
                    {/* Background plane for better readability */}
                    <mesh position={[0, 0, -0.1]}>
                        <planeGeometry args={[3.5, 1.2]} />
                        <meshBasicMaterial
                            color="#164e63"
                            opacity={0.8}
                            transparent
                        />
                    </mesh>

                    {/* 3D Text */}
                    <Text
                        position={[0, 0, 0]}
                        fontSize={0.6}
                        color="#e0f2fe"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.02}
                        outlineColor="#0891b2"
                    >
                        {stop.year}
                    </Text>
                </group>
            ) : null}
        </group>
    );
}
