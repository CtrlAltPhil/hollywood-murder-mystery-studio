import { useRef, useState, useEffect } from 'react';
import { GameState, Verb } from '@/types/game';

// Import assets
import breakroomBackground from '@/assets/backgrounds/breakroom.jpg';
import carlImage from '@/assets/characters/carl.png';
import elFuegoImage from '@/assets/characters/el-fuego.png';
import elFuegoImage2 from '@/assets/characters/el-fuego-2.png';
import ladyImage from '@/assets/characters/lady.png';
import losCabosImage from '@/assets/characters/los-cabos.png';
import tableImage from '@/assets/props/table.png';
import wineGlassesImage from '@/assets/props/wine-glasses.png';
import daggerImage from '@/assets/props/dagger.png';

interface GameSceneProps {
  gameState: GameState;
  setFlag: (key: string, value: boolean) => void;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onAddToInventory: (item: { id: string; name: string; image: string }) => void;
}

// Simplified hotspot for the scene
export interface SimpleHotspot {
  id: string;
  name: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  interactions: Record<string, string | (() => string | void)>;
}

// Cursor class mapping based on selected verb
function getCursorClass(verb: Verb | null): string {
  if (!verb) return 'cursor-default';
  
  const cursorMap: Record<Verb, string> = {
    look: 'cursor-look',
    pickup: 'cursor-pickup',
    use: 'cursor-use',
    open: 'cursor-open',
    close: 'cursor-close',
    talk: 'cursor-talk',
    push: 'cursor-push',
    pull: 'cursor-pull',
  };
  
  return cursorMap[verb] || 'cursor-default';
}

