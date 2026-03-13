import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { TitleScreen } from './TitleScreen';
import { IntroSequence } from './IntroSequence';
import { GameScene } from './GameScene';
import { HallwayScene } from './HallwayScene';
import { HallwayKitchenScene } from './HallwayKitchenScene';
import { KitchenScene } from './KitchenScene';
import { ProductionRoomScene } from './ProductionRoomScene';
import { LadyFantastiqueRoomScene } from './LadyFantastiqueRoomScene';
import { LosCabosRoomScene } from './LosCabosRoomScene';
import { StudyScene } from './StudyScene';
import { BackyardScene } from './BackyardScene';
import { ScummUI } from './ScummUI';
import { GameMenu } from './GameMenu';
import { DialogBox } from './DialogBox';
import { DebugGrid } from './DebugGrid';
import { getDialogTree, getDialogNodeById } from '@/data/dialogTrees';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import backyardKeyInventory from '@/assets/props/backyard-key-inventory.png';

export function GameContainer() {
  const {
    gameState,
    setPhase,
    selectVerb,
    selectItem,
    setActionText,
    addToInventory,
    setFlag,
    startDialog,
    advanceDialog,
    changeRoom,
  } = useGameState();

  const { playBackgroundTrack, playRoomAmbience, playDialogBlip, playSfx, setMusicVolume, setSfxVolume } = useAudioEngine();

  useEffect(() => {
    playBackgroundTrack(gameState.phase);
  }, [gameState.phase, playBackgroundTrack]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [musicVolumeState, setMusicVolumeState] = useState(0.3);
  const [sfxVolumeState, setSfxVolumeState] = useState(0.5);
  const [brightness, setBrightness] = useState(1);
  const [crashPlayed, setCrashPlayed] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [roomTransition, setRoomTransition] = useState(false);

  useEffect(() => {
    if (gameState.phase === 'blackout' && !crashPlayed) {
      playSfx('crash');
      setCrashPlayed(true);
    }
  }, [gameState.phase, crashPlayed, playSfx]);

  const handleMusicVolumeChange = (v: number) => {
    setMusicVolume(v);
    setMusicVolumeState(v);
  };

  const handleSfxVolumeChange = (v: number) => {
    setSfxVolume(v);
    setSfxVolumeState(v);
  };

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

  const handleLoadGame = () => {
    const saveData = localStorage.getItem('hmm_save_game');
    if (saveData) {
      try {
        const parsed = JSON.parse(saveData);
        // Reload the page with save data flag
        localStorage.setItem('hmm_load_pending', 'true');
        window.location.reload();
      } catch {
        alert('Failed to load save data.');
      }
    }
  };

  const handleRestart = () => {
    if (confirm('Are you sure you want to restart? Unsaved progress will be lost.')) {
      window.location.reload();
    }
  };

  const handleChangeRoom = (roomId: string) => {
    setRoomTransition(true);
    setTimeout(() => {
      changeRoom(roomId, { x: 400, y: 350 });
      selectVerb(null);
      setActionText('');
      playRoomAmbience(roomId);
      setTimeout(() => setRoomTransition(false), 50);
    }, 400);
  };

  const sharedHotspotHover = (text: string) => {
    const verb = gameState.selectedVerb;
    const item = gameState.selectedItem;
    if (verb === 'use' && item) {
      setActionText(`Use ${item.name} with ${text}`);
    } else if (verb) {
      setActionText(`${getVerbDisplayName(verb)} ${text}`);
    } else {
      setActionText(text);
    }
  };

  const sharedHotspotClick = (hotspot: any) => {
    const verb = gameState.selectedVerb;
    const item = gameState.selectedItem;

    if (verb === 'use' && item) {
      const useWithKey = `use_with_${item.id}`;
      const interaction = hotspot.interactions[useWithKey];
      if (interaction) {
        if (typeof interaction === 'string') setActionText(interaction);
        else if (typeof interaction === 'function') {
          const result = interaction();
          if (typeof result === 'string') setActionText(result);
        }
      } else {
        setActionText(`I can't use the ${item.name} with ${hotspot.name}.`);
      }
      selectVerb(null);
      return;
    }

    if (verb && hotspot.interactions[verb]) {
      const interaction = hotspot.interactions[verb];
      if (typeof interaction === 'string') {
        if (interaction.startsWith('__DIALOG__')) {
          const characterId = interaction.replace('__DIALOG__', '');
          const rootNode = getDialogTree(characterId, gameState.flags);
          if (rootNode) {
            startDialog(
              { id: characterId, name: hotspot.name, position: { x: 0, y: 0 }, sprite: '', isVisible: true },
              rootNode
            );
          }
          return;
        }
        setActionText(interaction);
      } else if (typeof interaction === 'function') {
        const resultText = interaction();
        if (typeof resultText === 'string') setActionText(resultText);
      }
    } else if (verb) {
      setActionText(`I can't ${verb} that.`);
    }
  };

  const handleAddToInventory = (item: { id: string; name: string; image: string }) => {
    addToInventory({ ...item, description: '' });
    playSfx('pickup');
  };

  const menuProps = {
    musicVolume: musicVolumeState,
    sfxVolume: sfxVolumeState,
    brightness,
    onMusicVolumeChange: handleMusicVolumeChange,
    onSfxVolumeChange: handleSfxVolumeChange,
    onBrightnessChange: setBrightness,
    debugMode,
    onDebugModeToggle: setDebugMode,
  };

  const renderCurrentRoom = () => {
    const handleEmptyClick = () => { if (gameState.selectedVerb) { selectVerb(null); } };
    const sceneProps = { gameState, onHotspotHover: sharedHotspotHover, onHotspotClick: sharedHotspotClick, onChangeRoom: handleChangeRoom, onEmptyClick: handleEmptyClick, debugMode };
    switch (gameState.currentRoom) {
      case 'hallway':
        return <HallwayScene {...sceneProps} />;
      case 'hallway-kitchen':
        return <HallwayKitchenScene {...sceneProps} />;
      case 'kitchen':
        return <KitchenScene {...sceneProps} />;
      case 'production-room':
        return <ProductionRoomScene {...sceneProps} />;
      case 'lady-fantastique-room':
        return <LadyFantastiqueRoomScene {...sceneProps} />;
      case 'los-cabos-room':
        return <LosCabosRoomScene {...sceneProps} />;
      case 'study':
        return <StudyScene {...sceneProps} />;
      case 'backyard':
        return <BackyardScene {...sceneProps} />;
      default:
        return (
          <GameScene
            gameState={gameState}
            setFlag={setFlag}
            onHotspotHover={sharedHotspotHover}
            onHotspotClick={sharedHotspotClick}
            onAddToInventory={handleAddToInventory}
            onChangeRoom={handleChangeRoom}
            onEmptyClick={handleEmptyClick}
            debugMode={debugMode}
          />
        );
    }
  };

  // Title screen
  if (gameState.phase === 'title') {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-5xl aspect-[4/3]">
          <TitleScreen 
            onStart={handleStart}
            onLoadGame={handleLoadGame}
            {...menuProps}
          />
        </div>
      </div>
    );
  }

  // Intro sequence
  if (['intro', 'party', 'blackout'].includes(gameState.phase)) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-5xl aspect-[4/3] bg-black shadow-2xl border-2 border-zinc-800 overflow-hidden relative flex items-center" style={{ filter: `brightness(${brightness})` }}>
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
              {...menuProps}
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
      <div className="relative w-full max-w-5xl aspect-[4/3] bg-zinc-900 shadow-2xl flex flex-col border-2 border-zinc-800" style={{ filter: `brightness(${brightness})` }}>
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
            {...menuProps}
          />
        )}
        
        <div className="relative w-full aspect-video bg-black overflow-hidden border-b-4 border-black">
          {renderCurrentRoom()}
          
          {/* Room transition overlay - fade from black */}
          <div 
            className={`absolute inset-0 bg-black z-40 pointer-events-none transition-opacity duration-500 ease-in-out ${
              roomTransition ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
          <DebugGrid visible={debugMode} />

          {gameState.dialogState.isActive && gameState.dialogState.currentNode && (
            <DialogBox
              node={gameState.dialogState.currentNode}
              onOptionSelect={(option) => {
                if (option.onSelect) option.onSelect();
                // Sally gets angry when accused, reverts after 3 seconds
                if (option.nextNodeId === 'sally-accuse') {
                  setFlag('sallyAngry', true);
                  setTimeout(() => setFlag('sallyAngry', false), 4000);
                }
                if (option.nextNodeId) {
                  const nextNode = getDialogNodeById(option.nextNodeId);
                  advanceDialog(nextNode);
                } else {
                  advanceDialog(null);
                }
              }}
              onContinue={() => {
                const nextId = gameState.dialogState.currentNode?.nextNodeId;
                if (nextId) {
                  const nextNode = getDialogNodeById(nextId);
                  advanceDialog(nextNode);
                } else {
                  advanceDialog(null);
                }
              }}
              playDialogBlip={playDialogBlip}
            />
          )}
        </div>

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
