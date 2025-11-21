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
                <color attach="background" args={['#050505']} />
                <fog attach="fog" args={['#050505', 20, 90]} />

                {/* Enhanced lighting for Tron aesthetic */}
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />

                {/* Cyan accent lights */}
                <pointLight position={[0, 5, 20]} intensity={1.5} color="#00ffff" distance={30} />
                <pointLight position={[0, 5, -20]} intensity={1.5} color="#00ffff" distance={30} />

                {/* Magenta accent lights */}
                <pointLight position={[20, 5, 0]} intensity={1.2} color="#ff00ff" distance={25} />
                <pointLight position={[-20, 5, 0]} intensity={1.2} color="#ff00ff" distance={25} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Lowered Grid to avoid intersection with track */}
                <Grid infiniteGrid fadeDistance={50} sectionColor="#4d4d4d" cellColor="#222" position={[0, -10, 0]} />

                <Track curve={curve} />

                {stops.map((stop, index) => (
                    <Checkpoint key={index} stop={stop} />
                ))}

                <Car curve={curve} />

                {/* Temporary controls for debugging */}
                {/* <OrbitControls /> */}
            </Canvas>
        </div>
    );
}
