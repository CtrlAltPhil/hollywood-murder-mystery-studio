import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Sun, Bug } from "lucide-react";

interface GameMenuProps {
  onResume: () => void;
  onSave: () => void;
  onRestart: () => void;
  onLoadGame?: () => void;
  musicVolume: number;
  sfxVolume: number;
  brightness: number;
  onMusicVolumeChange: (v: number) => void;
  onSfxVolumeChange: (v: number) => void;
  onBrightnessChange: (v: number) => void;
  isTitleScreen?: boolean;
  debugMode: boolean;
  onDebugModeToggle: (v: boolean) => void;
}

// Secret code: ↑ ↑ ↓ ↓ ← → ← → B A
const SECRET_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function GameMenu({ 
  onResume, onSave, onRestart, onLoadGame, musicVolume, sfxVolume, brightness, 
  onMusicVolumeChange, onSfxVolumeChange, onBrightnessChange, isTitleScreen,
  debugMode, onDebugModeToggle
}: GameMenuProps) {
  const [codeProgress, setCodeProgress] = useState(0);
  const [debugUnlocked, setDebugUnlocked] = useState(() => {
    return localStorage.getItem('hmm_debug_unlocked') === 'true';
  });
  const [showCodeFlash, setShowCodeFlash] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const expected = SECRET_CODE[codeProgress];
      if (e.key === expected || e.key.toLowerCase() === expected) {
        const next = codeProgress + 1;
        if (next >= SECRET_CODE.length) {
          setDebugUnlocked(true);
          localStorage.setItem('hmm_debug_unlocked', 'true');
          setShowCodeFlash(true);
          setTimeout(() => setShowCodeFlash(false), 1500);
          setCodeProgress(0);
        } else {
          setCodeProgress(next);
        }
      } else {
        setCodeProgress(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [codeProgress]);

  return (
    <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border-2 border-zinc-700 p-8 rounded-lg shadow-2xl max-w-md w-full max-h-[90%] overflow-y-auto">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-6 tracking-widest uppercase title-glow">
          {isTitleScreen ? 'Settings' : 'Game Paused'}
        </h2>

        {/* Code unlock flash */}
        {showCodeFlash && (
          <div className="mb-4 text-center text-green-400 text-xs font-pixel animate-pulse">
            🔓 Debug Mode Unlocked!
          </div>
        )}

        {/* Audio Settings */}
        <div className="mb-6 space-y-4 border border-zinc-700 rounded-lg p-4">
          <h3 className="text-sm font-bold text-yellow-400/80 uppercase tracking-wider">Audio</h3>
          <div className="flex items-center gap-3">
            <button onClick={() => onMusicVolumeChange(musicVolume > 0 ? 0 : 0.3)} className="text-zinc-400 hover:text-white cursor-pointer">
              {musicVolume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <span className="text-zinc-400 text-xs w-14">Music</span>
            <Slider value={[musicVolume * 100]} max={100} step={1} onValueChange={([v]) => onMusicVolumeChange(v / 100)} className="flex-1" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onSfxVolumeChange(sfxVolume > 0 ? 0 : 0.5)} className="text-zinc-400 hover:text-white cursor-pointer">
              {sfxVolume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <span className="text-zinc-400 text-xs w-14">SFX</span>
            <Slider value={[sfxVolume * 100]} max={100} step={1} onValueChange={([v]) => onSfxVolumeChange(v / 100)} className="flex-1" />
          </div>
        </div>

        {/* Brightness Settings */}
        <div className="mb-6 space-y-4 border border-zinc-700 rounded-lg p-4">
          <h3 className="text-sm font-bold text-yellow-400/80 uppercase tracking-wider">Display</h3>
          <div className="flex items-center gap-3">
            <Sun className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-400 text-xs w-14">Bright</span>
            <Slider value={[brightness * 100]} min={30} max={150} step={1} onValueChange={([v]) => onBrightnessChange(v / 100)} className="flex-1" />
          </div>
        </div>

        {/* Debug Mode (hidden until unlocked) */}
        {debugUnlocked && (
          <div className="mb-6 space-y-4 border border-green-900/50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-green-400/80 uppercase tracking-wider flex items-center gap-2">
              <Bug className="w-4 h-4" /> Developer
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-xs">Debug Mode</span>
              <button
                onClick={() => onDebugModeToggle(!debugMode)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  debugMode 
                    ? 'bg-green-600 text-white' 
                    : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                }`}
              >
                {debugMode ? 'ON' : 'OFF'}
              </button>
            </div>
            <p className="text-zinc-500 text-[10px]">Shows hotspot bounding boxes in all scenes.</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!isTitleScreen && (
            <>
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
            </>
          )}
          {onLoadGame && (
            <Button 
              onClick={onLoadGame}
              className="w-full text-lg py-6 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 transition-all hover:scale-105"
            >
              LOAD GAME
            </Button>
          )}
          {!isTitleScreen && (
            <Button 
              onClick={onRestart}
              variant="destructive"
              className="w-full text-lg py-6 border border-red-900 transition-all hover:scale-105 hover:bg-red-900/50"
            >
              RESTART TO TITLE
            </Button>
          )}
          {isTitleScreen && (
            <Button 
              onClick={onResume}
              className="w-full text-lg py-6 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 transition-all hover:scale-105"
            >
              CLOSE
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
