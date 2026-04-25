import { useRef, useCallback, useEffect } from 'react';

type SfxType = 'pickup' | 'click' | 'door' | 'crash';

interface AudioEngine {
  playBackgroundTrack: (phase: string) => void;
  playRoomAmbience: (roomId: string) => void;
  playDialogBlip: (speaker: string) => void;
  playSfx: (type: SfxType) => void;
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
}

// Speaker pitch map (Hz)
const SPEAKER_PITCHES: Record<string, number> = {
  Carl: 140,
  'Lady Fantastica': 380,
  'Duke Extreme': 220,
  You: 260,
};

// --- MIDI-style note helpers ---
// Note frequencies (A4 = 440Hz)
const NOTE_FREQ: Record<string, number> = {
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'Bb2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.26, 'F5': 698.46, 'G5': 783.99,
};

interface NoteEvent {
  note: string;
  time: number;   // beat offset
  duration: number; // in beats
  type?: OscillatorType;
  volume?: number;
}

export function useAudioEngine(): AudioEngine {
  const ctxRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const sfxVolumeRef = useRef(0.5);
  const musicVolumeRef = useRef(0.3);
  const currentPhaseRef = useRef<string>('');
  const blipCountRef = useRef(0);
  const loopTimerRef = useRef<number | null>(null);
  const scheduledNodesRef = useRef<AudioScheduledSourceNode[]>([]);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
      musicGainRef.current = ctxRef.current.createGain();
      musicGainRef.current.gain.value = musicVolumeRef.current;
      musicGainRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  useEffect(() => {
    const resume = () => {
      if (ctxRef.current?.state === 'suspended') {
        ctxRef.current.resume();
      }
    };
    window.addEventListener('click', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
    return () => {
      window.removeEventListener('click', resume);
      window.removeEventListener('keydown', resume);
    };
  }, []);

  const stopMusic = useCallback(() => {
    if (loopTimerRef.current !== null) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    scheduledNodesRef.current.forEach(n => {
      try { n.stop(); } catch {}
    });
    scheduledNodesRef.current = [];
  }, []);

  // Schedule a sequence of notes and loop it
  const scheduleLoop = useCallback((
    ctx: AudioContext,
    gain: GainNode,
    tracks: { notes: NoteEvent[]; wave: OscillatorType; baseVol: number }[],
    bpm: number,
    loopBeats: number
  ) => {
    const beatDur = 60 / bpm;
    const loopDur = loopBeats * beatDur;

    const playOnce = (startTime: number) => {
      for (const track of tracks) {
        for (const ev of track.notes) {
          const freq = NOTE_FREQ[ev.note];
          if (!freq) continue;

          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const noteStart = startTime + ev.time * beatDur;
          const noteDur = ev.duration * beatDur;
          const vol = (ev.volume ?? 1) * track.baseVol;

          osc.type = ev.type || track.wave;
          osc.frequency.value = freq;

          // ADSR-like envelope for MIDI feel
          g.gain.setValueAtTime(0, noteStart);
          g.gain.linearRampToValueAtTime(vol, noteStart + 0.015);
          g.gain.setValueAtTime(vol, noteStart + noteDur * 0.7);
          g.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDur);

          osc.connect(g);
          g.connect(gain);
          osc.start(noteStart);
          osc.stop(noteStart + noteDur + 0.01);
          scheduledNodesRef.current.push(osc);
        }
      }
    };

    // Schedule first iteration immediately
    const now = ctx.currentTime + 0.05;
    playOnce(now);

    // Continuously schedule ahead to ensure seamless looping
    let nextTime = now + loopDur;
    const scheduleAhead = () => {
      if (currentPhaseRef.current === '') return;
      // Clean up old nodes
      scheduledNodesRef.current = scheduledNodesRef.current.slice(-200);
      // Keep at least 2 loops scheduled ahead of current time
      while (nextTime < ctx.currentTime + loopDur * 2) {
        playOnce(nextTime);
        nextTime += loopDur;
      }
      loopTimerRef.current = window.setTimeout(scheduleAhead, (loopDur * 0.5) * 1000);
    };
    // Start the scheduling loop — first callback schedules the second iteration
    loopTimerRef.current = window.setTimeout(scheduleAhead, (loopDur * 0.3) * 1000);
  }, []);

  const playBackgroundTrack = useCallback((phase: string) => {
    if (phase === currentPhaseRef.current) return;
    currentPhaseRef.current = phase;

    const ctx = getCtx();
    const gain = musicGainRef.current!;
    stopMusic();

    switch (phase) {
      case 'title': {
        // Noir mystery theme — minor key, slow, moody like Monkey Island title
        const bpm = 100;
        const melody: NoteEvent[] = [
          // Haunting minor melody
          { note: 'E4', time: 0,  duration: 1.5 },
          { note: 'D4', time: 1.5, duration: 0.5 },
          { note: 'C4', time: 2,  duration: 1 },
          { note: 'B3', time: 3,  duration: 0.5 },
          { note: 'A3', time: 3.5, duration: 1.5 },
          { note: 'G3', time: 5,  duration: 0.5 },
          { note: 'A3', time: 5.5, duration: 1 },
          { note: 'E3', time: 6.5, duration: 1.5 },
          // Second phrase
          { note: 'E4', time: 8,  duration: 1 },
          { note: 'F4', time: 9,  duration: 0.5 },
          { note: 'E4', time: 9.5, duration: 0.5 },
          { note: 'D4', time: 10, duration: 1 },
          { note: 'C4', time: 11, duration: 0.5 },
          { note: 'D4', time: 11.5, duration: 0.5 },
          { note: 'E4', time: 12, duration: 1 },
          { note: 'C4', time: 13, duration: 1.5 },
          { note: 'A3', time: 14.5, duration: 1.5 },
        ];
        const bass: NoteEvent[] = [
          { note: 'A2', time: 0,  duration: 2 },
          { note: 'A2', time: 2,  duration: 2 },
          { note: 'F2', time: 4,  duration: 2 },
          { note: 'E2', time: 6,  duration: 2 },
          { note: 'A2', time: 8,  duration: 2 },
          { note: 'D2', time: 10, duration: 2 },
          { note: 'E2', time: 12, duration: 2 },
          { note: 'A2', time: 14, duration: 2 },
        ];
        const arp: NoteEvent[] = [
          // Arpeggiated chords for texture
          { note: 'A3', time: 0, duration: 0.4 }, { note: 'C4', time: 0.5, duration: 0.4 }, { note: 'E4', time: 1, duration: 0.4 },
          { note: 'A3', time: 2, duration: 0.4 }, { note: 'C4', time: 2.5, duration: 0.4 }, { note: 'E4', time: 3, duration: 0.4 },
          { note: 'F3', time: 4, duration: 0.4 }, { note: 'A3', time: 4.5, duration: 0.4 }, { note: 'C4', time: 5, duration: 0.4 },
          { note: 'E3', time: 6, duration: 0.4 }, { note: 'G3', time: 6.5, duration: 0.4 }, { note: 'B3', time: 7, duration: 0.4 },
          { note: 'A3', time: 8, duration: 0.4 }, { note: 'C4', time: 8.5, duration: 0.4 }, { note: 'E4', time: 9, duration: 0.4 },
          { note: 'D3', time: 10, duration: 0.4 }, { note: 'F3', time: 10.5, duration: 0.4 }, { note: 'A3', time: 11, duration: 0.4 },
          { note: 'E3', time: 12, duration: 0.4 }, { note: 'G3', time: 12.5, duration: 0.4 }, { note: 'B3', time: 13, duration: 0.4 },
          { note: 'A3', time: 14, duration: 0.4 }, { note: 'C4', time: 14.5, duration: 0.4 }, { note: 'E4', time: 15, duration: 0.4 },
        ];
        scheduleLoop(ctx, gain, [
          { notes: melody, wave: 'triangle', baseVol: 0.18 },
          { notes: bass,   wave: 'square',   baseVol: 0.10 },
          { notes: arp,    wave: 'sine',     baseVol: 0.06 },
        ], bpm, 16);
        break;
      }
      case 'intro':
      case 'party': {
        // Upbeat jazzy party — major key, faster
        const bpm = 140;
        const melody: NoteEvent[] = [
          { note: 'C4', time: 0, duration: 0.5 }, { note: 'E4', time: 0.5, duration: 0.5 },
          { note: 'G4', time: 1, duration: 0.5 }, { note: 'A4', time: 1.5, duration: 0.5 },
          { note: 'G4', time: 2, duration: 1 },   { note: 'E4', time: 3, duration: 0.5 },
          { note: 'F4', time: 3.5, duration: 0.5 },{ note: 'E4', time: 4, duration: 0.5 },
          { note: 'D4', time: 4.5, duration: 0.5 },{ note: 'C4', time: 5, duration: 1 },
          { note: 'D4', time: 6, duration: 0.5 }, { note: 'E4', time: 6.5, duration: 0.5 },
          { note: 'C4', time: 7, duration: 1 },
          { note: 'E4', time: 8, duration: 0.5 }, { note: 'G4', time: 8.5, duration: 0.5 },
          { note: 'A4', time: 9, duration: 0.5 }, { note: 'B4', time: 9.5, duration: 0.5 },
          { note: 'C5', time: 10, duration: 1 },  { note: 'A4', time: 11, duration: 0.5 },
          { note: 'G4', time: 11.5, duration: 0.5 },{ note: 'F4', time: 12, duration: 0.5 },
          { note: 'E4', time: 12.5, duration: 0.5 },{ note: 'D4', time: 13, duration: 1 },
          { note: 'C4', time: 14, duration: 2 },
        ];
        const bass: NoteEvent[] = [
          { note: 'C2', time: 0, duration: 1 }, { note: 'C2', time: 1, duration: 1 },
          { note: 'F2', time: 2, duration: 1 }, { note: 'F2', time: 3, duration: 1 },
          { note: 'G2', time: 4, duration: 1 }, { note: 'G2', time: 5, duration: 1 },
          { note: 'C2', time: 6, duration: 1 }, { note: 'G2', time: 7, duration: 1 },
          { note: 'C2', time: 8, duration: 1 }, { note: 'C2', time: 9, duration: 1 },
          { note: 'F2', time: 10, duration: 1 },{ note: 'F2', time: 11, duration: 1 },
          { note: 'G2', time: 12, duration: 1 },{ note: 'G2', time: 13, duration: 1 },
          { note: 'C2', time: 14, duration: 2 },
        ];
        scheduleLoop(ctx, gain, [
          { notes: melody, wave: 'square',   baseVol: 0.10 },
          { notes: bass,   wave: 'triangle', baseVol: 0.12 },
        ], bpm, 16);
        break;
      }
      case 'blackout': {
        // Tension — sparse low stabs
        const bpm = 60;
        const notes: NoteEvent[] = [
          { note: 'C2', time: 0, duration: 2 },
          { note: 'Eb3', time: 3, duration: 1 },
          { note: 'C2', time: 5, duration: 2 },
          { note: 'Bb2', time: 8, duration: 1 },
          { note: 'Ab3', time: 10, duration: 1.5 },
          { note: 'G2', time: 12, duration: 2 },
        ];
        scheduleLoop(ctx, gain, [
          { notes, wave: 'sine', baseVol: 0.15 },
        ], bpm, 16);
        break;
      }
      case 'murder-reveal': {
        // Dramatic sting then suspenseful loop
        const bpm = 80;
        const sting: NoteEvent[] = [
          { note: 'E4', time: 0, duration: 0.3, volume: 1.5 },
          { note: 'Eb4', time: 0.3, duration: 0.3, volume: 1.3 },
          { note: 'D4', time: 0.6, duration: 0.3, volume: 1.1 },
          { note: 'C4', time: 0.9, duration: 0.5, volume: 1 },
          { note: 'B3', time: 1.4, duration: 0.5, volume: 0.9 },
          { note: 'A3', time: 1.9, duration: 1.5, volume: 0.8 },
          // Then low suspense
          { note: 'A2', time: 4, duration: 2 },
          { note: 'E3', time: 6, duration: 1 },
          { note: 'A2', time: 7, duration: 1 },
          { note: 'C3', time: 8, duration: 2 },
          { note: 'B2', time: 10, duration: 1 },
          { note: 'A2', time: 11, duration: 1 },
          { note: 'E2', time: 12, duration: 2 },
          { note: 'A2', time: 14, duration: 2 },
        ];
        scheduleLoop(ctx, gain, [
          { notes: sting, wave: 'sawtooth', baseVol: 0.14 },
        ], bpm, 16);
        break;
      }
      case 'gameplay': {
        // Moody investigation — noir jazz, minor key, like SCUMM investigation music
        const bpm = 90;
        const melody: NoteEvent[] = [
          { note: 'A3', time: 0, duration: 1.5 },
          { note: 'C4', time: 1.5, duration: 0.5 },
          { note: 'E4', time: 2, duration: 1 },
          { note: 'D4', time: 3, duration: 0.5 },
          { note: 'C4', time: 3.5, duration: 0.5 },
          { note: 'A3', time: 4, duration: 1.5 },
          { note: 'G3', time: 5.5, duration: 0.5 },
          { note: 'A3', time: 6, duration: 2 },
          // Second phrase - rises then falls
          { note: 'C4', time: 8, duration: 1 },
          { note: 'D4', time: 9, duration: 0.5 },
          { note: 'E4', time: 9.5, duration: 1 },
          { note: 'F4', time: 10.5, duration: 0.5 },
          { note: 'E4', time: 11, duration: 0.5 },
          { note: 'D4', time: 11.5, duration: 0.5 },
          { note: 'C4', time: 12, duration: 1 },
          { note: 'A3', time: 13, duration: 1.5 },
          { note: 'E3', time: 14.5, duration: 1.5 },
        ];
        const bass: NoteEvent[] = [
          { note: 'A2', time: 0, duration: 1 }, { note: 'A2', time: 1, duration: 1 },
          { note: 'A2', time: 2, duration: 1 }, { note: 'E2', time: 3, duration: 1 },
          { note: 'F2', time: 4, duration: 1 }, { note: 'F2', time: 5, duration: 1 },
          { note: 'E2', time: 6, duration: 1 }, { note: 'A2', time: 7, duration: 1 },
          { note: 'A2', time: 8, duration: 1 }, { note: 'A2', time: 9, duration: 1 },
          { note: 'D2', time: 10, duration: 1 },{ note: 'D2', time: 11, duration: 1 },
          { note: 'E2', time: 12, duration: 1 },{ note: 'E2', time: 13, duration: 1 },
          { note: 'A2', time: 14, duration: 1 },{ note: 'A2', time: 15, duration: 1 },
        ];
        const arp: NoteEvent[] = [
          // Quiet background arpeggios for atmosphere
          { note: 'E3', time: 0.5, duration: 0.3 }, { note: 'A3', time: 1, duration: 0.3 },
          { note: 'E3', time: 2.5, duration: 0.3 }, { note: 'A3', time: 3, duration: 0.3 },
          { note: 'F3', time: 4.5, duration: 0.3 }, { note: 'A3', time: 5, duration: 0.3 },
          { note: 'E3', time: 6.5, duration: 0.3 }, { note: 'G3', time: 7, duration: 0.3 },
          { note: 'E3', time: 8.5, duration: 0.3 }, { note: 'A3', time: 9, duration: 0.3 },
          { note: 'F3', time: 10.5, duration: 0.3 },{ note: 'A3', time: 11, duration: 0.3 },
          { note: 'E3', time: 12.5, duration: 0.3 },{ note: 'G3', time: 13, duration: 0.3 },
          { note: 'E3', time: 14.5, duration: 0.3 },{ note: 'A3', time: 15, duration: 0.3 },
        ];
        scheduleLoop(ctx, gain, [
          { notes: melody, wave: 'triangle', baseVol: 0.14 },
          { notes: bass,   wave: 'square',   baseVol: 0.08 },
          { notes: arp,    wave: 'sine',      baseVol: 0.05 },
        ], bpm, 16);
        break;
      }
    }
  }, [getCtx, stopMusic, scheduleLoop]);

  // Room-specific ambient music — replaces the gameplay track when entering a specific room
  const currentRoomRef = useRef<string>('');
  const playRoomAmbience = useCallback((roomId: string) => {
    if (roomId === currentRoomRef.current) return;
    currentRoomRef.current = roomId;

    const ctx = getCtx();
    const gain = musicGainRef.current!;
    stopMusic();
    currentPhaseRef.current = 'room-ambience';

    switch (roomId) {
      case 'breakroom': {
        // Crime scene — tense, sparse minor key investigation
        const bpm = 90;
        const melody: NoteEvent[] = [
          { note: 'A3', time: 0, duration: 1.5 },
          { note: 'C4', time: 1.5, duration: 0.5 },
          { note: 'E4', time: 2, duration: 1 },
          { note: 'D4', time: 3, duration: 0.5 },
          { note: 'C4', time: 3.5, duration: 0.5 },
          { note: 'A3', time: 4, duration: 1.5 },
          { note: 'G3', time: 5.5, duration: 0.5 },
          { note: 'A3', time: 6, duration: 2 },
          { note: 'C4', time: 8, duration: 1 },
          { note: 'D4', time: 9, duration: 0.5 },
          { note: 'E4', time: 9.5, duration: 1 },
          { note: 'F4', time: 10.5, duration: 0.5 },
          { note: 'E4', time: 11, duration: 0.5 },
          { note: 'D4', time: 11.5, duration: 0.5 },
          { note: 'C4', time: 12, duration: 1 },
          { note: 'A3', time: 13, duration: 1.5 },
          { note: 'E3', time: 14.5, duration: 1.5 },
        ];
        const bass: NoteEvent[] = [
          { note: 'A2', time: 0, duration: 2 }, { note: 'E2', time: 2, duration: 2 },
          { note: 'F2', time: 4, duration: 2 }, { note: 'E2', time: 6, duration: 2 },
          { note: 'A2', time: 8, duration: 2 }, { note: 'D2', time: 10, duration: 2 },
          { note: 'E2', time: 12, duration: 2 }, { note: 'A2', time: 14, duration: 2 },
        ];
        scheduleLoop(ctx, gain, [
          { notes: melody, wave: 'triangle', baseVol: 0.14 },
          { notes: bass,   wave: 'square',   baseVol: 0.08 },
        ], bpm, 16);
        break;
      }
      case 'hallway':
      case 'hallway-kitchen': {
        // Echoing footsteps vibe — minimal, atmospheric
        const bpm = 70;
        const ambience: NoteEvent[] = [
          { note: 'E3', time: 0, duration: 3 },
          { note: 'A3', time: 4, duration: 2 },
          { note: 'E3', time: 7, duration: 2 },
          { note: 'G3', time: 10, duration: 2 },
          { note: 'A3', time: 13, duration: 3 },
        ];
        const drone: NoteEvent[] = [
          { note: 'A2', time: 0, duration: 4 },
          { note: 'A2', time: 4, duration: 4 },
          { note: 'E2', time: 8, duration: 4 },
          { note: 'A2', time: 12, duration: 4 },
        ];
        scheduleLoop(ctx, gain, [
          { notes: ambience, wave: 'sine',     baseVol: 0.08 },
          { notes: drone,    wave: 'triangle', baseVol: 0.06 },
        ], bpm, 16);
        break;
      }
      case 'kitchen': {
        // Uneasy kitchen — metallic, clinical feel
        const bpm = 85;
        const melody: NoteEvent[] = [
          { note: 'C4', time: 0, duration: 0.5 }, { note: 'Eb4', time: 1, duration: 0.5 },
          { note: 'F4', time: 2, duration: 1 },   { note: 'Eb4', time: 3.5, duration: 0.5 },
          { note: 'C4', time: 4, duration: 1.5 },  { note: 'Bb3', time: 6, duration: 1 },
          { note: 'C4', time: 8, duration: 0.5 },  { note: 'Eb4', time: 9, duration: 0.5 },
          { note: 'G4', time: 10, duration: 1 },   { note: 'F4', time: 11.5, duration: 0.5 },
          { note: 'Eb4', time: 12, duration: 1.5 },{ note: 'C4', time: 14, duration: 2 },
        ];
        const percussion: NoteEvent[] = [
          // Ticking, dripping feel
          { note: 'C5', time: 0, duration: 0.1 },  { note: 'C5', time: 2, duration: 0.1 },
          { note: 'C5', time: 4, duration: 0.1 },  { note: 'C5', time: 6, duration: 0.1 },
          { note: 'C5', time: 8, duration: 0.1 },  { note: 'C5', time: 10, duration: 0.1 },
          { note: 'C5', time: 12, duration: 0.1 }, { note: 'C5', time: 14, duration: 0.1 },
        ];
        scheduleLoop(ctx, gain, [
          { notes: melody,     wave: 'triangle', baseVol: 0.10 },
          { notes: percussion, wave: 'sine',     baseVol: 0.03 },
        ], bpm, 16);
        break;
      }
      case 'production-room': {
        // Industrial hum — low drones and mechanical feel
        const bpm = 75;
        const drone: NoteEvent[] = [
          { note: 'D2', time: 0, duration: 4 },
          { note: 'E2', time: 4, duration: 4 },
          { note: 'D2', time: 8, duration: 4 },
          { note: 'C2', time: 12, duration: 4 },
        ];
        const hum: NoteEvent[] = [
          { note: 'D3', time: 0, duration: 2 },  { note: 'F3', time: 3, duration: 1.5 },
          { note: 'E3', time: 5, duration: 2 },   { note: 'D3', time: 8, duration: 2 },
          { note: 'F3', time: 11, duration: 1.5 },{ note: 'E3', time: 13, duration: 2 },
        ];
        const clicks: NoteEvent[] = [
          { note: 'G5', time: 1, duration: 0.05 }, { note: 'G5', time: 5, duration: 0.05 },
          { note: 'G5', time: 9, duration: 0.05 }, { note: 'G5', time: 13, duration: 0.05 },
        ];
        scheduleLoop(ctx, gain, [
          { notes: drone,  wave: 'sine',     baseVol: 0.10 },
          { notes: hum,    wave: 'triangle', baseVol: 0.07 },
          { notes: clicks, wave: 'square',   baseVol: 0.02 },
        ], bpm, 16);
        break;
      }
      case 'lady-fantastique-room': {
        // Dramatic, theatrical — waltz-like, elegant but unsettling
        const bpm = 95;
        const melody: NoteEvent[] = [
          { note: 'E4', time: 0, duration: 1 },   { note: 'G4', time: 1, duration: 0.5 },
          { note: 'A4', time: 1.5, duration: 1 },  { note: 'G4', time: 2.5, duration: 0.5 },
          { note: 'F4', time: 3, duration: 1 },    { note: 'E4', time: 4, duration: 0.5 },
          { note: 'D4', time: 4.5, duration: 0.5 },{ note: 'E4', time: 5, duration: 1.5 },
          { note: 'Ab4', time: 7, duration: 1 },
          { note: 'G4', time: 8, duration: 1 },    { note: 'F4', time: 9, duration: 0.5 },
          { note: 'E4', time: 9.5, duration: 1 },  { note: 'D4', time: 10.5, duration: 0.5 },
          { note: 'C4', time: 11, duration: 1 },   { note: 'B3', time: 12, duration: 0.5 },
          { note: 'A3', time: 12.5, duration: 1.5 },{ note: 'E4', time: 14, duration: 2 },
        ];
        const waltzBass: NoteEvent[] = [
          { note: 'A2', time: 0, duration: 1 }, { note: 'E3', time: 1, duration: 0.5 }, { note: 'E3', time: 1.5, duration: 0.5 },
          { note: 'A2', time: 2, duration: 1 }, { note: 'E3', time: 3, duration: 0.5 }, { note: 'E3', time: 3.5, duration: 0.5 },
          { note: 'F2', time: 4, duration: 1 }, { note: 'C3', time: 5, duration: 0.5 }, { note: 'C3', time: 5.5, duration: 0.5 },
          { note: 'E2', time: 6, duration: 1 }, { note: 'B2', time: 7, duration: 0.5 }, { note: 'B2', time: 7.5, duration: 0.5 },
          { note: 'A2', time: 8, duration: 1 }, { note: 'E3', time: 9, duration: 0.5 }, { note: 'E3', time: 9.5, duration: 0.5 },
          { note: 'D2', time: 10, duration: 1 },{ note: 'A2', time: 11, duration: 0.5 },{ note: 'A2', time: 11.5, duration: 0.5 },
          { note: 'E2', time: 12, duration: 1 },{ note: 'B2', time: 13, duration: 0.5 },{ note: 'B2', time: 13.5, duration: 0.5 },
          { note: 'A2', time: 14, duration: 1 },{ note: 'E3', time: 15, duration: 0.5 },
        ];
        scheduleLoop(ctx, gain, [
          { notes: melody,    wave: 'triangle', baseVol: 0.12 },
          { notes: waltzBass, wave: 'sine',     baseVol: 0.08 },
        ], bpm, 16);
        break;
      }
      case 'los-cabos-room': {
        // Melancholic, sorrowful — slow minor melody for the victim's room
        const bpm = 65;
        const melody: NoteEvent[] = [
          { note: 'E4', time: 0, duration: 2 },
          { note: 'D4', time: 2, duration: 1 },
          { note: 'C4', time: 3, duration: 2 },
          { note: 'B3', time: 5, duration: 1 },
          { note: 'A3', time: 6, duration: 2.5 },
          { note: 'E4', time: 9, duration: 1.5 },
          { note: 'F4', time: 10.5, duration: 1 },
          { note: 'E4', time: 11.5, duration: 1 },
          { note: 'D4', time: 12.5, duration: 1 },
          { note: 'C4', time: 13.5, duration: 2.5 },
        ];
        const bass: NoteEvent[] = [
          { note: 'A2', time: 0, duration: 3 },
          { note: 'E2', time: 3, duration: 3 },
          { note: 'F2', time: 6, duration: 3 },
          { note: 'A2', time: 9, duration: 3 },
          { note: 'D2', time: 12, duration: 4 },
        ];
        scheduleLoop(ctx, gain, [
          { notes: melody, wave: 'sine',     baseVol: 0.12 },
          { notes: bass,   wave: 'triangle', baseVol: 0.07 },
        ], bpm, 16);
        break;
      }
      case 'study': {
        // Cerebral, investigative — steady ticking clock, thoughtful phrases
        const bpm = 80;
        const melody: NoteEvent[] = [
          { note: 'D4', time: 0, duration: 1.5 },
          { note: 'F4', time: 2, duration: 1 },
          { note: 'E4', time: 3, duration: 0.5 },
          { note: 'D4', time: 3.5, duration: 0.5 },
          { note: 'C4', time: 4, duration: 2 },
          { note: 'E4', time: 7, duration: 1 },
          { note: 'D4', time: 8, duration: 1.5 },
          { note: 'F4', time: 10, duration: 1 },
          { note: 'G4', time: 11, duration: 0.5 },
          { note: 'F4', time: 11.5, duration: 0.5 },
          { note: 'E4', time: 12, duration: 1.5 },
          { note: 'D4', time: 14, duration: 2 },
        ];
        const clock: NoteEvent[] = [
          // Steady ticking
          { note: 'B4', time: 0, duration: 0.08 }, { note: 'B4', time: 1, duration: 0.08 },
          { note: 'B4', time: 2, duration: 0.08 }, { note: 'B4', time: 3, duration: 0.08 },
          { note: 'B4', time: 4, duration: 0.08 }, { note: 'B4', time: 5, duration: 0.08 },
          { note: 'B4', time: 6, duration: 0.08 }, { note: 'B4', time: 7, duration: 0.08 },
          { note: 'B4', time: 8, duration: 0.08 }, { note: 'B4', time: 9, duration: 0.08 },
          { note: 'B4', time: 10, duration: 0.08 },{ note: 'B4', time: 11, duration: 0.08 },
          { note: 'B4', time: 12, duration: 0.08 },{ note: 'B4', time: 13, duration: 0.08 },
          { note: 'B4', time: 14, duration: 0.08 },{ note: 'B4', time: 15, duration: 0.08 },
        ];
        const bass: NoteEvent[] = [
          { note: 'D2', time: 0, duration: 4 },
          { note: 'C2', time: 4, duration: 4 },
          { note: 'D2', time: 8, duration: 4 },
          { note: 'E2', time: 12, duration: 4 },
        ];
        scheduleLoop(ctx, gain, [
          { notes: melody, wave: 'triangle', baseVol: 0.11 },
          { notes: clock,  wave: 'sine',     baseVol: 0.03 },
          { notes: bass,   wave: 'sine',     baseVol: 0.07 },
        ], bpm, 16);
        break;
      }
      case 'backyard': {
        // Outdoor night — crickets, gentle breeze, mysterious
        const bpm = 60;
        const melody: NoteEvent[] = [
          { note: 'E4', time: 0, duration: 2 },
          { note: 'G4', time: 2.5, duration: 1.5 },
          { note: 'A4', time: 4.5, duration: 1 },
          { note: 'G4', time: 6, duration: 2 },
          { note: 'E4', time: 9, duration: 1.5 },
          { note: 'D4', time: 11, duration: 1 },
          { note: 'C4', time: 12, duration: 2 },
          { note: 'E4', time: 14.5, duration: 1.5 },
        ];
        const crickets: NoteEvent[] = [
          { note: 'E5', time: 0.5, duration: 0.05 }, { note: 'E5', time: 0.6, duration: 0.05 },
          { note: 'E5', time: 2.5, duration: 0.05 }, { note: 'E5', time: 2.6, duration: 0.05 },
          { note: 'E5', time: 5, duration: 0.05 },   { note: 'E5', time: 5.1, duration: 0.05 },
          { note: 'E5', time: 7.5, duration: 0.05 }, { note: 'E5', time: 7.6, duration: 0.05 },
          { note: 'E5', time: 10, duration: 0.05 },  { note: 'E5', time: 10.1, duration: 0.05 },
          { note: 'E5', time: 12.5, duration: 0.05 },{ note: 'E5', time: 12.6, duration: 0.05 },
        ];
        const bass: NoteEvent[] = [
          { note: 'A2', time: 0, duration: 4 },
          { note: 'E2', time: 4, duration: 4 },
          { note: 'C2', time: 8, duration: 4 },
          { note: 'A2', time: 12, duration: 4 },
        ];
        scheduleLoop(ctx, gain, [
          { notes: melody,    wave: 'sine',     baseVol: 0.09 },
          { notes: crickets,  wave: 'square',   baseVol: 0.02 },
          { notes: bass,      wave: 'triangle', baseVol: 0.06 },
        ], bpm, 16);
        break;
      }
      default: {
        // Fallback: play the standard gameplay track
        currentPhaseRef.current = 'gameplay';
        playBackgroundTrack('gameplay');
        return;
      }
    }
  }, [getCtx, stopMusic, scheduleLoop, playBackgroundTrack]);

  const playDialogBlip = useCallback((speaker: string) => {
    const ctx = getCtx();
    const pitch = SPEAKER_PITCHES[speaker] || 200;
    blipCountRef.current++;
    const variation = (blipCountRef.current % 3 === 0) ? 20 : (blipCountRef.current % 3 === 1) ? -10 : 0;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = pitch + variation;
    g.gain.value = sfxVolumeRef.current * 0.15;
    g.gain.setValueAtTime(sfxVolumeRef.current * 0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }, [getCtx]);

  const playSfx = useCallback((type: SfxType) => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    g.gain.value = sfxVolumeRef.current * 0.3;
    osc.connect(g);
    g.connect(ctx.destination);

    switch (type) {
      case 'pickup': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        g.gain.setValueAtTime(sfxVolumeRef.current * 0.3, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        break;
      }
      case 'click': {
        osc.type = 'square';
        osc.frequency.value = 800;
        g.gain.setValueAtTime(sfxVolumeRef.current * 0.2, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
        break;
      }
      case 'door': {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
        g.gain.setValueAtTime(sfxVolumeRef.current * 0.4, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        break;
      }
      case 'crash': {
        // Dramatic crash — layered noise burst + low thud
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.8);
        g.gain.setValueAtTime(sfxVolumeRef.current * 0.6, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);

        // High-frequency shatter layer
        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(800, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
        g2.gain.setValueAtTime(sfxVolumeRef.current * 0.3, ctx.currentTime);
        g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc2.connect(g2);
        g2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.4);
        break;
      }
    }
  }, [getCtx]);

  const setMusicVolume = useCallback((v: number) => {
    musicVolumeRef.current = v;
    if (musicGainRef.current) {
      musicGainRef.current.gain.value = v;
    }
  }, []);

  const setSfxVolume = useCallback((v: number) => {
    sfxVolumeRef.current = v;
  }, []);

  useEffect(() => {
    return () => {
      stopMusic();
      ctxRef.current?.close();
    };
  }, [stopMusic]);

  return {
    playBackgroundTrack,
    playRoomAmbience,
    playDialogBlip,
    playSfx,
    setMusicVolume,
    setSfxVolume,
  };
}
