import { useState } from "react";
import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import gardenPathBackground from "@/assets/backgrounds/garden-path.png";
import shedCloseupBackground from "@/assets/backgrounds/shed-closeup.png";
import wireCuttersImage from "@/assets/props/wire-cutters.png";

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
  onAddToInventory,
}: GardenPathSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);
  const shedUnlocked = gameState.flags.shedUnlocked === true;
  const wireCuttersTaken = gameState.flags.wireCuttersTaken === true;

  const [showShedCloseup, setShowShedCloseup] = useState(false);
  const [comboDigits, setComboDigits] = useState([0, 0, 0]);
  const [shakeCombo, setShakeCombo] = useState(false);
  const [showUnlockFlash, setShowUnlockFlash] = useState(false);

  const cycleDigit = (index: number, direction: 1 | -1) => {
    setComboDigits(prev => {
      const next = [...prev];
      next[index] = (next[index] + direction + 10) % 10;
      return next;
    });
  };

  const tryUnlock = () => {
    if (comboDigits[0] === 7 && comboDigits[1] === 5 && comboDigits[2] === 4) {
      setShowUnlockFlash(true);
      setFlag("shedUnlocked", true);
      setTimeout(() => setShowUnlockFlash(false), 600);
    } else {
      setShakeCombo(true);
      onHotspotClick({
        id: "combo-lock",
        name: "Combination Lock",
        position: { x: 50, y: 50 },
        width: 10,
        height: 10,
        interactions: { use: "The lock doesn't budge. Wrong combination." },
      });
      setTimeout(() => setShakeCombo(false), 500);
    }
  };

  // Shed close-up view with combination lock
  if (showShedCloseup && !shedUnlocked) {
    return (
      <div className="relative w-full h-full cursor-default" onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${shedCloseupBackground})` }} />

        {/* Combination lock overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div
            className={`flex flex-col items-center gap-3 bg-zinc-800/90 border-2 border-amber-700 rounded-lg p-6 shadow-2xl ${shakeCombo ? "animate-shake" : ""}`}
            style={{ minWidth: "200px" }}
          >
            <div className="text-amber-400 font-pixel text-xs mb-2">COMBINATION LOCK</div>
            <div className="flex gap-4">
              {comboDigits.map((digit, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <button
                    className="text-amber-300 hover:text-amber-100 text-lg font-bold px-2 py-0.5 bg-zinc-700 rounded hover:bg-zinc-600 transition-colors"
                    onClick={() => cycleDigit(i, 1)}
                  >
                    ▲
                  </button>
                  <div className="w-10 h-12 bg-zinc-900 border-2 border-amber-600 rounded flex items-center justify-center text-amber-200 font-pixel text-xl">
                    {digit}
                  </div>
                  <button
                    className="text-amber-300 hover:text-amber-100 text-lg font-bold px-2 py-0.5 bg-zinc-700 rounded hover:bg-zinc-600 transition-colors"
                    onClick={() => cycleDigit(i, -1)}
                  >
                    ▼
                  </button>
                </div>
              ))}
            </div>
            <button
              className="mt-2 px-6 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-pixel text-xs rounded transition-colors"
              onClick={tryUnlock}
            >
              TRY CODE
            </button>
            <button
              className="mt-1 text-zinc-400 hover:text-zinc-200 font-pixel text-[10px] transition-colors"
              onClick={() => setShowShedCloseup(false)}
            >
              ▼ STEP BACK ▼
            </button>
          </div>
        </div>

        {/* Unlock flash */}
        {showUnlockFlash && (
          <div className="absolute inset-0 bg-amber-200/30 z-30 pointer-events-none animate-pulse" />
        )}
      </div>
    );
  }

  // Shed close-up view when unlocked (show wire cutters)
  if (showShedCloseup && shedUnlocked) {
    return (
      <div className="relative w-full h-full cursor-default" onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${shedCloseupBackground})` }} />
        
        {/* Open shed overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute z-20 text-amber-400 font-pixel text-xs top-4 left-1/2 -translate-x-1/2">
          The shed is open
        </div>

        {/* Wire cutters inside shed */}
        {!wireCuttersTaken && (
          <div
            className="absolute z-20 cursor-inherit hover:bg-white/20 transition-colors rounded"
            style={{ left: "38%", top: "35%", width: "24%", height: "30%" }}
            onMouseEnter={() => onHotspotHover("Wire Cutters")}
            onMouseLeave={() => onHotspotHover("")}
            onClick={() => {
              const verb = gameState.selectedVerb;
              if (verb === "pickup" || verb === "use" || !verb) {
                setFlag("wireCuttersTaken", true);
                onAddToInventory({ id: "wire_cutters", name: "Wire Cutters", image: wireCuttersImage });
                onHotspotClick({
                  id: "wire-cutters",
                  name: "Wire Cutters",
                  position: { x: 50, y: 50 },
                  width: 10,
                  height: 10,
                  interactions: { pickup: "A sturdy pair of wire cutters. These could cut through just about anything." },
                });
              } else if (verb === "look") {
                onHotspotClick({
                  id: "wire-cutters",
                  name: "Wire Cutters",
                  position: { x: 50, y: 50 },
                  width: 10,
                  height: 10,
                  interactions: { look: "A pair of heavy-duty wire cutters, hanging on a hook inside the shed." },
                });
              }
            }}
          >
            <img
              src={wireCuttersImage}
              alt="Wire Cutters"
              className="w-full h-full object-contain pointer-events-none drop-shadow-lg"
            />
          </div>
        )}

        <button
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-zinc-400 hover:text-zinc-200 font-pixel text-[10px] transition-colors"
          onClick={() => setShowShedCloseup(false)}
        >
          ▼ STEP BACK ▼
        </button>
      </div>
    );
  }

  // Main garden path scene
  const hotspots: SimpleHotspot[] = [
    {
      id: "shed-door",
      name: shedUnlocked ? "Shed (Open)" : "Shed",
      position: { x: 68, y: 50 },
      width: 18,
      height: 45,
      interactions: shedUnlocked
        ? {
            look: "The shed door hangs open. I can see some tools inside.",
            open: "__SHED_CLOSEUP__",
            use: "__SHED_CLOSEUP__",
          }
        : {
            look: "A sturdy wooden shed with a heavy combination lock on the door. Three digits... I wonder what the code could be.",
            open: "__SHED_CLOSEUP__",
            use: "__SHED_CLOSEUP__",
            push: "The door won't budge. That lock is solid.",
            pull: "It's locked tight.",
            pickup: "I can't pick up a whole shed.",
          },
    },
    {
      id: "garden-bench",
      name: "Garden Bench",
      position: { x: 15, y: 72 },
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
      position: { x: 82, y: 75 },
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
      position: { x: 40, y: 35 },
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
      position: { x: 95, y: 50 },
      width: 10,
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

    // Shed closeup trigger
    if (hotspot.id === "shed-door" && verb) {
      const interaction = hotspot.interactions[verb];
      if (interaction === "__SHED_CLOSEUP__") {
        setShowShedCloseup(true);
        return;
      }
    }

    // Default no-verb click on shed opens closeup
    if (hotspot.id === "shed-door" && !verb) {
      setShowShedCloseup(true);
      return;
    }

    handleSceneHotspotClick(hotspot, verb, onChangeRoom, onHotspotClick);
  };

  return (
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${gardenPathBackground})` }} />

      {/* Navigation indicators */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        Backyard ►
      </div>

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
