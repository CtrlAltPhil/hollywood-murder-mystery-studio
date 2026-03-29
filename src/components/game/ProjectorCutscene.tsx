import { useState, useEffect } from 'react';

interface ProjectorCutsceneProps {
  onComplete: () => void;
}

const FRAMES = [
  {
    text: "The recording shows the production room... hours before the party began.",
  },
  {
    text: "A figure enters through the side door, moving quickly. They look around to make sure they're alone.",
  },
  {
    text: "They open the electrical box on the wall and pull out a pair of wire cutters.",
  },
  {
    text: "With practiced precision, they sever the red conduit wire. Sparks fly briefly before dying out.",
  },
  {
    text: "They tape something to the inside of the box door — a small piece of paper — then close it and lock it.",
  },
  {
    text: "The figure turns toward the camera. For a split second, the light catches their face...",
  },
  {
    text: "It's too dark to identify them clearly, but they're wearing a distinctive ring — a large silver signet ring on their left hand.",
  },
  {
    text: "The recording ends with a burst of static.",
  },
];

export function ProjectorCutscene({ onComplete }: ProjectorCutsceneProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [flickerKey, setFlickerKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 300);
    return () => clearTimeout(t);
  }, [frameIndex]);

  useEffect(() => {
    const interval = setInterval(() => setFlickerKey(k => k + 1), 150);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setTextVisible(false);
    if (frameIndex < FRAMES.length - 1) {
      setTimeout(() => setFrameIndex(i => i + 1), 200);
    } else {
      onComplete();
    }
  };

  const flickerOpacity = flickerKey % 7 === 0 ? 0.15 : flickerKey % 11 === 0 ? 0.08 : 0;

  return (
    <div
      className="absolute inset-0 z-50 cursor-pointer select-none"
      onClick={handleClick}
    >
      {/* Dark base */}
      <div className="absolute inset-0 bg-black" />

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Flicker effect */}
      <div
        className="absolute inset-0 pointer-events-none bg-white transition-opacity duration-75"
        style={{ opacity: flickerOpacity }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Sepia-tinted content area */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div
          className={`max-w-xl text-center transition-opacity duration-500 ${textVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <p
            className="text-lg md:text-xl leading-relaxed font-serif italic"
            style={{ color: '#d4a574', textShadow: '0 0 20px rgba(212, 165, 116, 0.3)' }}
          >
            {FRAMES[frameIndex].text}
          </p>
        </div>
      </div>

      {/* Frame counter */}
      <div className="absolute bottom-4 right-6 font-mono text-xs" style={{ color: '#8b7355' }}>
        {frameIndex + 1} / {FRAMES.length}
      </div>

      {/* Click prompt */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs transition-opacity duration-1000 ${textVisible ? 'opacity-60' : 'opacity-0'}`}
        style={{ color: '#8b7355' }}
      >
        Click to continue
      </div>

      {/* Projector reel animation - top corners */}
      <div className="absolute top-3 left-4 w-4 h-4 border border-amber-900/40 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
      <div className="absolute top-3 right-4 w-4 h-4 border border-amber-900/40 rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
    </div>
  );
}
