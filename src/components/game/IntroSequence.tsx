import { useEffect, useState } from 'react';
import { GamePhase } from '@/types/game';
import breakroomBackground from '@/assets/backgrounds/breakroom.jpg';
import elFuegoSprite from '@/assets/characters/el-fuego.jpg';
import ladySprite from '@/assets/characters/lady.jpg';
import losCabosSprite from '@/assets/characters/los-cabos.jpg';
import carlSprite from '@/assets/characters/carl.jpg';
import daggerImage from '@/assets/items/dagger.jpg';
import wineGlassesImage from '@/assets/props/wine-glasses.jpg';
import tableImage from '@/assets/props/table.jpg';

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

      {/* Party Decorations */}
      {isPartyScene && (
        <>
          {/* Streamers */}
          <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
            {/* Streamer curves using CSS */}
            <svg className="absolute w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,5 Q10,15 20,5 T40,5 T60,5 T80,5 T100,5" 
                stroke="hsl(350, 80%, 60%)" strokeWidth="0.8" fill="none" className="opacity-80" />
              <path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" 
                stroke="hsl(45, 90%, 60%)" strokeWidth="0.8" fill="none" className="opacity-80" />
              <path d="M0,15 Q10,5 20,15 T40,15 T60,15 T80,15 T100,15" 
                stroke="hsl(200, 80%, 60%)" strokeWidth="0.8" fill="none" className="opacity-80" />
            </svg>
          </div>

          {/* Balloons */}
          <div className="absolute top-[5%] left-[10%] animate-[float_3s_ease-in-out_infinite]">
            <div className="w-8 h-10 bg-red-500 rounded-full opacity-80" style={{ filter: 'brightness(1.2)' }} />
            <div className="w-0.5 h-8 bg-gray-400 mx-auto" />
          </div>
          <div className="absolute top-[8%] left-[85%] animate-[float_3.5s_ease-in-out_infinite_0.5s]">
            <div className="w-8 h-10 bg-blue-500 rounded-full opacity-80" style={{ filter: 'brightness(1.2)' }} />
            <div className="w-0.5 h-8 bg-gray-400 mx-auto" />
          </div>
          <div className="absolute top-[3%] left-[25%] animate-[float_2.8s_ease-in-out_infinite_0.3s]">
            <div className="w-6 h-8 bg-yellow-400 rounded-full opacity-80" style={{ filter: 'brightness(1.2)' }} />
            <div className="w-0.5 h-6 bg-gray-400 mx-auto" />
          </div>
          <div className="absolute top-[6%] right-[20%] animate-[float_3.2s_ease-in-out_infinite_0.7s]">
            <div className="w-7 h-9 bg-green-500 rounded-full opacity-80" style={{ filter: 'brightness(1.2)' }} />
            <div className="w-0.5 h-7 bg-gray-400 mx-auto" />
          </div>
          <div className="absolute top-[4%] left-[50%] animate-[float_3s_ease-in-out_infinite_0.2s]">
            <div className="w-8 h-10 bg-purple-500 rounded-full opacity-80" style={{ filter: 'brightness(1.2)' }} />
            <div className="w-0.5 h-8 bg-gray-400 mx-auto" />
          </div>

          {/* Party Banner */}
          <div className="absolute top-[12%] left-1/2 -translate-x-1/2">
            <div className="bg-[hsl(45,80%,50%)] px-6 py-2 text-xs text-black font-bold tracking-wider 
                          border-2 border-[hsl(45,90%,30%)] shadow-lg">
              🎉 CONGRATULATIONS! 🎉
            </div>
          </div>
        </>
      )}

      {/* Party atmosphere overlay */}
      {isPartyScene && (
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent pointer-events-none" />
      )}

      {/* Table with food and drinks - near Lady and El Fuego */}
      {isPartyScene && (
        <div className="absolute bottom-[5%] left-[22%] z-10">
          <img 
            src={tableImage} 
            alt="Party Table"
            className="h-20 pixelated object-contain"
            style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}
          />
          {/* Wine glasses on table */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <img 
              src={wineGlassesImage} 
              alt="Wine Glasses"
              className="h-10 pixelated object-contain"
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
              className="h-36 pixelated object-contain"
              style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}
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
              src={elFuegoSprite} 
              alt="El Fuego"
              className="h-36 pixelated object-contain"
              style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}
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
              className="h-36 pixelated object-contain"
              style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}
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
              className="h-36 pixelated object-contain"
              style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}
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
          {/* Party decorations still visible */}
          <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
            <svg className="absolute w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,5 Q10,15 20,5 T40,5 T60,5 T80,5 T100,5" 
                stroke="hsl(350, 80%, 60%)" strokeWidth="0.8" fill="none" className="opacity-80" />
              <path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" 
                stroke="hsl(45, 90%, 60%)" strokeWidth="0.8" fill="none" className="opacity-80" />
              <path d="M0,15 Q10,5 20,15 T40,15 T60,15 T80,15 T100,15" 
                stroke="hsl(200, 80%, 60%)" strokeWidth="0.8" fill="none" className="opacity-80" />
            </svg>
          </div>

          {/* Balloons still floating */}
          <div className="absolute top-[5%] left-[10%] animate-[float_3s_ease-in-out_infinite]">
            <div className="w-8 h-10 bg-red-500 rounded-full opacity-80" />
            <div className="w-0.5 h-8 bg-gray-400 mx-auto" />
          </div>
          <div className="absolute top-[8%] left-[85%] animate-[float_3.5s_ease-in-out_infinite_0.5s]">
            <div className="w-8 h-10 bg-blue-500 rounded-full opacity-80" />
            <div className="w-0.5 h-8 bg-gray-400 mx-auto" />
          </div>

          {/* Banner still visible but now grim context */}
          <div className="absolute top-[12%] left-1/2 -translate-x-1/2">
            <div className="bg-[hsl(45,80%,50%)] px-6 py-2 text-xs text-black font-bold tracking-wider 
                          border-2 border-[hsl(45,90%,30%)] shadow-lg">
              🎉 CONGRATULATIONS! 🎉
            </div>
          </div>

          {/* Table with wine glasses */}
          <div className="absolute bottom-[5%] left-[22%] z-10">
            <img src={tableImage} alt="Party Table" className="h-20 pixelated object-contain"
              style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }} />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <img src={wineGlassesImage} alt="Wine Glasses" className="h-10 pixelated object-contain" />
            </div>
          </div>

          {/* Surviving characters in shock - positioned on floor */}
          <div className="absolute bottom-[3%] left-[8%] z-20">
            <img src={ladySprite} alt="Lady" className="h-36 pixelated object-contain"
              style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }} />
          </div>
          <div className="absolute bottom-[3%] left-[35%] z-20">
            <img src={elFuegoSprite} alt="El Fuego" className="h-36 pixelated object-contain"
              style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }} />
          </div>
          <div className="absolute bottom-[3%] left-[55%] z-20">
            <img src={carlSprite} alt="Carl" className="h-36 pixelated object-contain"
              style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }} />
          </div>

          {/* Los Cabos - body on the floor (victim) */}
          <div className="absolute bottom-[3%] right-[15%] transform -rotate-90 z-10">
            <img 
              src={losCabosSprite} 
              alt="Los Cabos - Victim"
              className="h-28 pixelated object-contain opacity-90"
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
