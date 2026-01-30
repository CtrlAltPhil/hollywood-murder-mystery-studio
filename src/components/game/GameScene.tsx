import { useRef } from 'react';
import { GameState, Verb } from '@/types/game';

// Import assets
import breakroomBackground from '@/assets/backgrounds/breakroom.jpg';
import carlImage from '@/assets/characters/carl.jpg';
import elFuegoImage from '@/assets/characters/el-fuego.jpg';
import ladyImage from '@/assets/characters/lady.jpg';
import losCabosImage from '@/assets/characters/los-cabos.jpg';
import tableImage from '@/assets/props/table.jpg';
import wineGlassesImage from '@/assets/props/wine-glasses.jpg';
import daggerImage from '@/assets/items/dagger.jpg';

interface GameSceneProps {
  gameState: GameState;
  setFlag: (key: string, value: boolean) => void;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onAddToInventory: (item: { id: string; name: string; image: string }) => void;
}

// Simplified hotspot for the scene
interface SimpleHotspot {
  id: string;
  name: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  interactions: Partial<Record<Verb, string | (() => string | void)>>;
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

  // Define hotspots for interactive elements
  const hotspots: SimpleHotspot[] = [
    {
      id: 'table',
      name: 'Party Table',
      position: { x: 35, y: 85 },
      width: 25,
      height: 20,
      interactions: {
        look: 'A festive party table covered with snacks and drinks.',
        pickup: "I can't carry the whole table!",
        use: 'I should look for something specific to use here.',
      },
    },
    {
      id: 'dagger',
      name: 'Bloody Dagger',
      position: { x: 89, y: 91 },
      width: 8,
      height: 8,
      interactions: {
        look: 'A ornate dagger covered in blood. This must be the murder weapon!',
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
      position: { x: 76, y: 85 },
      width: 18,
      height: 15,
      interactions: {
        look: 'Poor Los Cabos... He was stabbed in the back. Who could have done this?',
        talk: "He's... not going to answer.",
        pickup: "I can't move the body. That would contaminate the crime scene.",
        use: 'I should examine him more carefully instead.',
      },
    },
    {
      id: 'lady',
      name: 'Lady',
      position: { x: 14, y: 80 },
      width: 12,
      height: 35,
      interactions: {
        look: 'Lady looks shaken but composed. She was close to Los Cabos...',
        talk: '"I... I can\'t believe he\'s gone. We were just talking about the party plans..."',
        pickup: "I can't pick up a person!",
        use: 'I should talk to her instead.',
      },
    },
    {
      id: 'el-fuego',
      name: 'El Fuego',
      position: { x: 41, y: 80 },
      width: 12,
      height: 35,
      interactions: {
        look: 'El Fuego is sweating nervously. Is it the heat, or something else?',
        talk: '"This is terrible! I was in the kitchen getting more drinks when it happened!"',
        pickup: "That's not how you treat people.",
        use: 'I should talk to him instead.',
      },
    },
    {
      id: 'carl',
      name: 'Carl',
      position: { x: 61, y: 80 },
      width: 12,
      height: 35,
      interactions: {
        look: 'Carl seems unusually calm for someone who just witnessed a murder.',
        talk: '"Hmm, quite unfortunate. I was admiring the decorations when the lights went out."',
        pickup: "I don't think Carl would appreciate that.",
        use: 'I should talk to him instead.',
      },
    },
  ];

  // Filter out dagger if already taken
  const activeHotspots = hotspots.filter(h => {
    if (h.id === 'dagger' && gameState.flags.daggerTaken) return false;
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

      {/* Party Decorations */}
      <div className="absolute top-[5%] left-[20%] text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎈</div>
      <div className="absolute top-[8%] left-[40%] text-4xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎈</div>
      <div className="absolute top-[3%] left-[60%] text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>🎈</div>
      <div className="absolute top-[6%] left-[80%] text-4xl animate-bounce" style={{ animationDelay: '0.9s' }}>🎈</div>
      
      {/* Streamers */}
      <div className="absolute top-0 left-[30%] w-1 h-[15%] bg-gradient-to-b from-pink-500 to-transparent opacity-70" />
      <div className="absolute top-0 left-[50%] w-1 h-[12%] bg-gradient-to-b from-yellow-400 to-transparent opacity-70" />
      <div className="absolute top-0 left-[70%] w-1 h-[18%] bg-gradient-to-b from-blue-400 to-transparent opacity-70" />
      
      {/* Party Banner */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 bg-red-600 px-4 py-1 text-white font-bold text-sm rotate-[-2deg] shadow-lg">
        🎉 OFFICE PARTY 🎉
      </div>

      {/* Table with props */}
      <div className="absolute bottom-[5%] left-[22%] w-[25%] h-[20%]">
        <img src={tableImage} alt="Party Table" className="w-full h-full object-contain" />
        <img 
          src={wineGlassesImage} 
          alt="Wine Glasses" 
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[40%] h-[40%] object-contain"
        />
      </div>

      {/* Los Cabos - Dead on the floor */}
      <div className="absolute bottom-[3%] right-[15%] w-[18%] h-[25%] rotate-[-90deg]">
        <img src={losCabosImage} alt="Los Cabos" className="w-full h-full object-contain opacity-80" />
      </div>
      
      {/* Blood pool effect */}
      <div className="absolute bottom-[2%] right-[12%] w-[12%] h-[8%] bg-red-900/60 rounded-full blur-sm" />

      {/* Dagger near the body */}
      {!gameState.flags.daggerTaken && (
        <div className="absolute bottom-[5%] right-[8%] w-[6%] h-[8%]">
          <img src={daggerImage} alt="Bloody Dagger" className="w-full h-full object-contain rotate-45" />
        </div>
      )}

      {/* Surviving characters - standing in their original positions */}
      <div className="absolute bottom-[3%] left-[55%] w-[12%] h-[35%]">
        <img src={carlImage} alt="Carl" className="w-full h-full object-contain" />
      </div>
      
      <div className="absolute bottom-[3%] left-[8%] w-[12%] h-[35%]">
        <img src={ladyImage} alt="Lady" className="w-full h-full object-contain" />
      </div>
      
      <div className="absolute bottom-[3%] left-[35%] w-[12%] h-[35%]">
        <img src={elFuegoImage} alt="El Fuego" className="w-full h-full object-contain" />
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
