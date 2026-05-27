# Hollywood Murder Mystery

A SCUMM-style point-and-click adventure game set in 1940s Hollywood. Investigate the murder of a beloved star, interrogate suspects, collect evidence, and piece together the case across hand-painted noir scenes.

Live: https://hollywoodmystery.lovable.app

## Gameplay

- Classic verb-coin interface (Look, Use, Open, Talk, etc.) inspired by LucasArts adventures
- Branching dialogue with evidence-driven options
- Inventory and "Use [Item] with [Hotspot]" interactions
- Notes / case file tracking discovered clues
- 3 save slots, persisted locally
- Keyboard shortcuts and adjustable audio + brightness

## Tech

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Canvas + CSS sprite rendering, Web Audio API for procedural MIDI score
- LocalStorage save system (versioned)
- Packaged for web and Electron (relative asset paths, bundled fonts)

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Debug

The Konami code (↑ ↑ ↓ ↓ ← → ← → B A) toggles the debug overlay (hotspot bounds, grid).
