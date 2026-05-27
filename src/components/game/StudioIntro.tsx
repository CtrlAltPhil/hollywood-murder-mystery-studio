import { useEffect, useRef, useState } from 'react';
import studioIntroVideo from '@/assets/Celestini_Game_Studios_Intro.mp4';

interface StudioIntroProps {
  onComplete: () => void;
}

const SKIP_PREF_KEY = 'hmm_studio_intro_skip';
const WATCHDOG_MS = 5000;

export function StudioIntro({ onComplete }: StudioIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);
  const [showSkip, setShowSkip] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Honor a remembered "skip intro" preference. Set whenever the intro
  // previously failed or the user explicitly chose to skip it.
  useEffect(() => {
    if (localStorage.getItem(SKIP_PREF_KEY) === '1') {
      completedRef.current = true;
      onComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const safeComplete = (reason: 'ended' | 'skip' | 'error' | 'watchdog') => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (reason === 'error' || reason === 'watchdog') {
      // Don't punish future launches on this machine again.
      try { localStorage.setItem(SKIP_PREF_KEY, '1'); } catch { /* ignore */ }
    }
    onComplete();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Watchdog: if the video hasn't actually started playing within
    // WATCHDOG_MS (codec missing, autoplay stalled, slow disk on a
    // packaged Electron build), bail out gracefully instead of leaving
    // the user on a black screen.
    const watchdog = window.setTimeout(() => {
      if (!completedRef.current && video.readyState < 3) {
        console.warn('[StudioIntro] watchdog tripped — skipping intro');
        safeComplete('watchdog');
      }
    }, WATCHDOG_MS);

    // Try to start playback. Browsers (Safari, Fire OS) block autoplay
    // with sound — start muted, unmute once playing succeeds.
    video.muted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          try { video.muted = false; } catch { /* ignore */ }
        })
        .catch((err) => {
          console.warn('[StudioIntro] autoplay blocked:', err);
          setNeedsTap(true);
        });
    }

    return () => window.clearTimeout(watchdog);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTapToPlay = () => {
    const video = videoRef.current;
    if (!video) {
      safeComplete('skip');
      return;
    }
    video.muted = false;
    video
      .play()
      .then(() => setNeedsTap(false))
      .catch(() => {
        video.muted = true;
        video.play().then(() => setNeedsTap(false)).catch(() => safeComplete('error'));
      });
  };

  return (
    <div
      className="w-full h-screen bg-black flex items-center justify-center cursor-pointer relative"
      onClick={needsTap ? handleTapToPlay : () => safeComplete('skip')}
      onMouseMove={() => setShowSkip(true)}
    >
      <video
        ref={videoRef}
        src={studioIntroVideo}
        autoPlay
        playsInline
        muted
        preload="auto"
        onEnded={() => safeComplete('ended')}
        onError={(e) => {
          console.error('[StudioIntro] video error:', e);
          setHasError(true);
        }}
        onStalled={() => console.warn('[StudioIntro] stalled')}
        onSuspend={() => console.warn('[StudioIntro] suspend')}
        className="w-full h-full object-contain"
      />

      {needsTap && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); handleTapToPlay(); }}
            className="px-8 py-5 rounded-md bg-yellow-500/90 hover:bg-yellow-400 text-black text-xl font-bold tracking-widest uppercase shadow-2xl border-2 border-yellow-300 transition-transform hover:scale-105"
          >
            ▶ Click to Play Intro
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); safeComplete('skip'); }}
            className="text-white/70 hover:text-white text-sm font-mono underline-offset-4 hover:underline"
          >
            Skip intro
          </button>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <p className="text-white/70 text-sm font-mono">Couldn't play the studio intro on this device.</p>
          <button
            onClick={() => safeComplete('error')}
            className="px-6 py-3 rounded-md bg-white/10 border border-white/30 text-white font-mono hover:bg-white/20"
          >
            Continue
          </button>
        </div>
      )}

      {showSkip && !needsTap && !hasError && (
        <div className="absolute bottom-6 right-6 text-white/60 text-sm font-mono pointer-events-none">
          Click to skip
        </div>
      )}
    </div>
  );
}
