

# Notes System — Implementation Plan

## Overview
Add a notepad icon (top-left, gameplay only) that opens a full-screen overlay with two tabs: **Dialogue History** and **Evidence**. A notification dot appears on the icon when new entries are logged.

## What Gets Built

### 1. Notes State (in `useGameState` or a new `useNotesState` hook)
- **dialogueLog**: Array of `{ speaker, text, timestamp }` entries, recorded every time a dialog node is displayed
- **evidenceLog**: Array of `{ id, title, description, category }` entries, auto-added when relevant flags are set or items picked up
- **Categories**: Physical Evidence, Documents, Testimonies
- **hasUnread**: boolean flag, set true on new entries, cleared when notes are opened

### 2. Auto-Logging
- **Dialogue**: Hook into `DialogBox` or the dialog advancement flow in `GameContainer` — each time a dialog node renders, push `{ speaker, text }` to the log
- **Evidence**: Hook into `setFlag` and `addToInventory` — map specific flags/items to evidence entries (e.g., `drawerOpened` → "Threatening note found in Los Cabos' desk drawer: 'Decline the offer or else.'")

### 3. New Component: `NotesOverlay.tsx`
- Full-screen overlay with dark semi-transparent backdrop, styled to match the game's purple/amber theme
- Left sidebar with two tabs: **Dialogue** and **Evidence**
- Close button (X) in top-right corner

**Dialogue Tab**:
- Toggle between "By Character" and "Chronological" views
- Character view: collapsible sections per character, each showing their dialogue lines
- Chronological view: scrollable list in order of occurrence

**Evidence Tab**:
- Grouped by category (Physical Evidence, Documents, Testimonies)
- Each entry shows title and description

### 4. Notepad Icon
- Positioned top-left of the game scene area (inside `GameContainer`, only visible during `gameplay` phase)
- Uses a `NotebookPen` or `BookOpen` icon from lucide-react
- Amber/gold color to match UI theme
- Small pulsing red dot when `hasUnread` is true

## Files Changed

| File | Change |
|------|--------|
| `src/types/game.ts` | Add `DialogueEntry`, `EvidenceEntry` types |
| `src/hooks/useGameState.ts` | Add `dialogueLog`, `evidenceLog`, `hasUnread` to state; add `logDialogue`, `logEvidence`, `clearUnread` actions |
| `src/components/game/NotesOverlay.tsx` | **New** — full overlay component with tabs |
| `src/components/game/GameContainer.tsx` | Add notepad icon button, render `NotesOverlay`, wire dialogue logging into dialog flow, wire evidence logging into flag/inventory handlers |
| `src/data/evidenceMap.ts` | **New** — mapping of flag names and item IDs to evidence entries with categories |

