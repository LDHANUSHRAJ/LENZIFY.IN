"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
        brand: string;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Rotation values for 3D tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="group relative aspect-[4/5] perspective-1000"
        >
            <Link href={`/product/${product.id}`} className="block w-full h-full">
                <div className="relative w-full h-full glass-card rounded-3xl overflow-hidden border border-white/5 bg-brand-navy-dark">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 smooth-transition"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-8 group-hover:translate-y-0 smooth-transition" style={{ transform: "translateZ(50px)" }}>
                        <span className="text-brand-electric text-[10px] font-black tracking-[0.4em] uppercase mb-2 block">{product.brand}</span>
                        <h4 className="text-2xl font-black italic uppercase leading-none mb-4">{product.name}</h4>
                        <div className="flex justify-between items-end">
                            <span className="text-xl font-bold">₹{product.price.toLocaleString()}</span>
                            <div className="w-12 h-12 rounded-full glass-morphism border border-white/10 flex items-center justify-center group-hover:bg-brand-electric group-hover:text-black smooth-transition">
                                <ArrowUpRight size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Magnetic Glow Border Reveal */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-[-1px] rounded-3xl border border-brand-electric/50 blur-[2px]" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
