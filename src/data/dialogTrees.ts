import { DialogNode } from '@/types/game';

// All dialog nodes keyed by ID for each character
type DialogTree = Record<string, DialogNode>;

// ─── CARL ───────────────────────────────────────────────
const carlTree: DialogTree = {
  'carl-root': {
    id: 'carl-root',
    speaker: 'Carl',
    text: "Hmm? Oh, you want to talk. Fine. What do you want to know?",
    options: [
      { text: "What were you doing when the lights went out?", nextNodeId: 'carl-alibi' },
      { text: "Did you see anything suspicious?", nextNodeId: 'carl-suspicious' },
      { text: "What was your relationship with Los Cabos?", nextNodeId: 'carl-relationship' },
      { text: "Never mind.", nextNodeId: null },
    ],
  },
  'carl-alibi': {
    id: 'carl-alibi',
    speaker: 'Carl',
    text: "I was admiring the vintage film posters near the entrance. Quite a fine collection, really. When the lights came back... well, you can see for yourself.",
    options: [
      { text: "Can anyone confirm that?", nextNodeId: 'carl-confirm' },
      { text: "That's convenient — no witnesses.", nextNodeId: 'carl-defensive' },
      { text: "I have more questions.", nextNodeId: 'carl-root' },
    ],
  },
  'carl-confirm': {
    id: 'carl-confirm',
    speaker: 'Carl',
    text: "I don't need anyone to confirm it. I know where I was. Perhaps you should be asking the others where THEY were.",
    nextNodeId: 'carl-root',
  },
  'carl-defensive': {
    id: 'carl-defensive',
    speaker: 'Carl',
    text: "Are you accusing me? How gauche. I had no reason to harm Los Cabos. We were business partners. His death is... inconvenient for my investments.",
    nextNodeId: 'carl-root',
  },
  'carl-suspicious': {
    id: 'carl-suspicious',
    speaker: 'Carl',
    text: "Now that you mention it... I saw Lady Fantastique having quite a heated argument with Los Cabos earlier. She seemed furious about something. You might want to ask her about that.",
    options: [
      { text: "What were they arguing about?", nextNodeId: 'carl-lady-argument' },
      { text: "Anyone else acting strange?", nextNodeId: 'carl-elfuego-note' },
      { text: "I have more questions.", nextNodeId: 'carl-root' },
    ],
  },
  'carl-lady-argument': {
    id: 'carl-lady-argument',
    speaker: 'Carl',
    text: "I couldn't hear the details, but Lady Fantastique was pointing her finger at him and her voice was raised. Something about a 'betrayal.' Make of that what you will.",
    nextNodeId: 'carl-root',
  },
  'carl-elfuego-note': {
    id: 'carl-elfuego-note',
    speaker: 'Carl',
    text: "Duke Extreme kept disappearing to the kitchen. He said he was getting drinks, but he was gone for quite a long time each trip. Nervous fellow, that one.",
    nextNodeId: 'carl-root',
  },
  'carl-relationship': {
    id: 'carl-relationship',
    speaker: 'Carl',
    text: "Business. Purely business. Los Cabos and I co-produced three films together. He handled the creative, I handled the money. A perfectly functional arrangement.",
    options: [
      { text: "Was the arrangement still 'functional'?", nextNodeId: 'carl-money' },
      { text: "I have more questions.", nextNodeId: 'carl-root' },
    ],
  },
  'carl-money': {
    id: 'carl-money',
    speaker: 'Carl',
    text: "...Our latest project was over budget, if that's what you're digging at. But I would never kill someone over money. That's what lawyers are for.",
    nextNodeId: 'carl-root',
  },
  // Dagger-unlocked branch
  'carl-dagger': {
    id: 'carl-dagger',
    speaker: 'Carl',
    text: "Hmm? Oh, you want to talk. Fine. What do you want to know?",
    options: [
      { text: "I found the murder weapon. Know anything about this dagger?", nextNodeId: 'carl-dagger-react' },
      { text: "What were you doing when the lights went out?", nextNodeId: 'carl-alibi' },
      { text: "Did you see anything suspicious?", nextNodeId: 'carl-suspicious' },
      { text: "Never mind.", nextNodeId: null },
    ],
  },
  'carl-dagger-react': {
    id: 'carl-dagger-react',
    speaker: 'Carl',
    text: "That's... that's an ornate piece. It looks like the prop dagger from 'Midnight in Marrakech' — one of our productions. It was supposed to be locked in the prop room.",
    options: [
      { text: "Who had access to the prop room?", nextNodeId: 'carl-prop-room' },
      { text: "Your fingerprints might be on it.", nextNodeId: 'carl-fingerprints' },
      { text: "I have more questions.", nextNodeId: 'carl-dagger' },
    ],
  },
  'carl-prop-room': {
    id: 'carl-prop-room',
    speaker: 'Carl',
    text: "Anyone at the studio, technically. But Duke Extreme was a stunt coordinator on that film — he'd know exactly where the props are stored. And Lady Fantastique did costumes for it.",
    nextNodeId: 'carl-dagger',
  },
  'carl-fingerprints': {
    id: 'carl-fingerprints',
    speaker: 'Carl',
    text: "Of course they might! I've handled dozens of props. That doesn't make me a murderer. You're grasping at straws.",
    nextNodeId: 'carl-dagger',
  },
};

