# Art Deco Title Screen Makeover

Transform the bland "HOLLYWOOD MURDER MYSTERY" title into a period-accurate Old Hollywood marquee.

## What you'll see

- **"HOLLYWOOD"** in **Limelight** — the iconic 1930s Deco display face used on vintage movie posters
- **"MURDER MYSTERY"** in **Cinzel Black** — a tall, chiseled Roman serif with wide letter-spacing, evoking carved stone and film credits
- A thin **"— A NOIR ADVENTURE —"** subtitle between the two lines, framed by glowing horizontal rules
- **Gold gradient fill** (pale gold → amber → bronze) instead of flat yellow, with a layered drop shadow for marquee-bulb depth
- **Staggered drop-in animation** on load — "HOLLYWOOD" lands first, then the subtitle rule sweeps in, then "MURDER MYSTERY" drops
- **Subtle flicker** on the title (like a worn neon sign), independent of the existing lightning
- Updated **PRESS START / CONTINUE** to use Cinzel with a softer pulsing gold glow that matches

## Technical changes

1. **`index.html`** — add Google Fonts preconnect + `<link>` for `Limelight` and `Cinzel` (weights 500/700/900)
2. **`src/index.css`** — add:
   - `.font-deco` / `.font-cinzel` font-family utilities
   - `.title-deco` (gradient text + layered drop-shadows + flicker animation)
   - `.title-sub` and `.title-rule` for the framed subtitle
   - `@keyframes title-flicker`, `title-drop-in`, `press-start-pulse`
   - Three staggered `.title-drop-1/2/3` classes
3. **`src/components/game/TitleScreen.tsx`** — replace the title `<div>` block (lines 179–203) with the new structure: HOLLYWOOD heading, decorative rule + subtitle, MURDER MYSTERY heading, restyled PRESS START / CONTINUE buttons. The previously-referenced `title-glow` and `pulse-glow` classes were never defined in CSS, so this also fixes that.

No changes to game logic, layout positioning of other elements (car, fireflies, lightning, vignette), or any other screens.
