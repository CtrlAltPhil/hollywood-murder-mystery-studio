import { GameState, Verb } from '@/types/game';
import productionRoomBackground from '@/assets/backgrounds/production-room.png';
import { SimpleHotspot } from './GameScene';

interface ProductionRoomSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
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

export function ProductionRoomScene({ gameState, onHotspotHover, onHotspotClick, onChangeRoom, onEmptyClick, debugMode }: ProductionRoomSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);

  const hotspots: SimpleHotspot[] = [
    {
      id: 'camera',
      name: 'Camera',
      position: { x: 30, y: 60 },
      width: 18,
      height: 30,
      interactions: {
        look: 'A professional film camera on a tripod. The recording light is off, but the lens cap is missing.',
        use: 'I press the power button. The viewfinder flickers on — there\'s still a tape inside!',
        pickup: 'It\'s way too heavy to carry around.',
        push: 'I nudge the camera. It swivels to face the green screen.',
      },
    },
    {
      id: 'green-screen',
      name: 'Green Screen',
      position: { x: 55, y: 45 },
      width: 25,
      height: 35,
      interactions: {
        look: 'A green screen backdrop. It looks like it was set up for some kind of special effects shoot.',
        use: 'I don\'t have anything to film right now.',
        pull: 'The screen is firmly mounted to the wall.',
      },
    },
    {
      id: 'boxes',
      name: 'Cardboard Boxes',
      position: { x: 58, y: 70 },
      width: 16,
      height: 20,
      interactions: {
        look: 'Stacked cardboard boxes. Some are labeled "PROPS" and others "WARDROBE."',
        open: 'I open one of the boxes. Old costumes and wigs... nothing useful.',
        pickup: 'They\'re too bulky to carry.',
        push: 'I push one aside. There\'s a crumpled note underneath — looks like a call sheet with Los Cabos\' name circled in red.',
      },
    },
    {
      id: 'fire-extinguisher',
      name: 'Fire Extinguisher',
      position: { x: 92, y: 55 },
      width: 8,
      height: 20,
      interactions: {
        look: 'A wall-mounted fire extinguisher. Standard safety equipment.',
        pickup: 'It\'s bolted to the wall bracket.',
        use: 'There\'s no fire. I\'ll leave it where it is.',
        pull: 'I tug on it but it\'s locked into the bracket.',
      },
    },
    {
      id: 'cables',
      name: 'Cables and Wires',
      position: { x: 65, y: 88 },
      width: 30,
      height: 12,
      interactions: {
        look: 'A mess of power cables and extension cords snaking across the floor. A tripping hazard.',
        pickup: 'I don\'t need a bunch of tangled cables.',
        use: 'They\'re already plugged into the equipment.',
      },
    },
    {
      id: 'stage-lights',
      name: 'Stage Lights',
      position: { x: 35, y: 15 },
      width: 50,
      height: 15,
      interactions: {
        look: 'Powerful stage lights hanging from the ceiling. Two of them are still on, pointing at the green screen.',
        use: 'I can\'t reach them from down here.',
      },
    },
    {
      id: 'door-exit',
      name: 'Door',
      position: { x: 6, y: 55 },
      width: 10,
      height: 40,
      interactions: {
        look: 'The door back to the hallway.',
        open: '__NAVIGATE__hallway',
        use: '__NAVIGATE__hallway',
      },
    },
    {
      id: 'cable-reel',
      name: 'Cable Reel',
      position: { x: 80, y: 78 },
      width: 10,
      height: 14,
      interactions: {
        look: 'A large cable reel. Looks like it belongs to the lighting rig.',
        pickup: 'Too heavy.',
        push: 'It rolls a bit but there\'s nothing behind it.',
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
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${productionRoomBackground})` }}
      />

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
          onClick={(e) => { e.stopPropagation(); handleHotspotClick(hotspot); }}
        />
      ))}
    </div>
  );
}