// ─── LADY FANTASTIQUE ───────────────────────────────────────────────
const ladyTree: DialogTree = {
  'lady-root': {
    id: 'lady-root',
    speaker: 'Lady Fantastique',
    text: "*sniff* I still can't believe this is happening... What do you want?",
    options: [
      { text: "Where were you when the lights went out?", nextNodeId: 'lady-alibi' },
      { text: "Someone said you were arguing with Los Cabos earlier.", nextNodeId: 'lady-argument' },
      { text: "How well did you know Los Cabos?", nextNodeId: 'lady-relationship' },
      { text: "I'll let you be for now.", nextNodeId: null },
    ],
  },
  'lady-alibi': {
    id: 'lady-alibi',
    speaker: 'Lady Fantastique',
    text: "I was in the restroom freshening up. A lady needs her privacy. When I came back, everyone was screaming...",
    options: [
      { text: "How long were you in the restroom?", nextNodeId: 'lady-timeline' },
      { text: "Did you see anyone on the way back?", nextNodeId: 'lady-saw-someone' },
      { text: "I have more questions.", nextNodeId: 'lady-root' },
    ],
  },
  'lady-timeline': {
    id: 'lady-timeline',
    speaker: 'Lady Fantastique',
    text: "I don't know... five minutes? Ten? I wasn't watching the clock. Why does it matter?",
    options: [
      { text: "That's a long time to be freshening up during a party.", nextNodeId: 'lady-pressed' },
      { text: "I have more questions.", nextNodeId: 'lady-root' },
    ],
  },
  'lady-pressed': {
    id: 'lady-pressed',
    speaker: 'Lady Fantastique',
    text: "I— I was upset, okay?! After the argument. I needed to compose myself. Is that a crime now too?!",
    nextNodeId: 'lady-root',
  },
  'lady-saw-someone': {
    id: 'lady-saw-someone',
    speaker: 'Lady Fantastique',
    text: "Now that you ask... I thought I saw someone near the hallway, but it was dark. I couldn't tell who it was. They moved fast.",
    nextNodeId: 'lady-root',
  },
  'lady-argument': {
    id: 'lady-argument',
    speaker: 'Lady Fantastique',
    text: "Who told you that?! ...Fine. Yes, we had words. He promised me the lead role in his next film, then gave it to someone else. I was furious. But I didn't KILL him over it!",
    options: [
      { text: "That sounds like a pretty strong motive.", nextNodeId: 'lady-motive' },
      { text: "Who did he give the role to?", nextNodeId: 'lady-role' },
      { text: "I have more questions.", nextNodeId: 'lady-root' },
    ],
  },
  'lady-motive': {
    id: 'lady-motive',
    speaker: 'Lady Fantastique',
    text: "A motive?! In this town, everyone has a motive! You should look at Duke Extreme — that man has a temper like a volcano. I've seen him throw chairs on set!",
    nextNodeId: 'lady-root',
  },
  'lady-role': {
    id: 'lady-role',
    speaker: 'Lady Fantastique',
    text: "Some newcomer. Nobody. That's what made it sting. Years of loyalty and he replaces me with... ugh. But it doesn't matter now, does it?",
    nextNodeId: 'lady-root',
  },
  'lady-relationship': {
    id: 'lady-relationship',
    speaker: 'Lady Fantastique',
    text: "We worked together for years. He was my director, my mentor. I thought we had something special — professionally, I mean. Turns out I was just another actress to him.",
    nextNodeId: 'lady-root',
  },
  // Dagger-unlocked branch
  'lady-dagger': {
    id: 'lady-dagger',
    speaker: 'Lady Fantastique',
    text: "*sniff* What now...?",
    options: [
      { text: "Do you recognize this dagger?", nextNodeId: 'lady-dagger-react' },
      { text: "Where were you when the lights went out?", nextNodeId: 'lady-alibi' },
      { text: "Someone said you were arguing with Los Cabos earlier.", nextNodeId: 'lady-argument' },
      { text: "I'll let you be for now.", nextNodeId: null },
    ],
  },
  'lady-dagger-react': {
    id: 'lady-dagger-react',
    speaker: 'Lady Fantastique',
    text: "Oh god, is that... that's from the Marrakech film! I designed the sheath for it. It's supposed to be a prop — but someone must have sharpened the blade!",
    options: [
      { text: "You designed it? So you knew exactly where it was kept.", nextNodeId: 'lady-dagger-defense' },
      { text: "Who could have sharpened it?", nextNodeId: 'lady-dagger-sharpened' },
      { text: "I have more questions.", nextNodeId: 'lady-dagger' },
    ],
  },
  'lady-dagger-defense': {
    id: 'lady-dagger-defense',
    speaker: 'Lady Fantastique',
    text: "I designed the COSTUME, not the weapon! I barely touched it! Carl and Duke Extreme handled all the action props. Talk to THEM!",
    nextNodeId: 'lady-dagger',
  },
  'lady-dagger-sharpened': {
    id: 'lady-dagger-sharpened',
    speaker: 'Lady Fantastique',
    text: "Duke Extreme was the stunt coordinator. He managed all the weapons on set. He would know how to make a prop blade lethal...",
    nextNodeId: 'lady-dagger',
  },
};

