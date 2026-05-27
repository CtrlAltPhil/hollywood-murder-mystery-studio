import { useEffect, useState } from "react";
import lukeAdamsImg from "@/assets/characters/luke-adams.png";

interface AccusationCutsceneProps {
  onComplete: () => void;
}

// A short final-confrontation cutscene that plays once the detective has
// gathered enough evidence to identify Luke Adams as the killer.
// Lines auto-advance; the player can also click to skip ahead.
const LINES: { speaker: string; text: string }[] = [
  { speaker: "Detective Wilson", text: "It's over, Luke. The handkerchief in Duke's trunk, Cowardly's description, your phantom alibi — and Celston's inheritance papers tying it all together." },
  { speaker: "Luke Adams", text: "*flat* It was a job, Detective. Nothing personal. Celston paid, I delivered. That's the whole story." },
  { speaker: "Detective Wilson", text: "Then you can tell it again downtown. Stand against the wall. You're under arrest for the murder of Los Cabos." },
  { speaker: "Luke Adams", text: "*shrugs* Celston has lawyers. I'll be out before the ink dries." },
];

export function AccusationCutscene({ onComplete }: AccusationCutsceneProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      if (index < LINES.length - 1) setIndex(index + 1);
      else setTimeout(onComplete, 2000);
    }, 4200);
    return () => clearTimeout(t);
  }, [index, onComplete]);

  const advance = () => {
    if (index < LINES.length - 1) setIndex(index + 1);
    else onComplete();
  };

  const line = LINES[index];

  return (
    <div
      className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-end cursor-pointer"
      onClick={advance}
    >
      {/* Spotlight on Luke */}
      <div className="absolute inset-0 flex items-end justify-center pb-32">
        <div
          className="absolute w-[60%] h-[80%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, hsla(45, 90%, 70%, 0.18) 0%, transparent 65%)",
          }}
        />
        <img
          src={lukeAdamsImg}
          alt="Luke Adams"
          className="relative h-[55%] pixelated"
          style={{ imageRendering: "pixelated", filter: "drop-shadow(0 0 16px hsla(0,0%,0%,0.8))" }}
        />
      </div>

      {/* Dialog */}
      <div
        className="relative w-[90%] max-w-3xl mb-8 border-2 border-amber-400/70 bg-black/85 px-6 py-4 text-white shadow-[0_0_24px_hsla(45,90%,60%,0.3)]"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        <div
          className="text-amber-300 uppercase tracking-widest mb-3"
          style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px' }}
        >
          {line.speaker}
        </div>
        <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px', lineHeight: '1.8' }}>
          {line.text}
        </div>
        <div
          className="absolute bottom-1 right-3 text-amber-400/60 animate-pulse"
          style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}
        >
          {index < LINES.length - 1 ? "▼ click to continue" : "▼ click to finish"}
        </div>
      </div>
    </div>
  );
}
