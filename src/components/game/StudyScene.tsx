import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import studyBackground from "@/assets/backgrounds/study.png";
import backyardKeySprite from "@/assets/props/backyard-key.png";
import backyardKeyInventory from "@/assets/props/backyard-key-inventory.png";

interface StudySceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onAddToInventory: (item: { id: string; name: string; image: string }) => void;
  setFlag: (key: string, value: boolean) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  debugMode?: boolean;
}

export function StudyScene({
  gameState,
  onHotspotHover,
  onHotspotClick,
  onAddToInventory,
  setFlag,
  onChangeRoom,
  onEmptyClick,
  debugMode,
}: StudySceneProps) {
  const keyTaken = gameState.flags.backyardKeyTaken;
  const cursorClass = getCursorClass(gameState.selectedVerb);

  const hotspots: SimpleHotspot[] = [
    {
      id: "creep-poster",
      name: '"The Creep" Poster',
      position: { x: 18, y: 38 },
      width: 16,
      height: 35,
      interactions: {
        look: '"The Creep — A Creepy Horror Film." One of GB Studios\' biggest hits. The tagline reads: "You can\'t escape what\'s already inside."',
        use: "It's just a movie poster.",
      },
    },
    {
      id: "gb-studios-sign",
      name: "GB Studios Sign",
      position: { x: 80, y: 35 },
      width: 16,
      height: 28,
      interactions: {
        look: '"GB Studios — Movie Production Study Room." This must be where the creative team plans their projects.',
        use: "It's bolted to the wall.",
      },
    },
    {
      id: "desk",
      name: "Study Desk",
      position: { x: 50, y: 65 },
      width: 30,
      height: 25,
      interactions: {
        look: "A cluttered desk covered in scripts, notes, and a desk lamp. Someone was working late.",
        open: "I shuffle through the papers. There's a production schedule with tonight's party circled — and a note: \"It ends tonight.\"",
        use: 'I flip through the scripts. One has "FINAL DRAFT" stamped on it with Los Cabos\' name crossed out.',
        pickup: "I can't carry the whole desk.",
      },
    },
    {
      id: "window",
      name: "Window",
      position: { x: 48, y: 30 },
      width: 20,
      height: 28,
      interactions: {
        look: "A large window overlooking the studio backlot. The moon is out. I can see the other buildings from here.",
        open: "The window slides open. Cool night air rushes in. I can see the parking lot — one car has its trunk open.",
        close: "I slide it shut.",
      },
    },
    {
      id: "office-chair",
      name: "Office Chair",
      position: { x: 78, y: 70 },
      width: 16,
      height: 25,
      interactions: {
        look: "A worn leather office chair. It's still warm — someone was sitting here recently.",
        use: "I sit down and spin. Not helpful, but briefly fun.",
        push: 'I push the chair aside. There\'s a pen on the floor with the initials "D.E." engraved on it.',
      },
    },
    {
      id: "waste-bin",
      name: "Waste Bin",
      position: { x: 25, y: 85 },
      width: 10,
      height: 14,
      interactions: {
        look: "A metal waste bin. There's crumpled paper inside.",
        open: 'I dig through the trash. A torn note reads: "...can\'t let him leave. The studio depends on—" The rest is missing.',
        pickup: "I don't want to carry a trash can.",
        use: "I fish out the note. Could be important.",
      },
    },
    {
      id: "door-exit",
      name: "Door to Hallway",
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

  // Add key hotspot if not yet taken — uses standard pickup pattern
  const activeHotspots = keyTaken
    ? hotspots
    : [
        ...hotspots,
        {
          id: "backyard-key",
          name: "Old Key",
          position: { x: 16, y: 94 },
          width: 8,
          height: 10,
          interactions: {
            look: "An old brass key lying on the floor. I wonder what it opens...",
            pickup: () => {
              if (!gameState.flags.backyardKeyTaken) {
                onAddToInventory({ id: "backyard_key", name: "Backyard Key", image: backyardKeyInventory });
                setFlag("backyardKeyTaken", true);
                return "I picked up an old key. I wonder what it opens...";
              }
              return "I already have the key.";
            },
            use: "I should pick it up first.",
          },
        },
      ];

  return (
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${studyBackground})` }} />

      {/* Backyard key on the floor */}
      {!keyTaken && (
        <img
          src={backyardKeySprite}
          alt="Old Key"
          className="absolute pointer-events-none z-10"
          style={{ left: "14%", top: "90%", width: "auto", height: "10%" }}
        />
      )}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▼ Back to Hallway ▼
      </div>

      {activeHotspots.map((hotspot) => (
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
            handleSceneHotspotClick(hotspot, gameState.selectedVerb, onChangeRoom, onHotspotClick);
          }}
        />
      ))}
    </div>
  );
}
