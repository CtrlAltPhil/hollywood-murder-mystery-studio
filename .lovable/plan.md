

## Dialogue System Implementation Plan

### Overview
Add a branching conversation system where clicking "Talk to" on Carl, Lady, or El Fuego opens a dialog box with NPC speech and player response options. Dialogue branches change based on discovered evidence (game flags like `daggerTaken`, `examinedBody`, etc.).

### New Files

**`src/data/dialogTrees.ts`** — All dialogue data for the three characters:
- Each character gets a map of `DialogNode` objects keyed by node ID
- Root node selected dynamically based on `gameState.flags` (e.g., if `daggerTaken` is true, new dialogue options unlock)
- Factory function: `getDialogTree(characterId: string, flags: Record<string, boolean>): DialogNode`
- Each node has `speaker`, `text`, `options[]` with `text`, `nextNodeId`, optional `condition` (checked against flags), and optional `onSelect` callback for setting flags

Example structure:
- **Carl**: Calm, evasive. Initially deflects. If player has dagger, can confront him about fingerprints. Reveals he saw Lady arguing with Los Cabos.
- **Lady**: Emotional, defensive. Claims she was in the restroom. If body examined, can press her on timeline inconsistency. Mentions El Fuego's temper.
- **El Fuego**: Nervous, sweating. Says he was getting drinks. If dagger taken, stammers about the weapon. Points finger at Carl's calmness.

**`src/components/game/DialogBox.tsx`** — The dialog UI overlay:
- Renders over the scene area (not fullscreen — sits at bottom of scene like classic SCUMM)
- Shows speaker name, speech text with typewriter effect
- Shows clickable player response options when available
- "Continue" click for nodes without options (advances to `nextNodeId` or closes)
- Styled to match the existing purple/gold SCUMM UI theme

### Modified Files

**`src/components/game/GameContainer.tsx`**:
- Destructure `startDialog`, `advanceDialog` from `useGameState`
- Import `getDialogTree` and `DialogBox`
- In `onHotspotClick`: when verb is `talk` and hotspot is a character, call `startDialog` with the character and root dialog node
- Render `<DialogBox>` when `gameState.dialogState.isActive`, passing `currentNode`, handlers for option selection and advancing
- Option selection calls `advanceDialog` with next node (looked up from tree), plus runs `onSelect` callbacks (which call `setFlag`)

**`src/components/game/GameScene.tsx`**:
- Update character hotspot `talk` interactions to return a sentinel value or call a callback instead of returning static strings — so GameContainer knows to open dialog mode

**`src/types/game.ts`**:
- No changes needed — `DialogNode`, `DialogOption`, and `dialogState` already exist

### Implementation Steps

1. Create `src/data/dialogTrees.ts` with branching dialogue data for all three characters
2. Create `src/components/game/DialogBox.tsx` with typewriter text, speaker name, and clickable options
3. Update `GameContainer.tsx` to wire up dialog open/advance/close flow
4. Update `GameScene.tsx` character hotspots to trigger dialog mode on "Talk to"

