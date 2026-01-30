import { useState, useRef } from 'react';
import { GameState, Hotspot, InventoryItem } from '@/types/game';
import breakroomBackground from '@/assets/backgrounds/breakroom.jpg';
import elFuegoSprite from '@/assets/characters/el-fuego.jpg';
import ladySprite from '@/assets/characters/lady.jpg';
import losCabosSprite from '@/assets/characters/los-cabos.jpg';
import carlSprite from '@/assets/characters/carl.jpg';
import daggerImage from '@/assets/items/dagger.jpg';
import wineGlassesImage from '@/assets/props/wine-glasses.jpg';
import tableImage from '@/assets/props/table.jpg';

interface GameSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: Hotspot) => void;
  onAddToInventory: (item: InventoryItem) => void;
}

// Demo hotspots for the breakroom
const DEMO_HOTSPOTS: Hotspot[] = [
  {
    id: 'dagger',
    name: 'Bloody Dagger',
    position: { x: 55, y: 75 },
    width: 8,
    height: 10,
    walkToPosition: { x: 52, y: 80 },
    interactions: {
      look: 'A sharp dagger covered in fresh blood. The murder weapon!',
      pickup: 'You carefully pick up the dagger as evidence.',
    },
    isActive: true,
  },
  {
    id: 'wine-glasses',
    name: 'Wine Glasses',
    position: { x: 25, y: 60 },
    width: 10,
    height: 12,
    walkToPosition: { x: 28, y: 75 },
    interactions: {
      look: 'Several wine glasses, some still half-full. One has a strange residue...',
    },
    isActive: true,
  },
  {
    id: 'el-fuego',
    name: 'El Fuego',
    position: { x: 70, y: 55 },
    width: 12,
    height: 25,
    walkToPosition: { x: 65, y: 80 },
    interactions: {
      look: 'El Fuego looks nervous. They keep glancing at the body.',
      talk: 'El Fuego: "I... I didn\'t see anything! I was getting a drink when the lights went out!"',
    },
    isActive: true,
  },
  {
    id: 'body',
    name: 'The Victim',
    position: { x: 40, y: 72 },
    width: 15,
    height: 12,
    walkToPosition: { x: 38, y: 85 },
    interactions: {
      look: 'The victim lies motionless on the floor. A single stab wound is visible.',
    },
    isActive: true,
  },
];

