import { EvidenceEntry } from '@/types/game';

// Maps game flags to evidence entries that should be auto-logged
export const flagEvidenceMap: Record<string, EvidenceEntry> = {
  drawerOpened: {
    id: 'threatening-note',
    title: 'Threatening Note',
    description: 'Found in Los Cabos\' desk drawer. The note reads: "Decline the offer or else."',
    category: 'Documents',
  },
  murderRevealed: {
    id: 'murder-discovered',
    title: 'Murder Discovered',
    description: 'The lights went out during the party. When they came back on, a body was found.',
    category: 'Testimonies',
  },
  backyardUnlocked: {
    id: 'backyard-unlocked',
    title: 'Backyard Access',
    description: 'Used a key to unlock the french doors leading to the backyard.',
    category: 'Physical Evidence',
  },
};

// Maps inventory item IDs to evidence entries
export const itemEvidenceMap: Record<string, EvidenceEntry> = {
  'wine-glass': {
    id: 'wine-glass-evidence',
    title: 'Suspicious Wine Glass',
    description: 'A wine glass with a strange residue at the bottom. Someone may have been drugged.',
    category: 'Physical Evidence',
  },
  'fountain_key': {
    id: 'electrical-box-key',
    title: 'Electrical Box Key',
    description: 'A small key found hidden at the bottom of the koi pond, concealed by the fountain\'s flow. It fits the electrical box in the production room.',
    category: 'Physical Evidence',
  },
  'dagger': {
    id: 'murder-weapon',
    title: 'Murder Weapon',
    description: 'An ornate dagger covered in blood. The murder weapon.',
    category: 'Physical Evidence',
  },
  'money-bag': {
    id: 'money-bag-evidence',
    title: 'Duffel Bag of Cash',
    description: 'A black duffel bag stuffed with bundles of cash found in Duke Extreme\'s room.',
    category: 'Physical Evidence',
  },
  'meat-stick': {
    id: 'meat-stick-evidence',
    title: 'Meat Stick',
    description: 'A gourmet meat stick from the charcuterie board. Possibly useful.',
    category: 'Physical Evidence',
  },
  'wire_cutters': {
    id: 'wire-cutters-evidence',
    title: 'Wire Cutters',
    description: 'Heavy-duty wire cutters found in the garden shed. The blades have fresh copper residue — someone used these to cut wires recently.',
    category: 'Physical Evidence',
  },
};

export const flagEvidenceMapExtended: Record<string, EvidenceEntry> = {
  electricalBoxOpened: {
    id: 'frayed-wires',
    title: 'Sabotaged Electrical Box',
    description: 'The electrical box in the production room has been tampered with. The red conduit pipe was deliberately cut and the wires are frayed and exposed. This could be what caused the blackout.',
    category: 'Physical Evidence',
  },
  note754Found: {
    id: 'note-754',
    title: 'Mysterious Number: 754',
    description: 'A piece of paper taped inside the electrical box door with "754" scrawled in red. The significance of this number is unknown.',
    category: 'Documents',
  },
  shedUnlocked: {
    id: 'shed-unlocked',
    title: 'Shed Unlocked',
    description: 'The combination lock on the garden shed opened with code 754 — the same number found in the electrical box. Whoever sabotaged the wiring has access to this shed.',
    category: 'Physical Evidence',
  },
  wireCuttersCopperResidue: {
    id: 'copper-residue',
    title: 'Copper Residue on Wire Cutters',
    description: 'The wire cutters from the shed have fresh copper residue on the blades — a direct match to the cut conduit wires in the production room electrical box.',
    category: 'Physical Evidence',
  },
  propsCrateInspected: {
    id: 'props-crate',
    title: 'Empty Props Crate',
    description: 'A crate in the shed marked "PROPS - DO NOT REMOVE" is completely empty. Props from the production room may have been moved here — or removed entirely.',
    category: 'Documents',
  },
  wiresRepaired: {
    id: 'wires-repaired',
    title: 'Wires Repaired',
    description: 'Used the wire cutters to strip and reconnect the severed wires in the electrical box. The production room power system has been restored.',
    category: 'Physical Evidence',
  },
  projectorWatched: {
    id: 'projector-recording',
    title: 'Security Camera Recording',
    description: 'The film projector showed a recording of someone sabotaging the electrical box before the party. They cut the red conduit wire and taped a note with "754" inside the door. Their face was obscured, but they wore a distinctive silver signet ring on their left hand.',
    category: 'Documents',
  },
};
