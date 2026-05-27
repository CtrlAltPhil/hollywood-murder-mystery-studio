// Versioned, slot-based save system for Hollywood Murder Mystery.
// Supports 3 slots and silently migrates the legacy single-slot save
// (`hmm_save_game`) into slot 1 on first read.

export const SAVE_VERSION = 1;
export const SAVE_SLOTS = [1, 2, 3] as const;
export type SaveSlot = (typeof SAVE_SLOTS)[number];

const LEGACY_KEY = 'hmm_save_game';
const slotKey = (slot: SaveSlot) => `hmm_save_v${SAVE_VERSION}_slot_${slot}`;

export interface SaveData {
  version: number;
  savedAt: number;
  gameState: any;
  notes: {
    dialogueLog: any[];
    evidenceLog: any[];
  };
}

export interface SlotInfo {
  slot: SaveSlot;
  exists: boolean;
  savedAt?: number;
  phase?: string;
  currentRoom?: string;
}

function migrateLegacy() {
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (!legacy) return;
  if (!localStorage.getItem(slotKey(1))) {
    try {
      const parsed = JSON.parse(legacy);
      const wrapped: SaveData = {
        version: SAVE_VERSION,
        savedAt: parsed.savedAt ?? Date.now(),
        gameState: parsed.gameState ?? parsed,
        notes: parsed.notes ?? { dialogueLog: [], evidenceLog: [] },
      };
      localStorage.setItem(slotKey(1), JSON.stringify(wrapped));
    } catch {
      /* corrupted legacy save — drop it */
    }
  }
  localStorage.removeItem(LEGACY_KEY);
}

export function listSlots(): SlotInfo[] {
  migrateLegacy();
  return SAVE_SLOTS.map((slot) => {
    const raw = localStorage.getItem(slotKey(slot));
    if (!raw) return { slot, exists: false };
    try {
      const data: SaveData = JSON.parse(raw);
      return {
        slot,
        exists: true,
        savedAt: data.savedAt,
        phase: data.gameState?.phase,
        currentRoom: data.gameState?.currentRoom,
      };
    } catch {
      return { slot, exists: true };
    }
  });
}

export function hasAnySave(): boolean {
  migrateLegacy();
  return SAVE_SLOTS.some((s) => !!localStorage.getItem(slotKey(s)));
}

export function getMostRecentSlot(): SaveSlot | null {
  const slots = listSlots().filter((s) => s.exists && s.savedAt);
  if (!slots.length) return null;
  slots.sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
  return slots[0].slot;
}

export function writeSlot(slot: SaveSlot, data: Omit<SaveData, 'version' | 'savedAt'>) {
  const payload: SaveData = {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    ...data,
  };
  localStorage.setItem(slotKey(slot), JSON.stringify(payload));
}

export function readSlot(slot: SaveSlot): SaveData | null {
  const raw = localStorage.getItem(slotKey(slot));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SaveData;
    if (typeof parsed?.version !== 'number') return null;
    if (parsed.version > SAVE_VERSION) {
      // Future save — refuse rather than corrupt state
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function deleteSlot(slot: SaveSlot) {
  localStorage.removeItem(slotKey(slot));
}
