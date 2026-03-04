import { GameState, Verb } from '@/types/game';
import hallwayKitchenBackground from '@/assets/backgrounds/hallway-kitchen.jpg';
import { SimpleHotspot } from './GameScene';

interface HallwayKitchenSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  debugMode?: boolean;
}

function getCursorClass(verb: Verb | null): string {
  if (!verb) return 'cursor-default';
  const cursorMap: Record<Verb, string> = {
    look: 'cursor-look', pickup: 'cursor-pickup', use: 'cursor-use',
    open: 'cursor-open', close: 'cursor-close', talk: 'cursor-talk',
    push: 'cursor-push', pull: 'cursor-pull',
  };
  return cursorMap[verb] || 'cursor-default';
}

export function HallwayKitchenScene({ gameState, onHotspotHover, onHotspotClick, onChangeRoom, debugMode }: HallwayKitchenSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);

  const hotspots: SimpleHotspot[] = [
    {
      id: 'kitchen-door',
      name: 'Kitchen Door',
      position: { x: 50, y: 50 },
      width: 20,
      height: 50,
      interactions: {
        look: 'Heavy metal double doors leading to the kitchen.',
        open: '__NAVIGATE__kitchen',
        use: '__NAVIGATE__kitchen',
        push: '__NAVIGATE__kitchen',
      },
    },
    {
      id: 'party-room-door-left',
      name: 'Party Room Door',
      position: { x: 12, y: 50 },
      width: 12,
      height: 50,
      interactions: {
        look: 'Another entrance to the party room.',
        open: '__NAVIGATE__breakroom',
        use: '__NAVIGATE__breakroom',
      },
    },
    {
      id: 'production-room-door-right',
      name: 'Production Room Door',
      position: { x: 88, y: 50 },
      width: 12,
      height: 50,
      interactions: {
        look: 'Another way to the production room.',
        open: '__NAVIGATE__production-room',
        use: '__NAVIGATE__production-room',
      },
    },
    {
      id: 'back-to-hallway',
      name: 'Hallway',
      position: { x: 50, y: 95 },
      width: 60,
      height: 10,
      interactions: {
        look: '__NAVIGATE__hallway',
        open: '__NAVIGATE__hallway',
        use: '__NAVIGATE__hallway',
      },
    },
  ];

  const handleHotspotClick = (hotspot: SimpleHotspot) => {
    const verb = gameState.selectedVerb;
    if (verb) {
      const interaction = hotspot.interactions[verb];
      if (typeof interaction === 'string' && interaction.startsWith('__NAVIGATE__')) {
        const targetRoom = interaction.replace('__NAVIGATE__', '');
        onChangeRoom(targetRoom);
        return;
      }
    }
    // Default: doors auto-open when no verb selected
    if (!verb && hotspot.interactions.open && typeof hotspot.interactions.open === 'string' && (hotspot.interactions.open as string).startsWith('__NAVIGATE__')) {
      onChangeRoom((hotspot.interactions.open as string).replace('__NAVIGATE__', ''));
      return;
    }
    onHotspotClick(hotspot);
  };

  return (
    <div className={`relative w-full h-full ${cursorClass}`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${hallwayKitchenBackground})` }}
      />

      {/* Navigation arrow indicator at bottom */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▼ Back to Hallway ▼
      </div>

      {hotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          className={`absolute cursor-pointer transition-colors rounded ${debugMode ? 'border-2 border-green-400/70 bg-green-400/15' : 'hover:bg-white/10'}`}
          style={{
            left: `${hotspot.position.x - hotspot.width / 2}%`,
            top: `${hotspot.position.y - hotspot.height / 2}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
          }}
          onMouseEnter={() => onHotspotHover(hotspot.name)}
          onMouseLeave={() => onHotspotHover('')}
          onClick={() => handleHotspotClick(hotspot)}
        />
      ))}
    </div>
  );
}
