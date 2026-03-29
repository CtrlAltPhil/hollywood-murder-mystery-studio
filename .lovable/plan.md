

# Performance: Smooth Scene Transitions & Asset Preloading

## Problem
Two visible lag issues:
1. **Intro → Gameplay transition**: After the blackout, the breakroom scene renders but character images visibly pop in as they load.
2. **Backyard scene**: The waterfall frames load before the background, causing a flash of incomplete content.

**Root cause**: All scene images are loaded on-demand when a component mounts. There is no preloading, and no "ready" gate that waits for assets before revealing the scene.

## Solution

### 1. Create an Asset Preloader Utility (`src/utils/preloadAssets.ts`)
- Export a `preloadImages(urls: string[]): Promise<void>` function that creates `Image` objects for each URL and resolves when all have loaded.
- Export a manifest of **all game assets** grouped by scene (breakroom characters, backyard waterfall frames, production room images, etc.) so they can be bulk-loaded.

### 2. Preload Critical Assets During Title Screen
- In `GameContainer`, when the game is on the `title` phase, call `preloadImages` with the full asset manifest in a `useEffect`.
- Store a `assetsReady` boolean in state. This runs in the background while the player is on the title screen, so by the time they click "Start," most assets are already cached.

### 3. Add a Loading Gate on Scene Transitions
- In `handleChangeRoom`, the existing fade-to-black transition (`roomTransition` state with 400ms delay) should also preload the target room's assets before revealing.
- Extend the black overlay to stay visible until the target scene's images are cached, then fade in. This prevents partial rendering.

### 4. Gate the Intro → Gameplay Transition
- In `handleIntroComplete`, before setting phase to `gameplay`, preload the breakroom scene assets (characters, props, background). The screen is already black during the blackout phase, so this adds no visible delay — it just holds the black screen slightly longer if needed.

### 5. Fix the Backyard Waterfall Loading Order
- In `BackyardScene`, render the waterfall frames and background together but keep the entire scene hidden (opacity 0) until all images have loaded via `onLoad` callbacks. Fade in once ready.

## Files Changed

| File | Change |
|------|--------|
| `src/utils/preloadAssets.ts` | **New** — `preloadImages()` helper and asset manifest by scene |
| `src/components/game/GameContainer.tsx` | Preload all assets on title screen; gate intro→gameplay transition; extend room transition to wait for assets |
| `src/components/game/BackyardScene.tsx` | Add onLoad tracking for waterfall/background images; hide scene until ready |
| `src/components/game/GameScene.tsx` | Add onLoad tracking for character images; hide scene until ready |

## Technical Details
- Uses native `new Image()` with `onload`/`onerror` promises — no external libraries needed.
- Vite's static imports (e.g., `import img from '@/assets/...'`) return resolved URLs at build time, so they work directly with the preloader.
- The title screen preload is best-effort — if the player starts quickly, the per-scene gates still prevent flicker.

