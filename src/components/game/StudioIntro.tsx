import { useRef, useState } from 'react';
import studioIntroVideo from '@/assets/Celestini_Game_Studios_Intro.mp4';

interface StudioIntroProps {
  onComplete: () => void;
}

export function StudioIntro({ onComplete }: StudioIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSkip, setShowSkip] = useState(false);

  return (
    <div
      className="w-full h-screen bg-black flex items-center justify-center cursor-pointer"
      onClick={onComplete}
      onMouseMove={() => setShowSkip(true)}
    >
      <video
        ref={videoRef}
        src={studioIntroVideo}
        autoPlay
        playsInline
        onEnded={onComplete}
        onError={onComplete}
        className="w-full h-full object-contain"
      />
      {showSkip && (
        <div className="absolute bottom-6 right-6 text-white/60 text-sm font-mono pointer-events-none">
          Click to skip
        </div>
      )}
    </div>
  );
}
