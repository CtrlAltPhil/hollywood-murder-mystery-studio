import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import shedInteriorBg from "@/assets/backgrounds/shed-interior.png";
import wireCuttersImage from "@/assets/props/wire-cutters.png";

interface ShedInteriorSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  debugMode?: boolean;
  setFlag: (flag: string, value: boolean) => void;
  onAddToInventory: (item: { id: string; name: string; image: string }) => void;
}

export function ShedInteriorScene({
  gameState,
  onHotspotHover,
  onHotspotClick,
  onChangeRoom,
  onEmptyClick,
  debugMode,
  setFlag,
  onAddToInventory,
}: ShedInteriorSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);
  const wireCuttersTaken = gameState.flags.wireCuttersTaken === true;

  const activeHotspots: SimpleHotspot[] = [
    // Wire cutters on workbench
    ...(!wireCuttersTaken
      ? [
          {
            id: "wire-cutters",
            name: "Wire Cutters",
            position: { x: 50, y: 55 },
            width: 10,
            height: 15,
            interactions: {
              look: (() => { setFlag("wireCuttersCopperResidue", true); return "A sturdy pair of wire cutters. These have been used recently... the blades have fresh copper residue on them."; }) as unknown as string,
              pickup: "__PICKUP_WIRE_CUTTERS__",
              use: "__PICKUP_WIRE_CUTTERS__",
            },
          } as SimpleHotspot,
        ]
      : []),
    // Workbench
    {
      id: "workbench",
      name: "Workbench",
      position: { x: 35, y: 65 },
      width: 30,
      height: 20,
      interactions: {
        look: "A dusty workbench covered in old tools and wood shavings. Someone's been working here recently.",
        use: "Nothing here I need to use right now.",
        push: "It's bolted to the wall.",
      },
    },
    // Shelving
    {
      id: "shelving",
      name: "Shelving",
      position: { x: 15, y: 35 },
      width: 20,
      height: 30,
      interactions: {
        look: "Rusty shelves with paint cans and garden chemicals. Nothing useful.",
        pickup: "I don't need any of this.",
        use: "Nothing here that would help the investigation.",
      },
    },
    // Old crate
    {
      id: "old-crate",
      name: "Old Crate",
      position: { x: 55, y: 82 },
      width: 18,
      height: 16,
      interactions: {
        look: (() => { setFlag("propsCrateInspected", true); return "A wooden crate marked 'PROPS - DO NOT REMOVE'. It's empty now. Someone moved the props out of here."; }) as unknown as string,
        open: "It's already open. There's nothing inside.",
        push: "The crate scrapes across the floor but there's nothing underneath.",
        pickup: "It's too bulky to carry around.",
      },
    },
    // Wall tools
    {
      id: "wall-tools",
      name: "Wall Tools",
      position: { x: 70, y: 40 },
      width: 18,
      height: 25,
      interactions: {
        look: "An assortment of rusty garden tools hanging on hooks. Shovels, rakes, pruning shears... all well-used.",
        pickup: "I don't need any of these old garden tools.",
        use: "None of these would help with the investigation.",
      },
    },
    // Exit
    {
      id: "back-to-garden",
      name: "Garden Path",
      position: { x: 50, y: 5 },
      width: 30,
      height: 10,
      interactions: {
        look: "__NAVIGATE__garden-path",
        open: "__NAVIGATE__garden-path",
        use: "__NAVIGATE__garden-path",
      },
    },
  ];

  const handleHotspotClick = (hotspot: SimpleHotspot) => {
    const verb = gameState.selectedVerb;

    // Wire cutters pickup
    if (hotspot.id === "wire-cutters") {
      if (verb === "pickup" || verb === "use" || !verb) {
        setFlag("wireCuttersTaken", true);
        setFlag("wireCuttersCopperResidue", true);
        onAddToInventory({ id: "wire_cutters", name: "Wire Cutters", image: wireCuttersImage });
        onHotspotClick({
          id: "wire-cutters",
          name: "Wire Cutters",
          position: { x: 50, y: 55 },
          width: 10,
          height: 10,
          interactions: { pickup: "I picked up the wire cutters. These blades have fresh copper residue... someone used these to cut wires recently." },
        });
        return;
      }
      if (verb === "look") {
        setFlag("wireCuttersCopperResidue", true);
        onHotspotClick({
          id: "wire-cutters",
          name: "Wire Cutters",
          position: { x: 50, y: 55 },
          width: 10,
          height: 10,
          interactions: { look: "A sturdy pair of wire cutters. These have been used recently... the blades have fresh copper residue on them." },
        });
        return;
      }
    }

    // Old crate inspection
    if (hotspot.id === "old-crate" && verb === "look") {
      setFlag("propsCrateInspected", true);
      onHotspotClick({
        id: "old-crate",
        name: "Old Crate",
        position: { x: 55, y: 82 },
        width: 18,
        height: 16,
        interactions: { look: "A wooden crate marked 'PROPS - DO NOT REMOVE'. It's empty now. Someone moved the props out of here." },
      });
      return;
    }

    handleSceneHotspotClick(hotspot, verb, onChangeRoom, onHotspotClick);
  };

  return (
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${shedInteriorBg})` }} />

      {/* Navigation indicator */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▲ Garden Path ▲
      </div>

      {/* Wire cutters sprite on workbench */}
      {!wireCuttersTaken && (
        <img
          src={wireCuttersImage}
          alt="Wire Cutters"
          className="absolute pointer-events-none drop-shadow-lg z-10"
          style={{ left: "46%", top: "47%", width: "8%", height: "auto" }}
        />
      )}

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
