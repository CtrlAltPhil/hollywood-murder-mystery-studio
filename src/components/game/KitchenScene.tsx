import { GameState, Verb } from '@/types/game';
import kitchenBackground from '@/assets/backgrounds/kitchen.png';
import { SimpleHotspot } from './GameScene';

interface KitchenSceneProps {
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

export function KitchenScene({ gameState, onHotspotHover, onHotspotClick, onChangeRoom, debugMode }: KitchenSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);

  const hotspots: SimpleHotspot[] = [
    {
      id: 'chalkboard',
      name: 'Chalkboard',
      position: { x: 18, y: 40 },
      width: 22,
      height: 35,
      interactions: {
        look: '"Stock Pot Specifications... Main Stews... Daily Specials." Someone was planning quite the menu for the party.',
        use: 'I don\'t need to write anything on it.',
      },
    },
    {
      id: 'stove',
      name: 'Stove',
      position: { x: 50, y: 55 },
      width: 18,
      height: 30,
      interactions: {
        look: 'A large commercial stove. It\'s still warm — someone was cooking recently.',
        open: 'The oven is empty. Whatever was in there has already been served.',
        use: 'I\'m not here to cook.',
        push: 'It\'s bolted to the floor.',
      },
    },
    {
      id: 'knife-block',
      name: 'Knife Block',
      position: { x: 40, y: 52 },
      width: 8,
      height: 12,
      interactions: {
        look: 'A wooden knife block. Wait — one of the slots is empty. A knife is missing.',
        pickup: 'Better not touch the knives. This is a crime scene after all.',
        use: 'I shouldn\'t mess with potential evidence.',
      },
    },
    {
      id: 'cutting-board',
      name: 'Cutting Board with Vegetables',
      position: { x: 15, y: 62 },
      width: 14,
      height: 12,
      interactions: {
        look: 'Carrots, onions, peppers... Someone was in the middle of prep work when things went south.',
        pickup: 'I don\'t need raw vegetables right now.',
      },
    },
    {
      id: 'shelves',
      name: 'Kitchen Shelves',
      position: { x: 85, y: 45 },
      width: 16,
      height: 40,
      interactions: {
        look: 'Copper pots, plates, and containers. This kitchen is well-stocked.',
        use: 'Nothing useful on the shelves.',
      },
    },
    {
      id: 'catering-trays',
      name: 'Catering Trays',
      position: { x: 78, y: 62 },
      width: 14,
      height: 15,
      interactions: {
        look: 'Trays of hors d\'oeuvres. Some were served at the party, others never made it out.',
        pickup: 'I\'m not hungry. There\'s a murder to solve.',
      },
    },
    {
      id: 'sink',
      name: 'Sink',
      position: { x: 82, y: 72 },
      width: 10,
      height: 12,
      interactions: {
        look: 'A pile of dirty dishes. The sink has a faint reddish residue... wine? Or something else?',
        use: 'I turn on the faucet. Just water. The red stuff was probably wine... probably.',
      },
    },
    {
      id: 'back-to-hallway-kitchen',
      name: 'Hallway',
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
        style={{ backgroundImage: `url(${kitchenBackground})` }}
      />

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
