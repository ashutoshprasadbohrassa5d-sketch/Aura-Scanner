
"use client";

import { useState, useEffect } from "react";
import { Download, Share2, Cpu, Globe, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KeepsakeCardProps {
  photoDataUri: string;
  affirmation: string;
  traits: string[];
  resonanceScore?: number;
}

export function KeepsakeCard({ photoDataUri, affirmation, traits, resonanceScore }: KeepsakeCardProps) {
  const [artifactIp, setArtifactId] = useState("");

  useEffect(() => {
    setArtifactId("0x" + Math.random().toString(36).substring(2, 7).toUpperCase());
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = photoDataUri;
    link.download = "aura-artifact.jpg";
    link.click();
  };

  const isAscended = resonanceScore && resonanceScore >= 101;

  return (
    <div className="flex flex-col items-center gap-12 md:gap-16 px-4 pb-12">
      <div className="relative p-1 bg-white rounded-[3rem] md:rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] max-w-sm md:max-w-md w-full mx-auto overflow-hidden group">
        <div className="p-8 md:p-12 bg-white rounded-[2.8rem] md:rounded-[3.8rem] space-y-8 md:space-y-12">
          {/* Header */}
          <div className="flex justify-between items-center text-zinc-900/30">
            <span className="text-[8px] font-black tracking-[0.4em] uppercase">Auth: Bio-Digital</span>
            <span className="text-[8px] font-black tracking-[0.4em] uppercase">ID: {artifactIp}</span>
          </div>

          {/* Portrait Container */}
          <div className="relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-zinc-100 shadow-inner group">
            <img 
              src={photoDataUri} 
              alt="Artifact" 
              className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-125" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            {isAscended && (
              <div className="absolute top-4 right-4 p-2 md:p-3 bg-white text-black rounded-full shadow-2xl animate-pulse">
                <Star className="w-4 h-4 fill-current" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="text-center space-y-6 md:space-y-8">
            <div className="flex justify-center items-center gap-4 text-zinc-900/10">
              <div className="h-px w-full bg-current" />
              <Cpu className="w-4 h-4 flex-shrink-0" />
              <div className="h-px w-full bg-current" />
            </div>
            
            <h3 className="font-headline text-2xl md:text-3xl leading-tight text-zinc-900 italic tracking-tight px-2">
              "{affirmation}"
            </h3>

            <div className="pt-4 flex flex-wrap justify-center gap-2">
              {traits.slice(0, 3).map((t, i) => (
                <span key={i} className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded-full text-zinc-400 font-black">
                  {t}
                </span>
              ))}
              {resonanceScore && (
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] bg-zinc-900 border border-zinc-900 px-3 py-1.5 rounded-full text-white font-black">
                  {resonanceScore}% RESONANCE
                </span>
              )}
            </div>

            <div className="mt-8 pt-6 md:pt-8 border-t border-zinc-50 space-y-1">
              <p className="text-[8px] md:text-[9px] uppercase tracking-[0.6em] text-zinc-200 font-black">
                {isAscended ? "Official Ascended Bio-Artifact" : "Official Bio-Artifact"}
              </p>
              <p className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-zinc-300 font-medium">Neural Engine v8.0.0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm md:max-w-md">
        <Button 
          onClick={handleDownload} 
          className="flex-1 rounded-full h-16 bg-white text-black hover:bg-white/90 shadow-2xl font-black tracking-[0.2em] text-xs uppercase"
        >
          <Download className="w-4 h-4 mr-3" />
          Export
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 rounded-full h-16 border-white/10 text-white hover:bg-white/5 font-black tracking-[0.2em] text-xs uppercase"
        >
          <Share2 className="w-4 h-4 mr-3" />
          Share
        </Button>
      </div>
    </div>
  );
}
