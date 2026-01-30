// Core game types for Hollywood Murder Mystery

export type GamePhase = 'title' | 'intro' | 'party' | 'blackout' | 'murder-reveal' | 'gameplay';

export type Verb = 'look' | 'pickup' | 'use' | 'open' | 'close' | 'talk' | 'push' | 'pull';

export interface Position {
  x: number;
  y: number;
}

export interface Hotspot {
  id: string;
  name: string;
  position: Position;
  width: number;
  height: number;
  walkToPosition: Position;
  interactions: Partial<Record<Verb, string | (() => void)>>;
  isActive: boolean;
  zIndex?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
  canCombineWith?: string[];
}

export interface Character {
  id: string;
  name: string;
  position: Position;
  sprite: string;
  isVictim?: boolean;
  isVisible: boolean;
  dialogTree?: DialogNode;
}

export interface DialogOption {
  text: string;
  nextNodeId: string | null;
  condition?: () => boolean;
  onSelect?: () => void;
}

export interface DialogNode {
  id: string;
  speaker: string;
  text: string;
  options?: DialogOption[];
  nextNodeId?: string | null;
}

export interface Room {
  id: string;
  name: string;
  background: string;
  hotspots: Hotspot[];
  characters: Character[];
  walkableArea: { minX: number; maxX: number; minY: number; maxY: number };
  exits: { position: Position; width: number; height: number; targetRoom: string; targetPosition: Position }[];
}

export interface GameState {
  phase: GamePhase;
  currentRoom: string;
  playerPosition: Position;
  inventory: InventoryItem[];
  selectedVerb: Verb | null;
  selectedItem: InventoryItem | null;
  actionText: string;
  flags: Record<string, boolean>;
  dialogState: {
    isActive: boolean;
    currentNode: DialogNode | null;
    character: Character | null;
  };
}

export interface SaveData {
  slot: number;
  timestamp: number;
  gameState: GameState;
  roomStates: Record<string, { hotspots: Hotspot[]; characters: Character[] }>;
}
