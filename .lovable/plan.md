
# Aligning the Game with the New Official Script

The new script is a tighter, more coherent version of the story than what the codebase currently implements. Good news: a lot of the infrastructure you already built (Duke's room, Lady's room, parking lot with Luke's SUV, the electrical sabotage chain, the projector cutscene revealing "L.A.", the kitchen, the **Study**) lines up beautifully with the new direction. The "L.A." handkerchief was already foreshadowing **Luke Adams** — perfect.

What needs to change is mostly **content** (dialogue, character lineup, motives, intro), plus **a few new NPCs** and **a final accusation flow**.

---

## Part 1 — Story & Character Reconciliation

### Renames / role changes
- **Lady Fantastique → Lady Fantastica** (already partly done; sweep remaining references)
- **El Fuego → Duke Extreme** (already done in most places; verify `fuego-` dialog node IDs)
- **Carl** keeps his name, but his role narrows to "props & lights crew, innocent but flustered" (drop the "business partner / co-producer" backstory)
- **Los Cabos** stays as the victim, but his motive is now **inheritance** (contract assigns assets to Jack Celston on death), not a buyout offer
- **The Study = Jack Celston's Office**. Reuse the existing `StudyScene.tsx` — re-skin the framing copy ("GB Studios — Movie Production Study Room" → Jack Celston's office) and use the existing desk hotspot to surface the Inheritance Agreement.

### New characters to add
1. **Chef Allegro** — head chef, warm and cooperative, in the Kitchen
2. **Sous Chef Sally** — guarded, one-word answers, also in the Kitchen
3. **Mr. Cowardly** — terrified janitor, runs from Stanley on first approach, found in a hallway
4. **Luke Adams** — already present in the parking lot scene as the SUV owner; promote him to a fully interviewable on-screen NPC

### Characters/threads to retire from the active suspect pool
- The old "Carl had a buyout motive / shared profits" thread
- Lady Fantastica's "denied lead role" argument with Los Cabos
- Duke Extreme's "money problems / hired hitman" red herring (cash bag in his room)

These currently drive a lot of dialogue and evidence; we will replace them with the new script's evidence chain.

---

## Part 2 — Scene-by-Scene Changes

### Scene 1 — Opening / Dinner Party (rewrite)
Update `IntroSequence.tsx` and the party blackout sequence to match the new script:
- Pre-blackout line: Duke Extreme — "The wine is exquisite tonight."
- Blackout SFX: generator groan, fast deliberate footsteps from the **left door**, thud on the **far right**, lights back on, body on floor
- Post-blackout reactions in order: Lady Fantastica (dramatic), Duke Extreme (calm "Nobody move"), Carl (disbelief)
- Stanley enters and delivers his intro line + on-screen "Detective Stanley Wilson" intro card

### Scene 2 — Initial Witness Interviews (party room)
Rewrite the in-party dialog trees for **Lady Fantastica**, **Duke Extreme**, and **Carl** to match the script verbatim where possible, surfacing the three key clues:
- Lady: someone bumped her chair, came from the **left door**
- Duke: heard door open → fast footsteps → silence → thud
- Carl: nervous rambling, confirms no one was at the light switch (innocent)

### Scene 3 — Studio Investigation (new + revised dialog)
- **Chef Allegro** (new) — saw a tall, dark-haired stranger claiming to be new staff
- **Sous Chef Sally** (new) — one-word answers, eventually reveals the stranger had a knife "not ours"
- **Mr. Cowardly** (new) — runs on first approach, then confides he saw the stranger enter the party room
- **Luke Adams** (new dialog tree) — cool, composed alibi ("storage room, alone"), suspicious calmness

### Scene 4 — Jack Celston's Office (reuse the Study)
- Re-skin `StudyScene.tsx` framing copy so signage and look-text identify it as Jack Celston's office (GB Studios owner)
- Repurpose the existing desk hotspot: opening the bottom drawer reveals the **Talent Inheritance Agreement** envelope (smoking-gun evidence)
- Keep the existing backyard-key flow intact — it still works

### Scene 5 — Final Confrontation / Accusation (new mechanic)
- Triggered automatically when player has gathered the required evidence and re-enters the parking lot with Luke present
- Stanley lays out the case (4 evidence items combine into the accusation speech)
- Luke bolts → tackle cutscene → confession
- Radio call → epilogue card

### Epilogue
A static text card matching the script's closing paragraph.

---

## Part 3 — Accusation System (new)

