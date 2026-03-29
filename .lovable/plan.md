

# New Scene: Garden Path & Locked Shed with Combination Lock

## Overview
Add a new navigable area — a **Garden Path** — accessible from the left side of the Backyard. It features a locked shed with a 3-digit combination lock (code: **754**, found on the scrawled note in the Production Room). Opening the shed advances the investigation.

## Changes

### 1. Generate Garden Path Background
Use the AI image generation API to create `src/assets/backgrounds/garden-path.png` — a nighttime outdoor path with hedges, a gravel walkway, and a wooden shed on the right side. Match the Backyard's dark Hollywood estate aesthetic.

### 2. Generate Shed Close-Up + Lock Assets
- `src/assets/backgrounds/shed-closeup.png` — frontal view of the shed door with a visible combination padlock
- The combination lock UI will be built in CSS/React (three digit wheels), no separate asset needed

### 3. Create `GardenPathScene.tsx`
New scene component following the BackyardScene pattern:
- **Background**: garden-path.png
- **Hotspots**: shed door, garden bench, old lantern, path back to backyard (right side nav)
- **Shed interaction**: Looking at it describes a padlocked shed. Using/opening it triggers a **combination lock overlay** (three scrollable digit inputs, 0-9 each). Entering **754** unlocks it, sets flag `shedUnlocked`, and transitions to shed interior view or reveals contents.
- **Combination Lock UI**: A modal overlay with three styled digit selectors. Wrong code shows "The lock doesn't budge." Correct code plays pickup SFX, sets flag, and opens the shed.

### 4. Add Navigation from Backyard
Add a new hotspot in `BackyardScene.tsx` on the left edge:
- "Garden Path" — navigates to `garden-path` room
- Nav indicator: `◄ Garden Path` on the left side

### 5. Wire into GameContainer
- Import `GardenPathScene`
- Add `case 'garden-path'` to the room switch with `setFlag` and `onAddToInventory` props

### 6. Shed Contents (what's inside)
Once unlocked, the shed reveals a **wire cutters** item — useful for the frayed wires in the Production Room or cutting through the overgrown hedge in the Backyard. This creates a new puzzle chain.

## Files

| File | Change |
|------|--------|
| `src/assets/backgrounds/garden-path.png` | AI-generated scene background |
| `src/assets/backgrounds/shed-closeup.png` | AI-generated shed door close-up |
| `src/components/game/GardenPathScene.tsx` | New scene with hotspots + combination lock overlay |
| `src/components/game/BackyardScene.tsx` | Add left-side navigation hotspot to garden path |
| `src/components/game/GameContainer.tsx` | Import + add case for `garden-path` room |
| `src/utils/preloadAssets.ts` | Add new assets to preload list |

