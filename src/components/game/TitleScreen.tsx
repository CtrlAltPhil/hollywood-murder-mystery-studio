import { useState, useEffect } from 'react';
import gbStudiosBackground from '@/assets/backgrounds/gb-studios.jpg';

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [showLightning, setShowLightning] = useState(false);
  const [carPosition, setCarPosition] = useState(-250);

  // Lightning effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let flickerTimeouts: NodeJS.Timeout[] = [];

    const triggerLightning = () => {
      setShowLightning(true);
      
      // Clear any previous flicker timeouts
      flickerTimeouts.forEach(clearTimeout);
      flickerTimeouts = [];

      // Create flicker effect
      const t1 = setTimeout(() => setShowLightning(false), 150);
      const t2 = setTimeout(() => {
        setShowLightning(true);
        const t3 = setTimeout(() => setShowLightning(false), 100);
        flickerTimeouts.push(t3);
      }, 200);
      
      flickerTimeouts.push(t1, t2);

      // Schedule next lightning with new random delay
      const nextDelay = 2000 + Math.random() * 5000;
      timeoutId = setTimeout(triggerLightning, nextDelay);
    };

    // Start the loop
    const initialDelay = 1000 + Math.random() * 2000;
    timeoutId = setTimeout(triggerLightning, initialDelay);

    return () => {
      clearTimeout(timeoutId);
      flickerTimeouts.forEach(clearTimeout);
    };
  }, []);

  // Car animation
  useEffect(() => {
    let animationFrameId: number;
    let lastSpawnTime = performance.now();
    const SPAWN_INTERVAL = 10000;

    const animate = () => {
      const now = performance.now();

      // Reset car position every 10 seconds
      if (now - lastSpawnTime > SPAWN_INTERVAL) {
        setCarPosition(-250);
        lastSpawnTime = now;
      } else {
        // Move car
        setCarPosition(prev => {
          if (prev > window.innerWidth + 250) return prev;
          return prev + 3;
        });
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center pixelated"
        style={{ 
          backgroundImage: `url(${gbStudiosBackground})`,
          filter: 'brightness(0.7) contrast(1.1)',
        }}
      />

      {/* Lightning Flash Overlay */}
      <div 
        className={`absolute inset-0 bg-[hsl(var(--game-lightning))] pointer-events-none transition-opacity duration-75 ${
          showLightning ? 'opacity-50' : 'opacity-0'
        }`}
      />

      {/* Stormy Sky Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,8%,0.6)] via-transparent to-[hsl(220,30%,5%,0.8)]" />

      {/* Car Silhouette - at bottom on the street */}
      <div 
        className="absolute bottom-[2%] h-16 transition-none"
        style={{ left: carPosition }}
      >
        <div className="relative">
          {/* Simple car shape using CSS */}
          <div className="w-48 h-12 bg-[hsl(220,20%,15%)] rounded-t-xl relative">
            <div className="absolute -top-6 left-8 w-28 h-8 bg-[hsl(220,20%,12%)] rounded-t-lg" />
            {/* Headlights */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-300 rounded-full opacity-80" />
            {/* Taillights */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-80" />
          </div>
          {/* Wheels */}
          <div className="absolute -bottom-4 left-6 w-8 h-8 bg-[hsl(220,10%,10%)] rounded-full" />
          <div className="absolute -bottom-4 right-6 w-8 h-8 bg-[hsl(220,10%,10%)] rounded-full" />
        </div>
      </div>

      {/* Title - positioned above the building */}
      <div className="absolute top-[8%] left-0 right-0 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wider title-glow text-yellow-400">
          HOLLYWOOD
        </h1>
        <h2 className="text-5xl md:text-7xl font-bold tracking-widest title-glow text-yellow-400 mt-2">
          MURDER MYSTERY
        </h2>
      </div>

      {/* Press Start Button - below GB Studios sign, above door */}
      <div className="absolute top-[52%] left-0 right-0 text-center">
        <button
          onClick={onStart}
          className="text-2xl md:text-3xl tracking-widest text-yellow-400 pulse-glow hover:scale-105 transition-transform cursor-pointer"
        >
          PRESS START
        </button>
      </div>

      {/* Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none" 
        style={{
          boxShadow: 'inset 0 0 150px 50px hsl(220, 30%, 5%)',
        }}
      />

      {/* Optional Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
    </div>
  );
}
