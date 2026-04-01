import { GameState } from "@/types/game";
import { SimpleHotspot, getCursorClass, handleSceneHotspotClick } from "@/utils/sceneHelpers";
import ladyRoomBackground from "@/assets/backgrounds/lady-fantastique-room.png";
import ladyImage from "@/assets/characters/lady.png";

interface LadyFantastiqueRoomSceneProps {
  gameState: GameState;
  onHotspotHover: (text: string) => void;
  onHotspotClick: (hotspot: SimpleHotspot) => void;
  onChangeRoom: (roomId: string) => void;
  onEmptyClick?: () => void;
  debugMode?: boolean;
}

export function LadyFantastiqueRoomScene({
  gameState,
  onHotspotHover,
  onHotspotClick,
  onChangeRoom,
  onEmptyClick,
  debugMode,
}: LadyFantastiqueRoomSceneProps) {
  const cursorClass = getCursorClass(gameState.selectedVerb);
  const ladyPresent = gameState.flags.handkerchiefTaken === true;

  const hotspots: SimpleHotspot[] = [
    {
      id: "stage-presence-poster",
      name: '"Stage Presence" Poster',
      position: { x: 33, y: 37 },
      width: 12,
      height: 25,
      interactions: {
        look: '"Stage Presence" — a framed poster of Lady Fantastique in her breakout role. She looks younger here.',
        use: "It's just a poster on the wall.",
      },
    },
    {
      id: "fantastic-drama-poster",
      name: '"Fantastic Drama" Poster',
      position: { x: 45, y: 37 },
      width: 12,
      height: 25,
      interactions: {
        look: '"Fantastic Drama" — another starring role. Lady Fantastique was quite the star... before Los Cabos overtook her.',
        use: "It's just a poster.",
      },
    },
    {
      id: "vanity-desk",
      name: "Vanity Desk",
      position: { x: 12, y: 60 },
      width: 16,
      height: 25,
      interactions: {
        look: "An antique writing desk with a lamp. There are scattered papers and what looks like a torn letter.",
        open: "I open the desk drawer. Inside is a stack of letters — all addressed to Los Cabos, never sent.",
        use: "The lamp flickers when I touch it. The bulb is loose.",
        pickup: "The desk is far too heavy.",
      },
    },
    {
      id: "canopy-bed",
      name: "Canopy Bed",
      position: { x: 78, y: 55 },
      width: 22,
      height: 40,
      interactions: {
        look: "A luxurious four-poster bed with crimson drapes. The pillows are arranged perfectly — she hasn't slept here tonight.",
        use: "This is no time for a nap.",
        push: "I check under the pillows... nothing.",
      },
    },
    {
      id: "star-wallpaper",
      name: "Star Wallpaper",
      position: { x: 15, y: 35 },
      width: 25,
      height: 20,
      interactions: {
        look: "Gold and silver stars decorate the deep red walls. Lady Fantastique certainly has a flair for the dramatic.",
      },
    },
    {
      id: "rug",
      name: "Ornate Rug",
      position: { x: 40, y: 88 },
      width: 40,
      height: 15,
      interactions: {
        look: "A beautiful Persian rug. It's slightly bunched up in one corner, like something was dragged across it.",
        pull: "I pull back the corner of the rug. There are scratch marks on the floor underneath.",
        push: "I smooth it out. Nothing else underneath.",
      },
    },
    {
      id: "door-exit",
      name: "Door to Hallway",
      position: { x: 94, y: 55 },
      width: 8,
      height: 60,
      interactions: {
        look: "The door back to the hallway.",
        open: "__NAVIGATE__hallway",
        use: "__NAVIGATE__hallway",
      },
    },
    ...(ladyPresent
      ? [
          {
            id: "lady-fantastique",
            name: "Lady Fantastique",
            position: { x: 50, y: 72 },
            width: 12,
            height: 35,
            interactions: {
              look: "Lady Fantastique is here in her room now, sitting at the edge of her bed. She looks troubled.",
              talk: "__DIALOG__lady",
              pickup: "I can't pick up a person!",
              use: "I should talk to her instead.",
              use_with_monogrammed_handkerchief:
                '"Those initials... L.A. — that\'s Luke Adams. Carl\'s real name." Lady Fantastique looks away. "He changed it when he came to Hollywood. Nobody was supposed to know."',
              use_with_torn_photograph:
                '"That photograph... I\'ve seen it before. Carl — Luke — he kept it in his office. It was from the buyout deal signing. He was obsessed with that deal."',
            },
          } as SimpleHotspot,
        ]
      : []),
  ];

  return (
    <div className={`relative w-full h-full ${cursorClass}`} onClick={() => onEmptyClick?.()}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ladyRoomBackground})` }} />

      {/* Lady Fantastique sprite - only after she relocates here */}
      {ladyPresent && (
        <div
          className="absolute z-20 pointer-events-none animate-breathing"
          style={{ left: "44%", bottom: "5%", width: "auto", height: "42%", transformOrigin: "bottom center" }}
        >
          <img
            src={ladyImage}
            alt="Lady Fantastique"
            className="w-full h-full pixelated object-contain"
          />
        </div>
      )}

      {hotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          className={`absolute cursor-inherit transition-colors rounded ${debugMode ? "border-2 border-green-400/70 bg-green-400/15" : "hover:bg-white/10"}`}
          style={{
            left: `${hotspot.position.x - hotspot.width / 2}%`,
            top: `${hotspot.position.y - hotspot.height / 2}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
          }}
          onMouseEnter={() => onHotspotHover(hotspot.name)}
          onMouseLeave={() => onHotspotHover("")}
          onClick={(e) => {
            e.stopPropagation();
            handleSceneHotspotClick(hotspot, gameState.selectedVerb, onChangeRoom, onHotspotClick);
          }}
        >
          {debugMode && (
            <span className="absolute top-0 left-0 text-[8px] text-green-300 bg-black/70 px-1 rounded-br">
              {hotspot.id}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
