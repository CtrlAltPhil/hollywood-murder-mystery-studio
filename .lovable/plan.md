## Goal
Every time the player uses an inventory item on a character or object, they should get a response — either a witty refusal from the detective or a snappy reaction from the NPC. Right now, clicking Luke Adams with a photograph selected produces no response at all, and the response library is thin.

## Root cause of the silent Luke bug
In `src/hooks/useGameState.ts`, `selectItem()` sets `selectedItem` but leaves `selectedVerb` as `null` (unlike SCUMM, which auto-picks the "Use" verb). In `GameContainer.sharedHotspotClick`, the item-on-target branch only fires when `verb === 'use' && item`. With verb=null, the click falls through to `else if (verb)` which is also false — so nothing happens.

## Changes

### 1. Auto-select the "Use" verb when picking an inventory item
`src/hooks/useGameState.ts` — in `selectItem`, when an item is passed in and no verb is currently selected, set `selectedVerb: 'use'` and update `actionText` to `Use <Item>`. Clearing the item (`null`) leaves the verb alone.

### 2. Guarantee a response for item-on-anything
`src/components/game/GameContainer.tsx` — in `sharedHotspotClick`, when an item is selected but no verb (safety net for any lingering path), treat it as `use`. Ensure the branch always calls `setActionText(...)` and clears `selectedItem` after firing (so the player isn't stuck holding the item). Also route to `getCharacterItemResponse` whenever the target hotspot has a `talk: "__DIALOG__..."` interaction, even if the character also happens to have an unrelated `use_with_...` mapping.

### 3. Expand the response library
`src/utils/useItemResponses.ts`:
- Add per-character × per-item combos in a nested map `characterItemCombos[characterId][itemId]` for the memorable pairings (dagger + Luke/Duke/Cowardly/Lady, torn photograph + Luke, inheritance agreement + Luke, handkerchief + Luke, money bag + Duke/Carl, wine glass + Lady, meat stick + Carl/Cowardly, wire cutters + Duke, etc.). These take priority over generic character lines.
- Fill in reactions for missing NPCs: `duke` (currently only keyed as `el-fuego`), `jack` (Jack Celston), `los-cabos` (if reachable). Verify the exact character IDs from `dialogTrees.ts` / scene hotspots and key the map to those.
- Grow `itemSpecificResponses` for objects with 2-3 more witty lines per item so repeat failures don't loop.
- Add a small pool of target-aware detective quips for common object categories (car, door, painting, corpse, food, drink) picked by simple keyword match on `targetName`.
- Selection order in `getCharacterItemResponse(characterId, itemId)`:
  1. combo line (character + item) if defined
  2. character-specific reaction (60% weight, as today)
  3. detective refusal that names the character

### 4. Widen Luke's hitbox already fine, but double-check
No change needed unless verification shows the click isn't landing. If needed, nudge the hotspot width/height in `ParkingLotScene.tsx`.

## Verification
- Select torn photograph → click Luke → see a Luke-specific line about the photo.
- Select dagger → click car / painting / koi pond → see a themed refusal.
- Repeat the same combo 3× → see different lines.
- Selecting an item without first clicking Use still works (verb auto-becomes Use, action bar reads "Use <Item>").
