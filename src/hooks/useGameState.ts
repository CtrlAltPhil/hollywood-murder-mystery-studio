import { useState, useCallback } from 'react';
import { GameState, GamePhase, Verb, InventoryItem, Position, DialogNode, Character } from '@/types/game';

const initialGameState: GameState = {
  phase: 'studio-intro',
  currentRoom: 'breakroom',
  playerPosition: { x: 400, y: 350 },
  inventory: [],
  selectedVerb: null,
  selectedItem: null,
  actionText: '',
  flags: {},
  dialogState: {
    isActive: false,
    currentNode: null,
    character: null,
  },
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const setPhase = useCallback((phase: GamePhase) => {
    setGameState(prev => ({ ...prev, phase }));
  }, []);

  const selectVerb = useCallback((verb: Verb | null) => {
    setGameState(prev => ({
      ...prev,
      selectedVerb: verb,
      selectedItem: null,
      // Only overwrite actionText when a verb is being SET. Clearing selection
      // must preserve any response text the caller just wrote (e.g. item-on-NPC
      // reactions), otherwise the response flashes and disappears.
      actionText: verb ? getVerbDisplayName(verb) : prev.actionText,
    }));
  }, []);

  const selectItem = useCallback((item: InventoryItem | null) => {
    setGameState(prev => {
      // Picking up an item auto-selects the "Use" verb (classic SCUMM behavior)
      // so the very next click on any hotspot triggers a "use <item> with X" response.
      const nextVerb = item ? (prev.selectedVerb ?? 'use') : prev.selectedVerb;
      return {
        ...prev,
        selectedItem: item,
        selectedVerb: nextVerb,
        actionText: nextVerb
          ? `${getVerbDisplayName(nextVerb)} ${item?.name || ''}`
          : '',
      };
    });
  }, []);

  const setActionText = useCallback((text: string) => {
    setGameState(prev => ({ ...prev, actionText: text }));
  }, []);

  const addToInventory = useCallback((item: InventoryItem) => {
    setGameState(prev => ({
      ...prev,
      inventory: [...prev.inventory, item],
    }));
  }, []);

  const removeFromInventory = useCallback((itemId: string) => {
    setGameState(prev => ({
      ...prev,
      inventory: prev.inventory.filter(i => i.id !== itemId),
    }));
  }, []);

  const movePlayer = useCallback((position: Position) => {
    setGameState(prev => ({ ...prev, playerPosition: position }));
  }, []);

  const setFlag = useCallback((flag: string, value: boolean) => {
    setGameState(prev => ({
      ...prev,
      flags: { ...prev.flags, [flag]: value },
    }));
  }, []);

  const startDialog = useCallback((character: Character, node: DialogNode) => {
    setGameState(prev => ({
      ...prev,
      dialogState: {
        isActive: true,
        currentNode: node,
        character,
      },
    }));
  }, []);

  const advanceDialog = useCallback((nextNode: DialogNode | null) => {
    setGameState(prev => ({
      ...prev,
      dialogState: nextNode
        ? { ...prev.dialogState, currentNode: nextNode }
        : { isActive: false, currentNode: null, character: null },
    }));
  }, []);

  const changeRoom = useCallback((roomId: string, position: Position) => {
    setGameState(prev => ({
      ...prev,
      currentRoom: roomId,
      playerPosition: position,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  const restoreState = useCallback((saved: GameState) => {
    setGameState({
      ...saved,
      selectedVerb: null,
      selectedItem: null,
      actionText: '',
      dialogState: { isActive: false, currentNode: null, character: null },
    });
  }, []);

  return {
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
    resetGame,
  };
}

function getVerbDisplayName(verb: Verb): string {
  const verbNames: Record<Verb, string> = {
    look: 'Look at',
    pickup: 'Pick up',
    use: 'Use',
    open: 'Open',
    close: 'Close',
    talk: 'Talk to',
    push: 'Push',
    pull: 'Pull',
  };
  return verbNames[verb];
}
