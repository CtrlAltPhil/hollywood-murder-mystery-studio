import { useEffect, useState } from "react";
import newspaperImg from "@/assets/newspaper-ending.png";

interface NewspaperEndingProps {
  onComplete: () => void;
}

const LINES: { speaker: string; text: string }[] = [
  {
    speaker: "Headline",
    text: "STUDIO MOGUL ARRESTED — Jack Celston charged in the murder plot of beloved star Los Cabos.",
  },
  {
    speaker: "The Daily Reel",
    text: "Studio chief Jack Celston was taken into custody late last night after Detective Stanley Wilson uncovered evidence that Celston hired hitman Luke Adams to murder leading man Los Cabos.",
  },
  {
    speaker: "The Daily Reel",
    text: "Prosecutors say Celston feared losing the studio after a secret talent inheritance agreement guaranteed Los Cabos a controlling stake. Adams — a longtime 'fixer' — was paid to stage the killing during the cast party blackout.",
  },
  {
    speaker: "Detective Wilson",
    text: "It came down to four threads: a forged alibi, a monogrammed handkerchief in Duke Extreme's trunk, a sabotaged breaker box, and a witness too scared to lie. Pull on all four and the whole story unraveled.",
  },
  {
    speaker: "The Daily Reel",
    text: "Both Celston and Adams now await trial. Detective Wilson has been commended for closing one of Hollywood's darkest cases. The studio lights, for once, have gone out for good.",
  },
];

export function NewspaperEnding({ onComplete }: NewspaperEndingProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      if (index < LINES.length - 1) setIndex(index + 1);
      else setTimeout(onComplete, 2200);
    }, 5500);
    return () => clearTimeout(t);
  }, [index, onComplete]);

  const advance = () => {
    if (index < LINES.length - 1) setIndex(index + 1);
    else onComplete();
  };

  const line = LINES[index];

  return (
    <div
      className="absolute inset-0 z-50 bg-black flex items-center justify-center cursor-pointer overflow-hidden"
      onClick={advance}
    >
      {/* Newspaper drifts gently and zooms in slowly for a Ken Burns feel */}
      <img
        src={newspaperImg}
        alt="Newspaper: Studio Mogul Arrested"
        className="absolute h-[92%] max-w-none animate-[newspaper-zoom_22s_ease-out_forwards] pixelated"
        style={{
          imageRendering: "pixelated",
          filter: "drop-shadow(0 12px 30px hsla(0,0%,0%,0.7))",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, hsla(0,0%,0%,0.85) 100%)",
        }}
      />

      {/* Dialog */}
      <div className="absolute bottom-8 w-[90%] max-w-3xl border-2 border-amber-400/70 bg-black/85 px-6 py-4 font-pixel text-white shadow-[0_0_24px_hsla(45,90%,60%,0.3)]">
        <div className="text-amber-300 text-xs uppercase tracking-widest mb-2">
          {line.speaker}
        </div>
        <div className="text-base leading-relaxed">{line.text}</div>
        <div className="absolute bottom-1 right-3 text-amber-400/60 text-xs animate-pulse">
          {index < LINES.length - 1 ? "▼ click to continue" : "▼ roll credits"}
        </div>
      </div>

      <style>{`
        @keyframes newspaper-zoom {
          0%   { transform: scale(1.02) translateY(0); }
          100% { transform: scale(1.18) translateY(-2%); }
        }
      `}</style>
    </div>
  );
}
