import { useState, useCallback, useRef } from 'react';
import { DialogueEntry, EvidenceEntry } from '@/types/game';
import { flagEvidenceMap, itemEvidenceMap, flagEvidenceMapExtended } from '@/data/evidenceMap';

export function useNotesState() {
  const [dialogueLog, setDialogueLog] = useState<DialogueEntry[]>([]);
  const [evidenceLog, setEvidenceLog] = useState<EvidenceEntry[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const loggedEvidenceIds = useRef(new Set<string>());

  const logDialogue = useCallback((speaker: string, text: string) => {
    setDialogueLog(prev => [...prev, { speaker, text, timestamp: Date.now() }]);
    setHasUnread(true);
  }, []);

  const logEvidence = useCallback((entry: EvidenceEntry) => {
    if (loggedEvidenceIds.current.has(entry.id)) return;
    loggedEvidenceIds.current.add(entry.id);
    setEvidenceLog(prev => [...prev, entry]);
    setHasUnread(true);
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
    setHasUnread(false);
  }, []);

  const resetNotes = useCallback(() => {
    setDialogueLog([]);
    setEvidenceLog([]);
    setHasUnread(false);
    loggedEvidenceIds.current.clear();
  }, []);

  const restoreNotes = useCallback((savedDialogue: DialogueEntry[], savedEvidence: EvidenceEntry[]) => {
    setDialogueLog(savedDialogue);
    setEvidenceLog(savedEvidence);
    loggedEvidenceIds.current = new Set(savedEvidence.map(e => e.id));
    setHasUnread(false);
  }, []);

  return {
    dialogueLog,
    evidenceLog,
    hasUnread,
    logDialogue,
    logEvidence,
    checkFlagEvidence,
    checkItemEvidence,
    clearUnread,
    resetNotes,
    restoreNotes,
}
