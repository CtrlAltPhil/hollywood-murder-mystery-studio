import { useState, useEffect, useCallback } from 'react';
import gbStudiosBackground from '@/assets/backgrounds/gb-studios.jpg';

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [showLightning, setShowLightning] = useState(false);
  const [carPosition, setCarPosition] = useState(-250);
  const [easterEggVisible, setEasterEggVisible] = useState(false);
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
          filter: 'brightness(0.9) contrast(1.05)',
        }}
      />

      {/* Lightning Flash Overlay */}
      <div 
        className={`absolute inset-0 bg-[hsl(var(--game-lightning))] pointer-events-none transition-opacity duration-75 ${
          showLightning ? 'opacity-50' : 'opacity-0'
        }`}
      />

      {/* Stormy Sky Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,8%,0.3)] via-transparent to-[hsl(220,30%,5%,0.5)]" />

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

      {/* Fireflies around lamp posts */}
      {[
        { id: 'ff-easter', x: 8, y: 62, delay: 0, isEasterEgg: true },
        { id: 'ff2', x: 11, y: 58, delay: 1.2, isEasterEgg: false },
        { id: 'ff3', x: 14, y: 65, delay: 0.6, isEasterEgg: false },
        { id: 'ff4', x: 88, y: 60, delay: 0.3, isEasterEgg: false },
        { id: 'ff5', x: 91, y: 64, delay: 1.5, isEasterEgg: false },
        { id: 'ff6', x: 85, y: 57, delay: 0.9, isEasterEgg: false },
      ].map((ff) => (
        <div
          key={ff.id}
          className={`absolute w-2 h-2 rounded-full ${ff.isEasterEgg ? 'cursor-pointer z-20' : 'pointer-events-none'}`}
          style={{
            left: `${ff.x}%`,
            top: `${ff.y}%`,
            background: 'radial-gradient(circle, hsl(55, 90%, 75%) 0%, hsl(45, 80%, 50%, 0) 70%)',
            boxShadow: '0 0 6px 3px hsl(50, 90%, 60%, 0.4)',
            animation: `fireflyFloat 3s ease-in-out ${ff.delay}s infinite alternate, fireflyGlow 2s ease-in-out ${ff.delay}s infinite alternate`,
          }}
          onClick={ff.isEasterEgg ? () => setEasterEggVisible(true) : undefined}
        />
      ))}

      {/* Easter Egg Modal */}
      {easterEggVisible && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setEasterEggVisible(false)}
        >
          <div 
            className="max-w-md mx-4 p-6 border-2 border-yellow-400/60 rounded-lg text-center"
            style={{ background: 'linear-gradient(135deg, hsl(220, 30%, 12%), hsl(260, 20%, 15%))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-yellow-400 text-xs leading-relaxed font-pixel mb-4">
              ✨ You found a secret! ✨
            </p>
            <p className="text-yellow-200/90 text-[10px] leading-relaxed font-pixel mb-4">
              This game was crafted by Lucas — a storyteller at heart who believes every mystery deserves to be unraveled, 
              every character deserves a voice, and every late night spent writing dialogue is worth it if it makes someone smile. 
              From point-and-click adventures to campfire tales, Lucas has always loved weaving stories that pull you in 
              and never quite let go. Thanks for playing. 💛
            </p>
            <button 
              onClick={() => setEasterEggVisible(false)}
              className="text-yellow-400 text-[10px] font-pixel hover:text-yellow-300 cursor-pointer"
            >
              [ Click to close ]
            </button>
          </div>
        </div>
      )}

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