// ─── DUKE EXTREME ───────────────────────────────────────────
const elFuegoTree: DialogTree = {
  'fuego-root': {
    id: 'fuego-root',
    speaker: 'Duke Extreme',
    text: "¡Ay, this is terrible! Terrible! What— what do you want to ask me?",
    options: [
      { text: "Where were you when the lights went out?", nextNodeId: 'fuego-alibi' },
      { text: "You seem really nervous. Why?", nextNodeId: 'fuego-nervous' },
      { text: "Tell me about your relationship with Los Cabos.", nextNodeId: 'fuego-relationship' },
      { text: "I'll talk to you later.", nextNodeId: null },
    ],
  },
  'fuego-alibi': {
    id: 'fuego-alibi',
    speaker: 'Duke Extreme',
    text: "I was in the kitchen! Getting more drinks! The tequila ran out and— look, I was just being a good guest, okay?",
    options: [
      { text: "The kitchen is pretty close to where the body was found.", nextNodeId: 'fuego-proximity' },
      { text: "Anyone see you in the kitchen?", nextNodeId: 'fuego-witness' },
      { text: "I have more questions.", nextNodeId: 'fuego-root' },
    ],
  },
  'fuego-proximity': {
    id: 'fuego-proximity',
    speaker: 'Duke Extreme',
    text: "What— what are you saying?! Just because I was nearby doesn't mean— ¡Dios mío! You can't think I did this!",
    nextNodeId: 'fuego-root',
  },
  'fuego-witness': {
    id: 'fuego-witness',
    speaker: 'Duke Extreme',
    text: "I... no. I was alone in there. But that doesn't prove anything! Carl was alone with his 'posters' too!",
    nextNodeId: 'fuego-root',
  },
  'fuego-nervous': {
    id: 'fuego-nervous',
    speaker: 'Duke Extreme',
    text: "NERVOUS?! A man is DEAD! Of course I'm nervous! Wouldn't you be?! ...I just... I have a bad feeling someone in this room did it.",
    options: [
      { text: "Do you suspect someone specific?", nextNodeId: 'fuego-suspect' },
      { text: "I have more questions.", nextNodeId: 'fuego-root' },
    ],
  },
  'fuego-suspect': {
    id: 'fuego-suspect',
    speaker: 'Duke Extreme',
    text: "Have you looked at Carl? The man's ice cold. His business partner just got murdered and he's standing there like it's a Tuesday. That's not normal, amigo.",
    nextNodeId: 'fuego-root',
  },
  'fuego-relationship': {
    id: 'fuego-relationship',
    speaker: 'Duke Extreme',
    text: "Los Cabos gave me my break in Hollywood. Stunt coordinator on 'Midnight in Marrakech.' I owe— I OWED him everything. Why would I hurt him?",
    options: [
      { text: "I heard he was going to cut you from the next project.", nextNodeId: 'fuego-cut' },
      { text: "I have more questions.", nextNodeId: 'fuego-root' },
    ],
  },
  'fuego-cut': {
    id: 'fuego-cut',
    speaker: 'Duke Extreme',
    text: "That's— who told you that?! That's a LIE! We had a great working relationship! ...Okay, maybe he mentioned bringing in someone younger, but we were going to talk about it!",
    nextNodeId: 'fuego-root',
  },
  // Dagger-unlocked branch
  'fuego-dagger': {
    id: 'fuego-dagger',
    speaker: 'Duke Extreme',
    text: "¡Ay! W-what now?",
    options: [
      { text: "This dagger — you handled weapons on the Marrakech set. Recognize it?", nextNodeId: 'fuego-dagger-react' },
      { text: "Where were you when the lights went out?", nextNodeId: 'fuego-alibi' },
      { text: "You seem really nervous. Why?", nextNodeId: 'fuego-nervous' },
      { text: "I'll talk to you later.", nextNodeId: null },
    ],
  },
  'fuego-dagger-react': {
    id: 'fuego-dagger-react',
    speaker: 'Duke Extreme',
    text: "I— that— yes, it's from the film. But it was a PROP! A dull blade! Someone must have... someone sharpened it. That wasn't me! I swear on my mother!",
    options: [
      { text: "You're the stunt coordinator. You had the most access to these weapons.", nextNodeId: 'fuego-dagger-access' },
      { text: "Who else could have taken it from the prop room?", nextNodeId: 'fuego-dagger-who' },
      { text: "I have more questions.", nextNodeId: 'fuego-dagger' },
    ],
  },
  'fuego-dagger-access': {
    id: 'fuego-dagger-access',
    speaker: 'Duke Extreme',
    text: "*sweating profusely* Access?! EVERYONE had access! Carl owns the studio! Lady Fantastique was in and out for costumes! The prop room lock has been broken for months!",
    nextNodeId: 'fuego-dagger',
  },
  'fuego-dagger-who': {
    id: 'fuego-dagger-who',
    speaker: 'Duke Extreme',
    text: "Anyone! Carl, Lady Fantastique, even Los Cabos himself had keys. But... Lady Fantastique was on set last week picking up costume pieces. She could have taken it then.",
    nextNodeId: 'fuego-dagger',
  },
};

