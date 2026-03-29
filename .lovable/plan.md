

# Reimagine Shed Lock & Add Shed Interior Scene

## Overview
Replace the current "giant combo lock on shed door" close-up with a smaller, more realistic padlock interaction, and create a new **Shed Interior** scene that the player enters after unlocking. The shed interior contains inspectable items including the wire cutters.

## Changes

### 1. Rework the Lock Interaction in `GardenPathScene.tsx`
- Remove the full-screen shed close-up with the oversized combo lock UI
- Instead, when the player interacts with the shed door (open/use), show a **small padlock overlay** anchored to the shed door area -- a compact 3-digit lock widget (roughly 15-20% of the screen) positioned near the shed handle, not filling the whole view
- On correct code (754): set `shedUnlocked` flag, show brief unlock feedback
- On subsequent visits when unlocked: clicking the shed navigates to the new `shed-interior` room
- Remove the wire cutters pickup from GardenPathScene entirely

### 2. Create `ShedInteriorScene.tsx`
New scene following the standard scene architecture:
- **Background**: AI-generated `shed-interior.png` -- dark, cluttered tool shed interior (workbench, shelves, old crates, rusty tools on wall hooks)
- **Hotspots**:
  - **Wire Cutters** (pickup) -- "A sturdy pair of wire cutters. These have been used recently... the blades have fresh copper residue on them." Links to the cut wires in the Production Room
  - **Workbench** (look) -- "A dusty workbench covered in old tools and wood shavings. Someone's been working here recently."
  - **Shelving** (look) -- "Rusty shelves with paint cans and garden chemicals. Nothing useful."
  - **Old Crate** (look/open) -- "A wooden crate marked 'PROPS - DO NOT REMOVE'. It's empty now."
  - **Back to Garden** -- exit hotspot returning to `garden-path`
- Wire cutters use the existing `wire-cutters.png` sprite, positioned on the workbench

### 3. Update `GameContainer.tsx`
- Import `ShedInteriorScene`
- Add `case 'shed-interior'` to the room switch

### 4. Update `preloadAssets.ts`
- Add `shed-interior.png` to preload list

### 5. Generate Asset
- `src/assets/backgrounds/shed-interior.png` -- AI-generated dark tool shed interior matching the estate's aesthetic

## Files Modified/Created
| File | Change |
|------|--------|
| `src/components/game/GardenPathScene.tsx` | Replace full-screen lock close-up with compact padlock widget; navigate to shed-interior when unlocked |
| `src/components/game/ShedInteriorScene.tsx` | New scene with inspectable items + wire cutters pickup |
| `src/components/game/GameContainer.tsx` | Add shed-interior case |
| `src/utils/preloadAssets.ts` | Add shed-interior.png |
| `src/assets/backgrounds/shed-interior.png` | New AI-generated background |

