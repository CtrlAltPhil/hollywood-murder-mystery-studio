

## Fix Table Item Spacing

Based on the reference image, the current positioning has two issues:

1. **Charcuterie board** needs to be positioned higher (it sits above/behind the table, not on the table surface) and slightly more inward. It should also be a bit larger.
2. **Wine glasses** need to be shifted more toward the center-left of the table rather than pushed to the far right edge.

### Changes

**`src/components/game/GameScene.tsx`**
- Move the charcuterie board: change from `top-2 left-[5%]` to approximately `top-[-30%] left-[10%]` and increase height from `h-16` to `h-20` so it appears to sit on/above the table surface as shown in the reference
- Move the wine glasses: change from `top-0 right-[5%]` to approximately `top-[10%] left-[25%]` so they sit more centered on the table

**`src/components/game/IntroSequence.tsx`**
- Apply the same positioning adjustments to the intro scene so both scenes match

**`src/components/game/GameScene.tsx`** (hotspots)
- Update the `charcuterie-board` and `wine-glasses` hotspot x/y coordinates to align with the new visual positions

