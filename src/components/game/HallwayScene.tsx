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
        : {
            look: "Elegant french doors leading to the backyard garden. They appear to be locked.",
            open: "The doors are locked. I need a key.",
            use: "The doors won't budge. They're locked tight.",
            pull: "Locked. I need to find a key somewhere.",
            push: "Locked. I need to find a key somewhere.",
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

  // Mr. Cowardly hotspot — appears over his current sprite position.
  const cowardlyHotspot: SimpleHotspot = {
    id: "mr-cowardly",
    name: "Mr. Cowardly",
    position: { x: cowardlyAnchor.x, y: cowardlyAnchor.y - 10 },
    width: 8,
    height: 22,
    interactions: cornered
      ? {
          look: "He's pressed against the wall, trembling. He's not going anywhere.",
          talk: "__DIALOG__cowardly",
        }
      : {
          look: "A jittery little man lurking in the hallway. He looks ready to bolt.",
          talk: "__BOLT_COWARDLY__",
        },
  };

  const allHotspots = [...hotspots, cowardlyHotspot];

  const handleHotspotClick = (hotspot: SimpleHotspot) => {
    const verb = gameState.selectedVerb;

    // Special: clicking Mr. Cowardly with no verb (or talk) before he's cornered
    if (hotspot.id === "mr-cowardly" && !cornered && (!verb || verb === "talk")) {
      // First contact: he bolts. Trigger via parent so flag/sound flow stays consistent.
      onHotspotClick({
        ...hotspot,
        interactions: { talk: "__BOLT_COWARDLY__" },
        __defaultVerb: "talk",
      } as SimpleHotspot);
      return;
    }

    // Special: locked french doors show a message instead of navigating
    if (!verb && hotspot.id === "french-doors" && !gameState.flags.backyardUnlocked) {
      onHotspotHover("The doors are locked. I need to find a key.");
      return;
    }

    // Special: kitchen direction with no verb
    if (hotspot.id === "kitchen-direction" && !verb) {
      onChangeRoom("hallway-kitchen");
      return;
    }

    // Cornered Mr. Cowardly with no verb → open dialog
    if (hotspot.id === "mr-cowardly" && cornered && !verb) {
      onHotspotClick({ ...hotspot, __defaultVerb: "talk" } as SimpleHotspot);
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

      {/* Mr. Cowardly sprite */}
      <img
        src={cornered ? mrCowardlyScaredImg : mrCowardlyImg}
        alt="Mr. Cowardly"
        className="absolute pointer-events-none z-10 transition-all duration-700 ease-out"
        style={{
          left: `${cowardlyAnchor.x}%`,
          top: `${cowardlyAnchor.y}%`,
          height: "26%",
          transform: "translate(-50%, -100%)",
          imageRendering: "pixelated",
          animation: cornered ? "cowardly-tremble 0.25s ease-in-out infinite" : "cowardly-fidget 3s ease-in-out infinite",
        }}
      />

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
