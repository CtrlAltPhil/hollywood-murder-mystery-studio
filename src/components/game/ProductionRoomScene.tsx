import { useState } from "react";
import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import productionRoomBackground from "@/assets/Production_Room-2.png";
import electricalBoxFront from "@/assets/Electrical_Box_Front.png";
import electricalBoxOpen from "@/assets/Electrical_Box_Open.png";

interface ProductionRoomSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  debugMode?: boolean;
  onSetFlag?: (flag: string) => void;
}

type ElectricalBoxView = "none" | "closed" | "open";

export function ProductionRoomScene({ gameState, onHotspotHover, onHotspotClick, onChangeRoom, onEmptyClick, debugMode, onSetFlag }: ProductionRoomSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);
  const [electricalBoxView, setElectricalBoxView] = useState<ElectricalBoxView>("none");
  const [boxOpened, setBoxOpened] = useState(false);

  const hotspots: SimpleHotspot[] = [
    {
      id: "camera",
      name: "Camera",
      position: { x: 30, y: 60 },
      width: 18,
      height: 30,
      interactions: {
        look: "A professional film camera on a tripod. The recording light is off, but the lens cap is missing.",
        use: "I press the power button. The viewfinder flickers on — there's still a tape inside!",
        pickup: "It's way too heavy to carry around.",
        push: "I nudge the camera. It swivels to face the green screen.",
      },
    },
    {
      id: "green-screen",
      name: "Green Screen",
      position: { x: 55, y: 45 },
      width: 25,
      height: 35,
      interactions: {
        look: "A green screen backdrop. It looks like it was set up for some kind of special effects shoot.",
        use: "I don't have anything to film right now.",
        pull: "The screen is firmly mounted to the wall.",
      },
    },
    {
      id: "boxes",
      name: "Cardboard Boxes",
      position: { x: 58, y: 70 },
      width: 16,
      height: 20,
      interactions: {
        look: 'Stacked cardboard boxes. Some are labeled "PROPS" and others "WARDROBE."',
        open: "I open one of the boxes. Old costumes and wigs... nothing useful.",
        pickup: "They're too bulky to carry.",
        push: 'I push one aside. There\'s a crumpled note underneath — looks like a call sheet with Los Cabos\' name circled in red.',
      },
    },
    {
      id: "fire-extinguisher",
      name: "Fire Extinguisher",
      position: { x: 93, y: 65 },
      width: 6,
      height: 18,
      interactions: {
        look: "A wall-mounted fire extinguisher. Standard safety equipment.",
        pickup: "It's bolted to the wall bracket.",
        use: "There's no fire. I'll leave it where it is.",
        pull: "I tug on it but it's locked into the bracket.",
      },
    },
    {
      id: "cables",
      name: "Cables and Wires",
      position: { x: 65, y: 88 },
      width: 30,
      height: 12,
      interactions: {
        look: "A mess of power cables and extension cords snaking across the floor. A tripping hazard.",
        pickup: "I don't need a bunch of tangled cables.",
        use: "They're already plugged into the equipment.",
      },
    },
    {
      id: "stage-lights",
      name: "Stage Lights",
      position: { x: 35, y: 15 },
      width: 50,
      height: 15,
      interactions: {
        look: "Powerful stage lights hanging from the ceiling. Two of them are still on, pointing at the green screen.",
        use: "I can't reach them from down here.",
      },
    },
    {
      id: "door-exit",
      name: "Door",
      position: { x: 6, y: 55 },
      width: 10,
      height: 40,
      interactions: {
        look: "The door back to the hallway.",
        open: "__NAVIGATE__hallway",
        use: "__NAVIGATE__hallway",
      },
    },
    {
      id: "cable-reel",
      name: "Cable Reel",
      position: { x: 80, y: 78 },
      width: 10,
      height: 14,
      interactions: {
        look: "A large cable reel. Looks like it belongs to the lighting rig.",
        pickup: "Too heavy.",
        push: "It rolls a bit but there's nothing behind it.",
      },
    },
    {
      id: "electrical-box",
      name: "Electrical Box",
      position: { x: 85, y: 42 },
      width: 8,
      height: 18,
      interactions: {
        look: () => {
          setElectricalBoxView(boxOpened ? "open" : "closed");
          return "";
        },
        open: () => {
          setElectricalBoxView(boxOpened ? "open" : "closed");
          return "";
        },
        use: () => {
          setElectricalBoxView(boxOpened ? "open" : "closed");
          return "";
        },
      },
    },
  ];

  // Electrical box close-up views
  if (electricalBoxView === "closed") {
    const closeUpHotspots: SimpleHotspot[] = [
      {
        id: "ebox-open-action",
        name: "Electrical Box Latch",
        position: { x: 42, y: 50 },
        width: 25,
        height: 60,
        interactions: {
          open: () => {
            setBoxOpened(true);
            setElectricalBoxView("open");
            onSetFlag?.("electricalBoxOpened");
            return "";
          },
          look: "A sturdy electrical box. The label says 'DO NOT TOUCH.' The latch looks like it can be opened.",
          use: () => {
            setBoxOpened(true);
            setElectricalBoxView("open");
            onSetFlag?.("electricalBoxOpened");
            return "";
          },
        },
      },
      {
        id: "ebox-back",
        name: "Back",
        position: { x: 50, y: 92 },
        width: 100,
        height: 16,
        interactions: {
          look: "__BACK__",
          open: "__BACK__",
          use: "__BACK__",
          pickup: "__BACK__",
          close: "__BACK__",
          talk: "__BACK__",
          push: "__BACK__",
          pull: "__BACK__",
        },
      },
    ];

    return (
      <div className={`relative w-full h-full ${cursorClass}`}>
        <div className="absolute inset-0 bg-[#c8cdd4] flex items-center justify-center">
          <img src={electricalBoxFront} alt="Electrical Box (Closed)" style={{ maxHeight: "85%", maxWidth: "85%", objectFit: "contain" }} />
        </div>
        {closeUpHotspots.map((hotspot) => (
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
              if (Object.values(hotspot.interactions).some(v => v === "__BACK__")) {
                const verb = gameState.selectedVerb || "open";
                if (hotspot.interactions[verb] === "__BACK__" || !gameState.selectedVerb) {
                  setElectricalBoxView("none");
                  return;
                }
              }
              const verb = gameState.selectedVerb;
              if (verb && hotspot.interactions[verb]) {
                const interaction = hotspot.interactions[verb];
                if (typeof interaction === "function") {
                  interaction();
                } else if (typeof interaction === "string") {
                  onHotspotClick(hotspot);
                }
              } else if (!verb) {
                // Default: try open
                const interaction = hotspot.interactions.open;
                if (typeof interaction === "function") {
                  interaction();
                } else {
                  onHotspotClick(hotspot);
                }
              } else {
                onHotspotClick(hotspot);
              }
            }}
          />
        ))}
        {/* Back prompt */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-xs font-mono pointer-events-none bg-black/60 px-3 py-1 rounded">
          Click below to go back
        </div>
      </div>
    );
  }

  if (electricalBoxView === "open") {
    const openHotspots: SimpleHotspot[] = [
      {
        id: "ebox-wires",
        name: "Frayed Wires",
        position: { x: 38, y: 50 },
        width: 20,
        height: 40,
        interactions: {
          look: "Three conduit pipes — blue, red, and green. The red one has been cut open and the wires are frayed and exposed. This looks deliberate.",
          use: "I shouldn't touch live wires with my bare hands.",
          pickup: "That would be extremely dangerous.",
        },
      },
      {
        id: "ebox-note-754",
        name: "Note",
        position: { x: 65, y: 45 },
        width: 18,
        height: 35,
        interactions: {
          look: () => {
            onSetFlag?.("note754Found");
            return "A piece of paper taped to the inside of the door. Someone has scrawled '754' in red. What does that number mean?";
          },
          pickup: "It's taped firmly to the door. I'll make a note of the number instead.",
          use: "It's just a note with '754' written on it. I should remember this number.",
        },
      },
      {
        id: "ebox-back-open",
        name: "Back",
        position: { x: 50, y: 92 },
        width: 100,
        height: 16,
        interactions: {
          look: "__BACK__",
          open: "__BACK__",
          use: "__BACK__",
          pickup: "__BACK__",
          close: "__BACK__",
          talk: "__BACK__",
          push: "__BACK__",
          pull: "__BACK__",
        },
      },
    ];

    return (
      <div className={`relative w-full h-full ${cursorClass}`}>
        <div className="absolute inset-0 bg-[#c8cdd4] flex items-center justify-center">
          <img src={electricalBoxOpen} alt="Electrical Box (Open)" style={{ maxHeight: "85%", maxWidth: "85%", objectFit: "contain" }} />
        </div>
        {openHotspots.map((hotspot) => (
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
              if (Object.values(hotspot.interactions).some(v => v === "__BACK__")) {
                const verb = gameState.selectedVerb || "open";
                if (hotspot.interactions[verb] === "__BACK__" || !gameState.selectedVerb) {
                  setElectricalBoxView("none");
                  return;
                }
              }
              const verb = gameState.selectedVerb;
              if (verb && hotspot.interactions[verb]) {
                const interaction = hotspot.interactions[verb];
                if (typeof interaction === "function") {
                  interaction();
                } else {
                  onHotspotClick(hotspot);
                }
              } else if (!verb) {
                onHotspotClick(hotspot);
              } else {
                onHotspotClick(hotspot);
              }
            }}
          />
        ))}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-xs font-mono pointer-events-none bg-black/60 px-3 py-1 rounded">
          Click below to go back
        </div>
      </div>
    );
  }

  // Main production room view
  return (
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${productionRoomBackground})` }} />

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
            const verb = gameState.selectedVerb;
            // Electrical box special handling
            if (hotspot.id === "electrical-box") {
              if (verb === "look" || verb === "open" || verb === "use" || !verb) {
                setElectricalBoxView(boxOpened ? "open" : "closed");
                return;
              }
              onHotspotClick(hotspot);
              return;
            }
            handleSceneHotspotClick(hotspot, gameState.selectedVerb, onChangeRoom, onHotspotClick);
          }}
        />
      ))}
    </div>
  );
}
