import { useRef, useState, useEffect, useCallback } from "react";
import { GameState, Verb } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";

// Import assets
import breakroomBackground from "@/assets/backgrounds/breakroom.jpg";
import carlImage from "@/assets/characters/carl.png";
import elFuegoImage from "@/assets/characters/el-fuego.png";
import elFuegoImage2 from "@/assets/characters/el-fuego-2.png";
import ladyImage from "@/assets/characters/lady.png";
import losCabosImage from "@/assets/characters/los-cabos.png";
import losCabosDeadImage from "@/assets/characters/los-cabos-dead.png";
import tableImage from "@/assets/props/table.png";
import wineGlassesImage from "@/assets/props/wine-glasses.png";
import daggerImage from "@/assets/props/dagger.png";
import charcuterieBoardImage from "@/assets/charcuterie_board.png";
import meatStickImage from "@/assets/meat_stick.png";
import wineGlassInventoryImage from "@/assets/wine_glass.png";

// Re-export SimpleHotspot for backward compatibility
export type { SimpleHotspot } from "@/utils/sceneHelpers";

interface GameSceneProps {
  gameState: GameState;
  setFlag: (key: string, value: boolean) => void;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onAddToInventory: (item: { id: string; name: string; image: string }) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  debugMode?: boolean;
}

