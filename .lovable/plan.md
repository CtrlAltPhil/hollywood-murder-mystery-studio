

# Fix: Robust Save & Load System

## Current Problems

1. **Load is completely broken**: `handleLoadGame` parses the save data, sets `hmm_load_pending` in localStorage, then reloads the page — but **no code on mount ever checks for `hmm_load_pending`** or restores the saved state. The parsed data is discarded.
2. **Notes not saved**: Dialogue history and evidence are not included in the save data, so they'd be lost on load.
3. **Non-serializable data**: `gameState.dialogState` contains object references (character, dialogNode) that may not round-trip cleanly through JSON.
4. **Page reload is fragile**: Reloading wipes all React state. A proper in-place restore avoids this entirely.

## Solution

### 1. Add `restoreState` to `useGameState.ts`
- New method that replaces the entire game state with a saved snapshot, clearing transient fields (selectedVerb, selectedItem, dialogState).

### 2. Add `restoreNotes` to `useNotesState.ts`
- New method that bulk-sets dialogueLog and evidenceLog, and rebuilds the `loggedEvidenceIds` ref to prevent duplicate entries.

### 3. Rewrite save/load in `GameContainer.tsx`

**Save**: Serialize both `gameState` and `{ dialogueLog, evidenceLog }` into one localStorage entry. Clear non-serializable fields (dialogState) before saving.

**Load**: Read localStorage, call `restoreState()` and `restoreNotes()` in-place — no page reload. Works from both title screen and in-game menu.

### 4. Expose `resetNotes` for restart
- On restart, call `resetNotes()` and clear the save data before reloading.

## Files Changed

| File | Change |
|------|--------|
| `src/hooks/useGameState.ts` | Add `restoreState(saved)` method |
| `src/hooks/useNotesState.ts` | Add `restoreNotes(dialogueLog, evidenceLog)` method |
| `src/components/game/GameContainer.tsx` | Rewrite `handleSave` to include notes; rewrite `handleLoadGame` to restore in-place without reload |

## Why This Is Robust for Browser Play
- **localStorage** persists across browser sessions, tabs, and computer restarts — perfect for single-player browser games.
- No page reload means no race conditions or lost state.
- Save data is validated with try/catch for corrupted data.
- All game progress (inventory, flags, room, position, notes, evidence) is captured in one atomic save.

