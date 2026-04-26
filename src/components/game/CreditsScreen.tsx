import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CreditsScreenProps {
  onRestart: () => void;
  onLoadGame?: () => void;
}

const CREDITS: { role: string; name: string }[] = [
  { role: "A Hollywood Murder Mystery", name: "" },
  { role: "Case Closed", name: "Detective Stanley Wilson" },

  { role: "Story and Art by", name: "Lucas Celestini" },
  { role: "Game Development by", name: "Lucas Celestini & Phil Celestini" },

  { role: "Creative Director", name: "Lucas Celestini" },
  { role: "Lead Designer", name: "Lucas Celestini" },
  { role: "Character Design", name: "Lucas Celestini" },
  { role: "Concept Art", name: "Lucas Celestini" },
  { role: "Story & Script", name: "Lucas Celestini" },

  { role: "Lead Programmer", name: "Phil Celestini" },
  { role: "Systems & Tools", name: "Phil Celestini" },
  { role: "Audio Design", name: "Phil Celestini" },
  { role: "UI Engineering", name: "Phil Celestini" },
  { role: "Quality Assurance", name: "Lucas Celestini & Phil Celestini" },
  { role: "Producers", name: "Lucas Celestini & Phil Celestini" },
  { role: "Executive Producers", name: "Lucas Celestini & Phil Celestini" },

  { role: "Featuring", name: "Detective Stanley Wilson · Mr. Cowardly · Lady Fantastica · Duke Extreme · Chef Allegro · Sally · Carl · Luke Adams" },
  { role: "Built With", name: "React · Tailwind · Lovable" },

  { role: "A Father–Son Production", name: "Celestini Studios" },
  { role: "Thanks for Playing", name: "" },
];

export function CreditsScreen({ onRestart, onLoadGame }: CreditsScreenProps) {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButtons(true), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 z-50 bg-black overflow-hidden flex items-center justify-center">
      {/* Scrolling credits */}
      <div className="absolute inset-x-0 top-full animate-[credits-scroll_42s_linear_forwards] text-center text-white font-pixel">
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
          to { transform: translateY(-220%); }
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.8s ease-in forwards; }
      `}</style>
    </div>
  );
}
