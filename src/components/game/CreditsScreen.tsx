import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CreditsScreenProps {
  onRestart: () => void;
  onLoadGame?: () => void;
}

const CREDITS = [
  { role: "A Hollywood Murder Mystery", name: "" },
  { role: "Case Closed", name: "Detective Stanley Wilson" },
  { role: "The Killer", name: "Luke Adams" },
  { role: "The Victim", name: "Los Cabos" },
  { role: "Featuring", name: "Mr. Cowardly · Lady Fantastique · Carl Celston · Duke Extreme" },
  { role: "Written & Directed by", name: "You" },
  { role: "Engine", name: "React · Tailwind · Web Audio" },
  { role: "Thanks for Playing", name: "" },
];

export function CreditsScreen({ onRestart, onLoadGame }: CreditsScreenProps) {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButtons(true), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 z-50 bg-black overflow-hidden flex items-center justify-center">
      {/* Scrolling credits */}
      <div className="absolute inset-x-0 top-full animate-[credits-scroll_28s_linear_forwards] text-center text-white font-pixel">
        {CREDITS.map((c, i) => (
          <div key={i} className="my-10">
            <div className="text-amber-400/80 text-xs uppercase tracking-widest mb-2">{c.role}</div>
            {c.name && <div className="text-2xl">{c.name}</div>}
          </div>
        ))}
        <div className="h-40" />
      </div>

      {/* Action buttons */}
      {showButtons && (
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 z-10 animate-fade-in">
          <Button
            onClick={onRestart}
            className="font-pixel bg-amber-500 hover:bg-amber-400 text-black px-8 py-2 border-2 border-amber-300"
          >
            Return to Title
          </Button>
          {onLoadGame && (
            <Button
              onClick={onLoadGame}
              variant="outline"
              className="font-pixel border-amber-400/60 text-amber-300 hover:bg-amber-500/10 px-8 py-2"
            >
              Load Saved Game
            </Button>
          )}
        </div>
      )}

      <style>{`
        @keyframes credits-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(-180%); }
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.8s ease-in forwards; }
      `}</style>
    </div>
  );
}
