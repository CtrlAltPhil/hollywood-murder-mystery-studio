import { useState } from "react";
import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import gardenPathBackground from "@/assets/backgrounds/garden-path.png";

interface GardenPathSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  debugMode?: boolean;
  setFlag: (flag: string, value: boolean) => void;
  onAddToInventory: (item: { id: string; name: string; image: string }) => void;
}

export function GardenPathScene({
  gameState,
  onHotspotHover,
  onHotspotClick,
  onChangeRoom,
  onEmptyClick,
  debugMode,
  setFlag,
}: GardenPathSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);
  const shedUnlocked = gameState.flags.shedUnlocked === true;

  const [showLockWidget, setShowLockWidget] = useState(false);
  const [comboDigits, setComboDigits] = useState([0, 0, 0]);
  const [shakeCombo, setShakeCombo] = useState(false);
  const [showUnlockFlash, setShowUnlockFlash] = useState(false);

  const cycleDigit = (index: number, direction: 1 | -1) => {
    setComboDigits((prev) => {
      const next = [...prev];
      next[index] = (next[index] + direction + 10) % 10;
      return next;
    });
  };

  const tryUnlock = () => {
    if (comboDigits[0] === 7 && comboDigits[1] === 5 && comboDigits[2] === 4) {
      setShowUnlockFlash(true);
      setFlag("shedUnlocked", true);
      setTimeout(() => {
        setShowUnlockFlash(false);
        setShowLockWidget(false);
      }, 600);
    } else {
      setShakeCombo(true);
      onHotspotClick({
        id: "combo-lock",
        name: "Combination Lock",
        position: { x: 78, y: 60 },
        width: 10,
        height: 10,
        interactions: { use: "The lock doesn't budge. Wrong combination." },
      });
      setTimeout(() => setShakeCombo(false), 500);
    }
  };

  const hotspots: SimpleHotspot[] = [
    {
      id: "shed-door",
      name: shedUnlocked ? "Shed (Open)" : "Shed",
      position: { x: 78, y: 60 },
      width: 14,
      height: 45,
      interactions: shedUnlocked
        ? {
            look: "The shed door hangs open. I should take a look inside.",
            open: "__NAVIGATE__shed-interior",
            use: "__NAVIGATE__shed-interior",
          }
        : {
            look: "A sturdy wooden shed with a heavy combination lock on the door. Three digits... I wonder what the code could be.",
            open: "__SHOW_LOCK__",
            use: "__SHOW_LOCK__",
            push: "The door won't budge. That lock is solid.",
            pull: "It's locked tight.",
            pickup: "I can't pick up a whole shed.",
          },
    },
    {
      id: "garden-bench",
      name: "Garden Bench",
      position: { x: 15, y: 93 },
      width: 16,
      height: 18,
      interactions: {
        look: "An old wooden bench, weathered from years in the garden. Someone carved initials into the armrest — 'L.C. + D.E.' How interesting...",
        use: "Now's not the time to sit around.",
        push: "It's too heavy to move.",
      },
    },
    {
      id: "stone-lantern",
      name: "Stone Lantern",
      position: { x: 87, y: 90 },
      width: 10,
      height: 20,
      interactions: {
        look: "An old stone garden lantern. The glass is cracked but the candle inside still flickers faintly.",
        use: "The light is barely enough to see by, but it's something.",
        pickup: "It's cemented to the ground.",
      },
    },
    {
      id: "hedges",
      name: "Hedges",
      position: { x: 15, y: 15 },
      width: 20,
      height: 25,
      interactions: {
        look: "Overgrown hedges line the path. They haven't been trimmed in a while. The estate's gardener has been slacking.",
        push: "The branches are too thick and thorny.",
        use: "I'd need something to cut through these.",
      },
    },
    {
      id: "gravel-path",
      name: "Path to Mansion",
      position: { x: 40, y: 15 },
      width: 20,
      height: 15,
      interactions: {
        look: "The gravel path winds back toward the mansion. I can see its silhouette against the night sky.",
      },
    },
    {
      id: "back-to-backyard",
      name: "Backyard",
      position: { x: 97, y: 50 },
      width: 8,
      height: 80,
      interactions: {
        look: "__NAVIGATE__backyard",
        open: "__NAVIGATE__backyard",
        use: "__NAVIGATE__backyard",
      },
    },
  ];

  const handleHotspotClick = (hotspot: SimpleHotspot) => {
    const verb = gameState.selectedVerb;

    // Shed lock trigger
    if (hotspot.id === "shed-door" && !shedUnlocked) {
      const interaction = verb ? hotspot.interactions[verb] : undefined;
      if (interaction === "__SHOW_LOCK__" || !verb) {
        setShowLockWidget(true);
        return;
      }
    }

    // Shed enter when unlocked (no verb click)
    if (hotspot.id === "shed-door" && shedUnlocked && !verb) {
      onChangeRoom("shed-interior");
      return;
    }

    handleSceneHotspotClick(hotspot, verb, onChangeRoom, onHotspotClick);
  };

  return (
    <div
      className={`relative w-full h-full ${cursorClass}`}
      onClick={() => {
        setShowLockWidget(false);
        onEmptyClick?.();
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${gardenPathBackground})` }}
      />

      {/* Navigation indicators */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        Backyard ►
      </div>

      {/* Compact padlock widget near the shed door */}
      {showLockWidget && !shedUnlocked && (
        <div className="absolute z-40" style={{ left: "70%", top: "50%" }} onClick={(e) => e.stopPropagation()}>
          <div
            className={`flex flex-col items-center gap-1.5 bg-zinc-800/95 border border-amber-700/80 rounded-md p-3 shadow-xl backdrop-blur-sm ${shakeCombo ? "animate-shake" : ""}`}
            style={{ minWidth: "120px" }}
          >
            <div className="text-amber-400/80 font-pixel text-[8px] tracking-wider">🔒 LOCKED</div>
            <div className="flex gap-2">
              {comboDigits.map((digit, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <button
                    className="text-amber-300/70 hover:text-amber-100 text-[10px] font-bold px-1 bg-zinc-700/60 rounded hover:bg-zinc-600 transition-colors"
                    onClick={() => cycleDigit(i, 1)}
                  >
                    ▲
                  </button>
                  <div className="w-7 h-8 bg-zinc-900 border border-amber-600/70 rounded flex items-center justify-center text-amber-200 font-pixel text-sm">
                    {digit}
                  </div>
                  <button
                    className="text-amber-300/70 hover:text-amber-100 text-[10px] font-bold px-1 bg-zinc-700/60 rounded hover:bg-zinc-600 transition-colors"
                    onClick={() => cycleDigit(i, -1)}
                  >
                    ▼
                  </button>
                </div>
              ))}
            </div>
            <button
              className="px-4 py-1 bg-amber-700/80 hover:bg-amber-600 text-white font-pixel text-[8px] rounded transition-colors"
              onClick={tryUnlock}
            >
              TRY
            </button>
          </div>
        </div>
      )}

      {/* Unlock flash */}
      {showUnlockFlash && <div className="absolute inset-0 bg-amber-200/20 z-50 pointer-events-none animate-pulse" />}

      {hotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          className={`absolute cursor-inherit transition-colors rounded ${debugMode ? "border-2 border-green-400/70 bg-green-400/15" : "hover:bg-white/10"}`}
          style={{
            left: `${hotspot.position.x - hotspot.width / 2}%`,
            top: `${hotspot.position.y - hotspot.height / 2}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
          }}
          onMouseEnter={() => onHotspotHover(hotspot.name)}
          onMouseLeave={() => onHotspotHover("")}
          onClick={(e) => {
            e.stopPropagation();
            handleHotspotClick(hotspot);
          }}
        >
          {debugMode && (
            <span className="absolute top-0 left-0 text-[8px] text-green-300 bg-black/70 px-1 rounded-br">
              {hotspot.id}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
