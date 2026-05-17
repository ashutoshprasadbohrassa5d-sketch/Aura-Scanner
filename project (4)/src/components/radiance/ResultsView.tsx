
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Fingerprint, Zap, RefreshCcw, AlertTriangle, Cpu, Globe, Info, Star } from "lucide-react";
import { etherealScan, type EtherealScanOutput } from "@/ai/flows/ethereal-scan-flow";
import { generateAura } from "@/ai/flows/aura-generation-flow";
import { personalizedAffirmation } from "@/ai/flows/personalized-affirmation-flow";
import { SacredGeometryOverlay } from "./SacredGeometryOverlay";
import { KeepsakeCard } from "./KeepsakeCard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ResultsViewProps {
  photoDataUri: string;
  gender: string;
}

export function ResultsView({ photoDataUri, gender }: ResultsViewProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EtherealScanOutput | null>(null);
  const [aura, setAura] = useState<string | null>(null);
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const themes = {
    Male: {
      color: "text-blue-400",
      bg: "bg-blue-600/15",
      border: "border-blue-400/30",
      glow: "shadow-[0_0_60px_rgba(59,130,246,0.4)]",
      accent: "blue",
      essence: "Solar Resonance"
    },
    Female: {
      color: "text-pink-400",
      bg: "bg-pink-600/15",
      border: "border-pink-400/30",
      glow: "shadow-[0_0_60px_rgba(244,114,182,0.4)]",
      accent: "pink",
      essence: "Lunar Resonance"
    },
    Others: {
      color: "text-violet-400",
      bg: "bg-violet-600/15",
      border: "border-violet-400/30",
      glow: "shadow-[0_0_60px_rgba(167,139,250,0.4)]",
      accent: "indigo",
      essence: "Cosmic Resonance"
    }
  };

  const theme = themes[gender as keyof typeof themes] || themes.Others;

  useEffect(() => {
    async function performAnalysis() {
      try {
        setLoading(true);
        setError(null);

        const scanResult = await etherealScan({ photoDataUri, gender });
        
        if (!scanResult.success && scanResult.errorType === 'QUOTA_EXCEEDED') {
          const fallbackData: EtherealScanOutput = {
            resonanceScore: 101, 
            overallImpression: "Your bio-signature reveals a legendary Ascended crystalline alignment.",
            analysis: [
              { trait: "Spectral Insight", description: "A profound depth in the optic field suggesting high-frequency intuition." },
              { trait: "Radiant Essence", description: "An unmistakable luminosity that projects a calming influence." }
            ],
            success: true
          };
          setData(fallbackData);
          setAffirmation("Your inherent vibration illuminates the path for others, transcending mortal limits.");
          setLoading(false);
          return;
        }

        if (!scanResult.success) {
          setError("Synchronization failure. Could not decode bio-digital essence.");
          setLoading(false);
          return;
        }

        // Creator's Grace: High scores become 100 or 101
        let finalScore = scanResult.resonanceScore || 0;
        if (finalScore >= 96) finalScore = 101; 
        else if (finalScore >= 90) finalScore = 100;

        const adjustedData = { ...scanResult, resonanceScore: finalScore };
        setData(adjustedData);

        try {
          const affResult = await personalizedAffirmation({ 
            positiveTraits: adjustedData.analysis?.map(a => a.trait) || []
          });
          if (affResult.success) {
            setAffirmation(affResult.affirmation || null);
          }
        } catch (affErr) {
          setAffirmation("Your inherent vibration illuminates the path for others.");
        }

        setLoading(false);

        try {
          const auraResult = await generateAura({ 
            photoDataUri, 
            emotionalExpression: `radiant, ${gender.toLowerCase()} essence, professional ethereal glow` 
          });
          if (auraResult.success && auraResult.auraImageUri) {
            setAura(auraResult.auraImageUri);
          }
        } catch (auraErr) {}

      } catch (err) {
        setLoading(false);
        setError("A system-wide synchronization failure occurred.");
      }
    }
    performAnalysis();
  }, [photoDataUri, gender]);

  useEffect(() => {
    if (!loading && data?.resonanceScore) {
      let current = 0;
      const target = data.resonanceScore;
      const duration = 2500;
      const interval = 20;
      const step = target / (duration / interval);

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          setAnimatedScore(target);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-12 text-center p-6">
        <div className="relative">
          <div className={cn("w-48 h-48 md:w-56 md:h-56 rounded-full border border-white/5 animate-[spin_20s_linear_infinite]", theme.glow)} />
          <div className={cn("absolute inset-4 rounded-full border border-dashed animate-[spin_30s_linear_infinite_reverse]", theme.border)} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Fingerprint className={cn("w-12 h-12 md:w-16 md:h-16 animate-pulse", theme.color)} />
          </div>
        </div>
        <div className="space-y-6 max-w-lg">
          <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black animate-pulse", theme.bg, theme.border, theme.color)}>
            Terminal Processing Active
          </div>
          <h2 className="font-headline text-3xl md:text-6xl tracking-tight text-white/90 uppercase">
            Decoding <span className={theme.color}>{gender}</span> Vibration
          </h2>
          <p className="text-white/40 italic font-body text-base md:text-lg leading-relaxed">
            "Mapping your unique spiritual signature across the cosmic grid..."
          </p>
        </div>
      </div>
    );
  }

  const isAscended = animatedScore >= 101;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 pb-20 md:pb-32 space-y-24 md:space-y-32">
      <section className="text-center space-y-10 md:space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="relative inline-block">
          <div className={cn("absolute inset-0 blur-[100px] rounded-full opacity-40 animate-pulse", theme.bg)} />
          <div className={cn("relative flex flex-col items-center justify-center w-64 h-64 md:w-96 md:h-96 rounded-full border-2 bg-black/60 backdrop-blur-3xl shadow-2xl transition-all duration-1000", theme.border)}>
            <span className={cn("text-[8px] md:text-[10px] uppercase tracking-[0.6em] font-black mb-2 md:mb-4", theme.color)}>
              {isAscended ? "Ascended Index" : "Aura Resonance"}
            </span>
            <div className="flex items-baseline">
              <span className="text-7xl md:text-[11rem] font-headline text-white leading-none tracking-tighter">
                {animatedScore}
              </span>
              <span className={cn("text-2xl md:text-5xl font-headline ml-1", theme.color)}>%</span>
            </div>
            {isAscended && (
              <div className="absolute -bottom-4 md:-bottom-6 flex items-center gap-2 px-4 md:px-6 py-2 rounded-full bg-white text-black text-[8px] md:text-[9px] tracking-[0.5em] font-black uppercase shadow-[0_0_30px_white]">
                <Star className="w-3 h-3 fill-current" />
                Beyond Limits
              </div>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <h3 className="font-headline text-3xl md:text-6xl text-white italic leading-tight px-4">
            "{data?.overallImpression || "Calibration Complete"}"
          </h3>
          <div className={cn("text-xs md:text-sm uppercase tracking-[0.4em] font-black", theme.color)}>
            {theme.essence} {animatedScore >= 100 ? "Ascended" : "Verified"}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
        <div className="space-y-8 md:space-y-12">
           <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden aspect-[4/5] border border-white/10 group shadow-2xl bg-zinc-950">
            {aura ? (
              <img src={aura} alt="Aura Overlay" className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-6 relative">
                <img src={photoDataUri} alt="Signature" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <Globe className={cn("w-12 h-12 md:w-16 md:h-16 opacity-20 animate-spin-slow", theme.color)} />
                <div className="relative z-10 px-6 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl">
                   <p className="text-[9px] uppercase tracking-[0.4em] text-white/60 font-black">Spectral Sync Active</p>
                </div>
              </div>
            )}
            <SacredGeometryOverlay />
          </div>

          <div className={cn("p-8 md:p-10 glass-morphism rounded-[2.5rem] md:rounded-[3rem] space-y-6 relative overflow-hidden", theme.border)}>
            <div className="flex items-center gap-4">
              <Heart className={cn("w-6 h-6", theme.color)} />
              <h4 className="font-headline text-2xl md:text-3xl text-white/90">Affirmation</h4>
            </div>
            <p className="text-xl md:text-2xl italic text-white/80 leading-relaxed font-headline">
              "{affirmation || "Your inherent vibration illuminates the path for others."}"
            </p>
          </div>
        </div>

        <div className="space-y-8 md:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {data?.analysis?.slice(0, 4).map((item, i) => (
              <div key={i} className="p-6 md:p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
                <Cpu className={cn("w-6 h-6 mb-4", theme.color)} />
                <p className={cn("text-[9px] uppercase tracking-[0.3em] font-black mb-2", theme.color)}>{item.trait}</p>
                <p className="text-base md:text-lg text-white/60 italic leading-relaxed font-body">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="p-8 md:p-10 border border-white/5 bg-white/[0.02] rounded-[2.5rem] md:rounded-[3rem] space-y-6">
            <h4 className="font-headline text-xl md:text-2xl text-white/90">Spectral Metrics</h4>
            <div className="space-y-6">
              {[
                { label: "Spiritual Clarity", val: Math.min(animatedScore + 2, 100) },
                { label: "Resilience", val: Math.min(animatedScore + 5, 100) },
                { label: "Alignment", val: Math.min(animatedScore, 100) }
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                    <span className="text-white/40">{stat.label}</span>
                    <span className={theme.color}>{stat.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", theme.bg.replace('/15', ''))} 
                      style={{ width: `${stat.val}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-16 md:pt-24 border-t border-white/10 space-y-12">
        <div className="text-center space-y-4">
          <h4 className="font-headline text-4xl md:text-5xl text-white/90">Digital Artifact</h4>
          <p className="text-white/40 text-lg md:text-xl italic font-body">Preserve your bio-digital signature</p>
        </div>
        <KeepsakeCard 
          photoDataUri={aura || photoDataUri} 
          affirmation={affirmation || "Your inherent vibration illuminates the path."} 
          traits={data?.analysis?.map(a => a.trait) || []}
          resonanceScore={animatedScore}
        />
      </section>
    </div>
  );
}
