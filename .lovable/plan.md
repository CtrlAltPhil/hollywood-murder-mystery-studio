

# UI Improvements: Cursor System and Compact Layout

## Overview
This plan addresses two key changes:
1. Remove the visible player character and use cursor-based interaction instead
2. Redesign the UI panel to take less screen space

---

## Part 1: Cursor-Based Interaction System

### Remove Player Character
- Delete the yellow circle placeholder from GameScene
- Remove player movement logic (no need to walk to positions)
- The scene becomes purely point-and-click investigation

### Dynamic Cursor System
The cursor will change based on the currently selected verb:

| Verb | Cursor |
|------|--------|
| Look at | Magnifying glass |
| Pick up | Grabbing hand |
| Use | Open hand / pointer |
| Open/Close | Hand with key |
| Talk to | Speech bubble |
| Push/Pull | Pointing hand |
| Default (no verb) | Standard arrow |

### Implementation
- Add custom cursor CSS classes in index.css using SVG data URIs
- Apply cursor class to GameScene based on `selectedVerb` state
- When hovering over hotspots, cursor may glow or highlight

---

## Part 2: Compact Classic SCUMM Layout

### Single-Row UI Panel Design
Reorganize the bottom panel into one efficient horizontal strip:

```text
+------------------------------------------------------------------+
|  [Look] [Pick up] [Use] [Open] [Close] [Talk] [Push] [Pull]      |
|  "Look at Bloody Dagger"                                          |
|  [inv1] [inv2] [inv3] [inv4] [inv5] [inv6] [<] [>]               |
+------------------------------------------------------------------+
```

**Optimizations:**
- Reduce verb button padding for a tighter grid
- Make action text a single compact line
- Shrink inventory slots from 64px to 48px
- Total height target: ~120-140px (down from ~200px)

### Alternative: Two-Column Layout
For even more space, use a side-by-side arrangement:

```text
+------------------------------------------------------------------+
| [Look][Pickup][Use][Open]  |  "Look at Bloody Dagger"  | [items] |
| [Close][Talk][Push][Pull]  |                           | [items] |
+------------------------------------------------------------------+
```

This puts verbs on the left, action text centered, inventory on right - all in approximately 80-100px of height.

---

## Technical Details

### Files to Modify

**src/components/game/GameScene.tsx**
- Remove the player character div (lines 240-249)
- Remove player movement state and effects (lines 79-111)
- Add dynamic cursor class based on selected verb
- Remove handleSceneClick movement logic

**src/components/game/GameContainer.tsx**
- Remove movePlayer calls
- Pass selectedVerb to GameScene for cursor changes

**src/components/game/VerbBar.tsx**
- Reduce padding from p-2 to p-1
- Make buttons smaller with reduced font size
- Compress the grid layout

**src/components/game/Inventory.tsx**
- Reduce slot size from w-16 h-16 (64px) to w-12 h-12 (48px)
- Reduce item images proportionally

**src/index.css**
- Add custom cursor definitions using SVG data URIs
- Add cursor classes for each verb type
- Update .verb-button styles for smaller sizing
- Update .inventory-slot for compact display

### Custom Cursor SVGs
Will create simple pixel-art style cursors:
- Magnifying glass (for Look)
- Grabbing hand (for Pick up)
- Open palm (for Use)
- Speech bubble (for Talk)

---

## Visual Result

After implementation:
- Scene area will be ~80% of viewport (up from ~70%)
- Floor of breakroom will be clearly visible
- Cursor changes provide clear feedback on selected action
- UI remains fully functional but more compact
- Classic SCUMM feel with modern usability

