
"use client";

export function CreatorSignature() {
  return (
    <div className="py-20 flex flex-col items-center text-center px-4 border-t border-primary/10 mt-20">
      <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50 mb-4">Crafted with Vision & Soul</p>
      <h2 className="font-headline text-2xl md:text-3xl text-primary/80 mb-2">ASHUTOSH PRASAD BOHARA</h2>
      <p className="font-body italic text-muted-foreground/60 max-w-md">
        An exploration of digital aesthetics and the human spirit. 
        Designed to illuminate the unique radiance inherent in every soul.
      </p>
      <div className="mt-8 flex gap-4 text-primary/40">
        <div className="w-1 h-1 rounded-full bg-current" />
        <div className="w-1 h-1 rounded-full bg-current" />
        <div className="w-1 h-1 rounded-full bg-current" />
      </div>
    </div>
  );
}