// ─── CHEF ALLEGRO ───────────────────────────────────────────
const chefAllegroTree: DialogTree = {
  'chef-root': {
    id: 'chef-root',
    speaker: 'Chef Allegro',
    text: "Ah, welcome to my kitchen! Well... not the best night for a visit, eh? What can I do for you?",
    options: [
      { text: "Where were you when the lights went out?", nextNodeId: 'chef-alibi' },
      { text: "Did you notice anything unusual tonight?", nextNodeId: 'chef-unusual' },
      { text: "Tell me about the food you prepared for the party.", nextNodeId: 'chef-food' },
      { text: "Never mind.", nextNodeId: null },
    ],
  },
  'chef-alibi': {
    id: 'chef-alibi',
    speaker: 'Chef Allegro',
    text: "Right here! In my kitchen! Where else would I be? I was preparing the next course — a magnificent bouillabaisse. Then the lights went out and everything went to chaos.",
    options: [
      { text: "Was anyone else in the kitchen with you?", nextNodeId: 'chef-witness' },
      { text: "I have more questions.", nextNodeId: 'chef-root' },
    ],
  },
  'chef-witness': {
    id: 'chef-witness',
    speaker: 'Chef Allegro',
    text: "Sally was here, of course. And that nervous fellow — Duke Extreme — he kept coming in for drinks. Very agitated, that one. Kept looking over his shoulder.",
    nextNodeId: 'chef-root',
  },
  'chef-unusual': {
    id: 'chef-unusual',
    speaker: 'Chef Allegro',
    text: "Well... now that you mention it, someone came through the kitchen earlier and went toward the back hallway. I didn't see who — I was focused on my sauces. But they moved fast, like they didn't want to be seen.",
    options: [
      { text: "What time was this?", nextNodeId: 'chef-time' },
      { text: "Could it have been one of the guests?", nextNodeId: 'chef-guest' },
      { text: "I have more questions.", nextNodeId: 'chef-root' },
    ],
  },
  'chef-time': {
    id: 'chef-time',
    speaker: 'Chef Allegro',
    text: "Maybe twenty minutes before the blackout? I remember because I had just put the bread in the oven. The timer hadn't gone off yet when everything went dark.",
    nextNodeId: 'chef-root',
  },
  'chef-guest': {
    id: 'chef-guest',
    speaker: 'Chef Allegro',
    text: "Could have been anyone, really. But the footsteps were heavy — more like a man's. And I caught a whiff of expensive cologne. Not the kind Sally or I wear, I can tell you that.",
    nextNodeId: 'chef-root',
  },
  'chef-food': {
    id: 'chef-food',
    speaker: 'Chef Allegro',
    text: "Only the finest! Bruschetta, stuffed mushrooms, the wine selection was personally curated by Mr. Los Cabos himself. He had... very specific tastes. God rest his soul.",
    options: [
      { text: "Did anyone ask you to prepare anything special?", nextNodeId: 'chef-special' },
      { text: "I have more questions.", nextNodeId: 'chef-root' },
    ],
  },
  'chef-special': {
    id: 'chef-special',
    speaker: 'Chef Allegro',
    text: "Funny you should ask... Carl requested a very specific wine be served to Los Cabos. Said it was his favorite vintage. I thought nothing of it at the time, but now...",
    nextNodeId: 'chef-root',
  },
};

