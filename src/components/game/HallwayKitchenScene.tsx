import { GameState, Verb } from '@/types/game';
import hallwayKitchenBackground from '@/assets/backgrounds/hallway-kitchen.jpg';
import { SimpleHotspot } from './GameScene';

interface HallwayKitchenSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
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

export function HallwayKitchenScene({ gameState, onHotspotHover, onHotspotClick, onChangeRoom }: HallwayKitchenSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);

  const hotspots: SimpleHotspot[] = [
    {
      id: 'kitchen-door',
      name: 'Kitchen Door',
      position: { x: 50, y: 50 },
      width: 20,
      height: 50,
      interactions: {
        look: 'Heavy metal double doors leading to the kitchen. They look like they belong in a restaurant.',
        open: 'The doors are jammed shut. Something heavy is blocking them from the other side.',
        use: 'I can\'t get through. Something is blocking the doors.',
        push: 'I push hard but the doors won\'t budge. Something heavy is on the other side.',
        pull: 'These doors push inward — pulling won\'t help.',
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
        look: 'The production room. Still locked from this side too.',
        open: 'It\'s locked.',
        use: 'I need a key.',
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
    if (hotspot.id === 'back-to-hallway' && !verb) {
      onChangeRoom('hallway');
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
          className="absolute cursor-pointer hover:bg-white/10 transition-colors rounded"
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
