
"use client";

import { useState } from "react";
import { PortalHeader } from "@/components/radiance/PortalHeader";
import { ScannerView } from "@/components/radiance/ScannerView";
import { ResultsView } from "@/components/radiance/ResultsView";
import { CreatorSignature } from "@/components/radiance/CreatorSignature";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles, ChevronRight, Zap, ShieldCheck, Heart, User, Waves, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function Home() {
  const [step, setStep] = useState<"welcome" | "calibrate" | "scan" | "results">("welcome");
  const [photo, setPhoto] = useState<string | null>(null);
  const [gender, setGender] = useState<string>("Male");

  const startJourney = () => {
    setStep("calibrate");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCapture = (dataUri: string) => {
    setPhoto(dataUri);
    setStep("results");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroImage = PlaceHolderImages.find(img => img.id === "hero-portrait");

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#050405] text-foreground">
      {/* Dynamic Ambient Background - Enhanced for Mobile */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-aura opacity-30" />
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[70vh] blur-[120px] transition-all duration-[2000ms] opacity-30",
          gender === "Male" ? "bg-blue-600" : gender === "Female" ? "bg-pink-600" : "bg-violet-600"
        )} />
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-primary/10 blur-[150px]" />
      </div>

      <PortalHeader />

      <div className="relative pt-24 md:pt-32 pb-20 z-10 px-4">
        {step === "welcome" && (
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
            {/* High-End Hero Section */}
            <div className="mb-12 md:mb-16 relative w-full max-w-sm md:max-w-lg aspect-[3/4] group">
              <div className="absolute -inset-10 bg-primary/20 rounded-[4rem] blur-[80px] animate-pulse group-hover:bg-primary/30 transition-all duration-1000" />
              <div className="relative h-full w-full rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl glass-morphism">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-pink-500/10 to-violet-500/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="relative">
                      <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full animate-pulse" />
                      <Sparkles className="w-32 h-32 md:w-48 md:h-48 text-primary/40 relative z-10 animate-float" />
                   </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2">
                   <div className="p-5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 animate-float shadow-2xl">
                      <Heart className="w-10 h-10 text-primary" />
                   </div>
                </div>
              </div>
            </div>
            
            <h1 className="font-headline text-6xl md:text-9xl lg:text-[10rem] text-white mb-8 leading-[0.85] tracking-tighter uppercase">
              Aura <br />
              <span className="italic font-light opacity-60">Insight</span>
            </h1>
            
            <p className="font-body text-lg md:text-3xl text-white/50 max-w-2xl mb-12 md:mb-16 leading-relaxed px-4">
              Reveal the spectral frequencies of your presence. A journey through 
              neural brilliance and spiritual clarity.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-24 md:mb-32">
              <Button 
                size="lg" 
                onClick={startJourney}
                className="rounded-full px-12 md:px-20 h-20 md:h-24 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_20px_60px_rgba(235,162,182,0.4)] group transition-all text-xl md:text-2xl font-black tracking-[0.2em] uppercase"
              >
                Begin Analysis
                <ChevronRight className="ml-3 w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>

            {/* Feature Cards - Optimized for Mobile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
               {[
                 { icon: Heart, title: "Resonance", desc: "Precision frequency mapping of your spiritual signature." },
                 { icon: Zap, title: "Spectral", desc: "Real-time rendering of your unique emotional aura." },
                 { icon: ShieldCheck, title: "Digital", desc: "Secure biometric acquisition for your personal artifact." }
               ].map((feature, i) => (
                 <div key={i} className="p-8 md:p-10 glass-morphism rounded-[2.5rem] space-y-4 text-center md:text-left group hover:border-white/20 transition-all">
                   <feature.icon className="w-8 h-8 md:w-10 md:h-10 text-primary opacity-60 mx-auto md:mx-0 group-hover:opacity-100 transition-opacity" />
                   <h3 className="font-headline text-2xl md:text-3xl text-white/90">{feature.title}</h3>
                   <p className="text-white/40 leading-relaxed text-base md:text-lg">{feature.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {step === "calibrate" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4">
            <div className="text-center mb-12 md:mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] uppercase tracking-[0.4em] font-black">
                Phase 1: Essence Alignment
              </div>
              <h2 className="font-headline text-5xl md:text-8xl text-white">Select Vibration</h2>
              <p className="text-white/40 text-xl md:text-2xl italic font-body">Choose the essence that aligns with your spirit</p>
            </div>

            <div className="glass-morphism rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 space-y-12 md:space-y-16">
              <RadioGroup value={gender} onValueChange={setGender} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {[
                  { id: "Male", label: "MALE", sub: "SOLAR ESSENCE", icon: Sun, color: "border-blue-500", glow: "shadow-[0_0_50px_rgba(59,130,246,0.3)]", activeBg: "bg-blue-500/10", textColor: "text-blue-400" },
                  { id: "Female", label: "FEMALE", sub: "LUNAR ESSENCE", icon: Moon, color: "border-pink-500", glow: "shadow-[0_0_50px_rgba(244,114,182,0.3)]", activeBg: "bg-pink-500/10", textColor: "text-pink-400" },
                  { id: "Others", label: "OTHER", sub: "COSMIC ESSENCE", icon: Waves, color: "border-violet-500", glow: "shadow-[0_0_50px_rgba(167,139,250,0.3)]", activeBg: "bg-violet-500/10", textColor: "text-violet-400" }
                ].map((item) => (
                  <div key={item.id} className="flex flex-col items-center">
                    <RadioGroupItem value={item.id} id={item.id} className="sr-only" />
                    <Label 
                      htmlFor={item.id}
                      className={cn(
                        "w-full p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border-2 cursor-pointer text-center transition-all duration-500",
                        gender === item.id ? cn(item.color, item.activeBg, item.glow, "scale-105") : "border-white/5 bg-white/[0.01] hover:bg-white/[0.05]"
                      )}
                    >
                      <item.icon className={cn("w-8 h-8 mx-auto mb-4 transition-colors", gender === item.id ? item.textColor : "text-white/20")} />
                      <span className={cn("font-headline text-2xl md:text-3xl block mb-2 transition-colors", gender === item.id ? "text-white" : "text-white/30")}>{item.label}</span>
                      <span className={cn("text-[9px] uppercase tracking-[0.4em] font-black transition-opacity", gender === item.id ? "opacity-80" : "opacity-20")}>{item.sub}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-center pt-4 md:pt-8">
                <Button 
                  size="lg"
                  onClick={() => setStep("scan")}
                  className="rounded-full px-16 md:px-20 h-16 md:h-20 bg-white text-black hover:bg-white/90 shadow-2xl text-base font-black tracking-[0.3em] uppercase w-full md:w-auto"
                >
                  Confirm Identity
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === "scan" && (
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12 md:mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] uppercase tracking-[0.4em] font-black mb-2">
                Bio-Optic Ready
              </div>
              <h2 className="font-headline text-5xl md:text-8xl text-white">Capture Essence</h2>
              <p className="text-white/40 text-xl md:text-2xl italic font-body">Position your face within the ring</p>
            </div>
            <ScannerView onCapture={handleCapture} />
            <div className="mt-12 flex justify-center">
              <Button 
                variant="ghost" 
                onClick={() => setStep("calibrate")}
                className="text-white/30 hover:text-primary tracking-[0.3em] text-[10px] font-black uppercase"
              >
                ← Change Alignment
              </Button>
            </div>
          </div>
        )}

        {step === "results" && photo && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-[1500ms]">
            <ResultsView photoDataUri={photo} gender={gender} />
            <div className="flex justify-center mt-12 md:mt-20 px-4">
               <Button 
                 variant="outline" 
                 onClick={() => {
                   setStep("welcome");
                   setPhoto(null);
                 }}
                 className="rounded-full border-white/10 text-white/50 hover:text-white px-12 h-16 tracking-[0.4em] font-black text-[10px] uppercase w-full md:w-auto"
               >
                 End Session
               </Button>
            </div>
          </div>
        )}

        <CreatorSignature />
      </div>
    </main>
  );
}
