import { Verb, InventoryItem } from '@/types/game';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ScummUIProps {
  selectedVerb: Verb | null;
  onVerbSelect: (verb: Verb) => void;
  actionText: string;
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  onItemSelect: (item: InventoryItem) => void;
  onItemHover?: (text: string) => void;
  recentItemId?: string | null;
}


// Display order in the 4x2 grid, with the keyboard hotkey for each verb.
// Hotkeys (1-8) match left-to-right, top-to-bottom reading order.
const VERBS: { verb: Verb; label: string; hotkey: string }[] = [
  { verb: 'open', label: 'Open', hotkey: '1' },
  { verb: 'close', label: 'Close', hotkey: '2' },
  { verb: 'push', label: 'Push', hotkey: '3' },
  { verb: 'pull', label: 'Pull', hotkey: '4' },
  { verb: 'look', label: 'Look at', hotkey: '5' },
  { verb: 'pickup', label: 'Pick up', hotkey: '6' },
  { verb: 'talk', label: 'Talk to', hotkey: '7' },
  { verb: 'use', label: 'Use', hotkey: '8' },
];

export const VERB_HOTKEY_MAP: Record<string, Verb> = VERBS.reduce(
  (acc, v) => ({ ...acc, [v.hotkey]: v.verb }),
  {} as Record<string, Verb>,
);

const INVENTORY_SLOTS = 8;

export function ScummUI({
  selectedVerb,
  onVerbSelect,
  actionText,
  items,
  selectedItem,
  onItemSelect,
  onItemHover,
  recentItemId,
}: ScummUIProps) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const canScrollUp = scrollOffset > 0;
  const canScrollDown = scrollOffset < Math.max(0, items.length - INVENTORY_SLOTS);

  const visibleItems = items.slice(scrollOffset, scrollOffset + INVENTORY_SLOTS);
  const emptySlots = INVENTORY_SLOTS - visibleItems.length;


  return (
    <div className="h-full w-full bg-[hsl(280,40%,15%)] border-t-4 border-[hsl(280,30%,10%)] flex flex-col font-mono">
      {/* Action Text Line - Classic single line feedback */}
      <div className="min-h-8 flex-shrink-0 flex items-center justify-center bg-black/30 border-b border-[hsl(280,30%,25%)] px-3 py-1">
        <span className="text-[hsl(320,80%,70%)] text-xs lg:text-sm font-bold tracking-wider uppercase drop-shadow-md text-center leading-tight line-clamp-2">
          {actionText || ' '}
        </span>
      </div>

      {/* Control Panel */}
      <div className="flex flex-1 overflow-hidden p-1 gap-1.5">

        {/* Verbs Area - 4x2 Grid */}
        <div className="grid grid-cols-4 grid-rows-2 gap-1 w-1/2 lg:w-5/12">
          {VERBS.map(({ verb, label, hotkey }) => (
            <button
              key={verb}
              onClick={() => onVerbSelect(verb)}
              title={`${label} (${hotkey})`}
              aria-label={`${label} — keyboard shortcut ${hotkey}`}
              className={`
                relative flex items-center justify-center text-[10px] lg:text-xs font-bold uppercase tracking-wide transition-all
                border-2 active:translate-y-px
                ${selectedVerb === verb
                  ? 'text-black bg-[hsl(60,90%,70%)] border-[hsl(60,80%,50%)] shadow-[0_0_8px_hsl(60,90%,50%,0.5)]'
                  : 'text-[hsl(60,90%,70%)] bg-[hsl(280,40%,25%)] border-[hsl(280,40%,35%)] hover:bg-[hsl(280,40%,30%)] hover:text-white'
                }
              `}
            >
              <span>{label}</span>
              <span
                className={`absolute top-0.5 right-1 text-[8px] opacity-60 ${
                  selectedVerb === verb ? 'text-black' : 'text-[hsl(60,90%,70%)]'
                }`}
              >
                {hotkey}
              </span>
            </button>
          ))}
        </div>

        {/* Inventory Area */}
        <div className="flex-1 flex gap-1 bg-black/20 p-1 border-2 border-[hsl(280,30%,20%)] inset-shadow">

          {/* Scroll Up/Down Controls */}
          <div className="flex flex-col gap-1 w-6 lg:w-8">
            <button
              onClick={() => setScrollOffset(prev => Math.max(0, prev - 4))}
              disabled={!canScrollUp}
              aria-label="Scroll inventory up"
              className="flex-1 flex items-center justify-center bg-[hsl(280,40%,25%)] border border-[hsl(280,40%,35%)]
                         text-[hsl(60,90%,70%)] hover:bg-[hsl(280,40%,30%)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronUp size={16} strokeWidth={3} />
            </button>
            <button
              onClick={() => setScrollOffset(prev => Math.min(items.length - INVENTORY_SLOTS, prev + 4))}
              disabled={!canScrollDown}
              aria-label="Scroll inventory down"
              className="flex-1 flex items-center justify-center bg-[hsl(280,40%,25%)] border border-[hsl(280,40%,35%)]
                         text-[hsl(60,90%,70%)] hover:bg-[hsl(280,40%,30%)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronDown size={16} strokeWidth={3} />
            </button>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-4 grid-rows-2 gap-1 flex-1">
            {visibleItems.map(item => (
              <button
                key={item.id}
                onClick={() => onItemSelect(item)}
                onMouseEnter={() => {
                  setHoveredId(item.id);
                  onItemHover?.(item.name);
                }}
                onMouseLeave={() => {
                  setHoveredId(id => (id === item.id ? null : id));
                  onItemHover?.('');
                }}
                className={`
                  relative overflow-visible flex items-center justify-center
                  bg-[hsl(280,40%,20%)] border-2 transition-colors
                  ${selectedItem?.id === item.id
                    ? 'border-[hsl(60,90%,70%)] bg-[hsl(280,50%,30%)]'
                    : 'border-[hsl(280,50%,30%)] hover:border-[hsl(320,80%,70%)]'
                  }
                  ${recentItemId === item.id ? 'inventory-flash' : ''}
                `}
                aria-label={item.name}

              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain pixelated p-0.5"
                />
              </button>
            ))}
            {/* Empty Slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="bg-[hsl(280,40%,18%)] border border-[hsl(280,30%,25%)] opacity-50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
