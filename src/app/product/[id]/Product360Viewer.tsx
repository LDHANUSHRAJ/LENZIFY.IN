"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MoveHorizontal, RotateCw, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  images: string[];
}

export default function Product360Viewer({ images }: Props) {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentImageIndex = useRef(0);

  if (!images || images.length === 0) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 10) {
      const direction = delta > 0 ? -1 : 1;
      const nextIndex = (currentImageIndex.current + direction + images.length) % images.length;
      setIndex(nextIndex);
      currentImageIndex.current = nextIndex;
      startX.current = e.clientX;
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - startX.current;
    if (Math.abs(delta) > 10) {
      const direction = delta > 0 ? -1 : 1;
      const nextIndex = (currentImageIndex.current + direction + images.length) % images.length;
      setIndex(nextIndex);
      currentImageIndex.current = nextIndex;
      startX.current = e.touches[0].clientX;
    }
  };

  return (
    <div 
      className="relative aspect-[4/5] bg-white border border-brand-navy/5 overflow-hidden group shadow-sm flex items-center justify-center p-12 cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
         <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-navy/5"></div>
         <div className="absolute top-0 bottom-0 left-1/2 w-px bg-brand-navy/5"></div>
      </div>

      <Image 
        src={images[index]} 
        alt="360 view" 
        fill 
        priority
        draggable={false}
        className="object-contain p-12 mix-blend-multiply transition-opacity duration-300 pointer-events-none" 
      />

      {/* Interface Overlay */}
      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4">
         <div className="flex items-center gap-3 bg-brand-navy/5 backdrop-blur-sm px-6 py-3 rounded-full border border-brand-navy/5 text-[9px] font-bold uppercase tracking-[0.2em] text-brand-navy/40">
            <MoveHorizontal size={12} className="animate-pulse" />
            Drag to Rotate Model
         </div>
         <div className="flex gap-2">
            {images.map((_, i) => (
               <div key={i} className={cn("w-1 h-1 rounded-full transition-all", i === index ? "bg-secondary scale-150" : "bg-brand-navy/10")} />
            ))}
         </div>
      </div>

      <div className="absolute top-10 left-10 flex items-center gap-4">
         <div className="p-3 bg-secondary text-white rounded-full shadow-lg">
            <RotateCw size={14} />
         </div>
         <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-navy italic">360° Interaction Active</p>
      </div>

      <div className="absolute bottom-10 right-10 text-[8px] font-black uppercase tracking-[0.3em] text-brand-navy/10 italic">
         Sequence Node {index + 1}/{images.length}
      </div>
    </div>
  );
}
