import { useState, useRef, useEffect } from 'react';
import { GameState, Hotspot, Position, InventoryItem } from '@/types/game';
import breakroomBackground from '@/assets/backgrounds/breakroom.jpg';
import elFuegoSprite from '@/assets/characters/el-fuego.jpg';
import daggerImage from '@/assets/items/dagger.jpg';
import wineGlassesImage from '@/assets/props/wine-glasses.jpg';
import tableImage from '@/assets/props/table.jpg';

interface GameSceneProps {
  gameState: GameState;
  onMove: (position: Position) => void;
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

export function GameScene({ 
  gameState, 
  onMove, 
  onHotspotHover, 
  onHotspotClick,
  onAddToInventory 
}: GameSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [playerPos, setPlayerPos] = useState(gameState.playerPosition);
  const [isMoving, setIsMoving] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);

  // Smooth player movement
  useEffect(() => {
    if (playerPos.x === gameState.playerPosition.x && 
        playerPos.y === gameState.playerPosition.y) {
      setIsMoving(false);
      return;
    }

    setIsMoving(true);
    const dx = gameState.playerPosition.x - playerPos.x;
    const dy = gameState.playerPosition.y - playerPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 2) {
      setPlayerPos(gameState.playerPosition);
      setIsMoving(false);
      return;
    }

    const speed = 3;
    const timer = setTimeout(() => {
      setPlayerPos({
        x: playerPos.x + (dx / distance) * speed,
        y: playerPos.y + (dy / distance) * speed,
      });
    }, 16);

    return () => clearTimeout(timer);
  }, [playerPos, gameState.playerPosition]);

  const handleSceneClick = (e: React.MouseEvent) => {
    if (!sceneRef.current) return;
    
    const rect = sceneRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicked on walkable area (simplified)
    if (y > 50 && y < 95) {
      onMove({ x, y });
    }
  };

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
      className="relative w-full h-full cursor-crosshair"
      onClick={handleSceneClick}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center pixelated"
        style={{ backgroundImage: `url(${breakroomBackground})` }}
      />

      {/* Props Layer */}
      <div 
        className="absolute hotspot-highlight cursor-pointer"
        style={{ left: '20%', bottom: '35%', width: '15%' }}
      >
        <img 
          src={wineGlassesImage} 
          alt="Wine Glasses"
          className="w-full h-auto pixelated object-contain"
        />
      </div>

      {/* Body on the floor */}
      <div 
        className="absolute transform -rotate-90"
        style={{ left: '38%', bottom: '18%' }}
      >
        <img 
          src={elFuegoSprite} 
          alt="Victim"
          className="h-28 pixelated object-contain opacity-80"
          style={{ filter: 'grayscale(0.3) brightness(0.7)' }}
        />
      </div>

      {/* Blood pool */}
      <div 
        className="absolute w-28 h-10 rounded-full opacity-50"
        style={{ 
          left: '40%', 
          bottom: '12%',
          background: 'radial-gradient(ellipse, hsl(0, 80%, 25%) 0%, transparent 70%)',
        }}
      />

      {/* Dagger */}
      <div 
        className="absolute transform rotate-45 hotspot-highlight cursor-pointer"
        style={{ left: '52%', bottom: '20%' }}
      >
        <img 
          src={daggerImage} 
          alt="Dagger"
          className="h-14 pixelated object-contain"
          style={{ filter: 'drop-shadow(0 0 5px rgba(180,0,0,0.5))' }}
        />
      </div>

      {/* El Fuego (witness) */}
      <div 
        className="absolute hotspot-highlight cursor-pointer"
        style={{ right: '15%', bottom: '25%' }}
      >
        <img 
          src={elFuegoSprite} 
          alt="El Fuego"
          className="h-44 pixelated object-contain"
          style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}
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

      {/* Player Character (placeholder circle for now) */}
      <div
        className="absolute w-8 h-8 bg-primary rounded-full border-2 border-primary-foreground transition-none"
        style={{
          left: `${playerPos.x}%`,
          top: `${playerPos.y}%`,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
        }}
      />

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
