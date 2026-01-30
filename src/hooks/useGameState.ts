import { useState, useCallback } from 'react';
import { GameState, GamePhase, Verb, InventoryItem, Position, DialogNode, Character } from '@/types/game';

const initialGameState: GameState = {
  phase: 'title',
  currentRoom: 'gb-studios-exterior',
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
      actionText: verb ? getVerbDisplayName(verb) : '',
    }));
  }, []);

  const selectItem = useCallback((item: InventoryItem | null) => {
    setGameState(prev => ({
      ...prev,
      selectedItem: item,
      actionText: prev.selectedVerb 
        ? `${getVerbDisplayName(prev.selectedVerb)} ${item?.name || ''}` 
        : '',
    }));
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

  return {
    gameState,
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
