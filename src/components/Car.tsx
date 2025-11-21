import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useStore } from '../store';
import { stops } from '../data/stops';
import { Trail } from '@react-three/drei';

interface CarProps {
    curve: THREE.CatmullRomCurve3;
}

export function Car({ curve }: CarProps) {
    const ref = useRef<THREE.Group>(null);
    const { camera } = useThree();
    const { progress, setProgress, setActiveStopIndex } = useStore();

    // Local state for smooth movement
    const [targetProgress, setTargetProgress] = useState(0);
    const speed = useRef(0);

    // Handle scroll
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            // Normalize scroll delta
            const delta = e.deltaY * 0.0001;
            setTargetProgress(p => Math.max(0, Math.min(1, p + delta)));
        };
        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, []);

    // Handle keyboard
    useEffect(() => {
        const keys = { w: false, s: false, ArrowUp: false, ArrowDown: false };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key in keys) {
                keys[e.key as keyof typeof keys] = true;
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key in keys) {
                keys[e.key as keyof typeof keys] = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const interval = setInterval(() => {
            let delta = 0;
            if (keys.w || keys.ArrowUp) delta += 0.001;
            if (keys.s || keys.ArrowDown) delta -= 0.001;

            if (delta !== 0) {
                setTargetProgress(p => Math.max(0, Math.min(1, p + delta)));
            }
        }, 16);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            clearInterval(interval);
        };
    }, []);

    useFrame((state, delta) => {
        if (!ref.current) return;

        // Smoothly interpolate progress
        const newProgress = THREE.MathUtils.lerp(progress, targetProgress, delta * 2);
        setProgress(newProgress);

        // Get position on curve
        const position = curve.getPointAt(newProgress);
        const tangent = curve.getTangentAt(newProgress);

        // Update car position and rotation
        ref.current.position.copy(position);

        // Look ahead
        const lookAt = curve.getPointAt(Math.min(1, newProgress + 0.01));
        ref.current.lookAt(lookAt);

        // Update camera to follow car
        // Third person view: behind and slightly above
        const cameraOffset = new THREE.Vector3(0, 1.5, -6);
        cameraOffset.applyQuaternion(ref.current.quaternion);
        const cameraPos = position.clone().add(cameraOffset);

        // Smooth camera movement
        camera.position.lerp(cameraPos, delta * 2);
        camera.lookAt(position);

        // Check for checkpoints
        let closestStopIndex: number | null = null;
        let minDistance = Infinity;

        stops.forEach((stop, index) => {
            const stopPos = new THREE.Vector3(...stop.position);
            const distance = position.distanceTo(stopPos);
            if (distance < 5) { // Threshold for activating panel
                if (distance < minDistance) {
                    minDistance = distance;
                    closestStopIndex = index;
                }
            }
        });

        setActiveStopIndex(closestStopIndex);
    });

    return (
        <group ref={ref}>
            {/* Car Body */}
            <Trail width={1} length={10} color={new THREE.Color("cyan")} attenuation={(t) => t * t}>
                <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[1, 0.5, 2]} />
                    <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={0.5} />
                </mesh>
            </Trail>

            {/* Headlights */}
            <spotLight
                position={[0, 1, 1]}
                angle={0.5}
                penumbra={0.5}
                intensity={2}
                distance={20}
                castShadow
                color="cyan"
                target-position={[0, 0, 10]}
            />

            {/* Trail */}
            {/* Note: Trail needs to be imported from @react-three/drei. 
          Since I can't easily add imports with replace_file_content in this block without context,
          I will do it in a separate step or assume the user can add it.
          Actually, let's try to be complete. I'll update the imports in a separate call if needed,
          but for now let's just add the light and better material. 
          Trail might be tricky without the import. Let's stick to lights first.
      */}
        </group>
    );
}