export function GameScene({
  gameState,
  setFlag,
  onHotspotHover,
  onHotspotClick,
  onAddToInventory,
  onChangeRoom,
  onEmptyClick,
  debugMode,
}: GameSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cursorClass = getCursorClass(gameState.selectedVerb);

  // Animate Duke Extreme between two poses
  const [elFuegoPose, setElFuegoPose] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElFuegoPose((prev) => (prev === 0 ? 1 : 0));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Shocked reactions when gameplay first starts
  const SHOCK_MESSAGES = [
    { speaker: "Lady Fantastique", delay: 500, duration: 3000, text: "Oh my God! Los Cabos!!" },
    { speaker: "Carl", delay: 2000, duration: 3000, text: "He's... he's dead." },
    { speaker: "Duke Extreme", delay: 4000, duration: 3000, text: "¡Dios mío! Who did this?!" },
    { speaker: "Lady Fantastique", delay: 6000, duration: 3000, text: "Someone call the police!" },
    { speaker: "Carl", delay: 8000, duration: 3500, text: "Nobody leaves this room." },
  ];

  const [shockBubbles, setShockBubbles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (gameState.flags.shockReactionDone) return;
    const timers: NodeJS.Timeout[] = [];
    SHOCK_MESSAGES.forEach(({ speaker, delay, duration, text }) => {
      timers.push(
        setTimeout(() => {
          setShockBubbles((prev) => ({ ...prev, [speaker]: text }));
        }, delay),
      );
      timers.push(
        setTimeout(() => {
          setShockBubbles((prev) => {
            const next = { ...prev };
            if (next[speaker] === text) delete next[speaker];
            return next;
          });
        }, delay + duration),
      );
    });
    const lastMsg = SHOCK_MESSAGES[SHOCK_MESSAGES.length - 1];
    timers.push(setTimeout(() => setFlag("shockReactionDone", true), lastMsg.delay + lastMsg.duration));
    return () => timers.forEach(clearTimeout);
  }, [gameState.flags.shockReactionDone]);

  const hotspots: SimpleHotspot[] = [
    {
      id: "door",
      name: "Door",
      position: { x: 7, y: 65 },
      width: 7,
      height: 50,
      interactions: {
        look: "A sturdy wooden door leading to the hallway.",
        open: "__NAVIGATE__hallway",
        close: "It's already closed.",
        use: "__NAVIGATE__hallway",
        push: "__NAVIGATE__hallway",
        pull: "__NAVIGATE__hallway",
      },
    },
    {
      id: "window",
      name: "Window",
      position: { x: 95, y: 50 },
      width: 8,
      height: 45,
      interactions: {
        look: "A tall window overlooking the studio lot. It's latched shut. I can see police lights outside.",
        open: "It's latched from the outside. No way to open it.",
        close: "It's already shut.",
        use: "I can't do anything with the window.",
        push: "It won't open.",
      },
    },
    {
      id: "lights",
      name: "Lights",
      position: { x: 50, y: 10 },
      width: 54,
      height: 14,
      interactions: {
        look: "These hanging light fixtures looked like they were tampered with",
        use: "I can't use those.",
      },
    },
    {
      id: "wine-glasses",
      name: "Wine Glasses",
      position: { x: 26, y: 73 },
      width: 8,
      height: 10,
      interactions: {
        look: "A tray of half-finished wine glasses. One of them has a strange residue... Was someone drugged?",
        pickup: () => {
          if (!gameState.flags.glassesTaken) {
            onAddToInventory({ id: "wine-glass", name: "Suspicious Wine Glass", image: wineGlassInventoryImage });
            setFlag("glassesTaken", true);
            return "I carefully pick up the glass with the strange residue. This could be evidence.";
          }
          return "I already took the suspicious glass.";
        },
        use: "I should pick one up first to examine it.",
      },
    },
    {
      id: "charcuterie-board",
      name: "Charcuterie Board",
      position: { x: 32, y: 73 },
      width: 8,
      height: 10,
      interactions: {
        look: "A fancy charcuterie board with gourmet meat sticks. Looks like someone went all out for this party.",
        pickup: () => {
          if (!gameState.flags.meatStickTaken) {
            onAddToInventory({ id: "meat-stick", name: "Meat Stick", image: meatStickImage });
            setFlag("meatStickTaken", true);
            return "I grab a meat stick from the board. The board stays on the table.";
          }
          return "I already took a meat stick from the board.";
        },
        use: "I should pick something up from it first.",
      },
    },
    {
      id: "table",
      name: "Party Table",
      position: { x: 28, y: 85 },
      width: 14,
      height: 8,
      interactions: {
        look: "A festive party table. Most of the food has been knocked over in the commotion.",
        pickup: "I can't carry the whole table!",
        use: "I should look for something specific to use here.",
      },
    },
    {
      id: "dagger",
      name: "Bloody Dagger",
      position: { x: 90, y: 90 },
      width: 6,
      height: 8,
      interactions: {
        look: "An ornate dagger covered in blood. This must be the murder weapon!",
        pickup: () => {
          if (!gameState.flags.daggerTaken) {
            onAddToInventory({ id: "dagger", name: "Bloody Dagger", image: daggerImage });
            setFlag("daggerTaken", true);
            return "I carefully pick up the dagger, making sure not to smudge any fingerprints.";
          }
          return "I already have the dagger.";
        },
        use: "I should pick it up first.",
      },
    },
    {
      id: "los-cabos-body",
      name: "Los Cabos",
      position: { x: 80, y: 85 },
      width: 14,
      height: 12,
      interactions: {
        look: "Poor Los Cabos... He was stabbed in the back. Who could have done this?",
        talk: "He's... not going to answer.",
        pickup: "I can't move the body. That would contaminate the crime scene.",
        use: "I should examine him more carefully instead.",
        use_with_dagger: "The dagger matches the wound perfectly. This is definitely the murder weapon.",
        use_with_wine_glass: "I hold the glass near the body... no obvious connection.",
      },
    },
    {
      id: "lady",
      name: "Lady Fantastique",
      position: { x: 15, y: 82 },
      width: 10,
      height: 32,
      interactions: {
        look: "Lady Fantastique looks shaken but composed. She was close to Los Cabos...",
        talk: "__DIALOG__lady",
        pickup: "I can't pick up a person!",
        use: "I should talk to her instead.",
        use_with_dagger: '"Is that the... oh God, keep it away from me!" Lady Fantastique recoils in horror.',
        use_with_wine_glass: '"That\'s my glass! I mean... it looks like mine. So what?"',
      },
    },
    {
      id: "el-fuego",
      name: "Duke Extreme",
      position: { x: 42, y: 75 },
      width: 10,
      height: 32,
      interactions: {
        look: "Duke Extreme is sweating nervously. Is it the heat, or something else?",
        talk: "__DIALOG__el-fuego",
        pickup: "That's not how you treat people.",
        use: "I should talk to him instead.",
        use_with_dagger: '"Where did you... I\'ve never seen that before! I swear!" Duke Extreme backs away nervously.',
        use_with_wine_glass: '"That\'s just wine, amigo. Nothing special about it."',
      },
    },
    {
      id: "carl",
      name: "Carl",
      position: { x: 57, y: 75 },
      width: 10,
      height: 32,
      interactions: {
        look: "Carl seems unusually calm for someone who just witnessed a murder.",
        talk: "__DIALOG__carl",
        pickup: "I don't think Carl would appreciate that.",
        use: "I should talk to him instead.",
        use_with_dagger: 'Carl examines the dagger coolly. "Interesting craftsmanship. Looks expensive."',
        use_with_wine_glass: '"Hmm, that residue... Could be a sedative. Someone was planning ahead."',
      },
    },
  ];

  // Filter out collected items
  const activeHotspots = hotspots.filter((h) => {
    if (h.id === "dagger" && gameState.flags.daggerTaken) return false;
    if (h.id === "wine-glasses" && gameState.flags.glassesTaken) return false;
    return true;
  });

  return (
    <div ref={sceneRef} className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${breakroomBackground})` }} />

      {/* Table */}
      <img
        src={tableImage}
        alt="Party Table"
        className="absolute z-10 pointer-events-none pixelated object-contain"
        style={{ left: "20%", top: "56%", width: "25%", height: "42%" }}
      />
      {/* Wine glasses on table */}
      <img
        src={wineGlassesImage}
        alt="Wine Glasses"
        className="absolute z-10 pointer-events-none pixelated object-contain"
        style={{ left: "23%", top: "60%", width: "9%", height: "15%" }}
      />
      {/* Charcuterie board on table */}
      <img
        src={charcuterieBoardImage}
        alt="Charcuterie Board"
        className="absolute z-10 pointer-events-none pixelated object-contain"
        style={{ left: "31%", top: "52%", width: "10%", height: "18%" }}
      />

      {/* Los Cabos - Dead on the floor */}
      <img
        src={losCabosDeadImage}
        alt="Los Cabos"
        className="absolute z-10 pointer-events-none pixelated object-contain"
        style={{
          right: "15%",
          bottom: "-6%",
          height: "55%",
          width: "auto",
          transform: "rotate(-90deg)",
          filter: "grayscale(0.3) brightness(0.7) drop-shadow(2px 4px 6px rgba(0,0,0,0.8))",
          opacity: 0.95,
        }}
      />

      {/* Blood pool effect */}
      <div
        className="absolute opacity-60"
        style={{
          right: "12%",
          bottom: "2%",
          width: "20%",
          height: "12%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, hsl(0, 80%, 25%) 0%, transparent 70%)",
        }}
      />

      {/* Dagger near the body */}
      {!gameState.flags.daggerTaken && (
        <img
          src={daggerImage}
          alt="Bloody Dagger"
          className="absolute z-[15] pointer-events-none pixelated object-contain"
          style={{
            right: "8%",
            bottom: "5%",
            width: "6%",
            height: "13%",
            transform: "rotate(45deg)",
            filter: "drop-shadow(0 0 8px rgba(180,0,0,0.6))",
          }}
        />
      )}

      {/* Lady Fantastique */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{ left: "8%", bottom: "10%", width: "15%", height: "70%" }}
      >
        <img src={ladyImage} alt="Lady Fantastique" className="w-full h-full pixelated object-contain" />
        {shockBubbles["Lady Fantastique"] && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-3 py-2 rounded-lg max-w-[150px] text-center shadow-lg animate-[fade-in_0.3s_ease-out]">
            {shockBubbles["Lady Fantastique"]}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
          </div>
        )}
      </div>

      {/* Duke Extreme */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{ left: "35%", top: "42%", width: "12%", height: "55%" }}
      >
        <img
          src={elFuegoPose === 0 ? elFuegoImage : elFuegoImage2}
          alt="Duke Extreme"
          className="w-full h-full pixelated object-contain transition-opacity duration-300"
        />
        {shockBubbles["Duke Extreme"] && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-3 py-2 rounded-lg max-w-[150px] text-center shadow-lg animate-[fade-in_0.3s_ease-out]">
            {shockBubbles["Duke Extreme"]}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
          </div>
        )}
      </div>

      {/* Carl */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{ left: "50%", top: "42%", width: "12%", height: "55%" }}
      >
        <img src={carlImage} alt="Carl" className="w-full h-full pixelated object-contain" />
        {shockBubbles["Carl"] && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-3 py-2 rounded-lg max-w-[150px] text-center shadow-lg animate-[fade-in_0.3s_ease-out]">
            {shockBubbles["Carl"]}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
          </div>
        )}
      </div>

      {/* Invisible hotspots for interactions */}
      {activeHotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          className={`absolute z-30 cursor-pointer transition-colors rounded ${debugMode ? "border-2 border-green-400/70 bg-green-400/15" : "hover:bg-white/10"}`}
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
