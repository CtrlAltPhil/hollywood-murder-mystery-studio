import { useEffect, useState } from "react";
import { GamePhase } from "@/types/game";
import breakroomBackground from "@/assets/backgrounds/breakroom.jpg";
import elFuegoSprite from "@/assets/characters/el-fuego.png";
import elFuegoSprite2 from "@/assets/characters/el-fuego-2.png";
import ladySprite from "@/assets/characters/lady.png";
import losCabosSprite from "@/assets/characters/los-cabos.png";
import carlSprite from "@/assets/characters/carl.png";
import daggerImage from "@/assets/props/dagger.png";
import wineGlassesImage from "@/assets/props/wine-glasses.png";
import tableImage from "@/assets/props/table.png";
import charcuterieBoardImage from "@/assets/charcuterie_board.png";

interface IntroSequenceProps {
  phase: GamePhase;
  setPhase: (phase: GamePhase) => void;
  onComplete: () => void;
}

// Pre-blackout dinner party dialogue. Per the script, Duke's "wine is exquisite"
// line is the last thing said before the lights cut out.
const PARTY_DIALOGUE = [
  { speaker: "Lady Fantastica", text: "...and that's when the director GASPED!", position: "left" },
  { speaker: "Carl", text: "More wine, anyone?", position: "center" },
  { speaker: "Los Cabos", text: "A toast — to a wonderful evening.", position: "right" },
  { speaker: "Lady Fantastica", text: "Oh Los Cabos, you're TOO kind.", position: "left" },
  { speaker: "Duke Extreme", text: "The wine is exquisite tonight.", position: "left" },
];

// Post-blackout reactions, shown one at a time over the murder scene.
const REACTION_LINES = [
  { speaker: "Lady Fantastica", text: "Oh my — SOMEONE CALL THE POLICE!" },
  { speaker: "Duke Extreme", text: "Nobody move. Something's wrong here." },
  { speaker: "Carl", text: "How... how is this possible?" },
];

