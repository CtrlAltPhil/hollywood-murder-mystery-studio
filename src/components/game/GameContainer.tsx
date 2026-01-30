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

  // Intro sequence
  if (['intro', 'party', 'blackout', 'murder-reveal'].includes(gameState.phase)) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center p-4">
        {/* Intro now matches the main game container size for consistency */}
        <div className="w-full max-w-5xl aspect-[16/10] bg-black shadow-2xl border-2 border-zinc-800 overflow-hidden relative">
          <IntroSequence 
            phase={gameState.phase} 
            setPhase={setPhase}
            onComplete={handleIntroComplete} 
          />
        </div>
      </div>
    );
  }

  // Main gameplay
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      {/* MASTER LAYOUT: 16:10 "Monitor" Container 
        This contains both the 16:9 Scene and the bottom UI Bar.
      */}
      <div className="relative w-full max-w-5xl aspect-[16/10] bg-zinc-900 shadow-2xl flex flex-col border-2 border-zinc-800">
        
        {/* SCENE AREA: Forced 16:9 (aspect-video)
          This ensures the floor is NEVER cut off. The scene renders exactly as drawn.
        */}
        <div className="relative w-full aspect-video bg-black overflow-hidden border-b-4 border-black">
          <GameScene
            gameState={gameState}
            setFlag={setFlag}
            onHotspotHover={(text) => setActionText(
              gameState.selectedVerb 
                ? `${getVerbDisplayName(gameState.selectedVerb)} ${text}`
                : text
            )}
            onHotspotClick={(hotspot) => {
              const verb = gameState.selectedVerb;
              if (verb && hotspot.interactions[verb]) {
                const interaction = hotspot.interactions[verb];
                if (typeof interaction === 'function') {
                  const resultText = interaction();
                  if (resultText && typeof resultText === 'string') setActionText(resultText);
                } else if (typeof interaction === 'string') {
                  setActionText(interaction);
                }
              } else {
                 setActionText(`I can't ${verb} that.`);
              }
            }}
            onAddToInventory={addToInventory}
          />
        </div>

        {/* UI AREA: flex-1 
          This fills the remaining "black space" at the bottom automatically.
        */}
        <div className="w-full flex-1 z-10 min-h-0">
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
