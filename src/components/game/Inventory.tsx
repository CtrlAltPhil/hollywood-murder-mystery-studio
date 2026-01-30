import { InventoryItem } from '@/types/game';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface InventoryProps {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  onItemSelect: (item: InventoryItem) => void;
}

const VISIBLE_SLOTS = 6;

export function Inventory({ items, selectedItem, onItemSelect }: InventoryProps) {
  const [scrollOffset, setScrollOffset] = useState(0);

  const canScrollLeft = scrollOffset > 0;
  const canScrollRight = scrollOffset < Math.max(0, items.length - VISIBLE_SLOTS);

  const scrollLeft = () => {
    setScrollOffset(prev => Math.max(0, prev - 1));
  };

  const scrollRight = () => {
    setScrollOffset(prev => Math.min(items.length - VISIBLE_SLOTS, prev + 1));
  };

  const visibleItems = items.slice(scrollOffset, scrollOffset + VISIBLE_SLOTS);
  const emptySlots = VISIBLE_SLOTS - visibleItems.length;

  return (
    <div className="bg-[hsl(var(--game-inventory-bg))] border-t border-border/30 p-1">
      <div className="flex items-center justify-center gap-0.5">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Inventory Slots */}
        <div className="flex gap-0.5">
          {visibleItems.map(item => (
            <button
              key={item.id}
              onClick={() => onItemSelect(item)}
              className={`inventory-slot ${
                selectedItem?.id === item.id 
                  ? 'border-primary ring-1 ring-primary/50' 
                  : ''
              }`}
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
            <div key={`empty-${i}`} className="inventory-slot opacity-50" />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
