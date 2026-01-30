import { useEffect, useState } from 'react';
import { GamePhase } from '@/types/game';
import breakroomBackground from '@/assets/backgrounds/breakroom.jpg';
import elFuegoSprite from '@/assets/characters/el-fuego.jpg';
import daggerImage from '@/assets/items/dagger.jpg';

interface IntroSequenceProps {
  phase: GamePhase;
  setPhase: (phase: GamePhase) => void;
  onComplete: () => void;
}

export function IntroSequence({ phase, setPhase, onComplete }: IntroSequenceProps) {
  const [fadeState, setFadeState] = useState<'in' | 'out' | 'black' | 'visible'>('in');
  const [showMurderScene, setShowMurderScene] = useState(false);

  useEffect(() => {
    if (phase === 'intro') {
      // Fade in to party scene
      setFadeState('in');
      const timer = setTimeout(() => {
        setFadeState('visible');
        setPhase('party');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, setPhase]);

  useEffect(() => {
    if (phase === 'party') {
      // Show party for a few seconds then blackout
      const timer = setTimeout(() => {
        setFadeState('out');
        setTimeout(() => {
          setFadeState('black');
          setPhase('blackout');
        }, 1000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, setPhase]);

  useEffect(() => {
    if (phase === 'blackout') {
      // Stay black for dramatic effect
      const timer = setTimeout(() => {
        setShowMurderScene(true);
        setFadeState('in');
        setPhase('murder-reveal');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, setPhase]);

  useEffect(() => {
    if (phase === 'murder-reveal') {
      // Show murder scene then transition to gameplay
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Background */}
      {fadeState !== 'black' && (
        <div 
          className={`absolute inset-0 bg-cover bg-center pixelated transition-opacity duration-1000 ${
            fadeState === 'in' ? 'opacity-0 animate-[fade-in_1.5s_ease-out_forwards]' :
            fadeState === 'out' ? 'animate-[fade-out_1s_ease-out_forwards]' :
            'opacity-100'
          }`}
          style={{ 
            backgroundImage: `url(${breakroomBackground})`,
          }}
        />
      )}

      {/* Party atmosphere overlay */}
      {phase === 'party' && !showMurderScene && (
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent pointer-events-none" />
      )}

      {/* Characters at the party */}
      {(phase === 'party' || phase === 'intro') && !showMurderScene && fadeState !== 'black' && (
        <div className="absolute bottom-[20%] left-[30%]">
          <img 
            src={elFuegoSprite} 
            alt="El Fuego"
            className="h-48 pixelated object-contain"
            style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}
          />
        </div>
      )}

      {/* Murder Scene Elements */}
      {showMurderScene && (
        <>
          {/* Body on the floor (using El Fuego rotated as placeholder) */}
          <div className="absolute bottom-[15%] left-[40%] transform -rotate-90">
            <img 
              src={elFuegoSprite} 
              alt="Victim"
              className="h-32 pixelated object-contain opacity-80"
              style={{ filter: 'grayscale(0.3) brightness(0.7) drop-shadow(2px 4px 6px rgba(0,0,0,0.8))' }}
            />
          </div>

          {/* Dagger beside the body */}
          <div className="absolute bottom-[12%] left-[55%]">
            <img 
              src={daggerImage} 
              alt="Bloody Dagger"
              className="h-16 pixelated object-contain transform rotate-45"
              style={{ filter: 'drop-shadow(0 0 8px rgba(180,0,0,0.6))' }}
            />
          </div>

          {/* Blood pool effect */}
          <div 
            className="absolute bottom-[10%] left-[42%] w-32 h-12 rounded-full opacity-60"
            style={{ 
              background: 'radial-gradient(ellipse, hsl(0, 80%, 25%) 0%, transparent 70%)',
            }}
          />
        </>
      )}

      {/* Blackout overlay */}
      {fadeState === 'black' && (
        <div className="absolute inset-0 bg-black" />
      )}

      {/* Text overlays */}
      {phase === 'blackout' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground text-lg animate-pulse">
            *CRASH*
          </p>
        </div>
      )}

      {phase === 'murder-reveal' && (
        <div className="absolute top-8 left-0 right-0 text-center">
          <p className="text-accent text-xl font-bold animate-[fade-in_0.5s_ease-out]">
            MURDER!
          </p>
        </div>
      )}

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
    </div>
  );
}
