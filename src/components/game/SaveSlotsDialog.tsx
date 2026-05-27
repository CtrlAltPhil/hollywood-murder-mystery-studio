import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Save, FolderOpen } from 'lucide-react';
import { listSlots, SaveSlot, SlotInfo } from '@/utils/saveSystem';

interface SaveSlotsDialogProps {
  mode: 'save' | 'load';
  onSelect: (slot: SaveSlot) => void;
  onDelete?: (slot: SaveSlot) => void;
  onClose: () => void;
}

function formatDate(ts?: number) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function describePhase(slot: SlotInfo) {
  if (!slot.exists) return 'Empty slot';
  if (slot.phase === 'gameplay' && slot.currentRoom) {
    const pretty = slot.currentRoom.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return pretty;
  }
  return slot.phase ?? 'Saved game';
}

export function SaveSlotsDialog({ mode, onSelect, onDelete, onClose }: SaveSlotsDialogProps) {
  const [slots, setSlots] = useState<SlotInfo[]>(() => listSlots());

  useEffect(() => {
    setSlots(listSlots());
  }, [mode]);

  const refresh = () => setSlots(listSlots());

  return (
    <div
      className="absolute inset-0 z-[60] bg-black/85 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border-2 border-zinc-700 p-6 rounded-lg shadow-2xl max-w-md w-[92%]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-yellow-400 uppercase tracking-widest mb-4 text-center title-glow flex items-center justify-center gap-2">
          {mode === 'save' ? <Save className="w-5 h-5" /> : <FolderOpen className="w-5 h-5" />}
          {mode === 'save' ? 'Save Game' : 'Load Game'}
        </h3>
        <div className="flex flex-col gap-2 mb-4">
          {slots.map((s) => {
            const disabled = mode === 'load' && !s.exists;
            return (
              <div
                key={s.slot}
                className={`flex items-center gap-2 border rounded-md p-3 ${
                  disabled
                    ? 'border-zinc-800 opacity-50'
                    : 'border-zinc-700 hover:border-yellow-500/60 hover:bg-zinc-800/60 cursor-pointer'
                }`}
                onClick={() => !disabled && onSelect(s.slot)}
              >
                <div className="flex-1 text-left">
                  <div className="text-yellow-300 text-sm font-bold uppercase tracking-wider">
                    Slot {s.slot}
                  </div>
                  <div className="text-zinc-400 text-xs">{describePhase(s)}</div>
                  {s.exists && (
                    <div className="text-zinc-500 text-[10px] mt-0.5">{formatDate(s.savedAt)}</div>
                  )}
                </div>
                {s.exists && onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(s.slot);
                      refresh();
                    }}
                    className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors"
                    aria-label={`Delete slot ${s.slot}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          className="w-full text-sm py-4 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          CANCEL
        </Button>
      </div>
    </div>
  );
}
