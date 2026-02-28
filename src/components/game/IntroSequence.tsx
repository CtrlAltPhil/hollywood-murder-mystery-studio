import { useEffect, useState } from 'react';
import { GamePhase } from '@/types/game';
import breakroomBackground from '@/assets/backgrounds/breakroom.jpg';
import elFuegoSprite from '@/assets/characters/el-fuego.png';
import elFuegoSprite2 from '@/assets/characters/el-fuego-2.png';
import ladySprite from '@/assets/characters/lady.png';
import losCabosSprite from '@/assets/characters/los-cabos.png';
import carlSprite from '@/assets/characters/carl.png';
import daggerImage from '@/assets/props/dagger.png';
import wineGlassesImage from '@/assets/props/wine-glasses.png';
import tableImage from '@/assets/props/table.png';

interface IntroSequenceProps {
  phase: GamePhase;
  setPhase: (phase: GamePhase) => void;
  onComplete: () => void;
}

// Party dialogue that rotates through
const PARTY_DIALOGUE = [
  { speaker: 'Lady', text: "What a wonderful party!", position: 'left' },
  { speaker: 'El Fuego', text: "The wine is exquisite tonight.", position: 'left' },
  { speaker: 'Los Cabos', text: "I have an announcement to make later...", position: 'right' },
  { speaker: 'Carl', text: "This appetizer spread is incredible!", position: 'center' },
  { speaker: 'Lady', text: "Did you hear about the new production?", position: 'left' },
  { speaker: 'El Fuego', text: "Shh... not here.", position: 'left' },
  { speaker: 'Los Cabos', text: "Everyone seems tense tonight...", position: 'right' },
];

