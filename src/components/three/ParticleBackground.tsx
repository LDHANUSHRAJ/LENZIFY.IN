"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles({ count = 3000, color = "#2F8CFF", size = 0.015, speed = 1 }) {
    const points = useRef<THREE.Points>(null!);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime() * speed;
        points.current.rotation.x = time * 0.02;
        points.current.rotation.y = time * 0.03;

        // Mouse influence
        const targetX = state.mouse.x * 0.15;
        const targetY = state.mouse.y * 0.15;
        points.current.rotation.x += (targetY - points.current.rotation.x) * 0.02;
        points.current.rotation.y += (targetX - points.current.rotation.y) * 0.02;
    });

    return (
        <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color={color}
                size={size}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.6}
            />
        </Points>
    );
}

export default function ParticleBackground() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#0B1C2D]">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Particles count={2000} color="#2F8CFF" size={0.012} speed={0.8} />
                <Particles count={1000} color="#4FC3FF" size={0.008} speed={1.2} />
            </Canvas>
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C2D]/50 via-transparent to-[#050505]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(47,140,255,0.05)_0%,transparent_50%)]"></div>
        </div>
    );
}
