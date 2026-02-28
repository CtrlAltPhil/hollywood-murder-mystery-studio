

## Audio System Plan

### Approach
Use the **Web Audio API** to synthesize all sounds procedurally — no external files needed. This gives us retro-appropriate bleeps and atmospheric drones that match the pixel-art SCUMM aesthetic.

### New Files

**`src/hooks/useAudioEngine.ts`** — Central audio engine hook:
- Creates a single `AudioContext` (lazy-initialized on first user click)
- Exposes functions:
  - `playBackgroundTrack(phase)` — generates looping synthesized ambient music per phase using oscillators + gain envelopes:
    - **Title**: slow, mysterious pad (low-frequency oscillator chord)
    - **Intro/Party**: upbeat simple melody loop
    - **Blackout/Murder-reveal**: silence, then a single dramatic sting
    - **Gameplay**: moody investigation drone
  - `playDialogBlip(speaker)` — short pitched blip per character on each typewriter letter (different pitch per speaker: Carl=low, Lady=high, El Fuego=mid)
  - `playSfx(type)` — one-shot effects: `'pickup'`, `'click'`, `'door'`
  - `setMusicVolume(v)` / `setSfxVolume(v)`
- Replaces the current `useBackgroundMusic` hook

### Modified Files

**`src/components/game/DialogBox.tsx`**:
- Accept `playDialogBlip` callback prop
- Call it on each typewriter tick with `node.speaker` to produce character-specific blips

**`src/components/game/GameContainer.tsx`**:
- Replace `useBackgroundMusic` with `useAudioEngine`
- Pass `playDialogBlip` to `DialogBox`
- Call `playSfx('pickup')` when items are added to inventory
- Call `playBackgroundTrack(phase)` on phase changes

**`src/components/game/TitleScreen.tsx`**:
- Play a UI click sound on "Start Game" button press

### Implementation Steps

1. Create `useAudioEngine` hook with Web Audio API synthesis for background tracks, dialog blips, and SFX
2. Wire `GameContainer` to use the new audio engine for phase-based music and inventory SFX
3. Add dialog blip sounds to `DialogBox` typewriter effect
4. Remove old `useBackgroundMusic` hook