export function IntroSequence({ phase, setPhase, onComplete }: IntroSequenceProps) {
  const [fadeState, setFadeState] = useState<'in' | 'out' | 'black' | 'visible'>('visible');
  const [showMurderScene, setShowMurderScene] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [elFuegoPose, setElFuegoPose] = useState(0);

  // Animate El Fuego between poses
  useEffect(() => {
    const interval = setInterval(() => {
      setElFuegoPose(prev => (prev === 0 ? 1 : 0));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Rotate through dialogue during party
  useEffect(() => {
    if (phase === 'party') {
      const dialogueInterval = setInterval(() => {
        setCurrentDialogue(prev => (prev + 1) % PARTY_DIALOGUE.length);
      }, 2000);
      return () => clearInterval(dialogueInterval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'intro') {
      setFadeState('visible');
      setPhase('party');
    }
  }, [phase, setPhase]);

  useEffect(() => {
    if (phase === 'party') {
      let innerTimer: NodeJS.Timeout;
      // Extended party scene - 10 seconds
      const timer = setTimeout(() => {
        setFadeState('out');
        innerTimer = setTimeout(() => {
          setFadeState('black');
          setPhase('blackout');
        }, 1000);
      }, 10000);
      return () => {
        clearTimeout(timer);
        clearTimeout(innerTimer);
      };
    }
  }, [phase, setPhase]);

  useEffect(() => {
    if (phase === 'blackout') {
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
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const dialogue = PARTY_DIALOGUE[currentDialogue];
  const isPartyScene = (phase === 'party' || phase === 'intro') && !showMurderScene && fadeState !== 'black';

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
          style={{ backgroundImage: `url(${breakroomBackground})` }}
        />
      )}




      {/* Table with food and drinks - near Lady and El Fuego */}
      {isPartyScene && (
        <div className="absolute bottom-[5%] left-[22%] z-10">
          <img 
            src={tableImage} 
            alt="Party Table"
            className="h-28 pixelated object-contain"
          />
          {/* Wine glasses on table */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <img 
              src={wineGlassesImage} 
              alt="Wine Glasses"
              className="h-12 pixelated object-contain"
            />
          </div>
        </div>
      )}

      {/* Characters at the party - positioned on the floor */}
      {isPartyScene && (
        <>
          {/* Lady - near table, talking to El Fuego */}
          <div className="absolute bottom-[3%] left-[8%] z-20">
            <img 
              src={ladySprite} 
              alt="Lady"
               className="h-44 pixelated object-contain"
            />
            {/* Speech bubble for Lady */}
            {dialogue.speaker === 'Lady' && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-3 py-2 rounded-lg 
                            max-w-[150px] text-center shadow-lg animate-[fade-in_0.3s_ease-out]">
                {dialogue.text}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full 
                              w-0 h-0 border-l-8 border-r-8 border-t-8 
                              border-l-transparent border-r-transparent border-t-white" />
              </div>
            )}
          </div>

          {/* El Fuego - near table, talking to Lady */}
          <div className="absolute bottom-[3%] left-[35%] z-20">
            <img 
              src={elFuegoPose === 0 ? elFuegoSprite : elFuegoSprite2} 
              alt="El Fuego"
               className="h-44 pixelated object-contain transition-opacity duration-300"
            />
            {/* Speech bubble for El Fuego */}
            {dialogue.speaker === 'El Fuego' && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-3 py-2 rounded-lg 
                            max-w-[150px] text-center shadow-lg animate-[fade-in_0.3s_ease-out]">
                {dialogue.text}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full 
                              w-0 h-0 border-l-8 border-r-8 border-t-8 
                              border-l-transparent border-r-transparent border-t-white" />
              </div>
            )}
          </div>

          {/* Carl - center of the room */}
          <div className="absolute bottom-[3%] left-[55%] z-20">
            <img 
              src={carlSprite} 
              alt="Carl"
               className="h-44 pixelated object-contain"
            />
            {/* Speech bubble for Carl */}
            {dialogue.speaker === 'Carl' && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-3 py-2 rounded-lg 
                            max-w-[150px] text-center shadow-lg animate-[fade-in_0.3s_ease-out]">
                {dialogue.text}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full 
                              w-0 h-0 border-l-8 border-r-8 border-t-8 
                              border-l-transparent border-r-transparent border-t-white" />
              </div>
            )}
          </div>

          {/* Los Cabos - the future victim, standing on the right */}
          <div className="absolute bottom-[3%] right-[10%] z-20">
            <img 
              src={losCabosSprite} 
              alt="Los Cabos"
               className="h-44 pixelated object-contain"
            />
            {/* Speech bubble for Los Cabos */}
            {dialogue.speaker === 'Los Cabos' && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-3 py-2 rounded-lg 
                            max-w-[150px] text-center shadow-lg animate-[fade-in_0.3s_ease-out]">
                {dialogue.text}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full 
                              w-0 h-0 border-l-8 border-r-8 border-t-8 
                              border-l-transparent border-r-transparent border-t-white" />
              </div>
            )}
          </div>
        </>
      )}

      {/* Murder Scene Elements - Los Cabos is the victim */}
      {showMurderScene && (
        <>



          {/* Table with wine glasses */}
          <div className="absolute bottom-[5%] left-[22%] z-10">
            <img src={tableImage} alt="Party Table" className="h-28 pixelated object-contain" />
            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
              <img src={wineGlassesImage} alt="Wine Glasses" className="h-12 pixelated object-contain" />
            </div>
          </div>

          {/* Surviving characters in shock - positioned on floor */}
          <div className="absolute bottom-[3%] left-[8%] z-20">
            <img src={ladySprite} alt="Lady" className="h-44 pixelated object-contain" />
          </div>
          <div className="absolute bottom-[3%] left-[35%] z-20">
            <img src={elFuegoPose === 0 ? elFuegoSprite : elFuegoSprite2} alt="El Fuego" className="h-44 pixelated object-contain transition-opacity duration-300" />
          </div>
          <div className="absolute bottom-[3%] left-[55%] z-20">
            <img src={carlSprite} alt="Carl" className="h-44 pixelated object-contain" />
          </div>

          {/* Los Cabos - body on the floor (victim) */}
          <div className="absolute bottom-[3%] right-[15%] transform -rotate-90 z-10">
            <img 
              src={losCabosSprite} 
              alt="Los Cabos - Victim"
              className="h-36 pixelated object-contain opacity-90"
              style={{ filter: 'grayscale(0.3) brightness(0.7) drop-shadow(2px 4px 6px rgba(0,0,0,0.8))' }}
            />
          </div>

          {/* Blood pool effect */}
          <div 
            className="absolute bottom-[2%] right-[12%] w-36 h-14 rounded-full opacity-60 z-5"
            style={{ background: 'radial-gradient(ellipse, hsl(0, 80%, 25%) 0%, transparent 70%)' }}
          />

          {/* Dagger beside Los Cabos */}
          <div className="absolute bottom-[5%] right-[8%] z-15">
            <img 
              src={daggerImage} 
              alt="Bloody Dagger"
              className="h-12 pixelated object-contain transform rotate-45"
              style={{ filter: 'drop-shadow(0 0 8px rgba(180,0,0,0.6))' }}
            />
          </div>
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
