// Witty, noir-tinged responses for when an inventory item can't be used on a target.
// Returns a randomized line to keep repeated failures entertaining.

const genericResponses: string[] = [
  "That combination doesn't make sense.",
  "I don't think that's going to work.",
  "Nope. Not even close.",
  "My instincts say no. And my instincts are all I have left.",
  "Some things just aren't meant to be.",
  "I could try, but I'd only look foolish. More foolish.",
  "That's a hard pass.",
  "Not in a million years, kid.",
  "Hollywood's full of bad ideas. This might be the worst.",
  "I'd have better luck pitching a sequel to a flop.",
];

const itemSpecificResponses: Record<string, string[]> = {
  dagger: [
    "I'm trying to solve a murder, not commit another one.",
    "Stabbing that with a bloody dagger? My lawyer would have a field day.",
    "The dagger has already done enough damage tonight.",
    "Using a murder weapon on that seems like poor judgment, even for this town.",
    "I already have one body. Let's not make it two.",
    "That would be overkill. Literally.",
    "I'm a detective, not a slasher villain.",
    "The forensics team would have my badge if I contaminated the murder weapon.",
    "This blade's evidence, not a Swiss Army knife.",
  ],
  'wine-glass': [
    "It's empty. And even if it weren't, I doubt that appreciates fine wine.",
    "I could offer a toast, but I don't think that's thirsty.",
    "Throwing glassware isn't very professional. Unless you're in a saloon brawl.",
    "A wine glass won't help here. I need answers, not tannins.",
    "I already spilled enough for one night.",
    "Cheers to a dead-end idea.",
  ],
  'meat-stick': [
    "I could offer it as a bribe, but I doubt that's hungry.",
    "This isn't a dog. And even if it were, meat sticks don't solve murders.",
    "A meat stick? I'm a detective, not a caterer.",
    "Unless that wants beef jerky, this isn't going to help.",
    "Feeding that won't get me closer to the killer.",
    "My gut says no. And my gut wants this meat stick.",
  ],
  'money-bag': [
    "I could try to buy it, but I suspect it's not for sale.",
    "Bribery only works on people. Usually.",
    "The money's already done enough talking tonight.",
    "Everyone in this town has a price, but that doesn't.",
    "Throwing cash at the problem won't make it disappear.",
    "This bag stays closed until I know who it belongs to.",
  ],
  wire_cutters: [
    "I could cut that, but destruction of evidence is frowned upon.",
    "These are for wires and thick branches, not random objects.",
    "Cutting that would be vandalism. I'm already on thin ice.",
    "I need to cut red tape, not that.",
    "Wrong tool. Wrong target. Right hunch, though.",
  ],
  monogrammed_handkerchief: [
    "I could offer a handkerchief, but I don't think that's crying.",
    "Dabbing that with silk won't get me anywhere.",
    "The initials on this don't match that at all.",
    "A handkerchief? That's what they call grasping at straws.",
    "Fine silk deserves a better use than this.",
  ],
  torn_photograph: [
    "I could show it the photo, but it can't see.",
    "A photograph won't help here. Wrong audience, right tragedy.",
    "That doesn't care about who's in the picture.",
    "You can't shame an inanimate object with evidence.",
    "This picture needs a witness, not a wall.",
  ],
  inheritance_agreement: [
    "I could read it the legal fine print, but it won't sign.",
    "Talent contracts don't impress objects.",
    "That isn't bound by Hollywood law.",
    "I don't think that's interested in intellectual property.",
    "Even a shark lawyer couldn't spin this into a use case.",
  ],
  backyard_key: [
    "This key only fits one lock. And this isn't it.",
    "Wrong lock. Try again, detective.",
    "I could try to force it, but I'd just bend the key.",
    "That doesn't have a keyhole. Big surprise.",
  ],
  fountain_key: [
    "This key belongs to the electrical box. That is not the electrical box.",
    "Wrong lock. Try again, gumshoe.",
    "That doesn't have a keyhole. Big surprise.",
    "Keys only open doors. Or boxes. Not that.",
  ],
};

