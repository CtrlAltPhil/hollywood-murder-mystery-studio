import { useEffect, useRef, useState } from 'react';
import studioIntroVideo from '@/assets/Celestini_Game_Studios_Intro.mp4';

interface StudioIntroProps {
  onComplete: () => void;
}

export function StudioIntro({ onComplete }: StudioIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSkip, setShowSkip] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try to start playback. Browsers (Safari, Fire OS) block autoplay
    // with sound — we start muted, then unmute once playing.
    video.muted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          // Successfully started muted; try to unmute. If the browser
          // re-blocks, we just stay muted rather than failing the intro.
          try {
            video.muted = false;
          } catch {
            // ignore
          }
        })
        .catch((err) => {
          console.warn('[StudioIntro] autoplay blocked:', err);
          setNeedsTap(true);
        });
    }
  }, []);

  const handleTapToPlay = () => {
    const video = videoRef.current;
    if (!video) {
      onComplete();
      return;
    }
    video.muted = false;
    video
      .play()
      .then(() => setNeedsTap(false))
      .catch(() => {
        // Fall back to muted playback
        video.muted = true;
        video.play().then(() => setNeedsTap(false)).catch(() => onComplete());
      });
  };

  return (
    <div
      className="w-full h-screen bg-black flex items-center justify-center cursor-pointer relative"
      onClick={needsTap ? handleTapToPlay : onComplete}
      onMouseMove={() => setShowSkip(true)}
    >
      <video
        ref={videoRef}
        src={studioIntroVideo}
        autoPlay
        playsInline
        muted
        preload="auto"
        onEnded={onComplete}
        onError={(e) => {
          console.error('[StudioIntro] video error:', e);
          setHasError(true);
        }}
        className="w-full h-full object-contain"
      />

      {needsTap && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-6 py-4 rounded-md bg-black/70 border border-white/20 text-white text-lg font-mono">
            Tap / click to play intro
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={onComplete}
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