export function GameScene({ 
  gameState,
  setFlag,
  onHotspotHover,
  onHotspotClick,
  onAddToInventory,
}: GameSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cursorClass = getCursorClass(gameState.selectedVerb);

  // Define hotspots — positions must match the visual elements exactly
  // Visual chars: Lady left-[8%], El Fuego left-[35%], Carl left-[55%], all bottom-[3%] h-44
  // Table: left-[22%] bottom-[5%] h-28, Los Cabos: right-[15%] bottom-[1%]
  const hotspots: SimpleHotspot[] = [
    {
      id: 'door',
      name: 'Door',
      position: { x: 4, y: 65 },
      width: 7,
      height: 50,
      interactions: {
        look: 'A sturdy wooden door. It\'s locked from the outside — no one is leaving until this is solved.',
        open: 'It\'s locked. Someone must have called the police already.',
        close: 'It\'s already closed.',
        use: 'The door is locked tight.',
        push: 'It won\'t budge.',
        pull: 'It won\'t budge.',
      },
    },
    {
      id: 'window',
      name: 'Window',
      position: { x: 93, y: 55 },
      width: 8,
      height: 45,
      interactions: {
        look: 'A tall window overlooking the studio lot. It\'s latched shut. I can see police lights outside.',
        open: 'It\'s latched from the outside. No way to open it.',
        close: 'It\'s already shut.',
        use: 'I can\'t do anything with the window.',
        push: 'It won\'t open.',
      },
    },
    {
      id: 'wine-glasses',
      name: 'Wine Glasses',
      position: { x: 28, y: 80 },
      width: 10,
      height: 10,
      interactions: {
        look: 'A tray of half-finished wine glasses. One of them has a strange residue... Was someone drugged?',
        pickup: () => {
          if (!gameState.flags.glassesTaken) {
            onAddToInventory({ id: 'wine-glass', name: 'Suspicious Wine Glass', image: wineGlassesImage });
            setFlag('glassesTaken', true);
            return 'I carefully pick up the glass with the strange residue. This could be evidence.';
          }
          return 'I already took the suspicious glass.';
        },
        use: 'I should pick one up first to examine it.',
      },
    },
    {
      id: 'table',
      name: 'Party Table',
      position: { x: 28, y: 90 },
      width: 14,
      height: 12,
      interactions: {
        look: 'A festive party table. Most of the food has been knocked over in the commotion.',
        pickup: "I can't carry the whole table!",
        use: 'I should look for something specific to use here.',
      },
    },
    {
      id: 'dagger',
      name: 'Bloody Dagger',
      position: { x: 88, y: 93 },
      width: 6,
      height: 8,
      interactions: {
        look: 'An ornate dagger covered in blood. This must be the murder weapon!',
        pickup: () => {
          if (!gameState.flags.daggerTaken) {
            onAddToInventory({ id: 'dagger', name: 'Bloody Dagger', image: daggerImage });
            setFlag('daggerTaken', true);
            return 'I carefully pick up the dagger, making sure not to smudge any fingerprints.';
          }
          return 'I already have the dagger.';
        },
        use: 'I should pick it up first.',
      },
    },
    {
      id: 'los-cabos-body',
      name: 'Los Cabos',
      position: { x: 77, y: 92 },
      width: 14,
      height: 12,
      interactions: {
        look: 'Poor Los Cabos... He was stabbed in the back. Who could have done this?',
        talk: "He's... not going to answer.",
        pickup: "I can't move the body. That would contaminate the crime scene.",
        use: 'I should examine him more carefully instead.',
        use_with_dagger: 'The dagger matches the wound perfectly. This is definitely the murder weapon.',
        use_with_wine_glass: 'I hold the glass near the body... no obvious connection.',
      },
    },
    {
      id: 'lady',
      name: 'Lady',
      position: { x: 13, y: 72 },
      width: 10,
      height: 42,
      interactions: {
        look: 'Lady looks shaken but composed. She was close to Los Cabos...',
        talk: '__DIALOG__lady',
        pickup: "I can't pick up a person!",
        use: 'I should talk to her instead.',
        use_with_dagger: '"Is that the... oh God, keep it away from me!" Lady recoils in horror.',
        use_with_wine_glass: '"That\'s my glass! I mean... it looks like mine. So what?"',
      },
    },
    {
      id: 'el-fuego',
      name: 'El Fuego',
      position: { x: 40, y: 72 },
      width: 10,
      height: 42,
      interactions: {
        look: 'El Fuego is sweating nervously. Is it the heat, or something else?',
        talk: '__DIALOG__el-fuego',
        pickup: "That's not how you treat people.",
        use: 'I should talk to him instead.',
        use_with_dagger: '"Where did you... I\'ve never seen that before! I swear!" El Fuego backs away nervously.',
        use_with_wine_glass: '"That\'s just wine, amigo. Nothing special about it."',
      },
    },
    {
      id: 'carl',
      name: 'Carl',
      position: { x: 60, y: 72 },
      width: 10,
      height: 42,
      interactions: {
        look: 'Carl seems unusually calm for someone who just witnessed a murder.',
        talk: '__DIALOG__carl',
        pickup: "I don't think Carl would appreciate that.",
        use: 'I should talk to him instead.',
        use_with_dagger: 'Carl examines the dagger coolly. "Interesting craftsmanship. Looks expensive."',
        use_with_wine_glass: '"Hmm, that residue... Could be a sedative. Someone was planning ahead."',
      },
    },
  ];

  // Filter out collected items
  const activeHotspots = hotspots.filter(h => {
    if (h.id === 'dagger' && gameState.flags.daggerTaken) return false;
    if (h.id === 'wine-glasses' && gameState.flags.glassesTaken) return false;
    return true;
  });

  return (
    <div 
      ref={sceneRef}
      className={`relative w-full h-full ${cursorClass}`}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${breakroomBackground})` }}
      />




      {/* Table with props */}
      <div className="absolute bottom-[5%] left-[22%] z-10">
        <img src={tableImage} alt="Party Table" className="h-28 pixelated object-contain" />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <img src={wineGlassesImage} alt="Wine Glasses" className="h-14 pixelated object-contain" />
        </div>
      </div>

      {/* Los Cabos - Dead on the floor — lowered below baseboard */}
      <div className="absolute bottom-[1%] right-[15%] transform -rotate-90 z-10">
        <img 
          src={losCabosImage} 
          alt="Los Cabos" 
          className="h-36 pixelated object-contain opacity-90"
          style={{ filter: 'grayscale(0.3) brightness(0.7) drop-shadow(2px 4px 6px rgba(0,0,0,0.8))' }}
        />
      </div>
      
      {/* Blood pool effect */}
      <div 
        className="absolute bottom-[2%] right-[12%] w-36 h-14 rounded-full opacity-60"
        style={{ background: 'radial-gradient(ellipse, hsl(0, 80%, 25%) 0%, transparent 70%)' }}
      />

      {/* Dagger near the body */}
      {!gameState.flags.daggerTaken && (
        <div className="absolute bottom-[5%] right-[8%] z-[15]">
          <img 
            src={daggerImage} 
            alt="Bloody Dagger" 
            className="h-12 pixelated object-contain transform rotate-45"
            style={{ filter: 'drop-shadow(0 0 8px rgba(180,0,0,0.6))' }}
          />
        </div>
      )}

      {/* Surviving characters — same h-44 and bottom-[3%] as IntroSequence */}
      <div className="absolute bottom-[3%] left-[55%] z-20">
        <img src={carlImage} alt="Carl" className="h-44 pixelated object-contain" />
      </div>
      
      <div className="absolute bottom-[3%] left-[8%] z-20">
        <img src={ladyImage} alt="Lady" className="h-44 pixelated object-contain" />
      </div>
      
      <div className="absolute bottom-[3%] left-[35%] z-20">
        <img src={elFuegoImage} alt="El Fuego" className="h-44 pixelated object-contain" />
      </div>

      {/* Invisible hotspots for interactions */}
      {activeHotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          className="absolute cursor-pointer hover:bg-white/10 transition-colors rounded"
          style={{
            left: `${hotspot.position.x - hotspot.width / 2}%`,
            top: `${hotspot.position.y - hotspot.height / 2}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
          }}
          onMouseEnter={() => onHotspotHover(hotspot.name)}
          onMouseLeave={() => onHotspotHover('')}
          onClick={() => onHotspotClick(hotspot)}
        />
      ))}
    </div>
  );
}
