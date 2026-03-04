import { useState, useEffect } from "react";
import { GameState, Verb } from "@/types/game";
import backyardBackground from "@/assets/backgrounds/backyard.png";
import waterfall1 from "@/assets/props/waterfall1.png";
import waterfall2 from "@/assets/props/waterfall2.png";
import waterfall3 from "@/assets/props/waterfall3.png";
import waterfall4 from "@/assets/props/waterfall4.png";
import { SimpleHotspot } from "./GameScene";

interface BackyardSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  debugMode?: boolean;
}

function getCursorClass(verb: Verb | null): string {
  if (!verb) return "cursor-default";
  const cursorMap: Record<Verb, string> = {
    look: "cursor-look",
    pickup: "cursor-pickup",
    use: "cursor-use",
    open: "cursor-open",
    close: "cursor-close",
    talk: "cursor-talk",
    push: "cursor-push",
    pull: "cursor-pull",
  };
  return cursorMap[verb] || "cursor-default";
}

export function BackyardScene({
  gameState,
  onHotspotHover,
  onHotspotClick,
  onChangeRoom,
  debugMode,
}: BackyardSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);

  const waterfallFrames = [waterfall1, waterfall2, waterfall3, waterfall4];
  const [waterfallFrame, setWaterfallFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaterfallFrame((prev) => (prev + 1) % 4);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const hotspots: SimpleHotspot[] = [
    {
      id: "cherub-statue",
      name: "Cherub Statue",
      position: { x: 40, y: 25 },
      width: 10,
      height: 15,
      interactions: {
        look: "A stone cherub holding a jug. Water used to pour from it into the pond below. Something is etched on the base...",
        pickup: "It's solid stone. I'm not moving that.",
        push: "The statue wobbles slightly. Something rattles inside the base.",
        pull: "I give it a tug but it barely moves.",
      },
    },
    {
      id: "pond",
      name: "Koi Pond",
      position: { x: 46, y: 80 },
      width: 25,
      height: 18,
      interactions: {
        look: "A small koi pond. The water is dark and murky tonight. I can barely see the bottom.",
        use: "I'm not sticking my hand in there.",
        pickup: "I can't pick up a pond.",
      },
    },
    {
      id: "left-column",
      name: "Stone Column",
      position: { x: 30, y: 50 },
      width: 10,
      height: 65,
      interactions: {
        look: "An ornate stone column. Very theatrical... fits the Hollywood aesthetic.",
        push: "It's firmly cemented in place.",
      },
    },
    {
      id: "right-column",
      name: "Stone Column",
      position: { x: 70, y: 50 },
      width: 10,
      height: 65,
      interactions: {
        look: "Another stone column. There are fresh scratch marks near the base.",
        push: "It won't budge.",
      },
    },
    {
      id: "hedge",
      name: "Overgrown Hedge",
      position: { x: 50, y: 50 },
      width: 25,
      height: 20,
      interactions: {
        look: "A dense, overgrown hedge. Something glints between the thorny branches.",
        push: "I push the branches aside but they spring right back. The thorns sting.",
        use: "I need something to cut through these branches.",
      },
    },
    {
      id: "night-sky",
      name: "Night Sky",
      position: { x: 50, y: 5 },
      width: 80,
      height: 10,
      interactions: {
        look: "A clear Hollywood night. You can almost see the stars past the light pollution.",
      },
    },
    {
      id: "frog",
      name: "Frog",
      position: { x: 63, y: 85 },
      width: 5,
      height: 5,
      interactions: {
        look: "A large frog is enjoying his view by the pond.",
      },
    },
    {
      id: "back-inside",
      name: "French Doors (Inside)",
      position: { x: 50, y: 95 },
      width: 60,
      height: 10,
      interactions: {
        look: "__NAVIGATE__hallway",
        open: "__NAVIGATE__hallway",
        use: "__NAVIGATE__hallway",
      },
    },
  ];

  const handleHotspotClick = (hotspot: SimpleHotspot) => {
    const verb = gameState.selectedVerb;
    if (verb) {
      const interaction = hotspot.interactions[verb];
      if (typeof interaction === "string" && interaction.startsWith("__NAVIGATE__")) {
        onChangeRoom(interaction.replace("__NAVIGATE__", ""));
        return;
      }
    }
    if (
      !verb &&
      hotspot.interactions.open &&
      typeof hotspot.interactions.open === "string" &&
      (hotspot.interactions.open as string).startsWith("__NAVIGATE__")
    ) {
      onChangeRoom((hotspot.interactions.open as string).replace("__NAVIGATE__", ""));
      return;
    }
    onHotspotClick(hotspot);
  };

  return (
    <div className={`relative w-full h-full ${cursorClass}`}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backyardBackground})` }} />

      {/* Waterfall animation */}
      <img
        src={waterfallFrames[waterfallFrame]}
        alt=""
        className="absolute pointer-events-none z-10"
        style={{
          left: "21%",
          top: "18%",
          width: "45%",
          height: "75%",
          objectFit: "fill",
        }}
      />

      {/* Navigation indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▼ Back Inside ▼
      </div>

      {hotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          className={`absolute cursor-pointer transition-colors rounded ${
            debugMode ? "border-2 border-green-400/70 bg-green-400/15" : "hover:bg-white/10"
          }`}
          style={{
            left: `${hotspot.position.x - hotspot.width / 2}%`,
            top: `${hotspot.position.y - hotspot.height / 2}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
          }}
          onMouseEnter={() => onHotspotHover(hotspot.name)}
          onMouseLeave={() => onHotspotHover("")}
          onClick={() => handleHotspotClick(hotspot)}
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
