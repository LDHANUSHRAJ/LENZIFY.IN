"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PolicyPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function PolicyPage({ title, subtitle, children, className }: PolicyPageProps) {
  return (
    <div className={cn("min-h-screen bg-surface pt-40 pb-24", className)}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <header className="mb-20 space-y-4">
          <div className="w-12 h-[1px] bg-secondary mb-8"></div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif italic text-primary leading-tight"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs font-black uppercase tracking-[0.3em] text-on-surface/40"
            >
              {subtitle}
            </motion.p>
          )}
        </header>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-stone max-w-none 
            prose-headings:font-serif prose-headings:italic prose-headings:text-primary prose-headings:mb-8 prose-headings:mt-12
            prose-p:text-on-surface-variant prose-p:leading-relaxed prose-p:mb-8 prose-p:text-base
            prose-li:text-on-surface-variant prose-li:leading-relaxed prose-li:mb-4
            prose-strong:text-primary prose-strong:font-bold
            prose-hr:border-outline/10 prose-hr:my-16"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
