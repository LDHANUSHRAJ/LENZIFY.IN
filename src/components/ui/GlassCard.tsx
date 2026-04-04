"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverGlow?: boolean;
}

export default function GlassCard({ children, className = "", hoverGlow = true }: GlassCardProps) {
    return (
        <motion.div
            whileHover={hoverGlow ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
            className={`glass-card rounded-2xl p-6 relative overflow-hidden group ${className}`}
        >
            {/* Decorative Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-electric/10 blur-[80px] group-hover:bg-brand-cyan/20 smooth-transition" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
