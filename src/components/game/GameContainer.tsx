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

  // Main gameplay - Fixed Aspect Ratio Container (16:10)
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      {/* Responsive Retro Container:
        - aspect-[16/10]: Classic 320x200 ratio
        - h-full max-h-full: Fit vertical
        - w-auto max-w-full: Fit horizontal
      */}
      <div className="relative aspect-[16/10] h-full max-h-full w-auto max-w-full bg-zinc-900 shadow-2xl flex flex-col border-2 border-zinc-800">
        
        {/* Game Scene Area - Takes remaining space */}
        <div className="relative flex-1 w-full overflow-hidden bg-black">
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

        {/* SCUMM-style UI Panel - Fixed height percentage */}
        <div className="w-full h-[30%] min-h-[140px] z-10">
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
