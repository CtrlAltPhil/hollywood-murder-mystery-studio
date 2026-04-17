import { DialogNode, DialogOption } from '@/types/game';

// All dialog nodes keyed by ID for each character
type DialogTree = Record<string, DialogNode>;

// ─── CARL ───────────────────────────────────────────────
const carlTree: DialogTree = {
  'carl-root': {
    id: 'carl-root',
    speaker: 'Carl',
    text: "Hmm? Oh, you want to talk. Fine. What do you want to know?",
    shortText: "What else?",
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
      { text: "Back to questions.", nextNodeId: 'carl-root' },
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
      { text: "Back to questions.", nextNodeId: 'carl-root' },
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
      { text: "Back to questions.", nextNodeId: 'carl-root' },
    ],
  },
  'carl-money': {
    id: 'carl-money',
    speaker: 'Carl',
    text: "...Our latest project was over budget, if that's what you're digging at. But I would never kill someone over money. That's what lawyers are for.",
    nextNodeId: 'carl-root',
  },
  // Dagger-unlocked nodes
  'carl-dagger-react': {
    id: 'carl-dagger-react',
    speaker: 'Carl',
    text: "That's... that's an ornate piece. It looks like the prop dagger from 'Midnight in Marrakech' — one of our productions. It was supposed to be locked in the prop room.",
    onEnter: { flag: 'carlSmirking' },
    options: [
      { text: "Who had access to the prop room?", nextNodeId: 'carl-prop-room' },
      { text: "Your fingerprints might be on it.", nextNodeId: 'carl-fingerprints' },
      { text: "Back to questions.", nextNodeId: 'carl-root' },
    ],
  },
  'carl-prop-room': {
    id: 'carl-prop-room',
    speaker: 'Carl',
    text: "Anyone at the studio, technically. But Duke Extreme was a stunt coordinator on that film — he'd know exactly where the props are stored. And Lady Fantastique did costumes for it.",
    nextNodeId: 'carl-root',
  },
  'carl-fingerprints': {
    id: 'carl-fingerprints',
    speaker: 'Carl',
    text: "Of course they might! I've handled dozens of props. That doesn't make me a murderer. You're grasping at straws.",
    nextNodeId: 'carl-root',
  },
  // Threatening note nodes
  'carl-note-react': {
    id: 'carl-note-react',
    speaker: 'Carl',
    text: "'Decline the offer or else'...? Interesting. I know Los Cabos received a buyout offer for the studio last month. He turned it down flat. Someone was clearly unhappy about that.",
    options: [
      { text: "Who made the offer?", nextNodeId: 'carl-note-offer' },
      { text: "You're his business partner. Did YOU want him to take the deal?", nextNodeId: 'carl-note-accusation' },
      { text: "Back to questions.", nextNodeId: 'carl-root' },
    ],
  },
  'carl-note-offer': {
    id: 'carl-note-offer',
    speaker: 'Carl',
    text: "Some private equity group. I don't remember the name — Los Cabos handled it. But... Duke Extreme was oddly interested in the deal. He kept asking about the terms. Curious, no?",
    nextNodeId: 'carl-root',
  },
  'carl-note-accusation': {
    id: 'carl-note-accusation',
    speaker: 'Carl',
    text: "I— well, financially, the deal would have been favorable. But I didn't write that note! I'm a businessman, not a thug. Besides, I had nothing to gain from threatening him. We could have discussed it like adults.",
    nextNodeId: 'carl-root',
  },
  // Wine glass nodes
  'carl-wine-react': {
    id: 'carl-wine-react',
    speaker: 'Carl',
    text: "A residue? In the wine glass? ...I did request a specific vintage for Los Cabos. It was his favorite — a 1987 Château Margaux. But I certainly didn't put anything IN it.",
    options: [
      { text: "You ordered a specific wine just for him? That's suspicious.", nextNodeId: 'carl-wine-suspicious' },
      { text: "Who else handled the wine before it reached him?", nextNodeId: 'carl-wine-handled' },
      { text: "Back to questions.", nextNodeId: 'carl-root' },
    ],
  },
  'carl-wine-suspicious': {
    id: 'carl-wine-suspicious',
    speaker: 'Carl',
    text: "It was a GIFT! The man was being celebrated tonight! Is it so strange to get your business partner his favorite wine?! ...Chef Allegro poured it. Ask HIM what happened between the bottle and the glass.",
    nextNodeId: 'carl-root',
  },
  'carl-wine-handled': {
    id: 'carl-wine-handled',
    speaker: 'Carl',
    text: "I gave the bottle to Chef Allegro. After that... anyone could have tampered with it. The kitchen was a busy place tonight. Sally, Duke Extreme — they were all in and out.",
    nextNodeId: 'carl-root',
  },
  // Money bag nodes
  'carl-money-bag-react': {
    id: 'carl-money-bag-react',
    speaker: 'Carl',
    text: "A bag of CASH? In Duke Extreme's room? ...That's interesting. He's been complaining about money problems for months. Where did he get that kind of cash?",
    options: [
      { text: "Could it be connected to the buyout offer?", nextNodeId: 'carl-money-bag-buyout' },
      { text: "You handle the finances. Is money missing from the studio?", nextNodeId: 'carl-money-bag-missing' },
      { text: "Back to questions.", nextNodeId: 'carl-root' },
    ],
  },
  'carl-money-bag-buyout': {
    id: 'carl-money-bag-buyout',
    speaker: 'Carl',
    text: "...If someone paid Duke Extreme to pressure Los Cabos into selling... and the note said 'decline the offer or else'... My god. This is bigger than I thought.",
    nextNodeId: 'carl-root',
  },
  'carl-money-bag-missing': {
    id: 'carl-money-bag-missing',
    speaker: 'Carl',
    text: "Now that you mention it, there were some discrepancies in last quarter's books. I assumed it was creative accounting on Los Cabos' part, but... perhaps I was looking at the wrong person.",
    nextNodeId: 'carl-root',
  },
};

