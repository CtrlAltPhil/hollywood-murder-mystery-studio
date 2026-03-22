import { useState } from 'react';
import { X, MessageSquare, Search, Users, Clock } from 'lucide-react';
import { DialogueEntry, EvidenceEntry, EvidenceCategory } from '@/types/game';

interface NotesOverlayProps {
  dialogueLog: DialogueEntry[];
  evidenceLog: EvidenceEntry[];
  onClose: () => void;
}

type Tab = 'dialogue' | 'evidence';
type DialogueView = 'character' | 'chronological';

const EVIDENCE_CATEGORIES: EvidenceCategory[] = ['Physical Evidence', 'Documents', 'Testimonies'];

export function NotesOverlay({ dialogueLog, evidenceLog, onClose }: NotesOverlayProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dialogue');
  const [dialogueView, setDialogueView] = useState<DialogueView>('character');

  const dialogueByCharacter = dialogueLog.reduce<Record<string, DialogueEntry[]>>((acc, entry) => {
    if (!acc[entry.speaker]) acc[entry.speaker] = [];
    acc[entry.speaker].push(entry);
    return acc;
  }, {});

  const evidenceByCategory = EVIDENCE_CATEGORIES.map(cat => ({
    category: cat,
    entries: evidenceLog.filter(e => e.category === cat),
  })).filter(g => g.entries.length > 0);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-[90%] h-[85%] bg-zinc-900/95 border-2 border-amber-500/40 rounded-sm flex overflow-hidden"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left sidebar tabs */}
        <div className="w-44 border-r border-amber-500/20 flex flex-col bg-zinc-950/50 shrink-0">
          <div className="p-3 border-b border-amber-500/20">
            <span className="text-amber-400 text-[9px] uppercase tracking-wider">Detective Notes</span>
          </div>
          <button
            onClick={() => setActiveTab('dialogue')}
            className={`flex items-center gap-2 px-3 py-3 text-[8px] text-left transition-colors ${
              activeTab === 'dialogue'
                ? 'bg-amber-500/20 text-amber-300 border-r-2 border-amber-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            Dialogue
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex items-center gap-2 px-3 py-3 text-[8px] text-left transition-colors ${
              activeTab === 'evidence'
                ? 'bg-amber-500/20 text-amber-300 border-r-2 border-amber-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            Evidence
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'dialogue' && (
            <>
              {/* View toggle */}
              <div className="flex items-center gap-2 p-3 border-b border-amber-500/20">
                <button
                  onClick={() => setDialogueView('character')}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[7px] transition-colors ${
                    dialogueView === 'character'
                      ? 'bg-amber-500/30 text-amber-300'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  By Character
                </button>
                <button
                  onClick={() => setDialogueView('chronological')}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[7px] transition-colors ${
                    dialogueView === 'chronological'
                      ? 'bg-amber-500/30 text-amber-300'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  Chronological
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
                {dialogueLog.length === 0 ? (
                  <p className="text-zinc-600 text-[8px] text-center mt-8">No dialogue recorded yet.</p>
                ) : dialogueView === 'character' ? (
                  Object.entries(dialogueByCharacter).map(([speaker, entries]) => (
                    <CharacterSection key={speaker} speaker={speaker} entries={entries} />
                  ))
                ) : (
                  dialogueLog.map((entry, i) => (
                    <div key={i} className="border-b border-zinc-800/50 pb-2">
                      <span className="text-amber-400 text-[8px] uppercase">{entry.speaker}</span>
                      <p className="text-zinc-300 text-[7px] leading-relaxed mt-0.5">{entry.text}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'evidence' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {evidenceLog.length === 0 ? (
                <p className="text-zinc-600 text-[8px] text-center mt-8">No evidence collected yet.</p>
              ) : (
                evidenceByCategory.map(({ category, entries }) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-2 border-b border-amber-500/20 pb-1">
                      <span className="text-amber-400 text-[8px] uppercase tracking-wider">{category}</span>
                      <span className="text-zinc-600 text-[7px]">({entries.length})</span>
                    </div>
                    <div className="space-y-2 ml-1">
                      {entries.map(entry => (
                        <div key={entry.id} className="bg-zinc-800/40 rounded px-2 py-2 border-l-2 border-amber-500/40">
                          <p className="text-amber-300 text-[8px] font-bold">{entry.title}</p>
                          <p className="text-zinc-400 text-[7px] leading-relaxed mt-0.5">{entry.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CharacterSection({ speaker, entries }: { speaker: string; entries: DialogueEntry[] }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left mb-1"
      >
        <span className="text-amber-400 text-[8px] uppercase tracking-wider">{speaker}</span>
        <span className="text-zinc-600 text-[7px]">({entries.length})</span>
        <span className="text-zinc-600 text-[8px] ml-auto">{expanded ? '▾' : '▸'}</span>
      </button>
      {expanded && (
        <div className="space-y-1.5 ml-2 border-l border-zinc-800 pl-2">
          {entries.map((entry, i) => (
            <p key={i} className="text-zinc-300 text-[7px] leading-relaxed">{entry.text}</p>
          ))}
        </div>
      )}
    </div>
  );
}
