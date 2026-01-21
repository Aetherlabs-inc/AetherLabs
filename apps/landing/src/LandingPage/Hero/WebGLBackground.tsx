// "use client";

// import React, { useRef, useMemo } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// function ParticleField() {
//     const ref = useRef<THREE.Points>(null);

//     const particles = useMemo(() => {
//         const count = 5000;
//         const positions = new Float32Array(count * 3);

//         // Create cloud-like distribution: denser in center, thinner at edges
//         for (let i = 0; i < count; i++) {
//             const i3 = i * 3;

//             // Create radial distribution with higher density in center
//             const radius = Math.random() * Math.random() * 15; // Square distribution for density falloff
//             const theta = Math.random() * Math.PI * 2;
//             const phi = Math.random() * Math.PI * 2;

//             // Spherical distribution with more particles in center
//             positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
//             positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
//             positions[i3 + 2] = radius * Math.cos(phi);
//         }

//         return positions;
//     }, []);

//     useFrame((state, delta) => {
//         if (ref.current) {
//             // Very subtle rotation for gentle movement
//             ref.current.rotation.x += delta * 0.01;
//             ref.current.rotation.y += delta * 0.015;
//         }
//     });

//     return (
//         <points ref={ref} frustumCulled={false}>
//             <bufferGeometry>
//                 <bufferAttribute
//                     attach="attributes-position"
//                     count={particles.length / 3}
//                     array={particles}
//                     itemSize={3}x
//                 />
//             </bufferGeometry>
//             <pointsMaterial
//                 transparent
//                 color="#2A2121"
//                 size={0.08}
//                 sizeAttenuation={true}
//                 depthWrite={false}
//                 opacity={0.5}
//             />
//         </points>
//     );
// }

// const WebGLBackground = () => {
//     return (
//         <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
//             <Canvas
//                 camera={{ position: [0, 0, 5], fov: 75 }}
//                 gl={{ alpha: true, antialias: true }}
//                 style={{ background: 'transparent' }}
//             >
//                 <ParticleField />
//             </Canvas>
//         </div>
//     );
// };

// export default WebGLBackground;