// ─── LADY FANTASTIQUE ───────────────────────────────────────────────
const ladyTree: DialogTree = {
  'lady-root': {
    id: 'lady-root',
    speaker: 'Lady Fantastique',
    text: "*sniff* I still can't believe this is happening... What do you want?",
    shortText: "Yes, darling?",
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
      { text: "Back to questions.", nextNodeId: 'lady-root' },
    ],
  },
  'lady-timeline': {
    id: 'lady-timeline',
    speaker: 'Lady Fantastique',
    text: "I don't know... five minutes? Ten? I wasn't watching the clock. Why does it matter?",
    options: [
      { text: "That's a long time to be freshening up during a party.", nextNodeId: 'lady-pressed' },
      { text: "Back to questions.", nextNodeId: 'lady-root' },
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
      { text: "Back to questions.", nextNodeId: 'lady-root' },
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
  // Dagger-unlocked nodes
  'lady-dagger-react': {
    id: 'lady-dagger-react',
    speaker: 'Lady Fantastique',
    text: "Oh god, is that... that's from the Marrakech film! I designed the sheath for it. It's supposed to be a prop — but someone must have sharpened the blade!",
    onEnter: { flag: 'ladyNervous' },
    options: [
      { text: "You designed it? So you knew exactly where it was kept.", nextNodeId: 'lady-dagger-defense' },
      { text: "Who could have sharpened it?", nextNodeId: 'lady-dagger-sharpened' },
      { text: "Back to questions.", nextNodeId: 'lady-root' },
    ],
  },
  'lady-dagger-defense': {
    id: 'lady-dagger-defense',
    speaker: 'Lady Fantastique',
    text: "I designed the COSTUME, not the weapon! I barely touched it! Carl and Duke Extreme handled all the action props. Talk to THEM!",
    nextNodeId: 'lady-root',
  },
  'lady-dagger-sharpened': {
    id: 'lady-dagger-sharpened',
    speaker: 'Lady Fantastique',
    text: "Duke Extreme was the stunt coordinator. He managed all the weapons on set. He would know how to make a prop blade lethal...",
    nextNodeId: 'lady-root',
  },
  // Threatening note nodes
  'lady-note-react': {
    id: 'lady-note-react',
    speaker: 'Lady Fantastique',
    text: "'Decline the offer or else'? *goes pale* Oh my... I— I overheard Los Cabos on the phone last week. He sounded frightened. He said something like 'I won't be bullied into selling.'",
    options: [
      { text: "Selling? Selling the studio?", nextNodeId: 'lady-note-selling' },
      { text: "You seem to know more than you're letting on.", nextNodeId: 'lady-note-pressed' },
      { text: "Back to questions.", nextNodeId: 'lady-root' },
    ],
  },
  'lady-note-selling': {
    id: 'lady-note-selling',
    speaker: 'Lady Fantastique',
    text: "That's what it sounded like. And if the studio sold... I'd lose my contract. Duke Extreme too. Carl's the only one who'd profit — he owns a share. But I didn't write that awful note!",
    nextNodeId: 'lady-root',
  },
  'lady-note-pressed': {
    id: 'lady-note-pressed',
    speaker: 'Lady Fantastique',
    text: "I'm not hiding anything! I just... didn't think it was connected. Los Cabos had enemies. This industry chews people up. But a DEATH THREAT? That changes everything.",
    nextNodeId: 'lady-root',
  },
  // Wine glass nodes
  'lady-wine-react': {
    id: 'lady-wine-react',
    speaker: 'Lady Fantastique',
    text: "Drugged wine? *hand to mouth* That would explain... Los Cabos was acting strangely before the blackout. He seemed dizzy, unfocused. I thought he'd had too much to drink.",
    options: [
      { text: "Did you see who gave him the glass?", nextNodeId: 'lady-wine-who' },
      { text: "You noticed he was unwell and didn't say anything?", nextNodeId: 'lady-wine-guilt' },
      { text: "Back to questions.", nextNodeId: 'lady-root' },
    ],
  },
  'lady-wine-who': {
    id: 'lady-wine-who',
    speaker: 'Lady Fantastique',
    text: "Carl handed it to him. Made a big show of it too — 'A toast to our host!' he said. But... Sally was the one who carried the tray from the kitchen. Anyone could have slipped something in.",
    nextNodeId: 'lady-root',
  },
  'lady-wine-guilt': {
    id: 'lady-wine-guilt',
    speaker: 'Lady Fantastique',
    text: "I— we weren't speaking! After the argument! If I had known... if I had gone to him instead of storming off... maybe he'd still be... *breaks down crying*",
    nextNodeId: 'lady-root',
  },
  // Money bag nodes
  'lady-money-bag-react': {
    id: 'lady-money-bag-react',
    speaker: 'Lady Fantastique',
    text: "Cash? In Duke Extreme's room? That man has been borrowing money from everyone for months! Where did he suddenly get a bag full of cash?!",
    options: [
      { text: "Maybe someone paid him to do something.", nextNodeId: 'lady-money-bag-paid' },
      { text: "He borrowed money from you too?", nextNodeId: 'lady-money-bag-borrow' },
      { text: "Back to questions.", nextNodeId: 'lady-root' },
    ],
  },
  'lady-money-bag-paid': {
    id: 'lady-money-bag-paid',
    speaker: 'Lady Fantastique',
    text: "Paid him to... oh no. You don't think someone HIRED him to kill Los Cabos? He was always desperate for money. And he knows weapons from his stunt work. Oh god...",
    nextNodeId: 'lady-root',
  },
  'lady-money-bag-borrow': {
    id: 'lady-money-bag-borrow',
    speaker: 'Lady Fantastique',
    text: "Five thousand dollars last month! Said his car was being repossessed. I felt sorry for him. But now he's sitting on a bag of cash? That lying little—!",
    nextNodeId: 'lady-root',
  },
};

// ─── DUKE EXTREME ───────────────────────────────────────────
const elFuegoTree: DialogTree = {
  'fuego-root': {
    id: 'fuego-root',
    speaker: 'Duke Extreme',
    text: "¡Ay, this is terrible! Terrible! What— what do you want to ask me?",
    shortText: "Yeah? What now?",
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
      { text: "Back to questions.", nextNodeId: 'fuego-root' },
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
      { text: "Back to questions.", nextNodeId: 'fuego-root' },
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
      { text: "Back to questions.", nextNodeId: 'fuego-root' },
    ],
  },
  'fuego-cut': {
    id: 'fuego-cut',
    speaker: 'Duke Extreme',
    text: "That's— who told you that?! That's a LIE! We had a great working relationship! ...Okay, maybe he mentioned bringing in someone younger, but we were going to talk about it!",
    nextNodeId: 'fuego-root',
  },
  // Dagger-unlocked nodes
  'fuego-dagger-react': {
    id: 'fuego-dagger-react',
    speaker: 'Duke Extreme',
    text: "I— that— yes, it's from the film. But it was a PROP! A dull blade! Someone must have... someone sharpened it. That wasn't me! I swear on my mother!",
    onEnter: { flag: 'dukePanicked' },
    options: [
      { text: "You're the stunt coordinator. You had the most access to these weapons.", nextNodeId: 'fuego-dagger-access' },
      { text: "Who else could have taken it from the prop room?", nextNodeId: 'fuego-dagger-who' },
      { text: "Back to questions.", nextNodeId: 'fuego-root' },
    ],
  },
  'fuego-dagger-access': {
    id: 'fuego-dagger-access',
    speaker: 'Duke Extreme',
    text: "*sweating profusely* Access?! EVERYONE had access! Carl owns the studio! Lady Fantastique was in and out for costumes! The prop room lock has been broken for months!",
    nextNodeId: 'fuego-root',
  },
  'fuego-dagger-who': {
    id: 'fuego-dagger-who',
    speaker: 'Duke Extreme',
    text: "Anyone! Carl, Lady Fantastique, even Los Cabos himself had keys. But... Lady Fantastique was on set last week picking up costume pieces. She could have taken it then.",
    nextNodeId: 'fuego-root',
  },
  // Threatening note nodes
  'fuego-note-react': {
    id: 'fuego-note-react',
    speaker: 'Duke Extreme',
    text: "*eyes go wide* Where— where did you find that?! I mean— what note? I don't know anything about any note!",
    options: [
      { text: "You seem to recognize it. Did you write this?", nextNodeId: 'fuego-note-wrote' },
      { text: "It was in Los Cabos' desk. About a business offer. Know anything?", nextNodeId: 'fuego-note-offer' },
      { text: "Back to questions.", nextNodeId: 'fuego-root' },
    ],
  },
  'fuego-note-wrote': {
    id: 'fuego-note-wrote',
    speaker: 'Duke Extreme',
    text: "NO! No no no! I didn't write that! I can't even— my handwriting is terrible, ask anyone! Look, I heard rumors about some deal, but I had nothing to do with this!",
    options: [
      { text: "What rumors?", nextNodeId: 'fuego-note-rumors' },
      { text: "Back to questions.", nextNodeId: 'fuego-root' },
    ],
  },
  'fuego-note-rumors': {
    id: 'fuego-note-rumors',
    speaker: 'Duke Extreme',
    text: "...Some people wanted to buy the studio. Big money. Los Cabos said no. Someone approached ME too — said they'd keep me on as coordinator if I helped... convince him. I said no! I SWEAR I said no!",
    nextNodeId: 'fuego-root',
  },
  'fuego-note-offer': {
    id: 'fuego-note-offer',
    speaker: 'Duke Extreme',
    text: "A business— yes, okay, I heard about it. Some investors wanted to buy out the studio. Los Cabos wouldn't sell. Carl was frustrated about it. Very frustrated. You should ask Carl about this, not me!",
    nextNodeId: 'fuego-root',
  },
  // Wine glass nodes
  'fuego-wine-react': {
    id: 'fuego-wine-react',
    speaker: 'Duke Extreme',
    text: "Drugged?! ¡Santa madre! I was getting drinks from that same bar all night! What if I— could I have been drugged too?!",
    options: [
      { text: "Focus. Did you see anyone near Los Cabos' drink?", nextNodeId: 'fuego-wine-near' },
      { text: "You were in the kitchen all night. Did you see anyone tampering with drinks?", nextNodeId: 'fuego-wine-kitchen' },
      { text: "Back to questions.", nextNodeId: 'fuego-root' },
    ],
  },
  'fuego-wine-near': {
    id: 'fuego-wine-near',
    speaker: 'Duke Extreme',
    text: "I... Sally was carrying trays back and forth. And Carl kept hovering near Los Cabos with that wine bottle. But I wasn't paying close attention — I was too busy trying to calm my nerves.",
    nextNodeId: 'fuego-root',
  },
  'fuego-wine-kitchen': {
    id: 'fuego-wine-kitchen',
    speaker: 'Duke Extreme',
    text: "I saw Chef Allegro open a special bottle. Carl's request, he said. Sally poured it into a glass. After that... I left to use the bathroom. Anyone could have done something while I was gone.",
    nextNodeId: 'fuego-root',
  },
  // Money bag nodes
  'fuego-money-bag-react': {
    id: 'fuego-money-bag-react',
    speaker: 'Duke Extreme',
    text: "*goes white as a sheet* You— you went through my room?! That's— you had no right to—!",
    options: [
      { text: "Where did you get a bag full of cash, Duke?", nextNodeId: 'fuego-money-bag-where' },
      { text: "Someone paid you, didn't they? To 'convince' Los Cabos?", nextNodeId: 'fuego-money-bag-paid' },
      { text: "Back to questions.", nextNodeId: 'fuego-root' },
    ],
  },
  'fuego-money-bag-where': {
    id: 'fuego-money-bag-where',
    speaker: 'Duke Extreme',
    text: "It's— it's my savings! From stunt work! I've been saving for years! ...Okay, fine. Someone gave it to me. An advance. For a job. A LEGITIMATE job! Consulting work!",
    options: [
      { text: "Consulting for the people trying to buy the studio?", nextNodeId: 'fuego-money-bag-consulting' },
      { text: "Back to questions.", nextNodeId: 'fuego-root' },
    ],
  },
  'fuego-money-bag-consulting': {
    id: 'fuego-money-bag-consulting',
    speaker: 'Duke Extreme',
    text: "*long pause* ...They said all I had to do was talk to Los Cabos. Persuade him. That's ALL. I never— I would NEVER hurt him! You have to believe me! The money was just for talking!",
    nextNodeId: 'fuego-root',
  },
  'fuego-money-bag-paid': {
    id: 'fuego-money-bag-paid',
    speaker: 'Duke Extreme',
    text: "PAID?! I— okay, YES, someone gave me money! But it was just to TALK to him! To convince him the deal was good for everyone! I didn't kill anyone! When talking didn't work, I gave up! That's IT!",
    nextNodeId: 'fuego-root',
  },
};

