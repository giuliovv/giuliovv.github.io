import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Grid } from '@react-three/drei';
import { Track } from './Track';
import { Checkpoint } from './Checkpoint';
import { Car } from './Car';
import { stops } from '../data/stops';
import * as THREE from 'three';

export function Scene() {
    const curve = useMemo(() => {
        const points = stops.map(stop => new THREE.Vector3(...stop.position));
        return new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);
    }, []);

    return (
        <div className="w-full h-screen bg-black">
            <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
                <color attach="background" args={['#020205']} />
                <fog attach="fog" args={['#020205', 10, 50]} />

                {/* Enhanced lighting for Tron aesthetic */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />

                {/* Cyan accent lights */}
                <pointLight position={[0, 5, 20]} intensity={1.5} color="#00ffff" distance={30} />
                <pointLight position={[0, 5, -20]} intensity={1.5} color="#00ffff" distance={30} />

                {/* Magenta accent lights */}
                <pointLight position={[20, 5, 0]} intensity={1.2} color="#ff00ff" distance={25} />
                <pointLight position={[-20, 5, 0]} intensity={1.2} color="#ff00ff" distance={25} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Digital Horizon Grid */}
                <Grid
                    infiniteGrid
                    fadeDistance={60}
                    sectionColor="#00ffff"
                    cellColor="#1a1a1a"
                    sectionSize={10}
                    cellSize={2}
                    position={[0, -2, 0]}
                />

                {/* Floating Particles */}
                <Particles />

                <Track curve={curve} />

                {stops.map((stop, index) => {
                    // Calculate rotation to align with track
                    const t = index / stops.length;
                    const tangent = curve.getTangentAt(t).normalize();
                    const position = new THREE.Vector3(...stop.position);

                    // Create a lookAt rotation matrix
                    // We want the ring (which is in XY plane by default) to face the tangent
                    // Default Torus is in XY plane, facing Z.
                    // We want it to face the tangent direction.

                    const dummy = new THREE.Object3D();
                    dummy.position.copy(position);
                    dummy.lookAt(position.clone().add(tangent));

                    return (
                        <Checkpoint
                            key={index}
                            stop={stop}
                            rotation={dummy.rotation}
                        />
                    );
                })}

                <Car curve={curve} />

                {/* Temporary controls for debugging */}
                {/* <OrbitControls /> */}
            </Canvas>
        </div>
    );
}

function Particles() {
    const count = 2000;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100; // x
            pos[i * 3 + 1] = Math.random() * 20;      // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
        }
        return pos;
    }, []);

    const ref = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#00ffff"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}
