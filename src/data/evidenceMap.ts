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
};
