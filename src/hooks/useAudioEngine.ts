import { useRef, useCallback, useEffect } from 'react';

type SfxType = 'pickup' | 'click' | 'door';

interface AudioEngine {
  playBackgroundTrack: (phase: string) => void;
  playDialogBlip: (speaker: string) => void;
  playSfx: (type: SfxType) => void;
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
}

// Speaker pitch map (Hz)
const SPEAKER_PITCHES: Record<string, number> = {
  Carl: 140,
  Lady: 380,
  'El Fuego': 220,
  You: 260,
};

export function useAudioEngine(): AudioEngine {
  const ctxRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const sfxVolumeRef = useRef(0.5);
  const musicVolumeRef = useRef(0.3);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const currentPhaseRef = useRef<string>('');
  const blipCountRef = useRef(0);

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

  // Ensure audio context resumes on user interaction
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
    activeOscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    activeOscillatorsRef.current = [];
  }, []);

  const playBackgroundTrack = useCallback((phase: string) => {
    if (phase === currentPhaseRef.current) return;
    currentPhaseRef.current = phase;

    const ctx = getCtx();
    const gain = musicGainRef.current!;
    stopMusic();

    // Helper to create a looping drone
    const createDrone = (freq: number, type: OscillatorType, vol: number, detune = 0) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detune;
      g.gain.value = vol;
      osc.connect(g);
      g.connect(gain);
      osc.start();
      activeOscillatorsRef.current.push(osc);
      return osc;
    };

    switch (phase) {
      case 'title': {
        // Mysterious pad — low chord with slow LFO
        createDrone(65, 'sine', 0.4);
        createDrone(82, 'sine', 0.25, 5);
        createDrone(98, 'triangle', 0.15, -3);
        // LFO tremolo on gain
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.3;
        lfoGain.gain.value = 0.1;
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
        activeOscillatorsRef.current.push(lfo);
        break;
      }
      case 'intro':
      case 'party': {
        // Upbeat-ish: simple bass + higher tone
        createDrone(110, 'square', 0.12);
        createDrone(220, 'sawtooth', 0.06);
        createDrone(330, 'sine', 0.04);
        break;
      }
      case 'blackout': {
        // Near silence — just a low rumble
        createDrone(40, 'sine', 0.15);
        break;
      }
      case 'murder-reveal': {
        // Dramatic sting then drone
        const sting = ctx.createOscillator();
        const stingGain = ctx.createGain();
        sting.type = 'sawtooth';
        sting.frequency.value = 200;
        stingGain.gain.value = 0.5;
        sting.connect(stingGain);
        stingGain.connect(gain);
        stingGain.gain.setValueAtTime(0.5, ctx.currentTime);
        stingGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
        sting.frequency.setValueAtTime(200, ctx.currentTime);
        sting.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 2);
        sting.start();
        sting.stop(ctx.currentTime + 2.5);
        // Then moody drone
        setTimeout(() => {
          if (currentPhaseRef.current === 'murder-reveal') {
            createDrone(55, 'sine', 0.3);
            createDrone(82.5, 'triangle', 0.1, 7);
          }
        }, 2500);
        break;
      }
      case 'gameplay': {
        // Moody investigation drone
        createDrone(55, 'sine', 0.3);
        createDrone(82, 'triangle', 0.12, 4);
        createDrone(110, 'sine', 0.06, -2);
        // Slow wobble
        const lfo = ctx.createOscillator();
        const lfoG = ctx.createGain();
        lfo.frequency.value = 0.15;
        lfoG.gain.value = 0.06;
        lfo.connect(lfoG);
        lfoG.connect(gain.gain);
        lfo.start();
        activeOscillatorsRef.current.push(lfo);
        break;
      }
    }
  }, [getCtx, stopMusic]);

  const playDialogBlip = useCallback((speaker: string) => {
    const ctx = getCtx();
    const pitch = SPEAKER_PITCHES[speaker] || 200;
    blipCountRef.current++;

    // Vary pitch slightly per character for natural feel
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMusic();
      ctxRef.current?.close();
    };
  }, [stopMusic]);

  return {
    playBackgroundTrack,
    playDialogBlip,
    playSfx,
    setMusicVolume,
    setSfxVolume,
  };
}