// ─── SOUS CHEF SALLY ───────────────────────────────────────────
const sallyTree: DialogTree = {
  'sally-root': {
    id: 'sally-root',
    speaker: 'Sous Chef Sally',
    text: "*chopping vegetables aggressively* What? I'm busy. Make it quick.",
    options: [
      { text: "Where were you when the murder happened?", nextNodeId: 'sally-alibi' },
      { text: "You seem on edge. Everything okay?", nextNodeId: 'sally-edge' },
      { text: "I think YOU had something to do with this!", nextNodeId: 'sally-accuse' },
      { text: "I'll leave you to your work.", nextNodeId: null },
    ],
  },
  'sally-alibi': {
    id: 'sally-alibi',
    speaker: 'Sous Chef Sally',
    text: "In the kitchen. With Chef Allegro. Prepping food. Where else would I be? I'm the sous chef — I don't exactly get to mingle with the guests.",
    options: [
      { text: "Did you leave the kitchen at any point?", nextNodeId: 'sally-left' },
      { text: "I have more questions.", nextNodeId: 'sally-root' },
    ],
  },
  'sally-left': {
    id: 'sally-left',
    speaker: 'Sous Chef Sally',
    text: "...I stepped out for some air. Five minutes, tops. The back hallway. But I didn't see anything, if that's what you're asking.",
    nextNodeId: 'sally-root',
  },
  'sally-edge': {
    id: 'sally-edge',
    speaker: 'Sous Chef Sally',
    text: "Of course I'm on edge! Someone got murdered twenty feet from my kitchen! And now everyone's a suspect. Including me, apparently.",
    options: [
      { text: "Did you know Los Cabos personally?", nextNodeId: 'sally-personal' },
      { text: "I have more questions.", nextNodeId: 'sally-root' },
    ],
  },
  'sally-personal': {
    id: 'sally-personal',
    speaker: 'Sous Chef Sally',
    text: "...We talked a few times. He was nice to me. Said I had talent, that I should open my own restaurant someday. Not many people in this town are that genuine.",
    nextNodeId: 'sally-root',
  },
  'sally-accuse': {
    id: 'sally-accuse',
    speaker: 'Sous Chef Sally',
    text: "EXCUSE ME?! You come into MY kitchen and accuse ME?! I have been slaving over a hot stove all night while your fancy guests were out there playing Hollywood! How DARE you!",
    nextNodeId: 'sally-root',
  },
  // Dagger-unlocked branch
  'sally-dagger': {
    id: 'sally-dagger',
    speaker: 'Sous Chef Sally',
    text: "*glances up from her work* Back again? What now?",
    options: [
      { text: "Recognize this dagger?", nextNodeId: 'sally-dagger-react' },
      { text: "Where were you when the murder happened?", nextNodeId: 'sally-alibi' },
      { text: "I think YOU had something to do with this!", nextNodeId: 'sally-accuse' },
      { text: "I'll leave you to your work.", nextNodeId: null },
    ],
  },
  'sally-dagger-react': {
    id: 'sally-dagger-react',
    speaker: 'Sous Chef Sally',
    text: "That's... that's not a kitchen knife. That's a prop. I've seen it in the production room before. Someone took it from the display case.",
    options: [
      { text: "How do you know it's from the production room?", nextNodeId: 'sally-dagger-how' },
      { text: "I have more questions.", nextNodeId: 'sally-dagger' },
    ],
  },
  'sally-dagger-how': {
    id: 'sally-dagger-how',
    speaker: 'Sous Chef Sally',
    text: "I clean every room in this studio on off days. I've dusted that case a hundred times. That dagger was there last week. Someone planned this.",
    nextNodeId: 'sally-dagger',
  },
};