// ─── CHEF ALLEGRO ───────────────────────────────────────────
const chefAllegroTree: DialogTree = {
  'chef-root': {
    id: 'chef-root',
    speaker: 'Chef Allegro',
    text: "Ah, welcome to my kitchen! Well... not the best night for a visit, eh? What can I do for you?",
    shortText: "Anything else, eh?",
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
      { text: "Back to questions.", nextNodeId: 'chef-root' },
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
      { text: "Back to questions.", nextNodeId: 'chef-root' },
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
      { text: "Back to questions.", nextNodeId: 'chef-root' },
    ],
  },
  'chef-special': {
    id: 'chef-special',
    speaker: 'Chef Allegro',
    text: "Funny you should ask... Carl requested a very specific wine be served to Los Cabos. Said it was his favorite vintage. I thought nothing of it at the time, but now...",
    nextNodeId: 'chef-root',
  },
  // Wine glass nodes
  'chef-wine-react': {
    id: 'chef-wine-react',
    speaker: 'Chef Allegro',
    text: "Madre di Dio... a residue? In the wine glass?! I opened that bottle myself — it was sealed! If something was added, it happened AFTER it left my hands!",
    onEnter: { flag: 'chefDefensive' },
    options: [
      { text: "Walk me through exactly what happened with the wine.", nextNodeId: 'chef-wine-walkthrough' },
      { text: "Who touched the glass after you poured it?", nextNodeId: 'chef-wine-touched' },
      { text: "Back to questions.", nextNodeId: 'chef-root' },
    ],
  },
  'chef-wine-walkthrough': {
    id: 'chef-wine-walkthrough',
    speaker: 'Chef Allegro',
    text: "Carl gave me the bottle — a 1987 Château Margaux. I opened it, let it breathe. Sally poured it into a glass. She put it on the tray with the others. Then... I went back to my stove. The tray sat on the counter for a few minutes before anyone took it out.",
    options: [
      { text: "A few minutes unattended. That's long enough to spike it.", nextNodeId: 'chef-wine-unattended' },
      { text: "Back to questions.", nextNodeId: 'chef-root' },
    ],
  },
  'chef-wine-unattended': {
    id: 'chef-wine-unattended',
    speaker: 'Chef Allegro',
    text: "You're right... Duke Extreme was in the kitchen around that time. He said he was getting tequila, but he was near the tray. I didn't think anything of it then. Maledizione...",
    nextNodeId: 'chef-root',
  },
  'chef-wine-touched': {
    id: 'chef-wine-touched',
    speaker: 'Chef Allegro',
    text: "Sally poured it. The glass sat on the counter... Duke Extreme was hovering nearby. And then Sally carried the tray out. That's everyone who was near it. Unless someone came in while my back was turned.",
    nextNodeId: 'chef-root',
  },
  // Threatening note nodes
  'chef-note-react': {
    id: 'chef-note-react',
    speaker: 'Chef Allegro',
    text: "A threatening note? In Mr. Los Cabos' desk? *crosses himself* The poor man was being threatened and none of us knew...",
    options: [
      { text: "Did Los Cabos ever seem worried or scared to you?", nextNodeId: 'chef-note-worried' },
      { text: "Did you ever overhear anything about a business deal?", nextNodeId: 'chef-note-business' },
      { text: "Back to questions.", nextNodeId: 'chef-root' },
    ],
  },
  'chef-note-worried': {
    id: 'chef-note-worried',
    speaker: 'Chef Allegro',
    text: "Now that you mention it... he was more guarded lately. Double-checking locks, asking who was in the building. I thought he was just stressed about the new production. But maybe he knew someone was after him.",
    nextNodeId: 'chef-root',
  },
  'chef-note-business': {
    id: 'chef-note-business',
    speaker: 'Chef Allegro',
    text: "Business? I'm just the chef — they don't discuss business with me. But I did overhear Carl and Duke Extreme arguing in the hallway two days ago. Carl said something about 'the deal falling through' and Duke Extreme looked terrified.",
    nextNodeId: 'chef-root',
  },
};

