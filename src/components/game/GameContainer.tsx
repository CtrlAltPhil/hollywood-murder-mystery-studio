import { useGameState } from '@/hooks/useGameState';
import { TitleScreen } from './TitleScreen';
import { IntroSequence } from './IntroSequence';
import { GameScene } from './GameScene';
import { ScummUI } from './ScummUI';

export function GameContainer() {
  const {
    gameState,
    setPhase,
    selectVerb,
    selectItem,
    setActionText,
    addToInventory,
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
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-4xl aspect-[4/3]">
          <TitleScreen onStart={handleStart} />
        </div>
      </div>
    );
  }

  // Intro sequence (party -> blackout -> murder reveal)
  if (['intro', 'party', 'blackout', 'murder-reveal'].includes(gameState.phase)) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-4xl aspect-[4/3]">
          <IntroSequence 
            phase={gameState.phase} 
            setPhase={setPhase}
            onComplete={handleIntroComplete} 
          />
        </div>
      </div>
    );
  }

  // Main gameplay - Classic SCUMM layout with letterboxing
  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      {/* Game viewport container */}
      <div className="w-full max-w-4xl flex flex-col">
        {/* Game Scene Area - 4:3 aspect ratio */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <GameScene
            gameState={gameState}
            onHotspotHover={(text) => setActionText(
              gameState.selectedVerb 
                ? `${getVerbDisplayName(gameState.selectedVerb)} ${text}`
                : text
            )}
            onHotspotClick={(hotspot) => {
              console.log('Clicked hotspot:', hotspot.name, 'with verb:', gameState.selectedVerb);
            }}
            onAddToInventory={addToInventory}
          />
        </div>

        {/* SCUMM-style UI Panel */}
        <ScummUI
          selectedVerb={gameState.selectedVerb}
          onVerbSelect={selectVerb}
          actionText={gameState.actionText}
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
