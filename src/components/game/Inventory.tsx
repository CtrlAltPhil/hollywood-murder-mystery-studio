import { InventoryItem } from '@/types/game';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface InventoryProps {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  onItemSelect: (item: InventoryItem) => void;
  onItemHover?: (text: string) => void;
}

const VISIBLE_SLOTS = 6;

export function Inventory({ items, selectedItem, onItemSelect, onItemHover }: InventoryProps) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const canScrollLeft = scrollOffset > 0;
  const canScrollRight = scrollOffset < Math.max(0, items.length - VISIBLE_SLOTS);

  const scrollLeft = () => setScrollOffset(prev => Math.max(0, prev - 1));
  const scrollRight = () => setScrollOffset(prev => Math.min(items.length - VISIBLE_SLOTS, prev + 1));

  const visibleItems = items.slice(scrollOffset, scrollOffset + VISIBLE_SLOTS);
  const emptySlots = VISIBLE_SLOTS - visibleItems.length;

  return (
    <div className="bg-[hsl(var(--game-inventory-bg))] border-t border-border/30 p-1">
      <div className="flex items-center justify-center gap-0.5">
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Scroll inventory left"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex gap-0.5">
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
              className={`inventory-slot relative ${
                selectedItem?.id === item.id ? 'border-primary ring-1 ring-primary/50' : ''
              }`}
              aria-label={item.name}
            >
              <img src={item.image} alt={item.name} className="w-10 h-10 object-contain pixelated" />
              {hoveredId === item.id && (
                <div
                  className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-zinc-900 border border-amber-500/60 text-amber-200 text-[9px] px-2 py-1 rounded shadow-lg"
                  style={{ fontFamily: '"Press Start 2P", monospace' }}
                >
                  {item.name}
                </div>
              )}
            </button>
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div key={`empty-${i}`} className="inventory-slot opacity-50" />
          ))}
        </div>

        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Scroll inventory right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
