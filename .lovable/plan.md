

## Revised Plan: Standardize Scene Components (No Auto Height)

### What changed from previous plan
Removed `height: "auto"` from the standardized positioning approach. All sprites will use **explicit percentage-based width AND height** so you have full control over sizing on every screen size, including mobile.

### Changes

**Create `src/utils/sceneHelpers.ts`**
- Extract shared `getCursorClass` (eliminates 8 duplicates)
- Extract shared `handleSceneHotspotClick` for `__NAVIGATE__`, `__DIALOG__`, `__PICKUP__` patterns

**Standardize all sprite positioning to inline `style` with explicit percentages**
- Every sprite gets: `style={{ left: "X%", top: "Y%", width: "W%", height: "H%" }}`
- No `height: "auto"` — you set both dimensions explicitly
- Update GameScene (Tailwind → inline styles) and KitchenScene similarly
- StudyScene already uses inline styles but its `height: "auto"` will be replaced with an explicit value

**Standardize pickup handling**
- Replace StudyScene's one-off `onPickupKey` prop with the standard `onAddToInventory` pattern from GameScene
- Update GameContainer to remove `onPickupKey` wiring

**Standardize hotspot filtering**
- Use the `activeHotspots` filter pattern everywhere for taken items

**Files touched**: `sceneHelpers.ts` (new), GameScene, StudyScene, HallwayScene, HallwayKitchenScene, BackyardScene, KitchenScene, ProductionRoomScene, LadyFantastiqueRoomScene, LosCabosRoomScene, GameContainer

