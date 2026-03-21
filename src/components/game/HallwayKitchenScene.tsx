import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import hallwayKitchenBackground from "@/assets/backgrounds/hallway-kitchen.jpg";

interface HallwayKitchenSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  debugMode?: boolean;
}

export function HallwayKitchenScene({ gameState, onHotspotHover, onHotspotClick, onChangeRoom, onEmptyClick, debugMode }: HallwayKitchenSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);

  const hotspots: SimpleHotspot[] = [
    {
      id: "kitchen-door",
      name: "Kitchen Door",
      position: { x: 50, y: 50 },
      width: 20,
      height: 50,
      interactions: {
        look: "Heavy metal double doors leading to the kitchen.",
        open: "__NAVIGATE__kitchen",
        use: "__NAVIGATE__kitchen",
        push: "__NAVIGATE__kitchen",
      },
    },
    {
      id: "party-room-door-left",
      name: "Party Room Door",
      position: { x: 12, y: 50 },
      width: 12,
      height: 50,
      interactions: {
        look: "Another entrance to the party room.",
        open: "__NAVIGATE__breakroom",
        use: "__NAVIGATE__breakroom",
      },
    },
    {
      id: "production-room-door-right",
      name: "Production Room Door",
      position: { x: 88, y: 50 },
      width: 12,
      height: 50,
      interactions: {
        look: "Another way to the production room.",
        open: "__NAVIGATE__production-room",
        use: "__NAVIGATE__production-room",
      },
    },
    {
      id: "back-to-hallway",
      name: "Hallway",
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

  return (
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hallwayKitchenBackground})` }} />

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▼ Back to Hallway ▼
      </div>

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
            handleSceneHotspotClick(hotspot, gameState.selectedVerb, onChangeRoom, onHotspotClick);
          }}
        />
      ))}
    </div>
  );
}