// Map verb to cursor class
const getCursorClass = (verb: string | null): string => {
  if (!verb) return 'cursor-default';
  const cursorMap: Record<string, string> = {
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
};

export function GameScene({ 
  gameState, 
  onHotspotHover, 
  onHotspotClick,
  onAddToInventory 
}: GameSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);

  const cursorClass = getCursorClass(gameState.selectedVerb);

  const handleHotspotClick = (hotspot: Hotspot, e: React.MouseEvent) => {
    e.stopPropagation();
    onHotspotClick(hotspot);

    // Demo: Handle pickup verb
    if (gameState.selectedVerb === 'pickup' && hotspot.id === 'dagger') {
      onAddToInventory({
        id: 'dagger',
        name: 'Bloody Dagger',
        description: 'The murder weapon. Handle with care.',
        image: daggerImage,
      });
    }
  };

  return (
    <div 
      ref={sceneRef}
      className={`relative w-full h-full ${cursorClass}`}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center pixelated"
        style={{ backgroundImage: `url(${breakroomBackground})` }}
      />

      {/* Party decorations still visible in gameplay */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <svg className="absolute w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
          <path d="M0,5 Q10,15 20,5 T40,5 T60,5 T80,5 T100,5" 
            stroke="hsl(350, 80%, 60%)" strokeWidth="0.8" fill="none" className="opacity-80" />
          <path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" 
            stroke="hsl(45, 90%, 60%)" strokeWidth="0.8" fill="none" className="opacity-80" />
          <path d="M0,15 Q10,5 20,15 T40,15 T60,15 T80,15 T100,15" 
            stroke="hsl(200, 80%, 60%)" strokeWidth="0.8" fill="none" className="opacity-80" />
        </svg>
      </div>

      {/* Balloons */}
      <div className="absolute top-[5%] left-[10%] animate-[float_3s_ease-in-out_infinite] pointer-events-none">
        <div className="w-8 h-10 bg-red-500 rounded-full opacity-80" />
        <div className="w-0.5 h-8 bg-gray-400 mx-auto" />
      </div>
      <div className="absolute top-[8%] left-[85%] animate-[float_3.5s_ease-in-out_infinite_0.5s] pointer-events-none">
        <div className="w-8 h-10 bg-blue-500 rounded-full opacity-80" />
        <div className="w-0.5 h-8 bg-gray-400 mx-auto" />
      </div>

      {/* Banner */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-[hsl(45,80%,50%)] px-6 py-2 text-xs text-black font-bold tracking-wider 
                      border-2 border-[hsl(45,90%,30%)] shadow-lg">
          🎉 CONGRATULATIONS! 🎉
        </div>
      </div>

      {/* Table with wine glasses */}
      <div className="absolute bottom-[5%] left-[22%] z-10">
        <img src={tableImage} alt="Party Table" className="h-20 pixelated object-contain"
          style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }} />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <img src={wineGlassesImage} alt="Wine Glasses" className="h-10 pixelated object-contain" />
        </div>
      </div>

      {/* Surviving characters on the floor */}
      <div className="absolute bottom-[3%] left-[8%] z-20 hotspot-highlight">
        <img src={ladySprite} alt="Lady" className="h-36 pixelated object-contain"
          style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }} />
      </div>
      <div className="absolute bottom-[3%] left-[35%] z-20 hotspot-highlight">
        <img src={elFuegoSprite} alt="El Fuego" className="h-36 pixelated object-contain"
          style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }} />
      </div>
      <div className="absolute bottom-[3%] left-[55%] z-20 hotspot-highlight">
        <img src={carlSprite} alt="Carl" className="h-36 pixelated object-contain"
          style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }} />
      </div>

      {/* Los Cabos - body on the floor (victim) */}
      <div className="absolute bottom-[3%] right-[15%] transform -rotate-90 z-10">
        <img 
          src={losCabosSprite} 
          alt="Los Cabos - Victim"
          className="h-28 pixelated object-contain opacity-90"
          style={{ filter: 'grayscale(0.3) brightness(0.7) drop-shadow(2px 4px 6px rgba(0,0,0,0.8))' }}
        />
      </div>

      {/* Blood pool effect */}
      <div 
        className="absolute bottom-[2%] right-[12%] w-36 h-14 rounded-full opacity-60"
        style={{ background: 'radial-gradient(ellipse, hsl(0, 80%, 25%) 0%, transparent 70%)' }}
      />

      {/* Dagger beside Los Cabos */}
      <div className="absolute bottom-[5%] right-[8%] z-15 hotspot-highlight">
        <img 
          src={daggerImage} 
          alt="Bloody Dagger"
          className="h-12 pixelated object-contain transform rotate-45"
          style={{ filter: 'drop-shadow(0 0 8px rgba(180,0,0,0.6))' }}
        />
      </div>

      {/* Interactive Hotspots (invisible hit areas) */}
      {DEMO_HOTSPOTS.map(hotspot => (
        <div
          key={hotspot.id}
          className="absolute cursor-pointer"
          style={{
            left: `${hotspot.position.x}%`,
            top: `${hotspot.position.y}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
            // Debug: uncomment to see hotspot areas
            // border: '2px solid red',
            // backgroundColor: 'rgba(255,0,0,0.2)',
          }}
          onMouseEnter={() => {
            setHoveredHotspot(hotspot);
            onHotspotHover(hotspot.name);
          }}
          onMouseLeave={() => {
            setHoveredHotspot(null);
            onHotspotHover('');
          }}
          onClick={(e) => handleHotspotClick(hotspot, e)}
        />
      ))}


      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 100px 30px hsl(220, 30%, 5%)',
        }}
      />
    </div>
  );
}
