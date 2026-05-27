import { useEffect, useState } from 'react';

/**
 * Shows a "rotate your device" overlay when the user is on a small viewport
 * in portrait orientation. The game's 4:3 frame and SCUMM UI need landscape
 * width to be playable on a phone.
 */
export const RotateDeviceOverlay = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isPortrait = h > w;
      const isSmall = Math.min(w, h) < 700;
      setShow(isPortrait && isSmall);
    };
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-6">
      <div className="max-w-sm w-full border-2 border-zinc-700 bg-zinc-900 p-6 text-center shadow-2xl">
        <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
          <svg
            viewBox="0 0 64 64"
            className="w-16 h-16 text-amber-400 animate-[spin_2.5s_ease-in-out_infinite]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect x="14" y="6" width="36" height="52" rx="4" />
            <circle cx="32" cy="52" r="2" fill="currentColor" />
            <path d="M8 32 Q 8 18 22 14" strokeLinecap="round" />
            <path d="M22 14 l -4 -2 M22 14 l -2 4" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="font-mono text-amber-400 text-lg tracking-wider mb-2 uppercase">
          Rotate Your Device
        </h2>
        <p className="font-mono text-zinc-300 text-sm leading-relaxed">
          Hollywood Mystery is best played in landscape mode. Please turn your phone sideways.
        </p>
      </div>
    </div>
  );
};
