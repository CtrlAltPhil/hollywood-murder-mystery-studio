

# Parking Lot Scene + NPC Relocation

## What We're Building

1. **New Parking Lot scene** accessible from the Backyard (right side exit), containing:
   - **Duke Extreme's car** — vanity plate "XTRM DUK", open trunk with a **monogrammed handkerchief** (initials "L.A." — Luke Adams, Carl's alias) and a **torn photograph**
   - **Police vehicle** — the player's car, with hotspot interactions ("My cruiser. At least it's still in one piece.")
   - **Dumpster** — red herring (crumpled deal memo)
   - **Security camera** — cable cut cleanly (ties to wire cutters evidence)
   - **Oil stain** — beneath Duke's car, suggests recent activity

2. **New inventory items**:
   - `monogrammed_handkerchief` — initials "L.A." ; picking it up sets flag `handkerchiefTaken`
   - `torn_photograph` — shows two people at a signing; sets flag `photoTaken`

3. **NPC relocation logic**: Once `handkerchiefTaken` is true, Lady Fantastique moves from her current location (Breakroom) to her room. This will be handled by checking the flag in the Breakroom scene (hide her character hotspot) and ensuring she appears in `LadyFantastiqueRoomScene`.

4. **Evidence map updates**: New entries for the handkerchief, torn photograph, and security camera discovery.

5. **Luke Adams / Carl connection**: The handkerchief's "L.A." initials will be noted in evidence. Dialog branches connecting "Luke Adams" to Carl will come in a follow-up pass when we build out the dialog trees.

## Technical Plan

### New Files
- `src/components/game/ParkingLotScene.tsx` — follows the exact same pattern as BackyardScene (SimpleHotspot array, getCursorClass, handleSceneHotspotClick, flag-gated pickups). Background will be a CSS gradient/procedural dark parking lot until a proper asset is added. Props: `gameState`, `onHotspotHover`, `onHotspotClick`, `onChangeRoom`, `onEmptyClick`, `debugMode`, `setFlag`, `onAddToInventory`.

### Modified Files

- **`BackyardScene.tsx`** — Add a new hotspot on the right side ("Parking Lot") that navigates to `parking-lot`. Add a right-side nav indicator.

- **`GameContainer.tsx`**:
  - Import `ParkingLotScene`
  - Add `case 'parking-lot'` in `renderCurrentRoom` switch
  - Add item descriptions for `monogrammed_handkerchief` and `torn_photograph` in the descriptions map

- **`evidenceMap.ts`** — Add entries for `monogrammed_handkerchief`, `torn_photograph`, and a flag entry for `securityCameraFound`

- **`preloadAssets.ts`** — Register parking lot room assets

- **`GameScene.tsx` (Breakroom)** — Check `handkerchiefTaken` flag; if true, hide Lady Fantastique's character hotspot so she appears to have relocated

- **`LadyFantastiqueRoomScene.tsx`** — Ensure Lady Fantastique's character appears when `handkerchiefTaken` is true (she may already be there; will verify and adjust)

