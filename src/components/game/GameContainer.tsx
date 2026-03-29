import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { preloadImages, getAllAssets, getRoomAssets } from '@/utils/preloadAssets';
import { useNotesState } from '@/hooks/useNotesState';
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
import { GardenPathScene } from './GardenPathScene';
import { DukeExtremeRoomScene } from './DukeExtremeRoomScene';
import { ScummUI } from './ScummUI';
import { GameMenu } from './GameMenu';
import { DialogBox } from './DialogBox';
import { DebugGrid } from './DebugGrid';
import { NotesOverlay } from './NotesOverlay';
import { getDialogTree, getDialogNodeById } from '@/data/dialogTrees';
import { Button } from '@/components/ui/button';
import { Settings, NotebookPen } from 'lucide-react';


export function GameContainer() {
  const {
    gameState,
    restoreState,
    setPhase,
    selectVerb,
    selectItem,
    setActionText,
    addToInventory,
    removeFromInventory,
    movePlayer,
    setFlag,
    startDialog,
    advanceDialog,
    changeRoom,
  } = useGameState();

  const {
    dialogueLog,
    evidenceLog,
    hasUnread,
    logDialogue,
    checkFlagEvidence,
    checkItemEvidence,
    clearUnread,
    resetNotes,
    restoreNotes,
  } = useNotesState();

  const { playBackgroundTrack, playRoomAmbience, playDialogBlip, playSfx, setMusicVolume, setSfxVolume } = useAudioEngine();

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const lastLoggedNodeId = useRef<string | null>(null);

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
  const [hoverText, setHoverText] = useState('');
  const [assetsPreloaded, setAssetsPreloaded] = useState(false);
  const [hasSaveData, setHasSaveData] = useState(() => !!localStorage.getItem('hmm_save_game'));
  // Preload all game assets while on title screen
  useEffect(() => {
    if (gameState.phase === 'title' && !assetsPreloaded) {
      preloadImages(getAllAssets()).then(() => setAssetsPreloaded(true));
    }
  }, [gameState.phase, assetsPreloaded]);

  useEffect(() => {
    if (gameState.phase === 'blackout' && !crashPlayed) {
      playSfx('crash');
      setCrashPlayed(true);
    }
  }, [gameState.phase, crashPlayed, playSfx]);

  // Auto-log dialogue when a new dialog node appears
  useEffect(() => {
    const node = gameState.dialogState.currentNode;
    if (node && node.id !== lastLoggedNodeId.current) {
      lastLoggedNodeId.current = node.id;
      logDialogue(node.speaker, node.text);
    }
    if (!node) {
      lastLoggedNodeId.current = null;
    }
  }, [gameState.dialogState.currentNode, logDialogue]);

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

  const handleIntroComplete = async () => {
    // Preload breakroom assets before revealing gameplay (screen is black during blackout)
    await preloadImages(getRoomAssets('breakroom'));
    setPhase('gameplay');
    const flag = 'murderRevealed';
    setFlag(flag, true);
    checkFlagEvidence(flag);
  };

  const handleSave = () => {
    // Warn if overriding an existing save
    if (hasSaveData) {
      if (!confirm('This will overwrite your previous save. Continue?')) {
        return;
      }
    }
    try {
      const saveData = {
        gameState: {
          ...gameState,
          selectedVerb: null,
          selectedItem: null,
          actionText: '',
          dialogState: { isActive: false, currentNode: null, character: null },
        },
        notes: { dialogueLog, evidenceLog },
        savedAt: Date.now(),
      };
      localStorage.setItem('hmm_save_game', JSON.stringify(saveData));
      setHasSaveData(true);
      alert('Game Saved Successfully!');
    } catch {
      alert('Failed to save game.');
    }
    setIsMenuOpen(false);
  };

  const handleLoadGame = () => {
    const raw = localStorage.getItem('hmm_save_game');
    if (!raw) {
      alert('No save data found.');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const savedGameState = parsed.gameState || parsed;
      restoreState(savedGameState);
      if (parsed.notes) {
        restoreNotes(parsed.notes.dialogueLog || [], parsed.notes.evidenceLog || []);
      }
      setIsMenuOpen(false);
      setCrashPlayed(true);
    } catch {
      alert('Failed to load save data. The save file may be corrupted.');
    }
  };

  const handleRestart = () => {
    if (confirm('Are you sure you want to restart? Unsaved progress will be lost.')) {
      localStorage.removeItem('hmm_save_game');
      setHasSaveData(false);
      resetNotes();
      window.location.reload();
    }
  };

  const handleChangeRoom = (roomId: string) => {
    setRoomTransition(true);
    // Preload target room assets during the fade-to-black
    const preloadPromise = preloadImages(getRoomAssets(roomId));
    setTimeout(async () => {
      await preloadPromise; // Wait for assets if still loading
      changeRoom(roomId, { x: 400, y: 350 });
      setHoverText('');
      selectVerb(null);
      setActionText('');
      playRoomAmbience(roomId);
      setTimeout(() => setRoomTransition(false), 50);
    }, 400);
  };

  const sharedHotspotHover = (text: string) => {
    if (!text) {
      setHoverText('');
      return;
    }

    const verb = gameState.selectedVerb;
    const item = gameState.selectedItem;
    if (verb === 'use' && item) {
      setHoverText(`Use ${item.name} with ${text}`);
    } else if (verb) {
      setHoverText(`${getVerbDisplayName(verb)} ${text}`);
    } else {
      setHoverText(text);
    }
  };

  const sharedHotspotClick = (hotspot: any) => {
    setHoverText('');

    const verb = gameState.selectedVerb;
    const item = gameState.selectedItem;

    if (verb === 'use' && item) {
      const useWithKey = `use_with_${item.id}`;
      const interaction = hotspot.interactions[useWithKey];
      if (interaction) {
        if (typeof interaction === 'string') {
          if (interaction === '__UNLOCK_BACKYARD__') {
            setFlag('backyardUnlocked', true);
            checkFlagEvidence('backyardUnlocked');
            removeFromInventory('backyard_key');
            setActionText('The key fits! The french doors are now unlocked.');
            playSfx('pickup');
            selectVerb(null);
            return;
          }
          if (interaction === '__UNLOCK_EBOX__') {
            setFlag('electricalBoxUnlocked', true);
            removeFromInventory('fountain_key');
            setActionText('The key fits! I hear a click — the electrical box is now unlocked.');
            playSfx('pickup');
            selectVerb(null);
            return;
          }
          setActionText(interaction);
        } else if (typeof interaction === 'function') {
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
    const descriptions: Record<string, string> = {
      'wine-glass': 'A wine glass with a strange residue at the bottom. Someone may have been drugged.',
      'meat-stick': 'A gourmet meat stick from the charcuterie board. Smells delicious but this is no time to eat.',
      'dagger': 'An ornate dagger covered in blood. The murder weapon.',
      'money-bag': 'A black duffel bag stuffed with bundles of cash. What was Duke Extreme up to?',
      'wire_cutters': 'Heavy-duty wire cutters from the garden shed. Could cut through wires or thick branches.',
    };
    setHoverText('');
    addToInventory({ ...item, description: descriptions[item.id] || `It's a ${item.name}.` });
    checkItemEvidence(item.id);
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

  // Wrapped setFlag that also logs evidence
  const setFlagWithEvidence = (flag: string, value: boolean) => {
    setFlag(flag, value);
    if (value) checkFlagEvidence(flag);
  };

  const renderCurrentRoom = () => {
    const handleEmptyClick = () => {
      setHoverText('');
      if (gameState.selectedVerb) {
        selectVerb(null);
      }
    };
    const sceneProps = { gameState, onHotspotHover: sharedHotspotHover, onHotspotClick: sharedHotspotClick, onChangeRoom: handleChangeRoom, onEmptyClick: handleEmptyClick, debugMode };
    switch (gameState.currentRoom) {
      case 'hallway':
        return <HallwayScene {...sceneProps} />;
      case 'hallway-kitchen':
        return <HallwayKitchenScene {...sceneProps} />;
      case 'kitchen':
        return <KitchenScene {...sceneProps} />;
      case 'production-room':
        return <ProductionRoomScene {...sceneProps} onSetFlag={(flag) => setFlagWithEvidence(flag, true)} />;
      case 'lady-fantastique-room':
        return <LadyFantastiqueRoomScene {...sceneProps} />;
      case 'los-cabos-room':
        return <LosCabosRoomScene {...sceneProps} onAddToInventory={handleAddToInventory} setFlag={setFlagWithEvidence} />;
      case 'study':
        return <StudyScene {...sceneProps} onAddToInventory={handleAddToInventory} setFlag={setFlagWithEvidence} />;
      case 'backyard':
        return <BackyardScene {...sceneProps} setFlag={setFlagWithEvidence} onAddToInventory={handleAddToInventory} />;
      case 'garden-path':
        return <GardenPathScene {...sceneProps} setFlag={setFlagWithEvidence} onAddToInventory={handleAddToInventory} />;
      case 'duke-extreme-room':
        return <DukeExtremeRoomScene {...sceneProps} />;
      default:
        return (
          <GameScene
            gameState={gameState}
            setFlag={setFlagWithEvidence}
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
            onLoadGame={hasSaveData ? handleLoadGame : undefined}
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
        {/* Top-left: Notes icon */}
        <div className="absolute top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setIsNotesOpen(true); clearUnread(); }}
            className="text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/10 relative"
          >
            <NotebookPen className="w-6 h-6" />
            {hasUnread && (
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </Button>
        </div>

        {/* Top-right: Settings icon */}
        <div className="absolute top-4 right-4 z-50">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)} className="text-white/50 hover:text-white hover:bg-white/10">
            <Settings className="w-6 h-6" />
          </Button>
        </div>

        {isNotesOpen && (
          <NotesOverlay
            dialogueLog={dialogueLog}
            evidenceLog={evidenceLog}
            onClose={() => setIsNotesOpen(false)}
          />
        )}

        {isMenuOpen && (
          <GameMenu 
            onResume={() => setIsMenuOpen(false)}
            onSave={handleSave}
            onRestart={handleRestart}
            onLoadGame={hasSaveData ? handleLoadGame : undefined}
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
                  if (nextNode?.onEnter?.flag) {
                    setFlag(nextNode.onEnter.flag, true);
                  }
                  advanceDialog(nextNode);
                } else {
                  advanceDialog(null);
                }
              }}
              onContinue={() => {
                const nextId = gameState.dialogState.currentNode?.nextNodeId;
                if (nextId) {
                  const nextNode = getDialogNodeById(nextId);
                  if (nextNode?.onEnter?.flag) {
                    setFlag(nextNode.onEnter.flag, true);
                  }
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
            actionText={hoverText || gameState.actionText}
            items={gameState.inventory}
            selectedItem={gameState.selectedItem}
            onItemSelect={(item) => {
              if (gameState.selectedVerb === 'look') {
                setHoverText('');
                selectVerb(null);
                setActionText(item.description || `It's a ${item.name}.`);
              } else {
                selectItem(item);
              }
            }}
            onItemHover={(text) => sharedHotspotHover(text)}
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
