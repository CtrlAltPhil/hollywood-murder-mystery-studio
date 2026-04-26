import { useState, useEffect } from "react";
import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import kitchenBackground from "@/assets/backgrounds/kitchen.png";
import chefAllegroImage from "@/assets/characters/chef-allegro.png";
import chefAllegroBlinkImage from "@/assets/characters/chef-allegro-blink.png";
import sousChefSallyImage from "@/assets/characters/sous-chef-sally.png";
import sousChefSallyAngryImage from "@/assets/characters/sous-chef-sally-angry.png";
import chefAllegroDefensiveImage from "@/assets/characters/chef-allegro-defensive.png";

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
      position: { x: 13, y: 40 },
      width: 22,
      height: 30,
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
      position: { x: 8, y: 63 },
      width: 16,
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
        look: "A pile of dirty dishes from the party. Someone clearly didn't get to finish cleaning up tonight.",
        use: "I turn on the faucet. Just water. Not my job to do dishes.",
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
        use_with_wine_glass:
          '"A wine glass? Sì, sì, I served plenty of those tonight. Beautiful crystal, no? Was there something else, detective?"',
        use_with_dagger:
          "\"That's not from MY kitchen! My knives are all accounted for... well, except one. But that's not it!\" He looks defensive.",
        use_with_meat_stick: '"You\'re showing me my own food? I know what a meat stick looks like, detective."',
        use_with_money_bag: '"Cash? I don\'t deal in cash. I deal in flavors. You should ask Duke Extreme about that."',
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
        use_with_wine_glass:
          '"I poured the wine, yes. But I didn\'t put anything IN it! ...Why are you looking at me like that?"',
        use_with_dagger:
          "\"I've never seen that before! That's NOT one of our kitchen knives.\" Sally backs away nervously.",
        use_with_meat_stick: "\"That's Chef's specialty. I just do the prep work.\"",
        use_with_money_bag:
          '"Money? I barely make enough to pay rent. Ask someone who actually gets paid around here."',
      },
    },
    {
      id: "back-to-hallway-kitchen",
      name: "Hallway",
      position: { x: 50, y: 95 },
      width: 30,
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
      <div
        className="animate-breathing"
        style={{
          position: "absolute",
          left: "30%",
          top: "22%",
          width: "16%",
          height: "68%",
          transformOrigin: "bottom center",
        }}
      >
        <img
          src={
            gameState.flags.chefDefensive
              ? chefAllegroDefensiveImage
              : chefBlinking
                ? chefAllegroBlinkImage
                : chefAllegroImage
          }
          alt="Chef Allegro"
          className="z-20 pointer-events-none pixelated object-contain w-full h-full transition-all duration-300"
        />
      </div>

      {/* Sous Chef Sally */}
      <div
        className="animate-fidget"
        style={{
          position: "absolute",
          right: "30%",
          top: "22%",
          width: "16%",
          height: "68%",
          transformOrigin: "bottom center",
        }}
      >
        <img
          src={sallyAngry ? sousChefSallyAngryImage : sousChefSallyImage}
          alt="Sous Chef Sally"
          className="z-20 pointer-events-none pixelated object-contain w-full h-full transition-opacity duration-300"
        />
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▼ Back to Hallway ▼
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
            handleSceneHotspotClick(hotspot, gameState.selectedVerb, onChangeRoom, onHotspotClick);
          }}
        />
      ))}
    </div>
  );
}
