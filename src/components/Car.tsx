import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '../store';
import { stops } from '../data/stops';
import { Trail, Edges } from '@react-three/drei';

interface CarProps {
    curve: THREE.CatmullRomCurve3;
}

export function Car({ curve }: CarProps) {
    const ref = useRef<THREE.Group>(null);
    const { camera } = useThree();
    const { progress, setProgress, setActiveStopIndex } = useStore();

    // Local state for smooth movement
    const [targetProgress, setTargetProgress] = useState(0);

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

    // Handle keyboard and touch
    useEffect(() => {
        const keys = { w: false, s: false, ArrowUp: false, ArrowDown: false };
        const touches = { left: false, right: false };

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

        const handleTouchStart = (e: TouchEvent) => {
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                if (touch.clientX < window.innerWidth / 2) {
                    touches.left = true;
                } else {
                    touches.right = true;
                }
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            // Reset and re-evaluate active touches
            touches.left = false;
            touches.right = false;
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                if (touch.clientX < window.innerWidth / 2) {
                    touches.left = true;
                } else {
                    touches.right = true;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchcancel', handleTouchEnd);

        const interval = setInterval(() => {
            let delta = 0;
            if (keys.w || keys.ArrowUp || touches.right) delta += 0.001;
            if (keys.s || keys.ArrowDown || touches.left) delta -= 0.001;

            if (delta !== 0) {
                setTargetProgress(p => Math.max(0, Math.min(1, p + delta)));
            }
        }, 16);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
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

        // Update car position
        ref.current.position.copy(position);

        // Look ahead for rotation
        const lookAt = curve.getPointAt(Math.min(1, newProgress + 0.01));
        ref.current.lookAt(lookAt);

        // Update camera to follow car
        // Third person view: behind and slightly above
        const cameraOffset = new THREE.Vector3(0, 2, -8);
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
            <CarModel />

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
        </group>
    );
}

function CarModel() {
    const shape = useMemo(() => {
        const s = new THREE.Shape();
        // Create a sleek, aerodynamic profile
        s.moveTo(0, 0);
        s.lineTo(2, 0); // Bottom
        s.lineTo(2.2, 0.5); // Rear bumper
        s.lineTo(2, 1.2); // Rear deck
        s.lineTo(1.2, 1.8); // Roof rear
        s.lineTo(-0.5, 1.6); // Roof front
        s.lineTo(-1.8, 0.8); // Hood
        s.lineTo(-2, 0.2); // Front bumper
        s.lineTo(-1.8, 0); // Front bottom
        s.lineTo(0, 0);
        return s;
    }, []);

    const extrudeSettings = {
        steps: 1,
        depth: 1.6, // Car width
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 2
    };

    return (
        <group>
            {/* Body - Centered */}
            {/* 
                Shape is defined in XY plane (Length along X).
                Extrusion is along Z (Width). Depth is 1.6.
                Rotation [0, PI/2, 0] rotates:
                - Local X (Length) -> World Z
                - Local Z (Width) -> World X (or -X)

                If Local Z goes 0 to 1.6.
                And rotation maps Z to -X (assuming standard rotation).
                Then body goes 0 to -1.6 in World X.
                To center on X=0, we need to shift by +0.8.

                Shape is centered in Local X (-2 to 2), so centered in World Z.
            */}
            {/* Glowing Strips (Inner/Outer Shell) */}
            <mesh position={[-0.825, 0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
                <extrudeGeometry args={[shape, { ...extrudeSettings, depth: 1.65, bevelEnabled: false }]} />
                <meshBasicMaterial color="cyan" opacity={0.3} transparent />
            </mesh>

            {/* Body - Centered */}
            {/* 
                Total depth with bevel = 1.6 + 2*0.1 = 1.8.
                Center offset = 1.8 / 2 = 0.9.
                Rotation maps Z to X. Extrusion goes 0 to 1.8 in X.
                Need to shift by -0.9 to center on 0.
            */}
            <mesh position={[-0.9, 0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.3}
                    metalness={0.8}
                    emissive="#001111"
                    emissiveIntensity={0.2}
                />
                <Edges
                    threshold={15}
                    color="cyan"
                />
            </mesh>

            {/* Wheels */}
            <Wheel position={[1.2, 0.4, 0.9]} />
            <Wheel position={[-1.2, 0.4, 0.9]} />
            <Wheel position={[1.2, 0.4, -0.9]} />
            <Wheel position={[-1.2, 0.4, -0.9]} />
        </group>
    );
}

function Wheel({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            {/* Glowing Rim */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.3, 0.05, 16, 32]} />
                <meshBasicMaterial color="cyan" />
            </mesh>
            {/* Inner Glow */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.31, 16]} />
                <meshBasicMaterial color="cyan" opacity={0.2} transparent />
            </mesh>
        </group>
    );
}