// ─── SOUS CHEF SALLY ───────────────────────────────────────────
const sallyTree: DialogTree = {
  'sally-root': {
    id: 'sally-root',
    speaker: 'Sous Chef Sally',
    text: "*chopping vegetables aggressively* What? I'm busy. Make it quick.",
    shortText: "What now?",
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
      { text: "Back to questions.", nextNodeId: 'sally-root' },
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
      { text: "Back to questions.", nextNodeId: 'sally-root' },
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
  // Dagger-unlocked nodes
  'sally-dagger-react': {
    id: 'sally-dagger-react',
    speaker: 'Sous Chef Sally',
    text: "That's... that's not a kitchen knife. That's a prop. I've seen it in the production room before. Someone took it from the display case.",
    options: [
      { text: "How do you know it's from the production room?", nextNodeId: 'sally-dagger-how' },
      { text: "Back to questions.", nextNodeId: 'sally-root' },
    ],
  },
  'sally-dagger-how': {
    id: 'sally-dagger-how',
    speaker: 'Sous Chef Sally',
    text: "I clean every room in this studio on off days. I've dusted that case a hundred times. That dagger was there last week. Someone planned this.",
    nextNodeId: 'sally-root',
  },
  // Wine glass nodes
  'sally-wine-react': {
    id: 'sally-wine-react',
    speaker: 'Sous Chef Sally',
    text: "Drugged?! I POURED that wine! Are you saying I— no! The bottle was sealed when Chef Allegro opened it! If something was in the glass, it happened after I poured it!",
    options: [
      { text: "The glass sat on the counter for a while. Who was near it?", nextNodeId: 'sally-wine-counter' },
      { text: "You carried the tray out. Could someone have added something then?", nextNodeId: 'sally-wine-tray' },
      { text: "Back to questions.", nextNodeId: 'sally-root' },
    ],
  },
  'sally-wine-counter': {
    id: 'sally-wine-counter',
    speaker: 'Sous Chef Sally',
    text: "Duke Extreme! He was hovering around the counter like a vulture. Said he was looking for tequila but kept glancing at the tray. I thought he was just being weird. He's ALWAYS weird.",
    nextNodeId: 'sally-root',
  },
  'sally-wine-tray': {
    id: 'sally-wine-tray',
    speaker: 'Sous Chef Sally',
    text: "I carried it straight to the break room. But... I had to set it down for a second to open the door. It was out of my sight for maybe ten seconds. That's it. That's all it would take, though, isn't it?",
    nextNodeId: 'sally-root',
  },
  // Threatening note nodes
  'sally-note-react': {
    id: 'sally-note-react',
    speaker: 'Sous Chef Sally',
    text: "'Decline the offer or else'? ...That's dark. Mr. Los Cabos never mentioned anything like that to me. But I DID see Carl and Duke Extreme whispering together in the hallway last week. They went quiet the second they saw me.",
    options: [
      { text: "Carl and Duke Extreme together? What do you think they were planning?", nextNodeId: 'sally-note-planning' },
      { text: "Back to questions.", nextNodeId: 'sally-root' },
    ],
  },
  'sally-note-planning': {
    id: 'sally-note-planning',
    speaker: 'Sous Chef Sally',
    text: "I don't know, but Carl looked angry and Duke Extreme looked scared. Like Carl was giving him orders. I stay out of their business, but... if someone was threatening the boss, those two would know about it.",
    nextNodeId: 'sally-root',
  },
};

// ─── LADY FANTASTIQUE (IN HER ROOM) ─────────────────────────────
const ladyRoomTree: DialogTree = {
  'lady-room-root': {
    id: 'lady-room-root',
    speaker: 'Lady Fantastique',
    text: "*sitting on the edge of the bed, eyes red* I needed some space. This room... it's the only place that still feels safe. What do you want?",
    shortText: "More questions?",
    options: [
      { text: "Why did you come back to your room?", nextNodeId: 'lady-room-why' },
      { text: "Tell me more about your history with Los Cabos.", nextNodeId: 'lady-room-history' },
      { text: "Do you know someone named Luke Adams?", nextNodeId: 'lady-room-luke' },
      { text: "I'll give you some space.", nextNodeId: null },
    ],
  },
  'lady-room-why': {
    id: 'lady-room-why',
    speaker: 'Lady Fantastique',
    text: "Because I couldn't stand being in that room anymore. The blood... his body... and the way Carl was just STANDING there. Cold as ice. Like it didn't even bother him.",
    options: [
      { text: "You think Carl isn't bothered by the murder?", nextNodeId: 'lady-room-carl-cold' },
      { text: "Were you and Los Cabos more than colleagues?", nextNodeId: 'lady-room-romantic' },
      { text: "Back to questions.", nextNodeId: 'lady-room-root' },
    ],
  },
  'lady-room-carl-cold': {
    id: 'lady-room-carl-cold',
    speaker: 'Lady Fantastique',
    text: "Bothered? The man didn't even flinch! His business partner is dead on the floor and Carl's calculating his next move. That's not grief — that's an opportunity to him. It makes me sick.",
    options: [
      { text: "Has Carl always been like that?", nextNodeId: 'lady-room-carl-always' },
      { text: "Back to questions.", nextNodeId: 'lady-room-root' },
    ],
  },
  'lady-room-carl-always': {
    id: 'lady-room-carl-always',
    speaker: 'Lady Fantastique',
    text: "He's always been ruthless, but lately it's been worse. Ever since the buyout offer came in, he's been... different. More secretive. More controlling. Like he was waiting for something to happen.",
    nextNodeId: 'lady-room-root',
  },
  'lady-room-romantic': {
    id: 'lady-room-romantic',
    speaker: 'Lady Fantastique',
    text: "*long pause* ...We had something, once. Years ago, before he became the big star director. He was kind back then. Gentle. But Hollywood changes people. He chose his career over us. I never forgave him for that.",
    options: [
      { text: "Is that why you argued with him tonight?", nextNodeId: 'lady-room-argument-detail' },
      { text: "Back to questions.", nextNodeId: 'lady-room-root' },
    ],
  },
  'lady-room-argument-detail': {
    id: 'lady-room-argument-detail',
    speaker: 'Lady Fantastique',
    text: "Partly. He gave MY role to a younger actress. But what really hurt was HOW he told me — in front of everyone, like I didn't matter. After everything we'd been through together. I said things I regret now... but I didn't kill him. I loved him. Even after everything.",
    nextNodeId: 'lady-room-root',
  },
  'lady-room-history': {
    id: 'lady-room-history',
    speaker: 'Lady Fantastique',
    text: "We go back twenty years. He cast me in my first film — 'Stage Presence.' I was nobody, and he made me a star. We built this studio together, really. But as his name grew, mine started to fade. That's Hollywood for you.",
    options: [
      { text: "Did you resent him for that?", nextNodeId: 'lady-room-resent' },
      { text: "What about his partnership with Carl?", nextNodeId: 'lady-room-carl-partnership' },
      { text: "Back to questions.", nextNodeId: 'lady-room-root' },
    ],
  },
  'lady-room-resent': {
    id: 'lady-room-resent',
    speaker: 'Lady Fantastique',
    text: "Resent? That's a strong word. I was... disappointed. He promised me we'd always work together. 'You're my muse,' he said. Then one day I wasn't. The industry moved on and he moved with it. Without me.",
    nextNodeId: 'lady-room-root',
  },
  'lady-room-carl-partnership': {
    id: 'lady-room-carl-partnership',
    speaker: 'Lady Fantastique',
    text: "Carl came along about five years ago. Brought the money. But something was always off about that man. He appeared out of nowhere with deep pockets and a fake smile. Nobody even knows his real background. He just... showed up.",
    options: [
      { text: "Fake smile? You don't trust Carl?", nextNodeId: 'lady-room-carl-trust' },
      { text: "Back to questions.", nextNodeId: 'lady-room-root' },
    ],
  },
  'lady-room-carl-trust': {
    id: 'lady-room-carl-trust',
    speaker: 'Lady Fantastique',
    text: "Trust him? Nobody should trust Carl. He changes his story depending on who he's talking to. I once heard him on the phone using a completely different name. Like he was someone else entirely. It gave me chills.",
    onEnter: { flag: 'ladyMentionedCarlAlias' },
    nextNodeId: 'lady-room-root',
  },
  'lady-room-luke': {
    id: 'lady-room-luke',
    speaker: 'Lady Fantastique',
    text: "*sharp intake of breath* Where did you hear that name?",
    options: [
      { text: "I found a handkerchief with the initials 'L.A.' — Luke Adams.", nextNodeId: 'lady-room-luke-handkerchief' },
      { text: "Just a name that came up in the investigation.", nextNodeId: 'lady-room-luke-vague' },
    ],
  },
  'lady-room-luke-handkerchief': {
    id: 'lady-room-luke-handkerchief',
    speaker: 'Lady Fantastique',
    text: "Luke Adams... that's Carl's real name. He changed it when he came to Hollywood. Said 'Carl' sounded more sophisticated. Nobody was supposed to know about his past. But I found out.",
    onEnter: { flag: 'lukeAdamsRevealed' },
    options: [
      { text: "How did you find out?", nextNodeId: 'lady-room-luke-how' },
      { text: "Why would he hide his real name?", nextNodeId: 'lady-room-luke-why' },
      { text: "Back to questions.", nextNodeId: 'lady-room-root' },
    ],
  },
  'lady-room-luke-vague': {
    id: 'lady-room-luke-vague',
    speaker: 'Lady Fantastique',
    text: "Don't play coy with me, detective. If you know that name, you know more than you're letting on. Luke Adams is Carl's real name. Before Hollywood. Before the money. Before the lies.",
    onEnter: { flag: 'lukeAdamsRevealed' },
    options: [
      { text: "Why would Carl hide his identity?", nextNodeId: 'lady-room-luke-why' },
      { text: "Back to questions.", nextNodeId: 'lady-room-root' },
    ],
  },
  'lady-room-luke-how': {
    id: 'lady-room-luke-how',
    speaker: 'Lady Fantastique',
    text: "I found old documents in the studio safe last year. A birth certificate, a name change filing. 'Luke Adams' became 'Carl' — just Carl, no surname. Like Madonna or Cher, but for a con man. When I confronted him, he threatened to ruin my career if I told anyone.",
    options: [
      { text: "He threatened you? That sounds like motive.", nextNodeId: 'lady-room-luke-threat' },
      { text: "Back to questions.", nextNodeId: 'lady-room-root' },
    ],
  },
  'lady-room-luke-threat': {
    id: 'lady-room-luke-threat',
    speaker: 'Lady Fantastique',
    text: "Motive for ME? Or motive for HIM? Think about it — if Los Cabos found out Carl was hiding his identity, the partnership would be over. And with the buyout deal... Carl had everything to lose. Everything.",
    nextNodeId: 'lady-room-root',
  },
  'lady-room-luke-why': {
    id: 'lady-room-luke-why',
    speaker: 'Lady Fantastique',
    text: "Because Luke Adams has a past. Fraud charges in Nevada. A failed business that bilked investors. He reinvented himself as 'Carl' — mysterious, sophisticated, wealthy. But it's all built on lies. And now someone is dead.",
    onEnter: { flag: 'carlFraudRevealed' },
    nextNodeId: 'lady-room-root',
  },
  // Evidence options when in room
  'lady-room-dagger-react': {
    id: 'lady-room-dagger-react',
    speaker: 'Lady Fantastique',
    text: "You brought that HERE? *recoils* ...Wait. Look at the handle. See those scratches? Someone filed off an inscription. The original props all had the film title engraved. Whoever sharpened this tried to hide its origin.",
    options: [
      { text: "Carl said he handled the props. Could he have done this?", nextNodeId: 'lady-room-dagger-carl' },
      { text: "Back to questions.", nextNodeId: 'lady-room-root' },
    ],
  },
  'lady-room-dagger-carl': {
    id: 'lady-room-dagger-carl',
    speaker: 'Lady Fantastique',
    text: "Carl? That man doesn't get his hands dirty. But he'd know someone who would. Duke Extreme handled weapons on set... and he's been doing whatever Carl tells him lately. Follow the money, detective.",
    nextNodeId: 'lady-room-root',
  },
  'lady-room-note-react': {
    id: 'lady-room-note-react',
    speaker: 'Lady Fantastique',
    text: "That handwriting... *squints* I've seen it before. On memos around the studio. Carl always writes his M's with that strange flourish. Compare it yourself if you don't believe me.",
    onEnter: { flag: 'carlHandwritingClue' },
    options: [
      { text: "You're saying Carl wrote this threatening note?", nextNodeId: 'lady-room-note-carl' },
      { text: "Back to questions.", nextNodeId: 'lady-room-root' },
    ],
  },
  'lady-room-note-carl': {
    id: 'lady-room-note-carl',
    speaker: 'Lady Fantastique',
    text: "I'm saying the handwriting looks familiar. But Carl's too smart to leave something so obvious... unless he wanted someone else to take the fall. He's always three steps ahead. That's what makes him dangerous.",
    nextNodeId: 'lady-room-root',
  },
  'lady-room-photo-react': {
    id: 'lady-room-photo-react',
    speaker: 'Lady Fantastique',
    text: "That photograph... *takes it gently* This is from the buyout signing meeting. That's Carl — Luke — shaking hands with the buyer. He told Los Cabos the deal fell through. But it didn't, did it? He was working behind Los Cabos' back the whole time.",
    onEnter: { flag: 'carlBetrayalRevealed' },
    nextNodeId: 'lady-room-root',
  },
  'lady-room-money-bag-react': {
    id: 'lady-room-money-bag-react',
    speaker: 'Lady Fantastique',
    text: "Cash? That's the buyout advance, I'd bet my career on it. Carl funneled money to Duke Extreme to pressure Los Cabos. When pressure didn't work... someone escalated. And now Los Cabos is dead.",
    nextNodeId: 'lady-room-root',
  },
  'lady-room-wine-react': {
    id: 'lady-room-wine-react',
    speaker: 'Lady Fantastique',
    text: "Carl ordered that specific wine for Los Cabos. He made a point of it — 'only the best for our host.' But what if the wine was always part of the plan? Drug him first, then... *shudders* It's too horrible to think about.",
    nextNodeId: 'lady-room-root',
  },
};

const ladyRoomEvidenceOptions: EvidenceOption[] = [
  { flag: 'daggerTaken', option: { text: "Take another look at this dagger. Notice anything new?", nextNodeId: 'lady-room-dagger-react' } },
  { flag: 'drawerOpened', option: { text: "About that threatening note — do you recognize the handwriting?", nextNodeId: 'lady-room-note-react' } },
  { flag: 'photoTaken', option: { text: "I found this torn photograph. Recognize anyone?", nextNodeId: 'lady-room-photo-react' } },
  { flag: 'wineGlassTaken', option: { text: "The drugged wine — Carl ordered it specifically for Los Cabos, didn't he?", nextNodeId: 'lady-room-wine-react' } },
  { flag: 'moneyBagTaken', option: { text: "About that cash in Duke Extreme's room — where do you think it came from?", nextNodeId: 'lady-room-money-bag-react' } },
];

// ─── EVIDENCE-AWARE OPTION BUILDERS ───────────────────────────────

interface EvidenceOption {
  flag: string;
  option: DialogOption;
}

const carlEvidenceOptions: EvidenceOption[] = [
  { flag: 'daggerTaken', option: { text: "I found the murder weapon. Know anything about this dagger?", nextNodeId: 'carl-dagger-react' } },
  { flag: 'drawerOpened', option: { text: "I found a threatening note. 'Decline the offer or else.' Ring any bells?", nextNodeId: 'carl-note-react' } },
  { flag: 'wineGlassTaken', option: { text: "This wine glass has a strange residue. You ordered that wine, didn't you?", nextNodeId: 'carl-wine-react' } },
  { flag: 'moneyBagTaken', option: { text: "I found a bag of cash in Duke Extreme's room. Know anything about that?", nextNodeId: 'carl-money-bag-react' } },
];

const ladyEvidenceOptions: EvidenceOption[] = [
  { flag: 'daggerTaken', option: { text: "Do you recognize this dagger?", nextNodeId: 'lady-dagger-react' } },
  { flag: 'drawerOpened', option: { text: "I found a note in Los Cabos' desk: 'Decline the offer or else.'", nextNodeId: 'lady-note-react' } },
  { flag: 'wineGlassTaken', option: { text: "I found a wine glass with a suspicious residue. Los Cabos may have been drugged.", nextNodeId: 'lady-wine-react' } },
  { flag: 'moneyBagTaken', option: { text: "I found a bag of cash hidden in Duke Extreme's room.", nextNodeId: 'lady-money-bag-react' } },
];

const fuegoEvidenceOptions: EvidenceOption[] = [
  { flag: 'daggerTaken', option: { text: "This dagger — you handled weapons on the Marrakech set. Recognize it?", nextNodeId: 'fuego-dagger-react' } },
  { flag: 'drawerOpened', option: { text: "I found a threatening note: 'Decline the offer or else.' Know anything?", nextNodeId: 'fuego-note-react' } },
  { flag: 'wineGlassTaken', option: { text: "Someone drugged the wine. You were in the kitchen all night.", nextNodeId: 'fuego-wine-react' } },
  { flag: 'moneyBagTaken', option: { text: "I found a bag of cash in YOUR room, Duke. Care to explain?", nextNodeId: 'fuego-money-bag-react' } },
];

const chefEvidenceOptions: EvidenceOption[] = [
  { flag: 'wineGlassTaken', option: { text: "This wine glass has residue in it. The wine may have been drugged.", nextNodeId: 'chef-wine-react' } },
  { flag: 'drawerOpened', option: { text: "I found a threatening note in Los Cabos' desk. Did he seem worried lately?", nextNodeId: 'chef-note-react' } },
];

const sallyEvidenceOptions: EvidenceOption[] = [
  { flag: 'daggerTaken', option: { text: "Recognize this dagger?", nextNodeId: 'sally-dagger-react' } },
  { flag: 'wineGlassTaken', option: { text: "This wine glass has a strange residue. You poured the wine, right?", nextNodeId: 'sally-wine-react' } },
  { flag: 'drawerOpened', option: { text: "I found a note: 'Decline the offer or else.' Any idea who wrote it?", nextNodeId: 'sally-note-react' } },
];

/**
 * Builds a dynamic root node that includes evidence-based options
 * when the corresponding flags are set.
 */
function buildDynamicRoot(
  baseRoot: DialogNode,
  evidenceOptions: EvidenceOption[],
  flags: Record<string, boolean>,
): DialogNode {
  const activeEvidence = evidenceOptions.filter(e => flags[e.flag] === true);
  if (activeEvidence.length === 0) return baseRoot;

  // Insert evidence options before the last "dismiss" option
  const baseOptions = baseRoot.options ? [...baseRoot.options] : [];
  const dismissOption = baseOptions.pop(); // "Never mind" / "I'll leave you" etc.

  // Keep max 4 options: up to 2 evidence + remaining base + dismiss
  const evidenceDialogOptions = activeEvidence.map(e => e.option);
  const maxEvidence = Math.min(evidenceDialogOptions.length, 2);
  const selectedEvidence = evidenceDialogOptions.slice(0, maxEvidence);
  const remainingBase = baseOptions.slice(0, 4 - maxEvidence - 1); // -1 for dismiss

  const newOptions: DialogOption[] = [
    ...selectedEvidence,
    ...remainingBase,
  ];
  if (dismissOption) newOptions.push(dismissOption);

  return {
    ...baseRoot,
    id: baseRoot.id + '-dynamic',
    options: newOptions,
  };
}

/**
 * Returns the root DialogNode for a character based on current game flags.
 * Evidence flags dynamically add new conversation options.
 */
export function getDialogTree(characterId: string, flags: Record<string, boolean>): DialogNode | null {
  switch (characterId) {
    case 'carl':
      return buildDynamicRoot(carlTree['carl-root'], carlEvidenceOptions, flags);
    case 'lady':
      // Use room-specific dialog when Lady Fantastique has relocated
      if (flags.handkerchiefTaken) {
        return buildDynamicRoot(ladyRoomTree['lady-room-root'], ladyRoomEvidenceOptions, flags);
      }
      return buildDynamicRoot(ladyTree['lady-root'], ladyEvidenceOptions, flags);
    case 'el-fuego':
      return buildDynamicRoot(elFuegoTree['fuego-root'], fuegoEvidenceOptions, flags);
    case 'chef-allegro':
      return buildDynamicRoot(chefAllegroTree['chef-root'], chefEvidenceOptions, flags);
    case 'sous-chef-sally':
      return buildDynamicRoot(sallyTree['sally-root'], sallyEvidenceOptions, flags);
    default:
      return null;
  }
}

/**
 * Looks up a dialog node by ID across all character trees.
 */
export function getDialogNodeById(nodeId: string): DialogNode | null {
  return carlTree[nodeId] ?? ladyTree[nodeId] ?? elFuegoTree[nodeId] ?? chefAllegroTree[nodeId] ?? sallyTree[nodeId] ?? ladyRoomTree[nodeId] ?? null;
}
