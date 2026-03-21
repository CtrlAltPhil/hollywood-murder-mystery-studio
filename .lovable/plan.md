

## ✅ Standardize Scene Components (Completed)

All scene components now follow a consistent pattern:

### What was done
1. **Created `src/utils/sceneHelpers.ts`** — shared `getCursorClass`, `handleSceneHotspotClick`, and `SimpleHotspot` type (eliminated 8 duplicates)
2. **All sprites use inline `style` with explicit percentage-based positioning** — `style={{ left, top, width, height }}` with no `height: "auto"`
3. **Unified pickup pattern** — StudyScene now uses `onAddToInventory` + `setFlag` props (same as GameScene), removed one-off `onPickupKey` prop
4. **Standardized hotspot filtering** — `activeHotspots` filter pattern used consistently
5. **Updated 10 files**: sceneHelpers (new), GameScene, StudyScene, HallwayScene, HallwayKitchenScene, BackyardScene, KitchenScene, ProductionRoomScene, LadyFantastiqueRoomScene, LosCabosRoomScene, GameContainer
