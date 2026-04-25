import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import hallwayBackground from "@/assets/backgrounds/hallway.png";
import mrCowardlyImg from "@/assets/characters/mr-cowardly.png";
import mrCowardlyScaredImg from "@/assets/characters/mr-cowardly-scared.png";

interface HallwaySceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  debugMode?: boolean;
}

export function HallwayScene({
  gameState,
  onHotspotHover,
  onHotspotClick,
  onChangeRoom,
  onEmptyClick,
  debugMode,
}: HallwaySceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);

  // Mr. Cowardly state:
  //  - Starts mid-hallway, looking suspicious.
  //  - First contact (clicking him OR trying the french doors) → he flees out
  //    through the back garden door, locking it behind him. He'll then be
  //    waiting in the backyard, just left of the koi pond.
  const cowardlyFled = gameState.flags.cowardlyFled === true;

  // Sprite anchor (% of scene). Bottom-aligned via translate.
  const cowardlyAnchor = { x: 50, y: 78 };

  const hotspots: SimpleHotspot[] = [
    {
      id: "party-room-door",
      name: "Party Room Door",
      position: { x: 85, y: 55 },
      width: 12,
      height: 50,
      interactions: {
        look: "The door to the party room. This is where it all happened.",
        open: "__NAVIGATE__breakroom",
        use: "__NAVIGATE__breakroom",
      },
    },
    {
      id: "production-room-door",
      name: "Production Room Door",
      position: { x: 12, y: 55 },
      width: 10,
      height: 50,
      interactions: {
        look: "The door to the production room.",
        open: "__NAVIGATE__production-room",
        use: "__NAVIGATE__production-room",
      },
    },
    {
      id: "lady-fantastique-room-door",
      name: "Lady Fantastica's Room",
      position: { x: 30, y: 55 },
      width: 10,
      height: 50,
      interactions: {
        look: "The door to Lady Fantastica's private room.",
        open: "__NAVIGATE__lady-fantastique-room",
        use: "__NAVIGATE__lady-fantastique-room",
      },
    },
    {
      id: "los-cabos-room-door",
      name: "Los Cabos' Room",
      position: { x: 40, y: 50 },
      width: 5,
      height: 20,
      interactions: {
        look: "The door to Los Cabos' room. Poor guy...",
        open: "__NAVIGATE__los-cabos-room",
        use: "__NAVIGATE__los-cabos-room",
      },
    },
    {
      id: "duke-extreme-room-door",
      name: "Duke Extreme's Door",
      position: { x: 68, y: 55 },
      width: 10,
      height: 30,
      interactions: {
        look: "The door to Duke Extreme's Room. It's probably pretty extreme in there..",
        open: "__NAVIGATE__duke-extreme-room",
        use: "__NAVIGATE__duke-extreme-room",
      },
    },
    {
      id: "study-door",
      name: "Study",
      position: { x: 60, y: 50 },
      width: 5,
      height: 20,
      interactions: {
        look: 'A door marked "Study Room."',
        open: "__NAVIGATE__study",
        use: "__NAVIGATE__study",
      },
    },
    {
      id: "french-doors",
      name: "French Doors (Backyard)",
      position: { x: 50, y: 50 },
      width: 12,
      height: 30,
      interactions: gameState.flags.backyardUnlocked
        ? {
            look: "The french doors are unlocked now. They lead to the backyard garden.",
            open: "__NAVIGATE__backyard",
            use: "__NAVIGATE__backyard",
          }
        : cowardlyFled
        ? {
            // Cowardly slammed and locked them on his way out
            look: "The french doors. That jittery little man slammed them shut behind him — they're locked tight now.",
            open: "Locked. He must have jammed them from the other side. I need to find another way out — or a key.",
            use: "Won't budge. He locked them on his way out.",
            pull: "Locked.",
            push: "Locked.",
            use_with_backyard_key: "__UNLOCK_BACKYARD__",
          }
        : {
            // Pristine first state — but trying to go outside spooks Mr. Cowardly
            look: "Elegant french doors leading to the backyard garden. They appear to be locked.",
            open: "__FLEE_COWARDLY__",
            use: "__FLEE_COWARDLY__",
            pull: "__FLEE_COWARDLY__",
            push: "__FLEE_COWARDLY__",
            use_with_backyard_key: "__UNLOCK_BACKYARD__",
          },
    },
    {
      id: "kitchen-direction",
      name: "Kitchen Hallway",
      position: { x: 50, y: 95 },
      width: 30,
      height: 10,
      interactions: {
        look: "__NAVIGATE__hallway-kitchen",
        open: "__NAVIGATE__hallway-kitchen",
        use: "__NAVIGATE__hallway-kitchen",
      },
    },
  ];

  // Mr. Cowardly hotspot — only present in the hallway before he flees.
  const cowardlyHotspot: SimpleHotspot | null = cowardlyFled
    ? null
    : {
        id: "mr-cowardly",
        name: "Mr. Cowardly",
        position: { x: cowardlyAnchor.x, y: cowardlyAnchor.y - 10 },
        width: 8,
        height: 22,
        interactions: {
          look: "A jittery little man lurking in the hallway. He looks ready to bolt.",
          talk: "__FLEE_COWARDLY__",
        },
      };

  const allHotspots = cowardlyHotspot ? [...hotspots, cowardlyHotspot] : hotspots;

  const handleHotspotClick = (hotspot: SimpleHotspot) => {
    const verb = gameState.selectedVerb;

    // First contact with Mr. Cowardly (no verb or talk) → he flees out the back.
    if (hotspot.id === "mr-cowardly" && !cowardlyFled && (!verb || verb === "talk")) {
      onHotspotClick({
        ...hotspot,
        interactions: { talk: "__FLEE_COWARDLY__" },
        __defaultVerb: "talk",
      } as SimpleHotspot);
      return;
    }

    // First time approaching the french doors (still locked, Cowardly still here)
    // also spooks him into fleeing through them.
    if (
      hotspot.id === "french-doors" &&
      !cowardlyFled &&
      !gameState.flags.backyardUnlocked &&
      (!verb || verb === "open" || verb === "use" || verb === "pull" || verb === "push")
    ) {
      onHotspotClick({
        ...hotspot,
        interactions: { open: "__FLEE_COWARDLY__" },
        __defaultVerb: "open",
      } as SimpleHotspot);
      return;
    }

    // Locked french doors (post-flee or still locked) with no verb → hint
    if (!verb && hotspot.id === "french-doors" && !gameState.flags.backyardUnlocked) {
      onHotspotHover("The doors are locked.");
      return;
    }

    // Special: kitchen direction with no verb
    if (hotspot.id === "kitchen-direction" && !verb) {
      onChangeRoom("hallway-kitchen");
      return;
    }

    handleSceneHotspotClick(hotspot, verb, onChangeRoom, onHotspotClick);
  };

  return (
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hallwayBackground})` }} />

      {/* Navigation arrow indicator at bottom */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▼ Kitchen ▼
      </div>

      {/* Mr. Cowardly sprite — only present until he flees out the back */}
      {!cowardlyFled && (
        <img
          src={mrCowardlyImg}
          alt="Mr. Cowardly"
          className="absolute pointer-events-none z-10 transition-all duration-700 ease-out"
          style={{
            left: `${cowardlyAnchor.x}%`,
            top: `${cowardlyAnchor.y}%`,
            height: "26%",
            transform: "translate(-50%, -100%)",
            imageRendering: "pixelated",
            animation: "cowardly-fidget 3s ease-in-out infinite",
          }}
        />
      )}
      {allHotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          className={`absolute cursor-inherit transition-colors rounded ${debugMode ? "border-2 border-green-400/70 bg-green-400/15" : "hover:bg-white/10"}`}
          style={{
            left: `${hotspot.position.x - hotspot.width / 2}%`,
            top: `${hotspot.position.y - hotspot.height / 2}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
            zIndex: hotspot.id === "mr-cowardly" ? 20 : undefined,
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
