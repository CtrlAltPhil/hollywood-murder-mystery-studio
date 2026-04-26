import { useEffect, useState } from "react";
import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import parkingLotBackground from "@/assets/backgrounds/parking-lot.png";
import handkerchiefImg from "@/assets/props/monogrammed-handkerchief.png";
import tornPhotoImg from "@/assets/props/torn-photograph.png";
import lukeAdamsImg from "@/assets/characters/luke-adams.png";
import lukeAdamsImg2 from "@/assets/characters/luke-adams-2.png";
import lukeAdamsSmirkImg from "@/assets/characters/luke-adams-smirk.png";

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

  // Cycle Luke between idle frames (standing -> smoking) for subtle animation
  const [lukePose, setLukePose] = useState<0 | 1 | 2>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      // 0: idle, 1: idle, 2: smoking — gives smoking a less frequent appearance
      setLukePose((prev) => {
        if (prev === 0) return 1;
        if (prev === 1) return 2;
        return 0;
      });
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const lukeTalking = gameState.dialogState.isActive && gameState.dialogState.character?.id === "luke";
  const lukeSprite = lukeTalking ? lukeAdamsSmirkImg : lukePose === 2 ? lukeAdamsImg2 : lukeAdamsImg;
  const photoTaken = gameState.flags.photoTaken === true;
  const trunkInspected = gameState.flags.trunkInspected === true;

  const hotspots: SimpleHotspot[] = [
    {
      id: "duke-car",
      name: 'Black SUV ("XTRM DUKE")',
      position: { x: 70, y: 75 },
      width: 20,
      height: 20,
      interactions: {
        look: "A matte black SUV with tinted windows. The vanity plate reads \"XTRM DUKE\" — that's Duke Extreme's ride. The trunk is popped open.",
        open: "The trunk is already open. I should take a closer look inside.",
        use: "It's locked. I'm not getting in without keys.",
        push: "I'm not pushing a two-ton SUV.",
      },
    },
    {
      id: "open-trunk",
      name: "Open Trunk",
      position: { x: 85, y: 75 },
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
            onAddToInventory({
              id: "monogrammed_handkerchief",
              name: "Monogrammed Handkerchief",
              image: handkerchiefImg,
            });
            return 'I pick up the handkerchief. It\'s fine silk, embroidered with the initials "L.A." — Luke Adams? Who is that?';
          }
          if (!photoTaken) {
            setFlag("photoTaken", true);
            onAddToInventory({ id: "torn_photograph", name: "Torn Photograph", image: tornPhotoImg });
            return "I grab the torn photograph. It shows two men shaking hands over a contract. I don't recognize either of them — but the other face has been deliberately torn away.";
          }
          return "I've already taken everything from the trunk.";
        },
        use: "I should pick up what's inside first.",
      },
    },
    {
      id: "police-cruiser",
      name: "Police Cruiser",
      position: { x: 15, y: 85 },
      width: 20,
      height: 25,
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
      position: { x: 35, y: 65 },
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
      position: { x: 68, y: 40 },
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
      position: { x: 65, y: 90 },
      width: 12,
      height: 8,
      interactions: {
        look: "A fresh oil stain on the pavement, right beneath Duke's SUV. The engine was running recently. Was someone planning a quick getaway?",
        use: "It's just oil on asphalt.",
        pickup: "I can't pick up an oil stain.",
      },
    },
    {
      id: "luke-adams",
      name: "Luke Adams",
      position: { x: 14, y: 90 },
      width: 8,
      height: 22,
      interactions: {
        look: "A man in a sharp suit, leaning against the wall and smoking. He's been watching me. He must be Luke Adams — the name on the handkerchief.",
        talk: "__DIALOG__luke",
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
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${parkingLotBackground})` }}
      />

      {/* Navigation indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▼ Back to Backyard ▼
      </div>

      {/* Luke Adams — leaning against the wall, smoking */}
      <img
        src={lukeAdamsImg}
        alt="Luke Adams"
        className="absolute pointer-events-none z-10"
        style={{
          left: "14%",
          top: "100%",
          height: "26%",
          transform: "translate(-50%, -100%)",
          imageRendering: "pixelated",
          animation: "luke-lean 4s ease-in-out infinite",
          transformOrigin: "bottom center",
        }}
      />

      {/* Sparkling items in trunk after inspection (multi-point shimmer) */}
      {trunkInspected && !handkerchiefTaken && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{ left: "76%", top: "56%", width: "7%", height: "7%" }}
        >
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
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-ping"
              style={{ left: "40%", top: "30%", animationDuration: "1.3s", animationDelay: "0.4s" }}
            />
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
      {trunkInspected && !photoTaken && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{ left: "86%", top: "58%", width: "7%", height: "7%" }}
        >
          <div className="relative w-full h-full">
            <div
              className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full animate-ping"
              style={{ left: "50%", top: "40%", animationDuration: "1.4s", animationDelay: "0.2s" }}
            />
            <div
              className="absolute w-1 h-1 bg-white rounded-full animate-ping"
              style={{ left: "30%", top: "60%", animationDuration: "1.1s", animationDelay: "0.5s" }}
            />
            <div
              className="absolute w-1.5 h-1.5 bg-yellow-100 rounded-full animate-ping"
              style={{ left: "70%", top: "50%", animationDuration: "1.6s", animationDelay: "0.8s" }}
            />
            <div
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-ping"
              style={{ left: "55%", top: "70%", animationDuration: "1.3s", animationDelay: "0.1s" }}
            />
            <div className="absolute" style={{ left: "45%", top: "45%", width: "10%", height: "10%" }}>
              <div
                className="w-2 h-0.5 bg-yellow-200/90 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
                style={{ animationDuration: "0.9s" }}
              />
              <div
                className="w-0.5 h-2 bg-yellow-200/90 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
                style={{ animationDuration: "0.9s" }}
              />
            </div>
          </div>
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
