import { useState, useEffect } from "react";
import { GameState, Verb } from "@/types/game";
import kitchenBackground from "@/assets/backgrounds/kitchen.png";
import chefAllegroImage from "@/assets/characters/chef-allegro.png";
import chefAllegroBlinkImage from "@/assets/characters/chef-allegro-blink.png";
import sousChefSallyImage from "@/assets/characters/sous-chef-sally.png";
import sousChefSallyAngryImage from "@/assets/characters/sous-chef-sally-angry.png";
import { SimpleHotspot } from "./GameScene";

interface KitchenSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  debugMode?: boolean;
}

function getCursorClass(verb: Verb | null): string {
  if (!verb) return "cursor-default";
  const cursorMap: Record<Verb, string> = {
    look: "cursor-look",
    pickup: "cursor-pickup",
    use: "cursor-use",
    open: "cursor-open",
    close: "cursor-close",
    talk: "cursor-talk",
    push: "cursor-push",
    pull: "cursor-pull",
  };
  return cursorMap[verb] || "cursor-default";
}

export function KitchenScene({
  gameState,
  onHotspotHover,
  onHotspotClick,
  onChangeRoom,
  debugMode,
}: KitchenSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);

  // Chef Allegro blink animation — slow blink every 3-5 seconds
  const [chefBlinking, setChefBlinking] = useState(false);
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2000; // 3-5 seconds between blinks
      return setTimeout(() => {
        setChefBlinking(true);
        // Blink lasts 300ms
        setTimeout(() => {
          setChefBlinking(false);
        }, 300);
        timerRef = scheduleBlink();
      }, delay);
    };
    let timerRef = scheduleBlink();
    return () => clearTimeout(timerRef);
  }, []);

  // Sally angry state — triggered via flag, auto-reverts after 3 seconds
  const sallyAngry = gameState.flags.sallyAngry === true;
  useEffect(() => {
    if (!sallyAngry) return;
    // We don't auto-revert here — the dialog system handles setting the flag
  }, [sallyAngry]);

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
      position: { x: 40, y: 52 },
      width: 8,
      height: 12,
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
    // Chef Allegro hotspot — left side
    {
      id: "chef-allegro",
      name: "Chef Allegro",
      position: { x: 20, y: 82 },
      width: 10,
      height: 32,
      interactions: {
        look: "Chef Allegro, the head chef. He's got a permanent smile, but his eyes look worried.",
        talk: "__DIALOG__chef-allegro",
        pickup: "I can't pick up a chef!",
        use: "I should talk to him instead.",
      },
    },
    // Sous Chef Sally hotspot — right side
    {
      id: "sous-chef-sally",
      name: "Sous Chef Sally",
      position: { x: 80, y: 82 },
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

  const handleHotspotClick = (hotspot: SimpleHotspot) => {
    const verb = gameState.selectedVerb;
    if (verb) {
      const interaction = hotspot.interactions[verb];
      if (typeof interaction === "string" && interaction.startsWith("__NAVIGATE__")) {
        const targetRoom = interaction.replace("__NAVIGATE__", "");
        onChangeRoom(targetRoom);
        return;
      }
    }
    if (
      !verb &&
      hotspot.interactions.open &&
      typeof hotspot.interactions.open === "string" &&
      (hotspot.interactions.open as string).startsWith("__NAVIGATE__")
    ) {
      onChangeRoom((hotspot.interactions.open as string).replace("__NAVIGATE__", ""));
      return;
    }
    onHotspotClick(hotspot);
  };

  return (
    <div className={`relative w-full h-full ${cursorClass}`}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${kitchenBackground})` }} />

      {/* Chef Allegro — left station */}
      <div className="absolute bottom-[3%] left-[14%] z-20 pointer-events-none">
        <img
          src={chefBlinking ? chefAllegroBlinkImage : chefAllegroImage}
          alt="Chef Allegro"
          className="h-60 pixelated object-contain transition-opacity duration-150"
        />
      </div>

      {/* Sous Chef Sally — right station */}
      <div className="absolute bottom-[10%] right-[30%] z-20 pointer-events-none">
        <img
          src={sallyAngry ? sousChefSallyAngryImage : sousChefSallyImage}
          alt="Sous Chef Sally"
          className="h-72 pixelated object-contain transition-opacity duration-300"
        />
      </div>

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
          onClick={() => handleHotspotClick(hotspot)}
        />
      ))}
    </div>
  );
}
