

# Film Projector Cutscene — Wires Repaired Outcome

## Overview
When the player repairs the frayed wires, the film projector in the Production Room powers on. The player can then interact with the projector to watch a cutscene — a grainy film recording that reveals critical evidence (e.g., a secret meeting, a confrontation, or someone tampering with the electrical box before the blackout).

## Changes

### 1. Update Production Room after Wires Repaired
In `ProductionRoomScene.tsx`:
- Add a new hotspot for the **Film Projector** (near the camera/green screen area)
- When `wiresRepaired` is false: "The projector is dark. No power."
- When `wiresRepaired` is true: the projector hums, a light glows. Using or looking at it triggers `__PLAY_PROJECTOR__`
- Add a subtle visual indicator (e.g., a small glowing light overlay) when the projector is powered on

### 2. Create Projector Cutscene Component
New file `src/components/game/ProjectorCutscene.tsx`:
- A full-screen overlay styled as a grainy film projection (dark vignette, film grain effect, slight flicker via CSS)
- Displays a sequence of text cards and/or still images revealing the recording's content — e.g.:
  - *"The recording shows the production room hours before the party..."*
  - *"A figure enters and opens the electrical box..."*
  - *"They cut the red conduit wire with wire cutters, then place something inside the box door..."*
  - *"The figure turns — it's [character name or silhouette]..."*
- Player clicks to advance through frames, then the cutscene ends and returns to the Production Room
- Sets a flag `projectorWatched` when complete

### 3. Wire into GameContainer
- Handle `__PLAY_PROJECTOR__` action: show the projector cutscene overlay
- Add state for `showProjectorCutscene`
- On cutscene complete: set `projectorWatched` flag, log evidence entry

### 4. Add Evidence Entry
In `evidenceMap.ts`, add a `projectorWatched` flag entry:
- Title: "Security Camera Recording"
- Description: Summary of what the recording revealed
- Category: "Testimonies" or "Documents"

### 5. Update Preload
Add any new assets (film grain overlay texture if used) to `preloadAssets.ts`

## Files

| File | Change |
|------|--------|
| `src/components/game/ProductionRoomScene.tsx` | Add projector hotspot with powered-on/off states |
| `src/components/game/ProjectorCutscene.tsx` | New — grainy film cutscene overlay component |
| `src/components/game/GameContainer.tsx` | Handle `__PLAY_PROJECTOR__`, show cutscene, set flag |
| `src/data/evidenceMap.ts` | Add `projectorWatched` evidence entry |

