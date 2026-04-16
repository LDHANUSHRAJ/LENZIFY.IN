"use client";

import { useEffect, useState, useRef } from "react";
import { X, Camera, Loader2 } from "lucide-react";

declare var JEELIZVTO: any;

const AVAILABLE_FRAMES = [
  { sku: "rayban_aviator_or_vertFlash", label: "Aviator" },
  { sku: "rayban_wayfarer_noir_cristal", label: "Wayfarer" },
  { sku: "oakley_holbrook_matteblack_gray", label: "Holbrook" },
];

export default function JeelizModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSku, setCurrentSku] = useState("");
  const [productName, setProductName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleOpen = (e: any) => {
      const { sku, name } = e.detail;
      setIsOpen(true);
      setCurrentSku(sku || "rayban_wayfarer_noir_cristal");
      setProductName(name);
      setIsLoading(true);
      setErrorMessage("");
      // Lock scroll
      document.body.style.overflow = 'hidden';
    };

    window.addEventListener("lenzify-vto-open", handleOpen);
    return () => window.removeEventListener("lenzify-vto-open", handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && currentSku && typeof JEELIZVTO !== "undefined") {
      // Small timeout to ensure DOM is ready
      const timer = setTimeout(() => {
        JEELIZVTO.init({
          canvasId: 'jeelizCanvas',
          NNCpath: 'https://appstatic.jeeliz.com/jeelizvto/',
          sku: currentSku,
          onReady: () => {
            setIsLoading(false);
          },
          onError: (errorCode: string) => {
            setIsLoading(false);
            if (errorCode === 'WEBCAM_UNAVAILABLE') {
              setErrorMessage("Please allow camera access to use Try-On.");
            } else if (errorCode === 'WEBGL_UNAVAILABLE') {
              setErrorMessage("Your browser does not support Try-On.");
            } else {
              setErrorMessage("Something went wrong. Please try again.");
            }
          }
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (typeof JEELIZVTO !== "undefined") {
      JEELIZVTO.destroy();
    }
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const switchSku = (sku: string) => {
    if (typeof JEELIZVTO !== "undefined") {
      JEELIZVTO.change_sku(sku);
      setCurrentSku(sku);
    }
  };

  const takePhoto = () => {
    const canvas = document.getElementById('jeelizCanvas') as HTMLCanvasElement;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'lenzify-look.png';
      link.href = dataUrl;
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="jvto-overlay fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center font-sans">
      {/* CSS Scoped to jvto- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .jvto-overlay { color: white; }
        .jvto-modal { position: relative; width: 100%; height: 100%; max-width: 800px; max-height: 90vh; background: #000; overflow: hidden; display: flex; flex-direction: column; }
        @media (max-width: 768px) { .jvto-modal { max-height: 100vh; } }
        .jvto-header { padding: 1rem; display: flex; justify-content: space-between; items-center; z-index: 10; background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); }
        .jvto-canvas-container { flex: 1; position: relative; display: flex; items-center; justify-content: center; overflow: hidden; }
        #jeelizCanvas { transform: rotateY(180deg); width: 100%; height: 100%; object-fit: cover; }
        .jvto-footer { padding: 1.5rem; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); z-index: 10; }
        .jvto-strip { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem; scrollbar-width: none; }
        .jvto-strip::-webkit-scrollbar { display: none; }
        .jvto-frame-item { flex: 0 0 auto; padding: 0.5rem 1rem; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; cursor: pointer; transition: all 0.3s; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; background: rgba(0,0,0,0.5); }
        .jvto-frame-item.active { border-color: #e9c176; background: #e9c176; color: #000; }
        .jvto-capture-btn { background: white; color: black; border-radius: 9999px; padding: 1rem; display: flex; items-center; justify-content: center; margin: 1rem auto; transition: transform 0.2s; }
        .jvto-capture-btn:active { transform: scale(0.9); }
        .jvto-spinner { position: absolute; inset: 0; display: flex; flex-direction: column; items-center; justify-content: center; background: #000; z-index: 5; }
        .jvto-error { padding: 2rem; text-align: center; color: #ff8a80; font-weight: 600; }
      `}} />

      <div className="jvto-modal md:rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="jvto-header">
          <div>
            <h3 className="text-xl font-serif italic text-white leading-tight uppercase">{productName}</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Virtual Fitting Room</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Camera Area */}
        <div className="jvto-canvas-container">
          {isLoading && (
            <div className="jvto-spinner">
              <Loader2 size={48} className="animate-spin text-secondary mb-4" />
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Synchronizing Optics...</p>
            </div>
          )}
          
          {errorMessage ? (
            <div className="jvto-spinner">
              <div className="jvto-error">{errorMessage}</div>
              <button onClick={handleClose} className="px-6 py-2 border border-white/20 text-xs uppercase tracking-widest hover:bg-white/10">Dismiss</button>
            </div>
          ) : (
            <canvas id="jeelizCanvas"></canvas>
          )}

          {/* Capture Button */}
          {!isLoading && !errorMessage && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              <button 
                onClick={takePhoto}
                className="jvto-capture-btn shadow-lg hover:scale-110 active:scale-95 transition-transform"
                title="Capture Look"
              >
                <Camera size={24} />
              </button>
            </div>
          )}
        </div>

        {/* Footer / Switcher */}
        <div className="jvto-footer">
          <div className="jvto-strip">
            {AVAILABLE_FRAMES.map((frame) => (
              <div 
                key={frame.sku}
                onClick={() => switchSku(frame.sku)}
                className={`jvto-frame-item ${currentSku === frame.sku ? 'active' : ''}`}
              >
                {frame.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Close on backdrop click */}
      <div className="absolute inset-0 -z-10" onClick={handleClose}></div>
    </div>
  );
}
