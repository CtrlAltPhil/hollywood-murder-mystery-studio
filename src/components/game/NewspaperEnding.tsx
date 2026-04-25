import { useEffect, useState } from "react";
import newspaperImg from "@/assets/newspaper-ending.png";

interface NewspaperEndingProps {
  onComplete: () => void;
}

const LINES: { speaker: string; text: string }[] = [
  {
    speaker: "Headline",
    text: "STUDIO PARTNER UNMASKED — 'Carl' revealed as fugitive Luke Adams, charged in the murder of beloved star Los Cabos.",
  },
  {
    speaker: "The Daily Reel",
    text: "The Green Box Studios co-owner known only as 'Carl' was taken into custody late last night. Detective Stanley Wilson exposed his real identity as Luke Adams — a Nevada con artist with old fraud charges — who had reinvented himself in Hollywood five years ago.",
  },
  {
    speaker: "The Daily Reel",
    text: "Prosecutors say Adams murdered Los Cabos to bury a buyout deal his partner refused, and to keep his hidden past from ever reaching the front page. The blackout at the cast party gave him the cover he needed.",
  },
  {
    speaker: "Detective Wilson",
    text: "It came down to four threads: the inheritance papers in the study, a handkerchief monogrammed 'L.A.' in Duke's trunk, Mr. Cowardly's missing alibi, and the projector reel that caught Carl in the act. Pull on all four and the whole story unraveled.",
  },
  {
    speaker: "The Daily Reel",
    text: "Adams now awaits trial. Detective Wilson has been commended for closing one of Hollywood's darkest cases. The studio lights, for once, have gone out for good.",
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
