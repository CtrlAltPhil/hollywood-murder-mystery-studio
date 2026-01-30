import { Verb } from '@/types/game';

interface VerbBarProps {
  selectedVerb: Verb | null;
  onVerbSelect: (verb: Verb) => void;
  actionText: string;
}

const VERBS: { verb: Verb; label: string }[] = [
  { verb: 'look', label: 'Look at' },
  { verb: 'pickup', label: 'Pick up' },
  { verb: 'use', label: 'Use' },
  { verb: 'open', label: 'Open' },
  { verb: 'close', label: 'Close' },
  { verb: 'talk', label: 'Talk to' },
  { verb: 'push', label: 'Push' },
  { verb: 'pull', label: 'Pull' },
];

export function VerbBar({ selectedVerb, onVerbSelect, actionText }: VerbBarProps) {
  return (
    <div className="bg-[hsl(var(--game-verb-bg))] border-t-2 border-primary/30 p-2">
      {/* Action Text Display */}
      <div className="h-6 mb-2 text-center text-sm text-primary truncate px-4">
        {actionText || '\u00A0'}
      </div>

      {/* Verb Grid */}
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {VERBS.map(({ verb, label }) => (
          <button
            key={verb}
            onClick={() => onVerbSelect(verb)}
            className={`verb-button ${selectedVerb === verb ? 'active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
