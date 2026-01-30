import { useGameState } from '@/hooks/useGameState';
import { TitleScreen } from './TitleScreen';
import { IntroSequence } from './IntroSequence';
import { GameScene } from './GameScene';
import { VerbBar } from './VerbBar';
import { Inventory } from './Inventory';

export function GameContainer() {
  const {
    gameState,
    setPhase,
    selectVerb,
    selectItem,
    setActionText,
    addToInventory,
    movePlayer,
    setFlag,
  } = useGameState();

  const handleStart = () => {
    setPhase('intro');
  };

  const handleIntroComplete = () => {
    setPhase('gameplay');
    setFlag('murderRevealed', true);
  };

  // Title screen
  if (gameState.phase === 'title') {
    return (
      <div className="w-full h-screen">
        <TitleScreen onStart={handleStart} />
      </div>
    );
  }

  // Intro sequence (party -> blackout -> murder reveal)
  if (['intro', 'party', 'blackout', 'murder-reveal'].includes(gameState.phase)) {
    return (
      <div className="w-full h-screen">
        <IntroSequence 
          phase={gameState.phase} 
          setPhase={setPhase}
          onComplete={handleIntroComplete} 
        />
      </div>
    );
  }

  // Main gameplay - UI overlays the scene
  return (
    <div className="w-full h-screen relative bg-background">
      {/* Game Scene Area - Full screen */}
      <div className="absolute inset-0">
        <GameScene
          gameState={gameState}
          onHotspotHover={(text) => setActionText(
            gameState.selectedVerb 
              ? `${getVerbDisplayName(gameState.selectedVerb)} ${text}`
              : text
          )}
          onHotspotClick={(hotspot) => {
            // Handle interaction based on selected verb
            console.log('Clicked hotspot:', hotspot.name, 'with verb:', gameState.selectedVerb);
          }}
          onAddToInventory={addToInventory}
        />
      </div>

      {/* UI Panel - Overlays at bottom with transparency */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm">
        <VerbBar
          selectedVerb={gameState.selectedVerb}
          onVerbSelect={selectVerb}
          actionText={gameState.actionText}
        />
        <Inventory
          items={gameState.inventory}
          selectedItem={gameState.selectedItem}
          onItemSelect={selectItem}
        />
      </div>
    </div>
  );
}

function getVerbDisplayName(verb: string): string {
  const verbNames: Record<string, string> = {
    look: 'Look at',
    pickup: 'Pick up',
    use: 'Use',
    open: 'Open',
    close: 'Close',
    talk: 'Talk to',
    push: 'Push',
    pull: 'Pull',
  };
  return verbNames[verb] || verb;
}