Per your guidance: **not** a "pick the killer from a list" mechanic. Instead, the accusation auto-triggers when the player has gathered enough evidence.

- Track a derived `accusationReady` flag, true when these are all collected:
  1. Talent Inheritance Agreement (Celston's office / Study desk drawer)
  2. Sally's testimony (stranger had a non-kitchen knife)
  3. Mr. Cowardly's testimony (saw stranger enter party room)
  4. Two witness statements of footsteps (Duke + Lady)
- Once true, returning to the parking lot where Luke is present auto-triggers the confrontation cutscene
- Before that point, the parking lot interaction with Luke is just an interview
- Notes overlay shows a subtle "You have enough to make an accusation" banner when ready

---

## Part 4 — Asset & Location Action List

### Locations
| Location | Status | Action |
|---|---|---|
| Party room (dinner scene) | Exists | Rewrite dialog + intro choreography |
| Kitchen | Exists | Add Chef Allegro + Sally NPC sprites & hotspots |
| Hallway (outside party room) | Exists | Add Mr. Cowardly NPC + chase/corner interaction |
| Parking lot | Exists | Promote Luke Adams to interactive NPC; add confrontation trigger |
| Study (= Jack Celston's Office) | Exists | Re-skin signage/look-text; surface Inheritance Agreement from desk drawer |
| Storage room (Luke's claimed alibi) | Optional | Could be a visit-only location to verify Luke wasn't there |

### Character sprites needed
- Chef Allegro (warm, apron, chef's hat)
- Sous Chef Sally (guarded, apron, no hat)
- Mr. Cowardly (janitor, mop, nervous posture)
- Luke Adams (tall, dark hair, calm — currently no sprite, only his SUV)

### New evidence items
- **Talent Inheritance Agreement** (Study desk drawer) — primary smoking gun
- Stranger sighting (Allegro testimony)
- Out-of-place knife (Sally testimony)
- Stranger entering party room (Cowardly testimony)

### Existing evidence to keep (still supports the new story)
- Monogrammed handkerchief "L.A." (parking lot trunk)
- Projector recording of saboteur with silver ring
- Sabotaged electrical box, wire cutters, 754 code, shed
- These all support: "Luke sabotaged the lights before sneaking in to commit the murder"

### Existing evidence to retire or repurpose
- Threatening note ("decline the offer")
- Money bag in Duke's room
- Drugged wine glass
- Ornate Marrakech dagger backstory

### Game challenges / puzzles
- Mr. Cowardly chase/corner mini-interaction
- Final tackle sequence in the parking lot

---

## Part 5 — Open Questions Before Implementation

1. **Red herrings**: Remove the old dagger / wine glass / money bag / threatening note evidence entirely, or keep them as misleading clues that don't unlock the accusation?
2. **Mr. Cowardly chase**: simple "click twice to corner him" or a more involved mini-interaction?
3. **Storage room**: build it as a real location, or just have Luke reference it in dialogue?
4. **Tackle sequence**: auto-cutscene, single-click QTE, or a brief skill check?

Answering these in the next round will let the implementation pass be one clean sweep instead of a series of follow-ups.

---

## Technical Implementation Notes

- **Dialog rewrites** live in `src/data/dialogTrees.ts`. The existing `carl-`, `lady-`, `fuego-` trees will be largely replaced; new `allegro-`, `sally-`, `cowardly-`, `luke-` trees added.
- **Evidence map** (`src/data/evidenceMap.ts`) gains `inheritanceAgreement`, `sallyKnifeTestimony`, `cowardlyStrangerTestimony`, `allegroStrangerTestimony` entries; deprecated entries optionally removed.
- **Study reuse**: edit `StudyScene.tsx` copy to identify it as Jack Celston's office; repurpose the desk `open`/`use` interactions to drop an `inheritance-document` item into inventory and set an `inheritanceFound` flag.
- **Intro rewrite**: `IntroSequence.tsx` blackout choreography and post-blackout dialog lines per the script.
- **Accusation flag**: derived in `useGameState.ts` from existing evidence flags; trigger confrontation cutscene from `ParkingLotScene.tsx` when player approaches Luke with the flag set.
- **New NPC sprites**: pixel art generated via the existing asset pipeline; registered in `preloadAssets.ts`.
- **Confrontation cutscene**: new component `FinalConfrontation.tsx` modeled after `ProjectorCutscene.tsx`.
- **Memory updates**: refresh `mem://game/dialogue-system`, `mem://game/investigation-clues`, and `mem://game/room-navigation` to reflect the new canonical story (including Study = Celston's Office).
