"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function FrameModel() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
        groupRef.current.rotation.y = time * 0.2;

        // Mouse parallax
        const targetX = state.mouse.x * 0.8;
        const targetY = state.mouse.y * 0.8;
        groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05;
        groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;
    });

    return (
        <group ref={groupRef} scale={1.8}>
            {/* Left Lens Frame */}
            <mesh position={[-0.6, 0, 0]}>
                <torusGeometry args={[0.5, 0.04, 16, 100]} />
                <meshStandardMaterial color="#2F8CFF" emissive="#123A63" roughness={0.1} metalness={0.8} />
            </mesh>
            {/* Right Lens Frame */}
            <mesh position={[0.6, 0, 0]}>
                <torusGeometry args={[0.5, 0.04, 16, 100]} />
                <meshStandardMaterial color="#2F8CFF" emissive="#123A63" roughness={0.1} metalness={0.8} />
            </mesh>
            {/* Bridge */}
            <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                <meshStandardMaterial color="#2F8CFF" roughness={0.1} metalness={0.8} />
            </mesh>
            {/* Floating Glow Orb */}
            <mesh position={[0, 0, -0.2]}>
                <sphereGeometry args={[0.05, 32, 32]} />
                <MeshDistortMaterial
                    color="#4FC3FF"
                    speed={2}
                    distort={0.4}
                    radius={1}
                />
            </mesh>
        </group>
    );
}

export default function FloatingFrame() {
    return (
        <div className="w-full h-full min-h-[500px]">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#4FC3FF" />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#2F8CFF" />
                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <FrameModel />
                </Float>
            </Canvas>
        </div>
    );
}
