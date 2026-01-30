
# Hollywood Murder Mystery - SCUMM-Style Point & Click Adventure

## Project Overview
A browser-based point-and-click adventure game in the classic SCUMM style, featuring a Hollywood murder mystery set at GB Studios. The game combines retro pixel art aesthetics with classic adventure game mechanics.

---

## Phase 1: Title Screen & Opening Sequence

### Title Screen
- Dramatic view of GB Studios exterior at night with the stormy sky
- Animated lightning flashes illuminating the scene
- Parallax cars driving by in the foreground
- "HOLLYWOOD MURDER MYSTERY" title with retro pixel font
- Pulsing "PRESS START" button with nostalgic glow effect
- Ambient thunder sound effects (optional, can add later)

### Transition to Party Scene
- Fade to black transition
- Scene opens in the Breakroom during the party
- Characters positioned around the room enjoying the celebration
- Brief moment to establish the atmosphere

### The Murder Reveal
- Screen goes completely dark for 2-3 seconds
- Dramatic return of lights
- Victim character now lying on the floor
- Bloody dagger visible beside them
- Game UI appears and gameplay begins

---

## Phase 2: Core Game Engine

### Classic SCUMM Verb Bar
- Bottom panel with action verbs: **Look at**, **Pick up**, **Use**, **Open**, **Close**, **Talk to**, **Push**, **Pull**
- Selected verb highlights and combines with clicked objects
- Contextual cursor that changes based on hotspots
- Text display showing current action (e.g., "Use Dagger with...")

### Point-and-Click Movement
- Click anywhere in the walkable area to move the player character
- Smooth gliding movement initially (walk animations can be added later)
- Walk-behind objects for depth (tables, furniture)
- Blocked areas that prevent walking through walls

### Inventory System
- Scrollable inventory panel at bottom of screen (classic SCUMM style)
- Items appear when picked up with pixel art thumbnails
- Drag items onto scene objects or other inventory items to combine
- "Use X with Y" puzzle solving mechanic

---

## Phase 3: Dialog & Interaction System

### Dialog Trees
- Portrait-style character dialog boxes
- Multiple-choice responses for the player
- Branching conversations that reveal clues
- Characters remember previous conversations

### Hotspot System
- Interactive objects highlighted on hover
- Each object responds to different verbs differently
- "Look at" provides descriptions and clues
- "Talk to" triggers character dialog

---

## Phase 4: Game State & Progression

### Browser Save System
- Auto-save at key story moments
- Manual save/load slots (3 save slots)
- Saves inventory, room state, story progress, and dialog flags

### Scene Management
- Room-to-room navigation (doors, exits)
- Room state persistence (items taken, objects moved)
- Story flag system for puzzle progression

---

## Phase 5: Demo Content

### Rooms in Demo
1. **GB Studios Exterior** - Title screen location, can return to investigate outside
2. **Breakroom** - Main crime scene, party location, where murder occurs

### Interactive Elements
- Props on tables that can be examined
- Wine glasses (potential poison clue?)
- The dagger (murder weapon)
- Characters to interrogate
- Doors connecting rooms

### Characters
- **El Fuego** - One of the suspects/witnesses
- Additional characters (you'll provide sprites)
- One character becomes the victim

---

## Visual Style
- 4:3 or 16:9 aspect ratio game window (classic feel)
- Pixel art aesthetic matching your assets
- Dark, moody color palette for the mystery atmosphere
- Retro-styled UI elements and fonts
- Scanline filter option for extra nostalgia (toggleable)

---

## Technical Implementation
- Built with React for the web
- Canvas-based rendering for game scenes
- Responsive design that works on desktop and tablets
- No backend required - everything runs in the browser
- Easy to add new rooms and content as you create assets
