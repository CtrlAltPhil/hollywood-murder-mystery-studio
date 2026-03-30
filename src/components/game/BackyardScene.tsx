import { useState, useEffect } from "react";
import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import backyardBackground from "@/assets/backgrounds/backyard.png";
import waterfall1 from "@/assets/props/waterfall1.png";
import waterfall2 from "@/assets/props/waterfall2.png";
import waterfall3 from "@/assets/props/waterfall3.png";
import waterfall4 from "@/assets/props/waterfall4.png";
import electricalBoxKeyImage from "@/assets/Electrical_Box_Key.png";

interface BackyardSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  debugMode?: boolean;
  setFlag: (flag: string, value: boolean) => void;
  onAddToInventory: (item: { id: string; name: string; image: string }) => void;
}

export function BackyardScene({
  gameState,
  onHotspotHover,
  onHotspotClick,
  onChangeRoom,
  onEmptyClick,
  debugMode,
  setFlag,
  onAddToInventory,
}: BackyardSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);
  const fountainOff = gameState.flags.fountainOff === true;
  const fountainKeyTaken = gameState.flags.fountainKeyTaken === true;

  const waterfallFrames = [waterfall1, waterfall2, waterfall3, waterfall4];
  const [waterfallFrame, setWaterfallFrame] = useState(0);

  useEffect(() => {
    if (fountainOff) return;
    const interval = setInterval(() => {
      setWaterfallFrame((prev) => (prev >= waterfallFrames.length - 1 ? 0 : prev + 1));
    }, 12);
    return () => clearInterval(interval);
  }, [waterfallFrames.length, fountainOff]);

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
      interactions:
        fountainOff && !fountainKeyTaken
          ? {
              look: "With the fountain off, the water is still. I can see something shiny glinting at the bottom of the pond!",
              pickup: "__PICKUP_FOUNTAIN_KEY__",
              use: "I should try to grab that shiny thing in the water.",
            }
          : {
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
        look: () => {
          return fountainOff
            ? "The stone column. I can see the hidden switch I found earlier. The fountain is currently off."
            : "Wait... there's a small hidden switch behind this column! Someone went through a lot of trouble to conceal it. Want to flip it?";
        },
        push: "__TOGGLE_FOUNTAIN__",
        pull: "__TOGGLE_FOUNTAIN__",
        use: "__TOGGLE_FOUNTAIN__",
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
      id: "garden-path",
      name: "Garden Path",
      position: { x: 3, y: 50 },
      width: 6,
      height: 80,
      interactions: {
        look: "__NAVIGATE__garden-path",
        open: "__NAVIGATE__garden-path",
        use: "__NAVIGATE__garden-path",
      },
    },
    {
      id: "back-inside",
      name: "French Doors (Inside)",
      position: { x: 50, y: 95 },
      width: 30,
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

    // Toggle fountain switch
    if (hotspot.id === "right-column" && verb) {
      const interaction = hotspot.interactions[verb];
      if (interaction === "__TOGGLE_FOUNTAIN__") {
        if (fountainOff) {
          setFlag("fountainOff", false);
          onHotspotClick({
            ...hotspot,
            interactions: {
              [verb]: "I flip the switch. The fountain hums back to life and water starts flowing again.",
            },
          });
        } else {
          setFlag("fountainOff", true);
          onHotspotClick({
            ...hotspot,
            interactions: {
              [verb]:
                "I flip the hidden switch. The fountain sputters and goes quiet. The water in the pond becomes still...",
            },
          });
        }
        return;
      }
    }

    // Pickup fountain key
    if (hotspot.id === "pond" && verb === "pickup") {
      const interaction = hotspot.interactions[verb];
      if (interaction === "__PICKUP_FOUNTAIN_KEY__") {
        setFlag("fountainKeyTaken", true);
        onAddToInventory({ id: "fountain_key", name: "Electrical Box Key", image: electricalBoxKeyImage });
        onHotspotClick({
          ...hotspot,
          interactions: {
            pickup:
              "I reach into the still water and pull out a small key. It was hidden under the fountain's flow this whole time! It looks like it could fit an electrical panel or utility box.",
          },
        });
        return;
      }
    }

    handleSceneHotspotClick(hotspot, verb, onChangeRoom, onHotspotClick);
  };

  return (
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backyardBackground})` }} />

      {/* Waterfall animation - only show when fountain is on */}
      {!fountainOff && (
        <img
          src={waterfallFrames[waterfallFrame]}
          alt=""
          className="absolute pointer-events-none z-10"
          style={{ left: "21%", top: "18%", width: "45%", height: "75%", objectFit: "fill" }}
        />
      )}

      {/* Shiny item in the pond when fountain is off and key not taken */}
      {fountainOff && !fountainKeyTaken && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{ left: "42%", top: "76%", width: "8%", height: "8%" }}
        >
          {/* Sparkle effect - multiple small stars */}
          <div className="relative w-full h-full">
            <div
              className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full animate-ping"
              style={{ left: "50%", top: "40%", animationDuration: "1.2s", animationDelay: "0s" }}
            />
            <div
              className="absolute w-1 h-1 bg-white rounded-full animate-ping"
              style={{ left: "30%", top: "60%", animationDuration: "1.5s", animationDelay: "0.3s" }}
            />
            <div
              className="absolute w-1.5 h-1.5 bg-yellow-100 rounded-full animate-ping"
              style={{ left: "70%", top: "50%", animationDuration: "1s", animationDelay: "0.6s" }}
            />
            <div
              className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-ping"
              style={{ left: "55%", top: "70%", animationDuration: "1.8s", animationDelay: "0.9s" }}
            />
            <div
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-ping"
              style={{ left: "40%", top: "30%", animationDuration: "1.3s", animationDelay: "0.4s" }}
            />
            {/* Central star shape */}
            <div className="absolute" style={{ left: "45%", top: "45%", width: "10%", height: "10%" }}>
              <div
                className="w-2 h-0.5 bg-yellow-200/90 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
                style={{ animationDuration: "0.8s" }}
              />
              <div
                className="w-0.5 h-2 bg-yellow-200/90 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
                style={{ animationDuration: "0.8s" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▼ Back Inside ▼
      </div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ◄ Garden Path
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
