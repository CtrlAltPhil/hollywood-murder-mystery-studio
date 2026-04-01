import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";

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
            onAddToInventory({ id: "monogrammed_handkerchief", name: "Monogrammed Handkerchief", image: "" });
            return "I pick up the handkerchief. It's fine silk, embroidered with the initials \"L.A.\" — Luke Adams? Who is that?";
          }
          if (!photoTaken) {
            setFlag("photoTaken", true);
            onAddToInventory({ id: "torn_photograph", name: "Torn Photograph", image: "" });
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
      {/* Dark parking lot background - CSS gradient until proper asset */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a0c14 0%, #141825 30%, #1a1f30 60%, #252a3a 80%, #2f3445 100%)",
        }}
      />

      {/* Ground/asphalt */}
      <div
        className="absolute"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          height: "35%",
          background: "linear-gradient(180deg, #2a2d38 0%, #1e2028 50%, #16171f 100%)",
        }}
      />

      {/* Parking lines */}
      <div className="absolute" style={{ left: "15%", bottom: "2%", width: "70%", height: "2px", background: "rgba(255,255,200,0.15)" }} />
      <div className="absolute" style={{ left: "40%", bottom: "0%", width: "2px", height: "35%", background: "rgba(255,255,200,0.08)" }} />

      {/* Studio wall in background */}
      <div
        className="absolute"
        style={{
          left: 0,
          right: 0,
          top: "20%",
          height: "45%",
          background: "linear-gradient(180deg, #1a1d28 0%, #22263a 100%)",
          borderBottom: "2px solid rgba(255,255,255,0.05)",
        }}
      />

      {/* Police cruiser silhouette */}
      <div
        className="absolute"
        style={{
          left: "10%",
          top: "42%",
          width: "28%",
          height: "28%",
          background: "linear-gradient(180deg, #1a2040 0%, #141830 60%, #0f1220 100%)",
          borderRadius: "8px 8px 4px 4px",
          border: "1px solid rgba(100,120,200,0.15)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        {/* Police light bar */}
        <div
          className="absolute animate-pulse"
          style={{
            top: "-4px",
            left: "30%",
            width: "40%",
            height: "6px",
            background: "linear-gradient(90deg, #3355ff 0%, #ff3355 50%, #3355ff 100%)",
            borderRadius: "3px",
            boxShadow: "0 0 12px rgba(50,80,255,0.4), 0 0 12px rgba(255,50,80,0.4)",
          }}
        />
        {/* Windshield */}
        <div
          className="absolute"
          style={{
            top: "15%",
            left: "15%",
            width: "70%",
            height: "25%",
            background: "linear-gradient(180deg, rgba(100,130,200,0.2) 0%, rgba(60,80,120,0.1) 100%)",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Duke's SUV silhouette */}
      <div
        className="absolute"
        style={{
          left: "58%",
          top: "38%",
          width: "30%",
          height: "32%",
          background: "linear-gradient(180deg, #0d0e14 0%, #111318 60%, #0a0b10 100%)",
          borderRadius: "6px 6px 4px 4px",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 25px rgba(0,0,0,0.6)",
        }}
      >
        {/* Windshield */}
        <div
          className="absolute"
          style={{
            top: "12%",
            left: "10%",
            width: "80%",
            height: "22%",
            background: "linear-gradient(180deg, rgba(80,90,110,0.15) 0%, rgba(40,50,70,0.1) 100%)",
            borderRadius: "4px",
          }}
        />
        {/* Open trunk indicator - slight glow */}
        <div
          className="absolute"
          style={{
            top: "30%",
            right: "-5%",
            width: "20%",
            height: "40%",
            background: "radial-gradient(ellipse at center, rgba(200,180,100,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Vanity plate glow */}
      <div
        className="absolute text-[8px] font-pixel text-yellow-200/40"
        style={{ left: "68%", top: "68%", letterSpacing: "2px" }}
      >
        XTRM DUK
      </div>

      {/* Security camera on wall */}
      <div
        className="absolute"
        style={{
          left: "47%",
          top: "8%",
          width: "6%",
          height: "8%",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "60%",
            background: "#2a2d38",
            borderRadius: "2px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
        {/* Dangling cut cable */}
        <div
          style={{
            width: "2px",
            height: "40%",
            background: "rgba(200,50,50,0.4)",
            marginLeft: "30%",
          }}
        />
      </div>

      {/* Dumpster shape */}
      <div
        className="absolute"
        style={{
          left: "42%",
          top: "36%",
          width: "12%",
          height: "16%",
          background: "linear-gradient(180deg, #2a3828 0%, #1e2a1c 100%)",
          borderRadius: "2px",
          border: "1px solid rgba(100,140,80,0.2)",
        }}
      />

      {/* Stars / ambient lights */}
      {[
        { x: 15, y: 5, s: 2 },
        { x: 35, y: 3, s: 1.5 },
        { x: 60, y: 6, s: 2 },
        { x: 80, y: 4, s: 1.5 },
        { x: 90, y: 8, s: 1 },
      ].map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/30"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: `${star.s}px`, height: `${star.s}px` }}
        />
      ))}

      {/* Oil stain */}
      <div
        className="absolute rounded-full"
        style={{
          left: "68%",
          top: "78%",
          width: "10%",
          height: "6%",
          background: "radial-gradient(ellipse, rgba(40,35,20,0.6) 0%, rgba(30,25,15,0.3) 60%, transparent 100%)",
        }}
      />

      {/* Navigation indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▼ Back to Backyard ▼
      </div>

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
