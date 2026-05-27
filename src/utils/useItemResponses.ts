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
  ],
  'wine-glass': [
    "It's empty. And even if it weren't, I doubt that appreciates fine wine.",
    "I could offer a toast, but I don't think that's thirsty.",
    "Throwing glassware isn't very professional. Unless you're in a saloon brawl.",
    "A wine glass won't help here. I need answers, not tannins.",
    "I already spilled enough for one night.",
  ],
  'meat-stick': [
    "I could offer it as a bribe, but I doubt that's hungry.",
    "This isn't a dog. And even if it were, meat sticks don't solve murders.",
    "A meat stick? I'm a detective, not a caterer.",
    "Unless that wants beef jerky, this isn't going to help.",
    "Feeding that won't get me closer to the killer.",
  ],
  'money-bag': [
    "I could try to buy it, but I suspect it's not for sale.",
    "Bribery only works on people. Usually.",
    "The money's already done enough talking tonight.",
    "Everyone in this town has a price, but that doesn't.",
    "Throwing cash at the problem won't make it disappear.",
  ],
  wire_cutters: [
    "I could cut that, but destruction of evidence is frowned upon.",
    "These are for wires and thick branches, not random objects.",
    "Cutting that would be vandalism. I'm already on thin ice.",
    "I need to cut red tape, not that.",
  ],
  monogrammed_handkerchief: [
    "I could offer a handkerchief, but I don't think that's crying.",
    "Dabbing that with silk won't get me anywhere.",
    "The initials on this don't match that at all.",
    "A handkerchief? That's what they call grasping at straws.",
  ],
  torn_photograph: [
    "I could show it the photo, but it can't see.",
    "A photograph won't help here. Wrong audience, right tragedy.",
    "That doesn't care about who's in the picture.",
    "You can't shame an inanimate object with evidence.",
  ],
  inheritance_agreement: [
    "I could read it the legal fine print, but it won't sign.",
    "Talent contracts don't impress objects.",
    "That isn't bound by Hollywood law.",
    "I don't think that's interested in intellectual property.",
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

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a witty, randomized response for failing to use an inventory item on something.
 * @param itemId — the inventory item's id
 * @param targetName — optional name of the target hotspot (e.g. "the locked door")
 */
export function getCantUseResponse(itemId: string, targetName?: string): string {
  const responses = itemSpecificResponses[itemId] ?? genericResponses;
  let response = pickRandom(responses);

  // If there's a target name, try to inject it where it makes sense.
  // Some responses already have "that" baked in; for others we could substitute,
  // but to keep it simple we just append context when it feels natural.
  if (targetName && Math.random() > 0.5) {
    const lowerTarget = targetName.toLowerCase();
    // If the response ends with a period, add a follow-up quip
    const followUps = [
      ` Especially not on the ${lowerTarget}.`,
      ` The ${lowerTarget} certainly won't help.`,
      ` Not on the ${lowerTarget}, anyway.`,
    ];
    response += pickRandom(followUps);
  }

  return response;
}
