import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { TitleScreen } from './TitleScreen';
import { IntroSequence } from './IntroSequence';
import { GameScene } from './GameScene';
import { ScummUI } from './ScummUI';
import { GameMenu } from './GameMenu';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

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

  // Initialize background music system
  useBackgroundMusic(gameState.phase);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleStart = () => {
    setPhase('intro');
  };

  const handleIntroComplete = () => {
    setPhase('gameplay');
    setFlag('murderRevealed', true);
  };

  const handleSave = () => {
    localStorage.setItem('hmm_save_game', JSON.stringify(gameState));
    alert('Game Saved Successfully!');
    setIsMenuOpen(false);
  };

  const handleRestart = () => {
    if (confirm('Are you sure you want to restart? Unsaved progress will be lost.')) {
      window.location.reload();
    }
  };

  // Title screen
  if (gameState.phase === 'title') {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-5xl aspect-[4/3]">
          <TitleScreen onStart={handleStart} />
        </div>
      </div>
    );
  }

  // Intro sequence
  if (['intro', 'party', 'blackout', 'murder-reveal'].includes(gameState.phase)) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center p-4">
        {/* Intro matches the main game container size (4:3) but keeps content 16:9 (letterboxed) */}
        <div className="w-full max-w-5xl aspect-[4/3] bg-black shadow-2xl border-2 border-zinc-800 overflow-hidden relative flex items-center">
          
          {/* Menu Button */}
          <div className="absolute top-4 right-4 z-50">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)} className="text-white/50 hover:text-white hover:bg-white/10">
              <Settings className="w-6 h-6" />
            </Button>
          </div>

          {isMenuOpen && (
            <GameMenu 
              onResume={() => setIsMenuOpen(false)}
              onSave={handleSave}
              onRestart={handleRestart}
            />
          )}

          <div className="w-full aspect-video relative">
            <IntroSequence 
              phase={gameState.phase} 
              setPhase={setPhase}
              onComplete={handleIntroComplete} 
            />
          </div>
        </div>
      </div>
    );
  }

  // Main gameplay
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      {/* MASTER LAYOUT: 4:3 "Monitor" Container 
        This contains both the 16:9 Scene and the bottom UI Bar.
      */}
      <div className="relative w-full max-w-5xl aspect-[4/3] bg-zinc-900 shadow-2xl flex flex-col border-2 border-zinc-800">
        
        {/* Menu Button */}
        <div className="absolute top-4 right-4 z-50">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)} className="text-white/50 hover:text-white hover:bg-white/10">
            <Settings className="w-6 h-6" />
          </Button>
        </div>

        {isMenuOpen && (
          <GameMenu 
            onResume={() => setIsMenuOpen(false)}
            onSave={handleSave}
            onRestart={handleRestart}
          />
        )}
        
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
                  if (typeof resultText === 'string') {
                    setActionText(resultText);
                  }
                } else if (typeof interaction === 'string') {
                  setActionText(interaction);
                }
              } else if (verb) {
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
