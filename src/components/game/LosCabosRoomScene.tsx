import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import losCabosRoomBackground from "@/assets/backgrounds/los-cabos-room.png";

interface LosCabosRoomSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  onAddToInventory: (item: { id: string; name: string; image: string }) => void;
  setFlag: (flag: string, value: boolean) => void;
  debugMode?: boolean;
}

export function LosCabosRoomScene({ gameState, onHotspotHover, onHotspotClick, onChangeRoom, onEmptyClick, onAddToInventory, setFlag, debugMode }: LosCabosRoomSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);
  const hasFountainKey = gameState.inventory.some(i => i.id === "fountain_key");
  const drawerOpened = gameState.flags?.drawerOpened;

  const hotspots: SimpleHotspot[] = [
    {
      id: "desk",
      name: "Writing Desk",
      position: { x: 25, y: 48 },
      width: 22,
      height: 22,
      interactions: {
        look: 'Los Cabos\' desk. A sealed envelope sits on top, addressed to "My Dearest." The ink is still fresh.',
        use: "The desk lamp is on. He was working here not long ago.",
        pickup: "Way too heavy.",
      },
    },
    {
      id: "desk-drawer",
      name: drawerOpened ? "Open Drawer" : "Desk Drawer",
      position: { x: 22, y: 68 },
      width: 14,
      height: 10,
      interactions: {
        look: drawerOpened
          ? 'The drawer is open. Inside there\'s a crumpled note with shaky handwriting. It reads: "Decline the offer or else." Someone was threatening Los Cabos... but who? And what offer?'
          : "One of the front drawers on the desk. It has a small keyhole — it's locked.",
        open: drawerOpened
          ? 'The drawer is already open. A crumpled note sits inside. It reads: "Decline the offer or else." The handwriting is rushed and unsteady.'
          : hasFountainKey
            ? "__UNLOCK_DRAWER__"
            : "It's locked. I need some kind of small key to open it.",
        use: hasFountainKey && !drawerOpened
          ? "__UNLOCK_DRAWER__"
          : drawerOpened
            ? 'The drawer is already open. A crumpled note sits inside. It reads: "Decline the offer or else."'
            : "It's locked tight. There's a small keyhole.",
        pickup: "I can't pick up a drawer.",
      },
    },
    {
      id: "trophies",
      name: "Awards & Trophies",
      position: { x: 65, y: 55 },
      width: 16,
      height: 20,
      interactions: {
        look: 'A collection of awards and trophies. "Best Actor," "Lifetime Achievement"... Los Cabos was at the top of his game.',
        pickup: "These belong to the deceased. I shouldn't take them.",
        use: "They're just trophies. Nothing hidden behind them.",
      },
    },
    {
      id: "bunk-bed",
      name: "Bunk Bed",
      position: { x: 80, y: 40 },
      width: 20,
      height: 45,
      interactions: {
        look: "A sturdy wooden bunk bed. The top bunk is neatly made, but the bottom one has crumpled sheets — someone was sleeping here recently.",
        open: "I check under the mattress. There's a crumpled photo of Los Cabos and Lady Fantastique together, torn in half.",
        use: "No time for sleep.",
        push: "I push the bed. Something clinks underneath — a small key falls out.",
      },
    },
    {
      id: "ladder",
      name: "Ladder",
      position: { x: 70, y: 50 },
      width: 8,
      height: 30,
      interactions: {
        look: "A wooden ladder leading to the top bunk.",
        use: "I climb up. The top bunk has a clear view of the door — and a small notebook tucked under the pillow.",
        pickup: "It's attached to the bed frame.",
      },
    },
    {
      id: "suitcases",
      name: "Suitcases",
      position: { x: 55, y: 82 },
      width: 14,
      height: 14,
      interactions: {
        look: "Packed suitcases. Was Los Cabos planning to leave? These are ready to go.",
        open: "I open one. Clothes, a passport, and a one-way ticket to Buenos Aires. He was planning to disappear.",
        pickup: "I don't need his luggage.",
      },
    },
    {
      id: "wall-plaques",
      name: "Wall Plaques",
      position: { x: 50, y: 30 },
      width: 20,
      height: 15,
      interactions: {
        look: 'Framed certificates and plaques. "GB Studios Employee of the Year" — three years running.',
      },
    },
    {
      id: "ec-box",
      name: "Cardboard Box",
      position: { x: 90, y: 85 },
      width: 10,
      height: 12,
      interactions: {
        look: 'A box labeled "EC." What does EC stand for? El Cabos? Or something else?',
        open: 'Inside are old scripts with angry margin notes. "THIS IS GARBAGE" written in red ink.',
        pickup: "Too heavy to carry.",
      },
    },
    {
      id: "door-exit",
      name: "Door to Hallway",
      position: { x: 5, y: 50 },
      width: 8,
      height: 45,
      interactions: {
        look: "The door back to the hallway.",
        open: "__NAVIGATE__hallway",
        use: "__NAVIGATE__hallway",
      },
    },
  ];

  const handleHotspotClick = (hotspot: SimpleHotspot) => {
    const verb = gameState.selectedVerb || "look";
    const interaction = hotspot.interactions[verb];

    if (interaction === "__UNLOCK_DRAWER__") {
      setFlag("drawerOpened", true);
      // Remove the fountain key from inventory
      const keyIndex = gameState.inventory.findIndex(i => i.id === "fountain_key");
      if (keyIndex !== -1) {
        // We'll signal the pickup to trigger key consumption via a flag
        setFlag("fountainKeyUsed", true);
      }
      onHotspotClick({
        ...hotspot,
        interactions: {
          ...hotspot.interactions,
          [verb]: "I use the small key from the fountain... it fits! The drawer slides open. Inside there's a crumpled note with hasty handwriting.",
        },
      });
      return;
    }


    handleSceneHotspotClick(hotspot, gameState.selectedVerb, onChangeRoom, onHotspotClick);
  };

  return (
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${losCabosRoomBackground})` }} />

      {/* Visual indicator for opened drawer */}
      {drawerOpened && !threatNoteTaken && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{ left: "20%", top: "68%", width: "10%", height: "6%" }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-3/4 h-1 bg-yellow-200/60 rounded animate-pulse" />
          </div>
        </div>
      )}

      {hotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          className={`absolute cursor-pointer transition-colors rounded ${debugMode ? "border-2 border-green-400/70 bg-green-400/15" : "hover:bg-white/10"}`}
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
        />
      ))}
    </div>
  );
}
