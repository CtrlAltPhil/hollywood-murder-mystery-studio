import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import parkingLotBackground from "@/assets/backgrounds/parking-lot.png";
import handkerchiefImg from "@/assets/props/monogrammed-handkerchief.png";
import tornPhotoImg from "@/assets/props/torn-photograph.png";

interface ParkingLotSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  debugMode?: boolean;
  setFlag: (flag: string, value: boolean) => void;
  onAddToInventory: (item: { id: string; name: string; image: string }) => void;
}

export function ParkingLotScene({
  gameState,
  onHotspotHover,
  onHotspotClick,
  onChangeRoom,
  onEmptyClick,
  debugMode,
  setFlag,
  onAddToInventory,
}: ParkingLotSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);
  const handkerchiefTaken = gameState.flags.handkerchiefTaken === true;
  const photoTaken = gameState.flags.photoTaken === true;
  const trunkInspected = gameState.flags.trunkInspected === true;

  const hotspots: SimpleHotspot[] = [
    {
      id: "duke-car",
      name: "Black SUV (\"XTRM DUK\")",
      position: { x: 70, y: 55 },
      width: 28,
      height: 35,
      interactions: {
        look: "A matte black SUV with tinted windows. The vanity plate reads \"XTRM DUK\" — that's Duke Extreme's ride. The trunk is popped open.",
        open: "The trunk is already open. I should take a closer look inside.",
        use: "It's locked. I'm not getting in without keys.",
        push: "I'm not pushing a two-ton SUV.",
      },
    },
    {
      id: "open-trunk",
      name: "Open Trunk",
      position: { x: 82, y: 62 },
      width: 14,
      height: 18,
      interactions: {
        look: () => {
          setFlag("trunkInspected", true);
          if (!handkerchiefTaken && !photoTaken) {
            return "The trunk is wide open. Inside I can see a monogrammed handkerchief and what looks like a torn photograph. Someone left in a hurry.";
          }
          if (!handkerchiefTaken) return "There's still a handkerchief in here.";
          if (!photoTaken) return "There's still a torn photograph in here.";
          return "The trunk is empty now. I've already taken everything useful.";
        },
        pickup: () => {
          if (!handkerchiefTaken) {
            setFlag("handkerchiefTaken", true);
            onAddToInventory({ id: "monogrammed_handkerchief", name: "Monogrammed Handkerchief", image: handkerchiefImg });
            return "I pick up the handkerchief. It's fine silk, embroidered with the initials \"L.A.\" — Luke Adams? Who is that?";
          }
          if (!photoTaken) {
            setFlag("photoTaken", true);
            onAddToInventory({ id: "torn_photograph", name: "Torn Photograph", image: tornPhotoImg });
            return "I grab the torn photograph. It shows two men shaking hands over a contract. One of them looks like... Carl? The other face is torn away.";
          }
          return "I've already taken everything from the trunk.";
        },
        use: "I should pick up what's inside first.",
      },
    },
    {
      id: "police-cruiser",
      name: "Police Cruiser",
      position: { x: 25, y: 55 },
      width: 28,
      height: 35,
      interactions: {
        look: "My cruiser. At least it's still in one piece. The radio light is blinking — dispatch is probably wondering where my report is.",
        open: "I don't need anything from the car right now. The answers are inside the studio.",
        use: "I'm not leaving until I solve this case.",
        pickup: "It's a car. I can't pick it up.",
      },
    },
    {
      id: "dumpster",
      name: "Dumpster",
      position: { x: 48, y: 45 },
      width: 14,
      height: 20,
      interactions: {
        look: "A studio dumpster. I can see a crumpled piece of paper near the top... It's a deal memo between 'Sunset Productions' and 'Platinum Studios.' Looks like a standard buyout agreement — nothing unusual. A red herring.",
        open: "I lift the lid. Just regular studio trash and that deal memo. Nothing incriminating.",
        use: "I don't need to dig through garbage right now.",
        push: "It's on wheels but I don't need to move it.",
      },
    },
    {
      id: "security-camera",
      name: "Security Camera",
      position: { x: 50, y: 12 },
      width: 10,
      height: 12,
      interactions: {
        look: () => {
          setFlag("securityCameraFound", true);
          return "A security camera mounted on the wall... but the cable has been cut. Cleanly, too — with a sharp tool. Whoever did this knew what they were doing. Just like the wires in the production room...";
        },
        use: "The cable is severed. This camera isn't recording anything.",
        push: "I can't reach it from here.",
      },
    },
    {
      id: "oil-stain",
      name: "Oil Stain",
      position: { x: 72, y: 82 },
      width: 12,
      height: 8,
      interactions: {
        look: "A fresh oil stain on the pavement, right beneath Duke's SUV. The engine was running recently. Was someone planning a quick getaway?",
        use: "It's just oil on asphalt.",
        pickup: "I can't pick up an oil stain.",
      },
    },
    {
      id: "license-plate",
      name: "License Plate",
      position: { x: 62, y: 72 },
      width: 8,
      height: 6,
      interactions: {
        look: "The vanity plate: \"XTRM DUK\". Subtle, Duke. Real subtle.",
      },
    },
    {
      id: "back-to-backyard",
      name: "Backyard",
      position: { x: 50, y: 95 },
      width: 40,
      height: 10,
      interactions: {
        look: "__NAVIGATE__backyard",
        open: "__NAVIGATE__backyard",
        use: "__NAVIGATE__backyard",
      },
    },
  ];

  // Filter out collected items from trunk
  const activeHotspots = hotspots.filter((h) => {
    if (h.id === "open-trunk" && handkerchiefTaken && photoTaken) return false;
    return true;
  });

  const handleHotspotClick = (hotspot: SimpleHotspot) => {
    handleSceneHotspotClick(hotspot, gameState.selectedVerb, onChangeRoom, onHotspotClick);
  };

  return (
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${parkingLotBackground})` }} />

      {/* Navigation indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▼ Back to Backyard ▼
      </div>

      {/* Sparkling items in trunk after inspection */}
      {trunkInspected && !handkerchiefTaken && (
        <div
          className="absolute pointer-events-none z-20"
          style={{ left: "78%", top: "58%", width: "5%", height: "6%" }}
        >
          <img src={handkerchiefImg} alt="" className="w-full h-full object-contain drop-shadow-[0_0_4px_rgba(255,255,200,0.9)]" style={{ imageRendering: "pixelated" }} />
          <span className="absolute -top-1 -right-1 text-yellow-200 text-sm animate-pulse">✦</span>
          <span className="absolute bottom-0 left-0 text-yellow-100 text-xs animate-pulse" style={{ animationDelay: "0.4s" }}>✦</span>
        </div>
      )}
      {trunkInspected && !photoTaken && (
        <div
          className="absolute pointer-events-none z-20"
          style={{ left: "85%", top: "60%", width: "6%", height: "6%" }}
        >
          <img src={tornPhotoImg} alt="" className="w-full h-full object-contain drop-shadow-[0_0_4px_rgba(255,255,200,0.9)]" style={{ imageRendering: "pixelated" }} />
          <span className="absolute -top-1 -right-1 text-yellow-200 text-sm animate-pulse" style={{ animationDelay: "0.2s" }}>✦</span>
          <span className="absolute bottom-0 left-0 text-yellow-100 text-xs animate-pulse" style={{ animationDelay: "0.6s" }}>✦</span>
        </div>
      )}

      {/* Hotspots */}
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
