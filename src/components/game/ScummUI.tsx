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
}

const VERBS: { verb: Verb; label: string }[] = [
  { verb: 'open', label: 'Open' },
  { verb: 'close', label: 'Close' },
  { verb: 'push', label: 'Push' },
  { verb: 'pull', label: 'Pull' },
  { verb: 'look', label: 'Look at' },
  { verb: 'pickup', label: 'Pick up' },
  { verb: 'talk', label: 'Talk to' },
  { verb: 'use', label: 'Use' },
];

const INVENTORY_SLOTS = 8;

export function ScummUI({ 
  selectedVerb, 
  onVerbSelect, 
  actionText,
  items,
  selectedItem,
  onItemSelect
}: ScummUIProps) {
  const [scrollOffset, setScrollOffset] = useState(0);

  const canScrollUp = scrollOffset > 0;
  const canScrollDown = scrollOffset < Math.max(0, items.length - INVENTORY_SLOTS);

  const visibleItems = items.slice(scrollOffset, scrollOffset + INVENTORY_SLOTS);
  const emptySlots = INVENTORY_SLOTS - visibleItems.length;

  return (
    <div className="bg-[hsl(280,40%,15%)] border-t-2 border-[hsl(280,60%,40%)]">
      {/* Action Text Display */}
      <div className="h-6 flex items-center justify-center text-[hsl(320,80%,70%)] text-sm font-bold tracking-wide">
        {actionText || '\u00A0'}
      </div>

      {/* Main UI Row: Verbs | Inventory */}
      <div className="flex">
        {/* Verb Grid - 4x2 layout */}
        <div className="grid grid-cols-4 gap-px p-1 flex-shrink-0">
          {VERBS.map(({ verb, label }) => (
            <button
              key={verb}
              onClick={() => onVerbSelect(verb)}
              className={`
                px-3 py-1.5 text-xs font-bold tracking-wide transition-colors
                ${selectedVerb === verb 
                  ? 'text-[hsl(60,90%,70%)] bg-[hsl(280,50%,25%)]' 
                  : 'text-[hsl(320,80%,70%)] hover:text-[hsl(60,90%,70%)] bg-[hsl(280,40%,20%)]'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Inventory Grid - 4x2 with scroll arrows */}
        <div className="flex-1 flex items-center justify-end gap-1 p-1">
          {/* Scroll Up Arrow */}
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => setScrollOffset(prev => Math.max(0, prev - 4))}
              disabled={!canScrollUp}
              className="p-0.5 text-[hsl(320,80%,70%)] hover:text-[hsl(60,90%,70%)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() => setScrollOffset(prev => Math.min(items.length - INVENTORY_SLOTS, prev + 4))}
              disabled={!canScrollDown}
              className="p-0.5 text-[hsl(320,80%,70%)] hover:text-[hsl(60,90%,70%)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Inventory Slots - 4x2 grid */}
          <div className="grid grid-cols-4 grid-rows-2 gap-0.5">
            {visibleItems.map(item => (
              <button
                key={item.id}
                onClick={() => onItemSelect(item)}
                className={`
                  w-12 h-12 bg-[hsl(280,40%,20%)] border border-[hsl(280,50%,30%)] 
                  flex items-center justify-center transition-colors
                  ${selectedItem?.id === item.id 
                    ? 'border-[hsl(60,90%,70%)] ring-1 ring-[hsl(60,90%,70%)]' 
                    : 'hover:border-[hsl(320,80%,70%)]'
                  }
                `}
                title={item.name}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 object-contain pixelated"
                />
              </button>
            ))}
            {/* Empty slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div 
                key={`empty-${i}`} 
                className="w-12 h-12 bg-[hsl(280,40%,20%)] border border-[hsl(280,50%,30%)] opacity-50" 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
