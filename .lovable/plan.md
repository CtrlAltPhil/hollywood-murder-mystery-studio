

# Character Animations & Reactions Enhancement

## Overview
Add life to all characters through CSS-driven idle animations on existing sprites, plus generate AI sprite variants for emotional reactions tied to evidence discoveries.

## Phase 1: CSS Idle Animations (All Characters, No New Assets)

Add subtle idle animations to every character across all scenes:

| Character | Animation | Technique |
|-----------|-----------|-----------|
| Lady Fantastique | Gentle breathing + slight sway | `scale` pulse (1.0→1.015) on Y axis, 3s loop |
| Carl | Subtle weight shift | Slight `translateX` oscillation, 4s loop |
| Los Cabos (dead) | None (stays static — intentional contrast) | — |
| Chef Allegro | Slow blink already exists; add breathing | `scaleY` pulse on container |
| Sous Chef Sally | Fidgeting/shifting | `rotate` micro-oscillation ±0.5deg |
| Duke Extreme | Already has 2-pose swap; smooth it with crossfade | Improve existing transition timing |

Each animation uses CSS `@keyframes` in Tailwind config — no sprite sheets needed.

## Phase 2: AI-Generated Reaction Variants

Generate 1-2 additional emotional variants per character using the image generation API. Each variant is triggered by confronting a character with specific evidence.

**Variants to generate:**
- **Lady Fantastique — nervous** (when shown the wine glass)
- **Carl — smirking** (when shown the dagger — he's too calm)
- **Duke Extreme — panicked** (when confronted about money)
- **Chef Allegro — defensive** (when asked about the kitchen)

**Process:** Use `google/gemini-3.1-flash-image-preview` with the existing character PNG as reference input, requesting the same art style with a different expression. Save generated PNGs to `src/assets/characters/`. If quality doesn't match, fall back to CSS-only effects (color tint, slight blur, shake animation).

## Phase 3: Evidence-Triggered Reactions

Wire up the flag system so characters change state when evidence is shown:

- Using wine glass on Lady → swap to nervous sprite, unlock new dialog branch
- Using dagger on Carl → swap to smirking sprite, new dialog
- Using money bag on Duke → swap to panicked sprite, new dialog
- Sprite swaps persist via `gameState.flags` (e.g., `ladyNervous: true`)

The `use_with_*` interactions already exist in `GameScene.tsx` — extend them to also set flags and trigger sprite swaps.

## Files Changed

| File | Change |
|------|--------|
| `tailwind.config.ts` | Add `breathing`, `sway`, `fidget` keyframes |
| `src/components/game/GameScene.tsx` | Add CSS idle animations to all characters; add flag-based sprite swapping for reaction variants |
| `src/components/game/ProductionRoomScene.tsx` | Add idle animation to Chef Allegro |
| `src/components/game/KitchenScene.tsx` | Add idle animation to Sally/Chef if present |
| `src/components/game/DukeExtremeRoomScene.tsx` | Add idle animation if Duke appears here |
| `src/assets/characters/` | New AI-generated variant PNGs (lady-nervous, carl-smirking, duke-panicked, chef-defensive) |
| `src/data/dialogTrees.ts` | New dialog branches unlocked by reaction flags |

## Approach Order
1. Add all CSS idle animations first (immediate visual improvement)
2. Generate one test variant (Lady Fantastique nervous) to validate style match
3. If acceptable, generate remaining variants
4. Wire up flag-based sprite swapping and new dialog branches

