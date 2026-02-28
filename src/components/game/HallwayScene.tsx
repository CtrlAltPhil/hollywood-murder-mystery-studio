import { GameState, Verb } from '@/types/game';
import hallwayBackground from '@/assets/backgrounds/hallway.png';
import { SimpleHotspot } from './GameScene';

interface HallwaySceneProps {
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

export function HallwayScene({ gameState, onHotspotHover, onHotspotClick, onChangeRoom }: HallwaySceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);

  const hotspots: SimpleHotspot[] = [
    {
      id: 'party-room-door',
      name: 'Party Room Door',
      position: { x: 82, y: 55 },
      width: 12,
      height: 50,
      interactions: {
        look: 'The door to the party room. This is where it all happened.',
        open: '__NAVIGATE__breakroom',
        use: '__NAVIGATE__breakroom',
      },
    },
    {
      id: 'production-room-door',
      name: 'Production Room Door',
      position: { x: 18, y: 55 },
      width: 12,
      height: 50,
      interactions: {
        look: 'The production room. The door is locked.',
        open: 'It\'s locked. I don\'t have a key.',
        use: 'I need a key to open this door.',
      },
    },
    {
      id: 'exit-door',
      name: 'Exit',
      position: { x: 50, y: 50 },
      width: 12,
      height: 40,
      interactions: {
        look: 'The main exit. Police are outside — I can\'t leave yet.',
        open: 'The police have barricaded the exit. No one leaves until the case is solved.',
        use: 'I can\'t leave until I figure out who killed Los Cabos.',
      },
    },
    {
      id: 'hallway-posters',
      name: 'Movie Posters',
      position: { x: 50, y: 25 },
      width: 80,
      height: 20,
      interactions: {
        look: 'Old movie posters line the walls. "Aeons", "Ancient Crimes"... GB Studios has had better days.',
      },
    },
    {
      id: 'kitchen-direction',
      name: 'Kitchen Hallway',
      position: { x: 50, y: 95 },
      width: 60,
      height: 10,
      interactions: {
        look: '__NAVIGATE__hallway-kitchen',
        open: '__NAVIGATE__hallway-kitchen',
        use: '__NAVIGATE__hallway-kitchen',
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
    // For the kitchen direction, any click navigates
    if (hotspot.id === 'kitchen-direction' && !verb) {
      onChangeRoom('hallway-kitchen');
      return;
    }
    onHotspotClick(hotspot);
  };

  return (
    <div className={`relative w-full h-full ${cursorClass}`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${hallwayBackground})` }}
      />

      {/* Navigation arrow indicator at bottom */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-white/60 text-xs font-pixel animate-pulse">
        ▼ Kitchen ▼
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
