"use client";

import { useEffect, useState, useRef } from "react";
import { X, Camera, Loader2, AlertCircle } from "lucide-react";
import Script from "next/script";

// Simple mapping to colors for pseudo-3D frames
const AVAILABLE_FRAMES = [
  { sku: "wayfarer", label: "Wayfarer", color: "#111111" },
  { sku: "aviator", label: "Aviator", color: "#B8860B" },
  { sku: "round", label: "Round Metal", color: "#C0C0C0" },
];

export default function VirtualTryOnModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSku, setCurrentSku] = useState(AVAILABLE_FRAMES[0]);
  const [productName, setProductName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceMeshRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleOpen = (e: any) => {
      const { sku, name } = e.detail || {};
      setIsOpen(true);
      
      // Map jeeliz skus to our simple skus, or default to wayfarer
      let matchedFrame = AVAILABLE_FRAMES[0];
      if (sku) {
        if (sku.includes('aviator') || sku.includes('metal')) matchedFrame = AVAILABLE_FRAMES[1];
        else if (sku.includes('round') || sku.includes('circle')) matchedFrame = AVAILABLE_FRAMES[2];
      }
      
      setCurrentSku(matchedFrame);
      setProductName(name || "Virtual Try-On");
      setIsLoading(true);
      setErrorMessage("");
      document.body.style.overflow = "hidden";
    };

    window.addEventListener("lenzify-vto-open", handleOpen);
    return () => window.removeEventListener("lenzify-vto-open", handleOpen);
  }, []);

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          initMediaPipe();
        };
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      setIsLoading(false);
      setErrorMessage("Please allow camera access to use Try-On.");
    }
  };

  const initMediaPipe = () => {
    if (!(window as any).FaceMesh) {
      // If script hasn't loaded yet, try again shortly
      setTimeout(initMediaPipe, 200);
      return;
    }

    try {
      const faceMesh = new (window as any).FaceMesh({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults(onResults);
      faceMeshRef.current = faceMesh;

      // Start processing frames
      const processFrame = async () => {
        if (videoRef.current && faceMeshRef.current && isOpen && videoRef.current.readyState >= 2) {
          try {
             await faceMeshRef.current.send({ image: videoRef.current });
          } catch(e) {
             // suppress dropped frame errors
          }
        }
        if (isOpen) {
          animationRef.current = requestAnimationFrame(processFrame);
        }
      };
      
      processFrame();
    } catch (err) {
      console.error("MediaPipe initialization error:", err);
      setErrorMessage("Face tracking framework could not be loaded.");
      setIsLoading(false);
    }
  };

  const onResults = (results: any) => {
    setIsLoading(false);
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas to video dimensions
    if (canvas.width !== videoRef.current.videoWidth) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
    }

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw mirrored video
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    // Draw glasses if face is detected
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      drawGlasses(ctx, landmarks, canvas.width, canvas.height);
    }
    
    ctx.restore();
  };

  const drawGlasses = (ctx: CanvasRenderingContext2D, landmarks: any[], width: number, height: number) => {
    // Key landmarks for glasses placement
    // 33: left eye outer, 133: left eye inner
    // 362: right eye inner, 263: right eye outer
    // 168: bridge of nose, between eyes
    
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const pointCloudCenter = landmarks[168]; // bridge

    // Un-normalize coordinates
    const leftX = leftEye.x * width;
    const leftY = leftEye.y * height;
    const rightX = rightEye.x * width;
    const rightY = rightEye.y * height;
    
    const bridgeX = pointCloudCenter.x * width;
    const bridgeY = pointCloudCenter.y * height;

    // Calculate rotation angle
    const angle = Math.atan2(rightY - leftY, rightX - leftX);
    
    // Calculate distance between eyes centers for scaling
    // Add some padding to make glasses wider than eyes
    const eyeDist = Math.hypot(rightX - leftX, rightY - leftY);
    const frameWidth = eyeDist * 1.8; 
    
    ctx.save();
    ctx.translate(bridgeX, bridgeY);
    ctx.rotate(angle);

    // Styling based on current SKU
    ctx.lineWidth = currentSku.sku === 'wayfarer' ? 5 : 3;
    ctx.strokeStyle = currentSku.color;
    ctx.fillStyle = "rgba(40, 40, 40, 0.4)"; // tinted lenses

    // Simple procedural drawing of glasses relative to bridge (0,0)
    const lensWidth = frameWidth * 0.4;
    const lensHeight = currentSku.sku === 'aviator' ? lensWidth * 0.8 : 
                       currentSku.sku === 'round' ? lensWidth * 0.9 : 
                       lensWidth * 0.6; // wayfarer is shorter
    const bridgeWidth = frameWidth * 0.2;
    
    ctx.beginPath();
    // Bridge
    ctx.moveTo(-bridgeWidth/2, -lensHeight*0.2);
    ctx.quadraticCurveTo(0, -lensHeight*0.4, bridgeWidth/2, -lensHeight*0.2);
    
    // Right lens (mirror drawing frame)
    const rightLensCX = bridgeWidth/2 + lensWidth/2;
    if (currentSku.sku === 'round') {
        ctx.arc(rightLensCX, 0, lensWidth/2, 0, Math.PI * 2);
    } else if (currentSku.sku === 'aviator') {
        ctx.moveTo(bridgeWidth/2, -lensHeight*0.2);
        ctx.bezierCurveTo(rightLensCX, -lensHeight*0.5, rightLensCX + lensWidth/2, -lensHeight*0.1, rightLensCX + lensWidth/2, 0);
        ctx.bezierCurveTo(rightLensCX + lensWidth/2, lensHeight*0.8, rightLensCX - lensWidth/4, lensHeight, bridgeWidth/2, lensHeight*0.4);
        ctx.closePath();
    } else {
        // Wayfarer-ish
        ctx.roundRect(bridgeWidth/2, -lensHeight/2, lensWidth, lensHeight, 8);
    }

    // Left lens
    const leftLensCX = -bridgeWidth/2 - lensWidth/2;
    if (currentSku.sku === 'round') {
        ctx.moveTo(leftLensCX + lensWidth/2, 0);
        ctx.arc(leftLensCX, 0, lensWidth/2, 0, Math.PI * 2);
    } else if (currentSku.sku === 'aviator') {
        ctx.moveTo(-bridgeWidth/2, -lensHeight*0.2);
        ctx.bezierCurveTo(leftLensCX, -lensHeight*0.5, leftLensCX - lensWidth/2, -lensHeight*0.1, leftLensCX - lensWidth/2, 0);
        ctx.bezierCurveTo(leftLensCX - lensWidth/2, lensHeight*0.8, leftLensCX + lensWidth/4, lensHeight, -bridgeWidth/2, lensHeight*0.4);
        ctx.closePath();
    } else {
        ctx.roundRect(-bridgeWidth/2 - lensWidth, -lensHeight/2, lensWidth, lensHeight, 8);
    }
    
    // Draw arms extending back
    const armY = -lensHeight*0.3;
    ctx.moveTo(bridgeWidth/2 + lensWidth, armY);
    ctx.lineTo(bridgeWidth/2 + lensWidth + frameWidth*0.2, armY - frameWidth*0.05);
    
    ctx.moveTo(-bridgeWidth/2 - lensWidth, armY);
    ctx.lineTo(-bridgeWidth/2 - lensWidth - frameWidth*0.2, armY - frameWidth*0.05);

    ctx.stroke();
    // Fill lenses
    if (currentSku.sku !== 'round') ctx.fill(); // procedural fill logic is simpler for paths
    else {
        ctx.beginPath();
        ctx.arc(rightLensCX, 0, lensWidth/2, 0, Math.PI * 2);
        ctx.arc(leftLensCX, 0, lensWidth/2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
  };

  useEffect(() => {
    if (isOpen) {
      initCamera();
    } else {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
        faceMeshRef.current = null;
      }
      setIsLoading(true); // reset for next open
    }
    return () => {
      // Unmount cleanup
      if (streamRef.current) {
         streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
         cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const takePhoto = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "lenzify-look.png";
      link.href = dataUrl;
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" 
        strategy="lazyOnload" 
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" 
        strategy="lazyOnload" 
      />

      <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center font-sans backdrop-blur-sm">
        <div className="relative w-full h-full max-w-4xl max-h-[90vh] bg-black md:rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/10" onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
            <div>
              <h3 className="text-2xl font-serif italic text-white leading-tight uppercase">{productName}</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Simulated Reality Engine v2</p>
            </div>
            <button onClick={handleClose} className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 relative flex items-center justify-center bg-zinc-950 overflow-hidden">
            {/* Hidden video element for mediapipe source */}
            <video ref={videoRef} playsInline className="hidden" />
            
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/50 backdrop-blur-sm">
                <Loader2 size={48} className="animate-spin text-secondary mb-6" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/80">Calibrating Optics...</p>
              </div>
            )}

            {errorMessage && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 p-8 text-center">
                <AlertCircle size={48} className="text-red-500 mb-6" />
                <p className="text-red-200 font-serif italic text-xl mb-8">{errorMessage}</p>
                <button onClick={handleClose} className="px-8 py-3 border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                  Acknowledge
                </button>
              </div>
            )}

            <canvas 
              ref={canvasRef} 
              className="w-full h-full object-cover"
            />

            {/* Capture Button */}
            {!isLoading && !errorMessage && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
                <button 
                  onClick={takePhoto}
                  className="w-16 h-16 rounded-full bg-white/20 border-2 border-white backdrop-blur-md flex items-center justify-center hover:bg-white/40 hover:scale-105 active:scale-95 transition-all text-white shadow-2xl group"
                >
                  <Camera size={24} className="group-hover:scale-110 transition-transform" />
                </button>
                <span className="text-[8px] uppercase tracking-widest font-bold text-white/60 drop-shadow-md">Capture Session</span>
              </div>
            )}
          </div>

          {/* Footer - Frame Switcher */}
          <div className="p-6 bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 left-0 right-0 z-10">
            <div className="flex justify-center gap-4 overflow-x-auto pb-4 scrollbar-none snap-x pointer-events-auto">
              {AVAILABLE_FRAMES.map((frame) => (
                <button
                  key={frame.sku}
                  onClick={() => setCurrentSku(frame)}
                  className={`flex-none px-6 py-3 border rounded-full text-[10px] uppercase tracking-widest font-bold transition-all snap-center
                    ${currentSku.sku === frame.sku 
                      ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_15px_rgba(var(--brand-gold-rgb),0.3)]' 
                      : 'bg-black/50 border-white/20 text-white/70 hover:border-white/50 hover:text-white'}`}
                >
                  {frame.label}
                </button>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
