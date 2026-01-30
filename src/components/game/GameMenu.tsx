import { Button } from "@/components/ui/button";

interface GameMenuProps {
  onResume: () => void;
  onSave: () => void;
  onRestart: () => void;
}

export function GameMenu({ onResume, onSave, onRestart }: GameMenuProps) {
  return (
    <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border-2 border-zinc-700 p-8 rounded-lg shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-8 tracking-widest uppercase title-glow">
          Game Paused
        </h2>
        <div className="flex flex-col gap-4">
          <Button 
            onClick={onResume}
            className="w-full text-lg py-6 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 transition-all hover:scale-105"
          >
            RESUME
          </Button>
          <Button 
            onClick={onSave}
            className="w-full text-lg py-6 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 transition-all hover:scale-105"
          >
            SAVE GAME
          </Button>
          <Button 
            onClick={onRestart}
            variant="destructive"
            className="w-full text-lg py-6 border border-red-900 transition-all hover:scale-105 hover:bg-red-900/50"
          >
            RESTART TO TITLE
          </Button>
        </div>
      </div>
    </div>
  );
}