"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export const useScrollAnimation = (config: {
    animation?: "fade-up" | "fade-in" | "parallax";
    delay?: number;
    duration?: number;
    triggerHook?: number;
} = {}) => {
    const elementRef = useRef<any>(null);

    useEffect(() => {
        const el = elementRef.current;
        if (!el) return;

        if (config.animation === "parallax") {
            gsap.to(el, {
                y: -100,
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        } else {
            gsap.from(el, {
                opacity: 0,
                y: config.animation === "fade-up" ? 50 : 0,
                duration: config.duration || 1,
                delay: config.delay || 0,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: `top ${config.triggerHook || 85}%`,
                    toggleActions: "play none none reverse",
                },
            });
        }
    }, [config]);

    return elementRef;
};
