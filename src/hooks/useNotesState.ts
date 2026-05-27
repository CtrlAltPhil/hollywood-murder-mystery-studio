import { useState, useCallback, useRef } from 'react';
import { DialogueEntry, EvidenceEntry } from '@/types/game';
import { flagEvidenceMap, itemEvidenceMap, flagEvidenceMapExtended } from '@/data/evidenceMap';

export function useNotesState() {
  const [dialogueLog, setDialogueLog] = useState<DialogueEntry[]>([]);
  const [evidenceLog, setEvidenceLog] = useState<EvidenceEntry[]>([]);
  const [dialogueUnread, setDialogueUnread] = useState(false);
  const [evidenceUnread, setEvidenceUnread] = useState(false);
  const loggedEvidenceIds = useRef(new Set<string>());

  const hasUnread = dialogueUnread || evidenceUnread;

  const logDialogue = useCallback((speaker: string, text: string) => {
    setDialogueLog(prev => [...prev, { speaker, text, timestamp: Date.now() }]);
    setDialogueUnread(true);
  }, []);

  const logEvidence = useCallback((entry: EvidenceEntry) => {
    if (loggedEvidenceIds.current.has(entry.id)) return;
    loggedEvidenceIds.current.add(entry.id);
    setEvidenceLog(prev => [...prev, entry]);
    setEvidenceUnread(true);
  }, []);

  const checkFlagEvidence = useCallback((flag: string) => {
    const entry = flagEvidenceMap[flag] || flagEvidenceMapExtended[flag];
    if (entry) logEvidence(entry);
  }, [logEvidence]);

  const checkItemEvidence = useCallback((itemId: string) => {
    const entry = itemEvidenceMap[itemId];
    if (entry) logEvidence(entry);
  }, [logEvidence]);

  const clearUnread = useCallback(() => {
    // Kept for back-compat with code paths that close/open notes;
    // individual tab dots are cleared via clearDialogueUnread/clearEvidenceUnread.
  }, []);

  const clearDialogueUnread = useCallback(() => setDialogueUnread(false), []);
  const clearEvidenceUnread = useCallback(() => setEvidenceUnread(false), []);

  const resetNotes = useCallback(() => {
    setDialogueLog([]);
    setEvidenceLog([]);
    setDialogueUnread(false);
    setEvidenceUnread(false);
    loggedEvidenceIds.current.clear();
  }, []);

  const restoreNotes = useCallback((savedDialogue: DialogueEntry[], savedEvidence: EvidenceEntry[]) => {
    setDialogueLog(savedDialogue);
    setEvidenceLog(savedEvidence);
    loggedEvidenceIds.current = new Set(savedEvidence.map(e => e.id));
    setDialogueUnread(false);
    setEvidenceUnread(false);
  }, []);

  return {
    dialogueLog,
    evidenceLog,
    hasUnread,
    dialogueUnread,
    evidenceUnread,
    logDialogue,
    logEvidence,
    checkFlagEvidence,
    checkItemEvidence,
    clearUnread,
    clearDialogueUnread,
    clearEvidenceUnread,
    resetNotes,
    restoreNotes,
  };
}
