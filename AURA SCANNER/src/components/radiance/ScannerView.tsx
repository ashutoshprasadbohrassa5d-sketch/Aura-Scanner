
"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, RefreshCcw, Sparkles, Binary, Upload, ShieldAlert, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScannerViewProps {
  onCapture: (dataUri: string) => void;
}

export function ScannerView({ onCapture }: ScannerViewProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<{title: string, message: string} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    if (isInitializing) return;
    
    setIsInitializing(true);
    setError(null);
    stopCamera();

    try {
      if (!window.isSecureContext && window.location.hostname !== 'localhost') {
        throw new Error("SECURE_CONTEXT_REQUIRED");
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MEDIA_DEVICES_UNSUPPORTED");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });
      
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for metadata to load then play
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.warn("Auto-play prevented:", e));
        };
      }
      
      setIsInitializing(false);
    } catch (err: any) {
      console.warn("Camera Sync Note:", err.message || err.name);
      setIsInitializing(false);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError({
          title: "Access Restricted",
          message: "Camera permissions were denied. Please enable camera access in your browser settings."
        });
      } else if (err.message === "SECURE_CONTEXT_REQUIRED") {
        setError({
          title: "Insecure Link",
          message: "Webcam access requires an HTTPS connection. Please use manual upload."
        });
      } else {
        setError({
          title: "Sync Interrupted",
          message: "The bio-optic feed is currently unavailable. Please try manual upload."
        });
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUri = canvas.toDataURL("image/jpeg", 0.9);
        setIsCapturing(true);
        
        setTimeout(() => {
          onCapture(dataUri);
          stopCamera();
        }, 1200);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUri = event.target?.result as string;
        setIsCapturing(true);
        setTimeout(() => {
          onCapture(dataUri);
          stopCamera();
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-card border border-primary/20 shadow-[0_0_80px_rgba(235,162,182,0.1)] group">
        
        {isInitializing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-background/90 z-20">
            <div className="relative">
              <div className="w-20 h-20 border-t-2 border-primary rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Binary className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold animate-pulse">Syncing Optic Chain</p>
              <p className="text-[8px] text-muted-foreground mt-2 italic px-8">Establishing secure biometric connection...</p>
            </div>
          </div>
        )}
        
        {error && !isInitializing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-background/95 z-30 space-y-8 animate-in fade-in duration-500">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20">
                <ShieldAlert className="w-12 h-12 text-destructive" />
              </div>
              <XCircle className="absolute -bottom-1 -right-1 w-8 h-8 text-background fill-destructive" />
            </div>
            
            <div className="space-y-3">
              <h3 className="font-headline text-3xl text-destructive/90">{error.title}</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">{error.message}</p>
            </div>
            
            <div className="flex flex-col gap-4 w-full max-w-[220px]">
              <Button 
                variant="outline" 
                onClick={startCamera} 
                className="rounded-full border-primary/20 hover:bg-primary/5 h-14 group"
              >
                <RefreshCcw className="w-4 h-4 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                Retry Sync
              </Button>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full bg-primary text-primary-foreground h-14 shadow-lg shadow-primary/20"
              >
                <Upload className="w-4 h-4 mr-3" />
                Upload Signature
              </Button>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-all duration-1000 ${isCapturing ? 'scale-110 blur-xl opacity-40' : 'opacity-100'}`}
        />

        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-primary/40 rounded-bl-2xl" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-primary/40 rounded-br-2xl" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[85%] h-[85%] border border-white/5 rounded-full" />
            <div className="absolute w-[75%] h-[75%] border border-dashed border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
          </div>

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent shadow-[0_0_20px_hsl(var(--primary))] animate-scan-line-v2" />
          
          <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[8px] uppercase tracking-[0.3em] text-white/30 whitespace-nowrap">
            <span className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${stream ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              {stream ? 'Bio-Feed: Online' : 'Bio-Feed: Standby'}
            </span>
            <span className="w-1 h-1 rounded-full bg-primary/40" />
            <span>Mode: High-Frequency</span>
          </div>
        </div>

        {isCapturing && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 backdrop-blur-md z-40 transition-all duration-500">
            <div className="flex flex-col items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/40 blur-3xl rounded-full animate-pulse" />
                <div className="relative p-10 rounded-full bg-primary/10 border border-primary/30 shadow-2xl">
                   <Sparkles className="w-16 h-16 text-primary animate-bounce" />
                </div>
              </div>
              <div className="text-center space-y-4">
                <p className="font-headline text-4xl text-primary tracking-[0.4em] animate-pulse">DECODING RADIANCE</p>
                <div className="flex gap-2 justify-center">
                   <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0s]" />
                   <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                   <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="mt-12 flex items-center gap-10">
        <Button 
          size="lg" 
          onClick={capturePhoto} 
          disabled={!stream || isCapturing || isInitializing}
          className="rounded-full h-24 w-24 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_50px_rgba(235,162,182,0.4)] p-0 group overflow-hidden relative active:scale-95 transition-all disabled:opacity-30"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Camera className="w-10 h-10 relative z-10" />
          <span className="sr-only">Capture Aura</span>
        </Button>
        
        <div className="flex flex-col gap-3">
          <Button 
            variant="ghost" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isCapturing}
            className="rounded-full text-muted-foreground hover:text-primary transition-all px-8 hover:bg-primary/5 h-12"
          >
            <Upload className="w-5 h-5 mr-3" />
            Upload File
          </Button>
          {!stream && !isInitializing && (
            <Button 
              variant="ghost" 
              onClick={startCamera} 
              className="rounded-full text-primary/60 hover:text-primary transition-all px-8 h-10 text-[10px] uppercase tracking-widest"
            >
              <RefreshCcw className="w-3 h-3 mr-2" />
              Re-Sync Optics
            </Button>
          )}
        </div>
      </div>

      <p className="mt-8 text-[9px] uppercase tracking-[0.6em] text-muted-foreground/40 font-bold">Secure Bio-Data Acquisition Layer v5.2</p>
      
      <style jsx global>{`
        @keyframes scan-line-v2 {
          0% { transform: translateY(-100px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(600px); opacity: 0; }
        }
        .animate-scan-line-v2 {
          animation: scan-line-v2 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
