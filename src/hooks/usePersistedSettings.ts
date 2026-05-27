import { useEffect, useState } from 'react';

const KEY = 'hmm_settings_v1';

interface Settings {
  musicVolume: number;
  sfxVolume: number;
  brightness: number;
}

const DEFAULTS: Settings = {
  musicVolume: 0.3,
  sfxVolume: 0.5,
  brightness: 1,
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return {
      musicVolume: clamp(parsed.musicVolume ?? DEFAULTS.musicVolume, 0, 1),
      sfxVolume: clamp(parsed.sfxVolume ?? DEFAULTS.sfxVolume, 0, 1),
      brightness: clamp(parsed.brightness ?? DEFAULTS.brightness, 0.3, 1.5),
    };
  } catch {
    return DEFAULTS;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function usePersistedSettings() {
  const [settings, setSettings] = useState<Settings>(() => load());

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* quota or disabled storage — ignore */
    }
  }, [settings]);

  return {
    musicVolume: settings.musicVolume,
    sfxVolume: settings.sfxVolume,
    brightness: settings.brightness,
    setMusicVolume: (v: number) => setSettings((s) => ({ ...s, musicVolume: v })),
    setSfxVolume: (v: number) => setSettings((s) => ({ ...s, sfxVolume: v })),
    setBrightness: (v: number) => setSettings((s) => ({ ...s, brightness: v })),
  };
}