export function IntroSequence({ phase, setPhase, onComplete }: IntroSequenceProps) {
  const [fadeState, setFadeState] = useState<"in" | "out" | "black" | "visible">("visible");
  const [showMurderScene, setShowMurderScene] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [reactionIdx, setReactionIdx] = useState(-1);
  const [showStanleyCard, setShowStanleyCard] = useState(false);
  const [elFuegoPose, setElFuegoPose] = useState(0);

  // Animate El Fuego between poses
  useEffect(() => {
    const interval = setInterval(() => {
      setElFuegoPose((prev) => (prev === 0 ? 1 : 0));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Step through pre-blackout dialogue (stops on the last "wine is exquisite" line)
  useEffect(() => {
    if (phase === "party") {
      const dialogueInterval = setInterval(() => {
        setCurrentDialogue((prev) => Math.min(prev + 1, PARTY_DIALOGUE.length - 1));
      }, 2200);
      return () => clearInterval(dialogueInterval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "intro") {
      setFadeState("visible");
      setPhase("party");
    }
  }, [phase, setPhase]);

  // Party scene runs ~12s (long enough to hear all lines including Duke's "wine is exquisite"),
  // then the lights cut out into the blackout.
  useEffect(() => {
    if (phase === "party") {
      let innerTimer: NodeJS.Timeout;
      const timer = setTimeout(() => {
        setFadeState("out");
        innerTimer = setTimeout(() => {
          setFadeState("black");
          setPhase("blackout");
        }, 800);
      }, 12000);
      return () => {
        clearTimeout(timer);
        clearTimeout(innerTimer);
      };
    }
  }, [phase, setPhase]);

  // Blackout: hold black for the "fast deliberate footsteps + thud" beat,
  // then bring up the lights to reveal the body and cycle through reactions.
  useEffect(() => {
    if (phase === "blackout") {
      // Reveal the murder scene after the blackout beat
      const revealTimer = setTimeout(() => {
        setShowMurderScene(true);
        setFadeState("visible");
      }, 2200);

      // Start cycling reaction lines shortly after lights come back on
      const firstReaction = setTimeout(() => setReactionIdx(0), 3000);
      const secondReaction = setTimeout(() => setReactionIdx(1), 5200);
      const thirdReaction = setTimeout(() => setReactionIdx(2), 7400);
      const stanleyCard = setTimeout(() => setShowStanleyCard(true), 9600);
      const finishTimer = setTimeout(() => onComplete(), 13500);

      return () => {
        clearTimeout(revealTimer);
        clearTimeout(firstReaction);
        clearTimeout(secondReaction);
        clearTimeout(thirdReaction);
        clearTimeout(stanleyCard);
        clearTimeout(finishTimer);
      };
    }
  }, [phase, onComplete]);

  const dialogue = PARTY_DIALOGUE[currentDialogue];
  const reaction = reactionIdx >= 0 ? REACTION_LINES[reactionIdx] : null;
  const isPartyScene = (phase === "party" || phase === "intro") && !showMurderScene && fadeState !== "black";

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Background */}
      {fadeState !== "black" && (
        <div
          className={`absolute inset-0 bg-cover bg-center pixelated transition-opacity duration-1000 ${
            fadeState === "in"
              ? "opacity-0 animate-[fade-in_1.5s_ease-out_forwards]"
              : fadeState === "out"
                ? "animate-[fade-out_1s_ease-out_forwards]"
                : "opacity-100"
          }`}
          style={{ backgroundImage: `url(${breakroomBackground})` }}
        />
      )}

      {/* Table with food and drinks - near Lady and Duke Extreme */}
      {isPartyScene && (
        <div className="absolute bottom-[1%] left-[20%] z-10">
          <img src={tableImage} alt="Party Table" className="h-48 pixelated object-contain" />
          {/* Wine glasses centered on table */}
          <div className="absolute top-[10%] left-[0%]">
            <img src={wineGlassesImage} alt="Wine Glasses" className="h-20 pixelated object-contain" />
          </div>
          {/* Charcuterie board sitting above table */}
          <div className="absolute top-[10%] left-[40%]">
            <img src={charcuterieBoardImage} alt="Charcuterie Board" className="h-18 pixelated object-contain" />
          </div>
        </div>
      )}

      {/* Characters at the party - positioned on the floor */}
      {isPartyScene && (
        <>
          {/* Lady Fantastica */}
          <div className="absolute bottom-[3%] left-[8%] z-20">
            <img src={ladySprite} alt="Lady Fantastica" className="h-60 pixelated object-contain" />
            {dialogue.speaker === "Lady Fantastica" && (
              <SpeechBubble text={dialogue.text} />
            )}
          </div>

          {/* Duke Extreme */}
          <div className="absolute bottom-[3%] left-[35%] z-20">
            <img
              src={elFuegoPose === 0 ? elFuegoSprite : elFuegoSprite2}
              alt="Duke Extreme"
              className="h-60 pixelated object-contain transition-opacity duration-300"
            />
            {dialogue.speaker === "Duke Extreme" && (
              <SpeechBubble text={dialogue.text} />
            )}
          </div>

          {/* Carl */}
          <div className="absolute bottom-[3%] left-[55%] z-20">
            <img src={carlSprite} alt="Carl" className="h-60 pixelated object-contain" />
            {dialogue.speaker === "Carl" && (
              <SpeechBubble text={dialogue.text} />
            )}
          </div>

          {/* Los Cabos - the future victim, near the far right window */}
          <div className="absolute bottom-[3%] right-[10%] z-20">
            <img src={losCabosSprite} alt="Los Cabos" className="h-60 pixelated object-contain" />
            {dialogue.speaker === "Los Cabos" && (
              <SpeechBubble text={dialogue.text} />
            )}
          </div>
        </>
      )}

      {/* Murder Scene - lights are back on, body on the floor */}
      {showMurderScene && (
        <>
          <div className="absolute bottom-[5%] left-[22%] z-10">
            <img src={tableImage} alt="Party Table" className="h-28 pixelated object-contain" />
            <div className="absolute top-[10%] left-[25%]">
              <img src={wineGlassesImage} alt="Wine Glasses" className="h-12 pixelated object-contain" />
            </div>
            <div className="absolute top-1 left-[5%]">
              <img src={charcuterieBoardImage} alt="Charcuterie Board" className="h-10 pixelated object-contain" />
            </div>
          </div>

          {/* Surviving witnesses in shock */}
          <div className="absolute bottom-[3%] left-[8%] z-20">
            <img src={ladySprite} alt="Lady Fantastica" className="h-44 pixelated object-contain" />
            {reaction?.speaker === "Lady Fantastica" && (
              <SpeechBubble text={reaction.text} />
            )}
          </div>
          <div className="absolute bottom-[3%] left-[35%] z-20">
            <img
              src={elFuegoPose === 0 ? elFuegoSprite : elFuegoSprite2}
              alt="Duke Extreme"
              className="h-44 pixelated object-contain transition-opacity duration-300"
            />
            {reaction?.speaker === "Duke Extreme" && (
              <SpeechBubble text={reaction.text} />
            )}
          </div>
          <div className="absolute bottom-[3%] left-[55%] z-20">
            <img src={carlSprite} alt="Carl" className="h-44 pixelated object-contain" />
            {reaction?.speaker === "Carl" && (
              <SpeechBubble text={reaction.text} />
            )}
          </div>

          {/* Los Cabos - body on the floor on the far right (where he was standing) */}
          <div className="absolute bottom-[3%] right-[15%] transform -rotate-90 z-10">
            <img
              src={losCabosSprite}
              alt="Los Cabos - Victim"
              className="h-60 pixelated object-contain opacity-90"
              style={{ filter: "grayscale(0.3) brightness(0.7) drop-shadow(2px 4px 6px rgba(0,0,0,0.8))" }}
            />
          </div>

          {/* Blood pool */}
          <div
            className="absolute bottom-[2%] right-[12%] w-36 h-14 rounded-full opacity-60 z-5"
            style={{ background: "radial-gradient(ellipse, hsl(0, 80%, 25%) 0%, transparent 70%)" }}
          />

          {/* Knife (per script — "a knife beside him") */}
          <div className="absolute bottom-[5%] right-[8%] z-15">
            <img
              src={daggerImage}
              alt="Bloody Knife"
              className="h-12 pixelated object-contain transform rotate-45"
              style={{ filter: "drop-shadow(0 0 8px rgba(180,0,0,0.6))" }}
            />
          </div>

          {/* Stanley Wilson intro card */}
          {showStanleyCard && (
            <div className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-center pb-8 animate-[fade-in_0.5s_ease-out]">
              <div className="bg-black/90 border-2 border-white/80 px-6 py-4 max-w-md text-center">
                <p className="text-white text-sm font-bold tracking-wider mb-1">DETECTIVE STANLEY WILSON</p>
                <p className="text-white/80 text-xs leading-relaxed">
                  Twenty year veteran of the Hollywood Police Department. Serious, sharp, and by the book.
                  He has solved every case he has ever been assigned — and he does not intend to stop now.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Blackout overlay */}
      {fadeState === "black" && <div className="absolute inset-0 bg-black" />}

      {/* Blackout audio cue text */}
      {phase === "blackout" && !showMurderScene && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <p className="text-muted-foreground text-base animate-pulse">*the generator groans*</p>
          <p className="text-muted-foreground text-xs animate-pulse">*fast footsteps cross the room*</p>
          <p className="text-red-400/70 text-sm animate-pulse">*THUD*</p>
        </div>
      )}

      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
    </div>
  );
}

function SpeechBubble({ text }: { text: string }) {
  return (
    <div
      className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-3 py-2 rounded-lg
                  max-w-[160px] text-center shadow-lg animate-[fade-in_0.3s_ease-out] z-30"
    >
      {text}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full
                    w-0 h-0 border-l-8 border-r-8 border-t-8
                    border-l-transparent border-r-transparent border-t-white"
      />
    </div>
  );
}
