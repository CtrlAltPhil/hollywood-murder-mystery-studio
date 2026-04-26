import { useState, useEffect, useCallback } from "react";
import gbStudiosBackground from "@/assets/backgrounds/gb-studios.jpg";
import { GameMenu } from "./GameMenu";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface TitleScreenProps {
  onStart: () => void;
  onLoadGame?: () => void;
  musicVolume: number;
  sfxVolume: number;
  brightness: number;
  onMusicVolumeChange: (v: number) => void;
  onSfxVolumeChange: (v: number) => void;
  onBrightnessChange: (v: number) => void;
  debugMode: boolean;
  onDebugModeToggle: (v: boolean) => void;
}

export function TitleScreen({
  onStart,
  onLoadGame,
  musicVolume,
  sfxVolume,
  brightness,
  onMusicVolumeChange,
  onSfxVolumeChange,
  onBrightnessChange,
  debugMode,
  onDebugModeToggle,
}: TitleScreenProps) {
  const [showLightning, setShowLightning] = useState(false);
  const [carPosition, setCarPosition] = useState(-250);
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const [fireflyClickCount, setFireflyClickCount] = useState(0);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const FIREFLY_MESSAGES = [
    "It's just a firefly.",
    "Yep... still a firefly.",
    "Okay, you really like this firefly, huh?",
  ];

  const handleFireflyClick = () => {
    const nextCount = fireflyClickCount + 1;
    setFireflyClickCount(nextCount);
    if (nextCount <= 3) {
      setSpeechBubble(FIREFLY_MESSAGES[nextCount - 1]);
      setTimeout(() => setSpeechBubble(null), 2500);
    } else {
      setSpeechBubble(null);
      setEasterEggVisible(true);
    }
  };

  // Lightning effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let flickerTimeouts: NodeJS.Timeout[] = [];

    const triggerLightning = () => {
      setShowLightning(true);
      flickerTimeouts.forEach(clearTimeout);
      flickerTimeouts = [];

      const t1 = setTimeout(() => setShowLightning(false), 150);
      const t2 = setTimeout(() => {
        setShowLightning(true);
        const t3 = setTimeout(() => setShowLightning(false), 100);
        flickerTimeouts.push(t3);
      }, 200);

      flickerTimeouts.push(t1, t2);
      const nextDelay = 2000 + Math.random() * 5000;
      timeoutId = setTimeout(triggerLightning, nextDelay);
    };

    const initialDelay = 1000 + Math.random() * 2000;
    timeoutId = setTimeout(triggerLightning, initialDelay);

    return () => {
      clearTimeout(timeoutId);
      flickerTimeouts.forEach(clearTimeout);
    };
  }, []);

  // Car animation
  useEffect(() => {
    let animationFrameId: number;
    let lastSpawnTime = performance.now();
    const SPAWN_INTERVAL = 10000;

    const animate = () => {
      const now = performance.now();
      if (now - lastSpawnTime > SPAWN_INTERVAL) {
        setCarPosition(-250);
        lastSpawnTime = now;
      } else {
        setCarPosition((prev) => {
          if (prev > window.innerWidth + 250) return prev;
          return prev + 3;
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const hasSaveData = !!localStorage.getItem("hmm_save_game");

  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center pixelated"
        style={{
          backgroundImage: `url(${gbStudiosBackground})`,
          filter: "brightness(0.9) contrast(1.05)",
        }}
      />

      {/* Lightning Flash Overlay */}
      <div
        className={`absolute inset-0 bg-[hsl(var(--game-lightning))] pointer-events-none transition-opacity duration-75 ${
          showLightning ? "opacity-50" : "opacity-0"
        }`}
      />

      {/* Stormy Sky Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,8%,0.3)] via-transparent to-[hsl(220,30%,5%,0.5)]" />

      {/* Menu Button */}
      <div className="absolute top-4 right-4 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(true)}
          className="text-white/50 hover:text-white hover:bg-white/10"
        >
          <Settings className="w-6 h-6" />
        </Button>
      </div>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <GameMenu
          onResume={() => setIsMenuOpen(false)}
          onSave={() => {}}
          onRestart={() => {}}
          onLoadGame={hasSaveData ? onLoadGame : undefined}
          musicVolume={musicVolume}
          sfxVolume={sfxVolume}
          brightness={brightness}
          onMusicVolumeChange={onMusicVolumeChange}
          onSfxVolumeChange={onSfxVolumeChange}
          onBrightnessChange={onBrightnessChange}
          isTitleScreen
          debugMode={debugMode}
          onDebugModeToggle={onDebugModeToggle}
        />
      )}

      {/* Car Silhouette */}
      <div className="absolute bottom-[2%] h-16 transition-none" style={{ left: carPosition }}>
        <div className="relative">
          <div className="w-48 h-12 bg-[hsl(220,20%,15%)] rounded-t-xl relative">
            <div className="absolute -top-6 left-8 w-28 h-8 bg-[hsl(220,20%,12%)] rounded-t-lg" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-300 rounded-full opacity-80" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-80" />
          </div>
          <div className="absolute -bottom-4 left-6 w-8 h-8 bg-[hsl(220,10%,10%)] rounded-full" />
          <div className="absolute -bottom-4 right-6 w-8 h-8 bg-[hsl(220,10%,10%)] rounded-full" />
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-[7%] left-0 right-0 text-center px-6">
        {/* Dark backdrop to separate title from the gold GB Studios sign */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[260%] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, hsl(220, 40%, 4%, 0.92) 0%, hsl(220, 40%, 4%, 0.78) 35%, hsl(220, 40%, 4%, 0.4) 65%, transparent 85%)',
          }}
        />
        <div className="relative">
          <h1 className="title-drop-1 font-deco title-deco text-5xl md:text-7xl lg:text-8xl tracking-[0.18em] leading-none">
            HOLLYWOOD
          </h1>

          <div className="title-drop-2 flex items-center justify-center gap-3 my-3 md:my-4">
            <div className="title-rule flex-1 max-w-[25%]" />
            <div className="title-rule flex-1 max-w-[25%]" />
          </div>

          <h2 className="title-drop-3 font-cinzel title-deco text-3xl md:text-5xl lg:text-6xl font-black tracking-[0.32em] leading-none">
            MURDER MYSTERY
          </h2>
        </div>
      </div>

      {/* Press Start Button */}
      <div className="absolute top-[58%] left-0 right-0 text-center flex flex-col items-center gap-4">
        <button
          onClick={onStart}
          className="font-cinzel md:text-2xl tracking-[0.4em] text-yellow-300 press-start-pulse hover:scale-105 transition-transform cursor-pointer font-bold text-3xl"
        >
          PRESS START
        </button>
        {hasSaveData && onLoadGame && (
          <button
            onClick={onLoadGame}
            className="font-cinzel md:text-sm tracking-[0.4em] text-yellow-300/60 hover:text-yellow-300 hover:scale-105 transition-all cursor-pointer font-semibold text-lg"
          >
            CONTINUE
          </button>
        )}
      </div>

      {/* Fireflies */}
      {[
        { id: "ff-easter", x: 8, y: 62, delay: 0, isEasterEgg: true },
        { id: "ff2", x: 11, y: 58, delay: 1.2, isEasterEgg: false },
        { id: "ff3", x: 14, y: 65, delay: 0.6, isEasterEgg: false },
        { id: "ff4", x: 88, y: 60, delay: 0.3, isEasterEgg: false },
        { id: "ff5", x: 91, y: 64, delay: 1.5, isEasterEgg: false },
        { id: "ff6", x: 85, y: 57, delay: 0.9, isEasterEgg: false },
      ].map((ff) => (
        <div
          key={ff.id}
          className={`absolute w-4 h-4 rounded-full ${ff.isEasterEgg ? "cursor-pointer z-20" : "pointer-events-none"}`}
          style={{
            left: `${ff.x}%`,
            top: `${ff.y}%`,
            background: "radial-gradient(circle, hsl(55, 90%, 75%) 0%, hsl(45, 80%, 50%, 0) 70%)",
            boxShadow: "0 0 6px 3px hsl(50, 90%, 60%, 0.4)",
            animation: `fireflyFloat 3s ease-in-out ${ff.delay}s infinite alternate, fireflyGlow 2s ease-in-out ${ff.delay}s infinite alternate`,
          }}
          onClick={ff.isEasterEgg ? handleFireflyClick : undefined}
        >
          {ff.isEasterEgg && speechBubble && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-black text-[9px] px-2 py-1 rounded-md shadow-lg font-pixel animate-[fade-in_0.2s_ease-out] z-30">
              {speechBubble}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
            </div>
          )}
        </div>
      ))}

      {/* Easter Egg Modal */}
      {easterEggVisible && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setEasterEggVisible(false)}
        >
          <div
            className="max-w-md mx-4 p-6 border-2 border-yellow-400/60 rounded-lg text-center"
            style={{ background: "linear-gradient(135deg, hsl(220, 30%, 12%), hsl(260, 20%, 15%))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-yellow-400 text-xs leading-relaxed font-pixel mb-4">✨ You found a secret! ✨</p>
            <p className="text-yellow-200/90 text-[10px] leading-relaxed font-pixel mb-4">
              This game was crafted by Lucas — a storyteller at heart who believes every mystery deserves to be
              unraveled, every character deserves a voice, and every late night spent writing dialogue is worth it if it
              makes someone smile. From point-and-click adventures to campfire tales, Lucas has always loved weaving
              stories that pull you in and never quite let go. Thanks for playing. 💛
            </p>
            <button
              onClick={() => setEasterEggVisible(false)}
              className="text-yellow-400 text-[10px] font-pixel hover:text-yellow-300 cursor-pointer"
            >
              [ Click to close ]
            </button>
          </div>
        </div>
      )}

      {/* Vignette Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 100px 30px hsl(220, 30%, 5%)",
        }}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
    </div>
  );
}
