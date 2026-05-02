"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface SectionBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function SectionBanner({ image, title, subtitle, ctaText, ctaLink }: SectionBannerProps) {
  return (
    <section className="relative w-full h-[300px] md:h-[450px] overflow-hidden group">

      <motion.div 
        className="absolute inset-0"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
      </motion.div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/80 text-lg md:text-xl font-body max-w-2xl mx-auto mb-8">
              {subtitle}
            </p>
          )}
          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className="inline-block px-8 py-3 bg-white text-black font-semibold hover:bg-black hover:text-white transition-all duration-300"
            >
              {ctaText}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
