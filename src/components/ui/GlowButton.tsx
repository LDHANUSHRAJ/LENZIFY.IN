"use client";

import { motion } from "framer-motion";

interface GlowButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
}

export default function GlowButton({ children, className = "", onClick, variant = "primary" }: GlowButtonProps) {
    const isPrimary = variant === "primary";

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        relative px-12 py-5 rounded-full font-black tracking-[0.2em] uppercase text-[11px]
        smooth-transition overflow-hidden group
        ${isPrimary
                    ? "bg-brand-electric text-white shadow-xl shadow-brand-electric/10"
                    : "glass-morphism text-white border border-white/10 hover:border-brand-glow"
                }
        ${className}
      `}
        >
            {/* Background Hover Shine */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out" />

            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}
