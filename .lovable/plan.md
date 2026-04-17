

## Problem
When a dialogue branch ends with `nextNodeId: 'carl-root'`, the player is returned to the root node and the character's full intro line ("Hmm? Oh, you want to talk. Fine. What do you want to know?") is typed out again — slow and repetitive.

## Solution: "Return to options" without re-typing

Introduce a lightweight **re-prompt** mechanism that shows the root's option list again with a short, varied filler line (or no typing at all) instead of replaying the full intro.

### Approach

Add an optional `shortText` field to `DialogNode` in `src/types/game.ts`. When the dialog system navigates to a node that has already been visited in the current conversation, `DialogBox` renders `shortText` (e.g. "Anything else?") instead of `text`. First visit still uses the full `text`.

```ts
// types/game.ts
export interface DialogNode {
  id: string;
  speaker: string;
  text: string;
  shortText?: string;  // shown on revisit
  // ...existing fields
}
```

### Implementation

1. **`src/types/game.ts`** — add `shortText?: string` to `DialogNode`.

2. **`src/components/game/DialogBox.tsx`**:
   - Accept a new prop `isRevisit: boolean`.
   - When `isRevisit && node.shortText` is true, use `shortText` for the typewriter (much shorter, finishes near-instantly).
   - Optionally skip the typewriter entirely on revisit (render immediately) for snappier flow.

3. **`src/components/game/GameContainer.tsx`** (or wherever dialog state lives):
   - Track a `Set<string>` of visited node IDs for the current conversation.
   - Reset the set when a new conversation starts (speaker change / dialog opens).
   - Pass `isRevisit={visitedNodes.has(node.id)}` to `DialogBox`.
   - Add the current node ID to the set whenever it changes.

4. **`src/data/dialogTrees.ts`** — add `shortText` to each character's root node:
   - Carl: `"What else?"`
   - Lady Fantastique: `"Yes, darling?"`
   - Lady Fantastique (room tree): `"More questions?"`
   - Duke Extreme: `"Yeah? What now?"`
   - Chef Allegro: `"Anything else, eh?"`
   - (etc. — root nodes only; mid-branch nodes don't need it)

5. **Optional polish**: rename branch-end option labels from `"I have more questions."` → `"Back to questions."` for clarity. (Quick find/replace across `dialogTrees.ts`.)

### Why this approach
- Backward compatible: nodes without `shortText` still play their full `text`.
- No structural change to the dialog tree — just a per-node hint.
- Conversation-scoped (not permanent) so re-entering a conversation later still gets the full intro.

### Files touched
- `src/types/game.ts` (add field)
- `src/components/game/DialogBox.tsx` (revisit-aware rendering)
- `src/components/game/GameContainer.tsx` (track visited node IDs)
- `src/data/dialogTrees.ts` (add `shortText` to root nodes; optional label tidy)