// Target-category quips keyed by keywords in the hotspot name.
const targetCategoryQuips: { match: RegExp; lines: string[] }[] = [
  {
    match: /car|suv|truck|vehicle|hood|trunk|tire|bumper/i,
    lines: [
      "Detroit didn't build this car for that.",
      "Whatever I'm about to try, the car's gonna win.",
      "I'd rather not explain the dent to insurance.",
    ],
  },
  {
    match: /door|gate|window|french/i,
    lines: [
      "The door doesn't respond to that kind of persuasion.",
      "That's not how you open a door in a Hollywood mystery.",
    ],
  },
  {
    match: /painting|portrait|photo frame|poster/i,
    lines: [
      "Art critics have used worse tools, but not by much.",
      "I'd get thrown out of the museum for that.",
    ],
  },
  {
    match: /body|corpse|victim|los cabos/i,
    lines: [
      "Show some respect. He's had a rough evening.",
      "The victim's been through enough tonight.",
      "Tampering with a body is a fast way to lose a badge.",
    ],
  },
  {
    match: /food|cheese|charcuterie|plate|dish/i,
    lines: [
      "I don't play with my food. Usually.",
      "That's a good way to ruin an appetizer.",
    ],
  },
  {
    match: /wine|drink|glass|bottle|bar/i,
    lines: [
      "The bartender would have my head.",
      "That's a waste of a perfectly good vintage.",
    ],
  },
  {
    match: /koi|pond|fountain|water/i,
    lines: [
      "The koi didn't do anything to deserve that.",
      "Water and evidence don't mix. Trust me.",
    ],
  },
  {
    match: /projector|film|reel|camera/i,
    lines: [
      "This equipment cost more than my apartment. Hands off.",
      "I'd rather not be the one who broke Hollywood tonight.",
    ],
  },
  {
    match: /desk|drawer|cabinet|shelf/i,
    lines: [
      "This isn't the drawer that hides its secrets.",
      "Furniture stays furniture. For now.",
    ],
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a witty, randomized response for failing to use an inventory item on something.
 */
export function getCantUseResponse(itemId: string, targetName?: string): string {
  // Category-aware quip has a chance to fire first when we recognize the target.
  if (targetName) {
    const category = targetCategoryQuips.find((c) => c.match.test(targetName));
    if (category && Math.random() < 0.45) {
      return pickRandom(category.lines);
    }
  }

  const responses = itemSpecificResponses[itemId] ?? genericResponses;
  let response = pickRandom(responses);

  if (targetName && Math.random() > 0.5) {
    const lowerTarget = targetName.toLowerCase();
    const followUps = [
      ` Especially not on the ${lowerTarget}.`,
      ` The ${lowerTarget} certainly won't help.`,
      ` Not on the ${lowerTarget}, anyway.`,
    ];
    response += pickRandom(followUps);
  }

  return response;
}

// ============================================================
// Using inventory items ON characters (NPCs)
// ============================================================

const playerOnCharacterGeneric: ((name: string) => string)[] = [
  (n) => `Waving this in ${n}'s face won't get me any closer to the truth.`,
  (n) => `${n} would just laugh me out of the room.`,
  (n) => `That's a great way to end this conversation before it starts.`,
  (n) => `${n} doesn't strike me as the type who'd appreciate that.`,
  (n) => `I'd rather not show my hand to ${n} just yet.`,
  (n) => `Pulling that out in front of ${n}? Bad move, detective.`,
  (n) => `${n} isn't going to react the way I need them to.`,
];

const characterReactions: Record<string, string[]> = {
  luke: [
    'Luke Adams: "Put that away, gumshoe. You\'re embarrassing yourself."',
    'Luke Adams: "*exhales smoke* That supposed to mean something to me?"',
    'Luke Adams: "Cute. Now ask me a real question."',
    'Luke Adams: "I\'ve had bigger things waved at me by smaller men."',
    'Luke Adams: "*flat stare* No."',
  ],
  cowardly: [
    'Mr. Cowardly: "P-please, put that away! I don\'t want any trouble!"',
    'Mr. Cowardly: "Oh dear, oh dear — is that really necessary?"',
    'Mr. Cowardly: "I\'ll talk! I\'ll talk! Just — not with THAT in my face!"',
    'Mr. Cowardly: "*whimpers* What did I do to deserve this?"',
  ],
  lady: [
    'Lady Fantastica: "Darling, this isn\'t a prop department. Put it away."',
    'Lady Fantastica: "I\'ve been handed worse by better men, detective."',
    'Lady Fantastica: "*arches an eyebrow* Is this your idea of charm?"',
    'Lady Fantastica: "If you wanted my attention, you\'ve certainly got it. Just not the way you hoped."',
  ],
  'el-fuego': [
    'Duke Extreme: "*scoffs* Try that again and you\'ll be picking your teeth off the asphalt."',
    'Duke Extreme: "I do my own stunts, pal. Yours need work."',
    'Duke Extreme: "That the best you got, detective?"',
    'Duke Extreme: "*cracks knuckles* You sure you want to play it like that?"',
  ],
  carl: [
    'Carl: "Hey man, I just park cars. Don\'t bring me into whatever that is."',
    'Carl: "*shrugs* Not really my department, dude."',
    'Carl: "Whoa whoa whoa — keep that thing away from the keys."',
    'Carl: "I\'m just trying to finish my shift, alright?"',
  ],
  'chef-allegro': [
    'Chef Allegro: "Mamma mia! Get that out of my kitchen!"',
    'Chef Allegro: "*waves a ladle* You bring THAT in here? Out, out!"',
    'Chef Allegro: "I cook with passion, not with whatever that is."',
    'Chef Allegro: "This is a kitchen, detective, not a pawn shop."',
  ],
  'sous-chef-sally': [
    'Sous-Chef Sally: "Uh, I\'m just trying to finish prep here."',
    'Sous-Chef Sally: "*nervous laugh* Yeah, no thanks, detective."',
    'Sous-Chef Sally: "Please don\'t put that on the cutting board."',
    'Sous-Chef Sally: "I really don\'t get paid enough for this."',
  ],
};

// Per-character × per-item combos. These win over the generic character lines
// whenever both keys exist.
const characterItemCombos: Record<string, Record<string, string[]>> = {
  luke: {
    dagger: [
      'Luke Adams: "*eyes the blade* Wrong end pointed at me, detective. Careful."',
      'Luke Adams: "You waving that at me is either brave or stupid. I\'ll guess."',
      'I don\'t threaten the pro. Not with his own kind of tool.',
    ],
    torn_photograph: [
      'Luke Adams: "*long drag* Never seen him before in my life."',
      'Luke Adams: "That photo\'s got two people in it, gumshoe. Ask the other one."',
      'Luke Adams: "You brought a torn picture to a murder? Bold."',
      'His eyes flick to the photo for a fraction of a second — then back to nothing.',
    ],
    monogrammed_handkerchief: [
      'Luke Adams: "*half-smile* Lots of guys with those initials in this town."',
      'Luke Adams: "That\'s a nice hankie. Wonder who lost it."',
      'He doesn\'t reach for it. That, by itself, tells me plenty.',
    ],
    inheritance_agreement: [
      'Luke Adams: "*exhales smoke* Contracts are for lawyers. I just do the work."',
      'Luke Adams: "You reading me the fine print, detective? I don\'t do bedtime stories."',
      'His jaw tightens the moment he sees the envelope. Just for a second.',
    ],
    'money-bag': [
      'Luke Adams: "*glances at the bag* Already been paid, thanks."',
      'Luke Adams: "Cash doesn\'t buy answers from me. It buys silence."',
    ],
    'meat-stick': [
      'Luke Adams: "*flat stare* Do I look like a stray dog to you?"',
    ],
    'wine-glass': [
      'Luke Adams: "I don\'t drink on the job."',
    ],
    wire_cutters: [
      'Luke Adams: "Point those cutters somewhere else, gumshoe."',
    ],
  },
  cowardly: {
    dagger: [
      'Mr. Cowardly: "AAH! Please — I didn\'t do it, I swear, I swear!"',
      'Mr. Cowardly: "*hands up* I\'m just the janitor! The JANITOR!"',
      'He shrinks back so fast he nearly falls over his own mop bucket.',
    ],
    torn_photograph: [
      'Mr. Cowardly: "I — I don\'t know him! I only clean the halls, honest!"',
      'Mr. Cowardly: "*squints* That could be anyone. Anyone at all. Really."',
      'His eyes dart to the photo, then to the exit. Twice.',
    ],
    inheritance_agreement: [
      'Mr. Cowardly: "I don\'t read the boss\'s mail! I don\'t know anything!"',
      'Mr. Cowardly: "*swallows* Legal papers give me hives, detective."',
    ],
    'money-bag': [
      'Mr. Cowardly: "*eyes widen* Oh no no no, I don\'t take bribes! ...How much?"',
      'Mr. Cowardly: "I earn my wage honestly. Mostly."',
    ],
    backyard_key: [
      'Mr. Cowardly: "I have my OWN set, detective. Every door in this place."',
    ],
    fountain_key: [
      'Mr. Cowardly: "I have my OWN set, detective. Every door in this place."',
    ],
    'meat-stick': [
      'Mr. Cowardly: "Oh! Um. Is that a bribe or a snack?"',
    ],
  },
  lady: {
    dagger: [
      'Lady Fantastica: "*doesn\'t flinch* I\'ve had prop knives closer to my throat, darling."',
      'Lady Fantastica: "If you\'re going to threaten a lady, at least clean the blade first."',
    ],
    torn_photograph: [
      'Lady Fantastica: "*studies it* I don\'t recognize the face. But that suit — very Jack."',
      'Lady Fantastica: "Torn photographs are so dramatic. I approve."',
      'Lady Fantastica: "Whoever tore this didn\'t want him remembered. Or found."',
    ],
    'wine-glass': [
      'Lady Fantastica: "*takes it* Empty. Typical. Refill it and we\'ll talk."',
      'Lady Fantastica: "A gentleman never brings a lady an empty glass."',
    ],
    monogrammed_handkerchief: [
      'Lady Fantastica: "*fingers the silk* Fine work. Not mine, though. Wrong initials, wrong perfume."',
    ],
    inheritance_agreement: [
      'Lady Fantastica: "*raises an eyebrow* Now THAT is interesting. Where did you find this?"',
      'Lady Fantastica: "Jack\'s signature is on this? Well, well, well."',
    ],
    'money-bag': [
      'Lady Fantastica: "Darling, I have my own. But the gesture is noted."',
    ],
  },
  'el-fuego': {
    dagger: [
      'Duke Extreme: "*grins* You know how many blades I\'ve had thrown at me on set? Put it down."',
      'Duke Extreme: "That\'s cute. Ever see the knife scene from \'Blood Canyon\'? I did it live."',
    ],
    'money-bag': [
      'Duke Extreme: "*stares at the bag* That mine? Because if it\'s mine, hand it over."',
      'Duke Extreme: "Never seen it. And you never saw me look at it."',
      'Duke Extreme: "Where\'d you find that? ...Never mind. Don\'t answer that."',
    ],
    torn_photograph: [
      'Duke Extreme: "Don\'t know him. Should I?"',
      'Duke Extreme: "Half a face and a handshake. That\'s Hollywood, pal."',
    ],
    'wine-glass': [
      'Duke Extreme: "I don\'t drink wine. Bourbon or nothing."',
    ],
    inheritance_agreement: [
      'Duke Extreme: "*scans it* Talent contracts. Jack loves his paperwork."',
    ],
    wire_cutters: [
      'Duke Extreme: "*eyes the cutters* You accusing me of something, detective?"',
    ],
  },
  carl: {
    'money-bag': [
      'Carl: "*eyes the cash* I mean... how much are we talking?"',
      'Carl: "Whoa — I didn\'t see nothin\'. But if you wanna leave that here..."',
      'Carl: "Man, that\'s more than I make in a year of parking cars."',
    ],
    dagger: [
      'Carl: "WHOA whoa — I park cars, man! I don\'t stab people!"',
      'Carl: "That\'s the murder weapon, right? Get it away, get it AWAY."',
    ],
    torn_photograph: [
      'Carl: "Never seen the guy. But I see a lot of guys, man. They all blur."',
      'Carl: "*shrugs* Half a face? I need more to work with, dude."',
    ],
    'meat-stick': [
      'Carl: "*perks up* Oh sweet, are you sharing? ...No? Cool cool cool."',
    ],
    'wine-glass': [
      'Carl: "I don\'t drink on the clock, man. Boss would kill me."',
    ],
  },
  'chef-allegro': {
    'meat-stick': [
      'Chef Allegro: "You bring me... a MEAT STICK? In MY kitchen?! *muttering in Italian*"',
      'Chef Allegro: "This is not cuisine. This is truck-stop food. GET OUT."',
    ],
    'wine-glass': [
      'Chef Allegro: "*sniffs* Cheap wine. But acceptable. Leave it, I\'ll cook with it."',
    ],
    dagger: [
      'Chef Allegro: "I have BETTER knives than that, detective. And I know how to use them."',
    ],
    torn_photograph: [
      'Chef Allegro: "*squints* I do not know this man. I know only my ingredients."',
    ],
  },
  'sous-chef-sally': {
    dagger: [
      'Sous-Chef Sally: "*backs up* That\'s — that\'s covered in blood, please put it down."',
    ],
    'meat-stick': [
      'Sous-Chef Sally: "Chef would fire me on the spot if I touched that."',
    ],
    torn_photograph: [
      'Sous-Chef Sally: "I stay in the back. I don\'t recognize half the people in this studio."',
    ],
  },
};

/**
 * Response for using an inventory item on a character (NPC). Prioritizes a
 * scripted combo line (character + specific item), then a generic character
 * reaction, then a detective-flavored refusal.
 */
export function getCharacterItemResponse(
  characterId: string,
  characterName: string,
  itemId: string,
): string {
  const combo = characterItemCombos[characterId]?.[itemId];
  if (combo && combo.length > 0) {
    return pickRandom(combo);
  }
  const npcLines = characterReactions[characterId];
  if (npcLines && Math.random() < 0.6) {
    return pickRandom(npcLines);
  }
  return pickRandom(playerOnCharacterGeneric)(characterName);
}
