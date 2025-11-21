import { useMemo } from 'react';
import * as THREE from 'three';

interface TrackProps {
    curve: THREE.CatmullRomCurve3;
}

export function Track({ curve }: TrackProps) {
    // Create glowing edge lines and road surface
    const trackData = useMemo(() => {
        const points = curve.getPoints(200);
        const leftEdge: THREE.Vector3[] = [];
        const rightEdge: THREE.Vector3[] = [];
        const centerLine: THREE.Vector3[] = [];
        const roadVertices: number[] = [];
        const roadIndices: number[] = [];

        points.forEach((point, i) => {
            // Get tangent to determine perpendicular direction
            const tangent = curve.getTangent(i / points.length);
            const perpendicular = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

            // Create left and right edge points (width of 8 units total, 4 on each side)
            const leftPoint = point.clone().add(perpendicular.clone().multiplyScalar(4));
            const rightPoint = point.clone().add(perpendicular.clone().multiplyScalar(-4));

            leftEdge.push(leftPoint);
            rightEdge.push(rightPoint);
            centerLine.push(point.clone());

            // Build road surface vertices (flat plane between edges)
            roadVertices.push(leftPoint.x, leftPoint.y, leftPoint.z);
            roadVertices.push(rightPoint.x, rightPoint.y, rightPoint.z);

            // Create triangles for the road surface
            if (i < points.length - 1) {
                const baseIndex = i * 2;
                // Triangle 1
                roadIndices.push(baseIndex, baseIndex + 1, baseIndex + 2);
                // Triangle 2
                roadIndices.push(baseIndex + 1, baseIndex + 3, baseIndex + 2);
            }
        });

        // Close the loop
        const baseIndex = (points.length - 1) * 2;
        roadIndices.push(baseIndex, baseIndex + 1, 0);
        roadIndices.push(baseIndex + 1, 1, 0);

        return { leftEdge, rightEdge, centerLine, roadVertices, roadIndices };
    }, [curve]);

    // Create road surface geometry
    const roadGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(trackData.roadVertices), 3));
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(trackData.roadIndices), 1)); // Use Uint32Array for indices
        geometry.computeVertexNormals();
        return geometry;
    }, [trackData]);

    return (
        <group>
            {/* Flat road surface - dark with subtle texture */}
            <mesh geometry={roadGeometry}>
                <meshStandardMaterial
                    color="#0a0a0a"
                    roughness={0.8}
                    metalness={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Left glowing edge tube */}
            {(() => {
                const edgeCurve = new THREE.CatmullRomCurve3(trackData.leftEdge);
                const edgeTube = new THREE.TubeGeometry(edgeCurve, 100, 0.2, 8, true);

                return (
                    <mesh geometry={edgeTube}>
                        <meshStandardMaterial
                            color="#00ffff"
                            emissive="#00ffff"
                            emissiveIntensity={3}
                            toneMapped={false}
                        />
                    </mesh>
                );
            })()}

            {/* Right glowing edge tube */}
            {(() => {
                const edgeCurve = new THREE.CatmullRomCurve3(trackData.rightEdge);
                const edgeTube = new THREE.TubeGeometry(edgeCurve, 100, 0.2, 8, true);

                return (
                    <mesh geometry={edgeTube}>
                        <meshStandardMaterial
                            color="#00ffff"
                            emissive="#00ffff"
                            emissiveIntensity={3}
                            toneMapped={false}
                        />
                    </mesh>
                );
            })()}

            {/* Center glowing line */}
            <line>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={trackData.centerLine.length}
                        array={new Float32Array(trackData.centerLine.flatMap(p => [p.x, p.y, p.z]))}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color="#ff00ff"
                    linewidth={2}
                    transparent
                    opacity={0.6}
                />
            </line>
        </group>
    );
}
