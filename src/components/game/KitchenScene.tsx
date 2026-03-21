import { useState, useEffect } from "react";
import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import kitchenBackground from "@/assets/backgrounds/kitchen.png";
import chefAllegroImage from "@/assets/characters/chef-allegro.png";
import chefAllegroBlinkImage from "@/assets/characters/chef-allegro-blink.png";
import sousChefSallyImage from "@/assets/characters/sous-chef-sally.png";
import sousChefSallyAngryImage from "@/assets/characters/sous-chef-sally-angry.png";

interface KitchenSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  debugMode?: boolean;
}

export function KitchenScene({
  gameState,
  onHotspotHover,
  onHotspotClick,
  onChangeRoom,
  onEmptyClick,
  debugMode,
}: KitchenSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);

  // Chef Allegro blink animation
  const [chefBlinking, setChefBlinking] = useState(false);
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2000;
      return setTimeout(() => {
        setChefBlinking(true);
        setTimeout(() => setChefBlinking(false), 300);
        timerRef = scheduleBlink();
      }, delay);
    };
    let timerRef = scheduleBlink();
    return () => clearTimeout(timerRef);
  }, []);

  const sallyAngry = gameState.flags.sallyAngry === true;

  const hotspots: SimpleHotspot[] = [
    {
      id: "chalkboard",
      name: "Chalkboard",
      position: { x: 18, y: 40 },
      width: 22,
      height: 35,
      interactions: {
        look: '"Stock Pot Specifications... Main Stews... Daily Specials." Someone was planning quite the menu for the party.',
        use: "I don't need to write anything on it.",
      },
    },
    {
      id: "stove",
      name: "Stove",
      position: { x: 50, y: 55 },
      width: 18,
      height: 30,
      interactions: {
        look: "A large commercial stove. It's still warm — someone was cooking recently.",
        open: "The oven is empty. Whatever was in there has already been served.",
        use: "I'm not here to cook.",
        push: "It's bolted to the floor.",
      },
    },
    {
      id: "knife-block",
      name: "Knife Block",
      position: { x: 32, y: 52 },
      width: 8,
      height: 8,
      interactions: {
        look: "A wooden knife block. Wait — one of the slots is empty. A knife is missing.",
        pickup: "Better not touch the knives. This is a crime scene after all.",
        use: "I shouldn't mess with potential evidence.",
      },
    },
    {
      id: "cutting-board",
      name: "Cutting Board with Vegetables",
      position: { x: 15, y: 62 },
      width: 14,
      height: 12,
      interactions: {
        look: "Carrots, onions, peppers... Someone was in the middle of prep work when things went south.",
        pickup: "I don't need raw vegetables right now.",
      },
    },
    {
      id: "shelves",
      name: "Kitchen Shelves",
      position: { x: 85, y: 45 },
      width: 16,
      height: 40,
      interactions: {
        look: "Copper pots, plates, and containers. This kitchen is well-stocked.",
        use: "Nothing useful on the shelves.",
      },
    },
    {
      id: "catering-trays",
      name: "Catering Trays",
      position: { x: 65, y: 65 },
      width: 12,
      height: 18,
      interactions: {
        look: "Trays of hors d'oeuvres. Some were served at the party, others never made it out.",
        pickup: "I'm not hungry. There's a murder to solve.",
      },
    },
    {
      id: "sink",
      name: "Sink",
      position: { x: 82, y: 72 },
      width: 10,
      height: 12,
      interactions: {
        look: "A pile of dirty dishes. The sink has a faint reddish residue... wine? Or something else?",
        use: "I turn on the faucet. Just water. The red stuff was probably wine... probably.",
      },
    },
    {
      id: "chef-allegro",
      name: "Chef Allegro",
      position: { x: 38, y: 70 },
      width: 10,
      height: 32,
      interactions: {
        look: "Chef Allegro, the head chef. He's got a permanent smile, but his eyes look worried.",
        talk: "__DIALOG__chef-allegro",
        pickup: "I can't pick up a chef!",
        use: "I should talk to him instead.",
      },
    },
    {
      id: "sous-chef-sally",
      name: "Sous Chef Sally",
      position: { x: 62, y: 70 },
      width: 10,
      height: 32,
      interactions: {
        look: "Sous Chef Sally. She looks tense, like she's hiding something.",
        talk: "__DIALOG__sous-chef-sally",
        pickup: "That's not how you treat kitchen staff.",
        use: "I should talk to her instead.",
      },
    },
    {
      id: "back-to-hallway-kitchen",
      name: "Hallway",
      position: { x: 50, y: 95 },
      width: 60,
      height: 10,
      interactions: {
        look: "__NAVIGATE__hallway-kitchen",
        open: "__NAVIGATE__hallway-kitchen",
        use: "__NAVIGATE__hallway-kitchen",
      },
    },
  ];

  return (
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${kitchenBackground})` }} />

      {/* Chef Allegro */}
      <img
        src={chefBlinking ? chefAllegroBlinkImage : chefAllegroImage}
        alt="Chef Allegro"
        className="absolute z-20 pointer-events-none pixelated object-contain transition-opacity duration-150"
        style={{ left: "30%", top: "22%", width: "16%", height: "68%" }}
      />

      {/* Sous Chef Sally */}
      <img
        src={sallyAngry ? sousChefSallyAngryImage : sousChefSallyImage}
        alt="Sous Chef Sally"
        className="absolute z-20 pointer-events-none pixelated object-contain transition-opacity duration-300"
        style={{ right: "30%", top: "22%", width: "16%", height: "68%" }}
      />

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
