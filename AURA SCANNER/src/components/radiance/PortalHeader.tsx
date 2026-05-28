"use client";

import { Sparkles, Heart } from "lucide-react";

export function PortalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-6 px-8 flex justify-between items-center bg-background/60 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-3 group cursor-pointer transition-all">
        <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Heart className="w-6 h-6 text-primary animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="font-headline text-xl tracking-[0.3em] text-primary/90 leading-none">AURA SCANNER</span>
          <span className="text-[8px] uppercase tracking-[0.5em] text-accent/60 font-bold">Bio-Digital Insight</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/50">Production v2.4.0</span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-primary/60 font-medium">Ashutosh Prasad Bohara</span>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
      </div>
    </header>
  );
}