/**
 * Returns the root DialogNode for a character based on current game flags.
 * Flags like `daggerTaken` unlock new conversation branches.
 */
export function getDialogTree(characterId: string, flags: Record<string, boolean>): DialogNode | null {
  const hasDagger = flags.daggerTaken === true;

  switch (characterId) {
    case 'carl': {
      const rootId = hasDagger ? 'carl-dagger' : 'carl-root';
      return carlTree[rootId] ?? null;
    }
    case 'lady': {
      const rootId = hasDagger ? 'lady-dagger' : 'lady-root';
      return ladyTree[rootId] ?? null;
    }
    case 'el-fuego': {
      const rootId = hasDagger ? 'fuego-dagger' : 'fuego-root';
      return elFuegoTree[rootId] ?? null;
    }
    case 'chef-allegro': {
      return chefAllegroTree['chef-root'] ?? null;
    }
    case 'sous-chef-sally': {
      const rootId = hasDagger ? 'sally-dagger' : 'sally-root';
      return sallyTree[rootId] ?? null;
    }
    default:
      return null;
  }
}

/**
 * Looks up a dialog node by ID across all character trees.
 */
export function getDialogNodeById(nodeId: string): DialogNode | null {
  return carlTree[nodeId] ?? ladyTree[nodeId] ?? elFuegoTree[nodeId] ?? chefAllegroTree[nodeId] ?? sallyTree[nodeId] ?? null;
}
