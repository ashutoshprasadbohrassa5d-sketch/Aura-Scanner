
"use client";

import { useMemo } from "react";

export function SacredGeometryOverlay() {
  const lines = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      rotate: i * 30,
      opacity: 0.1 + Math.random() * 0.2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden mix-blend-screen opacity-60">
      <div className="relative w-full h-full">
        {/* Central Mandala Pattern */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow duration-[30s]">
          {lines.map((line) => (
            <div
              key={line.id}
              className="absolute w-[200%] h-[1px] bg-accent/30"
              style={{ transform: `rotate(${line.rotate}deg)` }}
            />
          ))}
        </div>
        
        {/* Harmonious Circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border border-primary/20 animate-glow-pulse" />
          <div className="absolute w-72 h-72 rounded-full border border-accent/10 animate-glow-pulse delay-700" />
          <div className="absolute w-96 h-96 rounded-full border border-primary/5 animate-glow-pulse delay-1000" />
        </div>

        {/* Golden Ratio Indications (Conceptual) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600">
           <path 
             d="M 100 200 Q 200 100 300 200 T 200 400" 
             fill="none" 
             stroke="hsl(var(--primary))" 
             strokeWidth="0.5" 
             strokeDasharray="4 4" 
             className="opacity-20"
           />
           <circle cx="200" cy="200" r="100" fill="none" stroke="hsl(var(--accent))" strokeWidth="0.5" className="opacity-20" />
           <line x1="100" x2="300" x2="300" y2="200" stroke="hsl(var(--primary))" strokeWidth="0.5" className="opacity-20" />
           <line x1="200" y1="100" x2="200" y2="400" stroke="hsl(var(--primary))" strokeWidth="0.5" className="opacity-20" />
        </svg>
      </div>
    </div>
  );
}
