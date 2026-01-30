import { useState, useEffect } from 'react';
import gbStudiosBackground from '@/assets/backgrounds/gb-studios.jpg';

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [showLightning, setShowLightning] = useState(false);
  const [carPosition, setCarPosition] = useState(-150);

  // Lightning effect
  useEffect(() => {
    const lightningInterval = setInterval(() => {
      setShowLightning(true);
      setTimeout(() => setShowLightning(false), 150);
      setTimeout(() => {
        setShowLightning(true);
        setTimeout(() => setShowLightning(false), 100);
      }, 200);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(lightningInterval);
  }, []);

  // Car animation
  useEffect(() => {
    const carInterval = setInterval(() => {
      setCarPosition(-150);
      const animate = () => {
        setCarPosition(prev => {
          if (prev > window.innerWidth + 150) return prev;
          requestAnimationFrame(animate);
          return prev + 3;
        });
      };
      requestAnimationFrame(animate);
    }, 10000);

    // Start first car immediately
    const animate = () => {
      setCarPosition(prev => {
        if (prev > window.innerWidth + 150) return prev;
        requestAnimationFrame(animate);
        return prev + 3;
      });
    };
    requestAnimationFrame(animate);

    return () => clearInterval(carInterval);
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
          showLightning ? 'opacity-30' : 'opacity-0'
        }`}
      />

      {/* Stormy Sky Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,30%,8%,0.6)] via-transparent to-[hsl(220,30%,5%,0.8)]" />

      {/* Car Silhouette - at bottom on the street */}
      <div 
        className="absolute bottom-[2%] h-8 transition-none"
        style={{ left: carPosition }}
      >
        <div className="relative">
          {/* Simple car shape using CSS */}
          <div className="w-24 h-6 bg-[hsl(220,20%,15%)] rounded-t-lg relative">
            <div className="absolute -top-3 left-4 w-14 h-4 bg-[hsl(220,20%,12%)] rounded-t-md" />
            {/* Headlights */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-300 rounded-full opacity-80" />
            {/* Taillights */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full opacity-80" />
          </div>
          {/* Wheels */}
          <div className="absolute -bottom-2 left-3 w-4 h-4 bg-[hsl(220,10%,10%)] rounded-full" />
          <div className="absolute -bottom-2 right-3 w-4 h-4 bg-[hsl(220,10%,10%)] rounded-full" />
        </div>
      </div>

      {/* Title - positioned above the building */}
      <div className="absolute top-[8%] left-0 right-0 text-center">
        <h1 className="text-2xl md:text-4xl font-bold tracking-wider title-glow text-[hsl(var(--game-title-gold))]">
          HOLLYWOOD
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold tracking-widest title-glow text-[hsl(var(--game-title-gold))] mt-2">
          MURDER MYSTERY
        </h2>
      </div>

      {/* Press Start Button - below GB Studios sign, above door */}
      <div className="absolute top-[52%] left-0 right-0 text-center">
        <button
          onClick={onStart}
          className="text-lg md:text-xl tracking-widest text-[hsl(var(--game-title-gold))] pulse-glow hover:scale-105 transition-transform cursor-pointer"
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
