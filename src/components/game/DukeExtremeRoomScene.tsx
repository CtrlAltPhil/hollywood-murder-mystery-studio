import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import dukeRoomBackground from "@/assets/backgrounds/duke-extreme-room.png";
import moneyBag from "@/assets/money_bag.png";

interface DukeExtremeRoomSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  debugMode?: boolean;
}

export function DukeExtremeRoomScene({
  gameState,
  onHotspotHover,
  onHotspotClick,
  onChangeRoom,
  onEmptyClick,
  debugMode,
}: DukeExtremeRoomSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);

  const hotspots: SimpleHotspot[] = [
    {
      id: "money-bag",
      name: "Money Bag",
      position: { x: 54, y: 75 },
      width: 12,
      height: 15,
      interactions: {
        look: "A black duffel bag stuffed with cash, just sitting on the footstool. Why would Duke Extreme have a bag of money just lying around in his room? That's not exactly normal... even for Hollywood.",
        pickup: "That bag is evidence. I should leave it right where it is — the police will want to see this.",
        use: "I shouldn't touch it. It could be evidence.",
        push: "Better not disturb potential evidence.",
        pull: "Better not disturb potential evidence.",
      },
    },
    {
      id: "recliner",
      name: "Leather Recliner",
      position: { x: 25, y: 70 },
      width: 20,
      height: 45,
      interactions: {
        look: "A massive leather recliner. It looks extremely comfortable. Duke Extreme clearly likes the finer things.",
        use: "Now's not the time to sit down and relax.",
        push: "It's too heavy to move.",
      },
    },
    {
      id: "tv",
      name: "Flat Screen TV",
      position: { x: 82, y: 35 },
      width: 18,
      height: 30,
      interactions: {
        look: "A large flat screen TV mounted on the wall. It's turned on but showing nothing but a white screen.",
        use: "I don't see a remote anywhere nearby... wait, there's one on the shelf.",
        push: "I'm not going to push a TV off the wall.",
      },
    },
    {
      id: "remote",
      name: "TV Remote",
      position: { x: 88, y: 60 },
      width: 8,
      height: 6,
      interactions: {
        look: "A TV remote sitting on a small shelf.",
        pickup: "I don't need a TV remote right now.",
        use: "I press some buttons but nothing interesting happens.",
      },
    },
    {
      id: "el-fuego-portrait",
      name: "El Fuego Portrait",
      position: { x: 35, y: 20 },
      width: 18,
      height: 30,
      interactions: {
        look: "A large portrait of Duke Extreme in his 'El Fuego' character. He looks very proud of himself. The frame is gilded and way too big for this room.",
        push: "I'm not going to mess with his portrait.",
      },
    },
    {
      id: "fire-painting",
      name: "Fire Painting",
      position: { x: 60, y: 15 },
      width: 10,
      height: 14,
      interactions: {
        look: "A small painting of a flame. Very on-brand for someone called 'El Fuego.'",
      },
    },
    {
      id: "el-fuego-sign",
      name: "'EL!!! FUEGO' Sign",
      position: { x: 62, y: 35 },
      width: 12,
      height: 12,
      interactions: {
        look: "A framed sign that reads 'EL!!! FUEGO' in bold letters. Subtle.",
      },
    },
    {
      id: "back-to-hallway",
      name: "Hallway",
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

  return (
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dukeRoomBackground})` }} />

      {/* Money bag on the footstool */}
      <img
        src={moneyBag}
        alt="Money Bag"
        className="absolute pointer-events-none z-10"
        style={{ left: "42%", top: "65%", width: "auto", height: "25%", objectFit: "contain" }}
      />

      {/* Navigation indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▼ Hallway ▼
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
            const verb = gameState.selectedVerb;
            if (hotspot.id === "back-to-hallway" && !verb) {
              onChangeRoom("hallway");
              return;
            }
            handleSceneHotspotClick(hotspot, verb, onChangeRoom, onHotspotClick);
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
