import { CSSProperties } from "react";

export type CarVariant = "sedan" | "coupe" | "roadster" | "truck" | "taxi" | "limo";

export interface CarProps {
  variant: CarVariant;
  /** Body color in HSL space, e.g. "220 20% 15%" */
  bodyHsl: string;
  /** Trim / roof accent in HSL space */
  trimHsl: string;
  /** Direction of travel — affects which end the headlights/tail-lights sit on */
  direction: "ltr" | "rtl";
  /** Pixel offset from the left edge of the viewport */
  x: number;
  /** Vertical position as % from bottom */
  bottomPct: number;
  /** Overall scale (perspective: smaller = further) */
  scale: number;
}

/**
 * Period-correct 1940s silhouette cars. Built from layered divs so they
 * read as crisp pixel-art rather than rounded modern shapes.
 *
 * Geometry is authored facing right (headlights on the right). When
 * direction is "rtl" we mirror the whole sprite via scaleX(-1) so the
 * lights end up at the leading edge of travel.
 */
export function Car({ variant, bodyHsl, trimHsl, direction, x, bottomPct, scale }: CarProps) {
  const mirror = direction === "rtl" ? -1 : 1;
  const wrapperStyle: CSSProperties = {
    left: x,
    bottom: `${bottomPct}%`,
    transform: `scale(${scale}) scaleX(${mirror})`,
    transformOrigin: "bottom center",
  };

  return (
    <div className="absolute pointer-events-none transition-none" style={wrapperStyle}>
      {renderVariant(variant, bodyHsl, trimHsl)}
    </div>
  );
}

function renderVariant(variant: CarVariant, body: string, trim: string) {
  const bodyBg = `hsl(${body})`;
  const trimBg = `hsl(${trim})`;
  const shadow = `hsl(220 30% 4% / 0.55)`;

  // Shared lamps: yellow headlight on the right (leading edge), red tail on the left
  const Lamps = (
    <>
      <div
        className="absolute right-[-2px] top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full"
        style={{
          background: "hsl(50 100% 70%)",
          boxShadow: "0 0 8px 3px hsl(50 100% 65% / 0.7), 0 0 18px 6px hsl(50 100% 60% / 0.35)",
        }}
      />
      <div
        className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full"
        style={{
          background: "hsl(0 90% 55%)",
          boxShadow: "0 0 6px 2px hsl(0 90% 50% / 0.6)",
        }}
      />
    </>
  );

  const Wheel = ({ left }: { left: number }) => (
    <div
      className="absolute -bottom-[6px] w-[14px] h-[14px] rounded-full"
      style={{
        left,
        background: "hsl(220 10% 8%)",
        boxShadow: `inset 0 0 0 2px hsl(220 10% 25%), 0 2px 4px ${shadow}`,
      }}
    />
  );

  switch (variant) {
    case "sedan":
      // Long body, full passenger cabin, two windows
      return (
        <div className="relative w-[180px] h-[44px]">
          {/* roof + cabin */}
          <div
            className="absolute top-0 left-[30px] right-[30px] h-[22px] rounded-t-[10px]"
            style={{ background: trimBg, boxShadow: `inset 0 -3px 0 ${shadow}` }}
          />
          {/* windows */}
          <div className="absolute top-[4px] left-[42px] w-[42px] h-[14px] rounded-sm" style={{ background: "hsl(210 30% 22%)" }} />
          <div className="absolute top-[4px] right-[42px] w-[42px] h-[14px] rounded-sm" style={{ background: "hsl(210 30% 22%)" }} />
          {/* body */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[24px] rounded-md"
            style={{ background: bodyBg, boxShadow: `inset 0 -4px 0 ${shadow}` }}
          >
            {Lamps}
          </div>
          <Wheel left={20} />
          <Wheel left={146} />
        </div>
      );

    case "coupe":
      // Shorter, sloped roof
      return (
        <div className="relative w-[150px] h-[42px]">
          <div
            className="absolute top-[2px] left-[34px] right-[24px] h-[20px]"
            style={{
              background: trimBg,
              clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
            }}
          />
          <div
            className="absolute top-[6px] left-[46px] right-[34px] h-[14px]"
            style={{
              background: "hsl(210 30% 22%)",
              clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[24px] rounded-md"
            style={{ background: bodyBg, boxShadow: `inset 0 -4px 0 ${shadow}` }}
          >
            {Lamps}
          </div>
          <Wheel left={16} />
          <Wheel left={118} />
        </div>
      );

    case "roadster":
      // Low convertible — no roof
      return (
        <div className="relative w-[160px] h-[36px]">
          {/* windshield */}
          <div
            className="absolute top-[4px] left-[58px] w-[26px] h-[14px]"
            style={{
              background: "hsl(210 30% 28%)",
              clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[22px] rounded-[14px]"
            style={{ background: bodyBg, boxShadow: `inset 0 -4px 0 ${shadow}` }}
          >
            {Lamps}
          </div>
          {/* fender hump */}
          <div
            className="absolute bottom-[6px] left-[14px] w-[22px] h-[14px] rounded-t-full"
            style={{ background: bodyBg }}
          />
          <div
            className="absolute bottom-[6px] right-[14px] w-[22px] h-[14px] rounded-t-full"
            style={{ background: bodyBg }}
          />
          <Wheel left={18} />
          <Wheel left={126} />
        </div>
      );

    case "truck":
      // Cab + flatbed
      return (
        <div className="relative w-[190px] h-[48px]">
          {/* cab roof */}
          <div
            className="absolute top-0 right-[10px] w-[60px] h-[24px] rounded-t-md"
            style={{ background: trimBg, boxShadow: `inset 0 -3px 0 ${shadow}` }}
          />
          <div className="absolute top-[4px] right-[18px] w-[44px] h-[16px] rounded-sm" style={{ background: "hsl(210 30% 22%)" }} />
          {/* flatbed */}
          <div
            className="absolute top-[10px] left-[6px] w-[120px] h-[14px] rounded-sm"
            style={{ background: `hsl(${body.split(" ")[0]} ${body.split(" ")[1]} 10%)` }}
          />
          {/* chassis */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[22px] rounded-sm"
            style={{ background: bodyBg, boxShadow: `inset 0 -4px 0 ${shadow}` }}
          >
            {Lamps}
          </div>
          <Wheel left={20} />
          <Wheel left={100} />
          <Wheel left={156} />
        </div>
      );

    case "taxi":
      // Checker cab — yellow with band of checkers
      return (
        <div className="relative w-[170px] h-[46px]">
          <div
            className="absolute top-0 left-[28px] right-[28px] h-[22px] rounded-t-[10px]"
            style={{ background: "hsl(45 90% 50%)", boxShadow: `inset 0 -3px 0 ${shadow}` }}
          />
          <div className="absolute top-[4px] left-[40px] right-[40px] h-[14px] rounded-sm" style={{ background: "hsl(210 30% 22%)" }} />
          {/* TAXI sign */}
          <div
            className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-[24px] h-[6px] rounded-sm flex items-center justify-center"
            style={{ background: "hsl(45 95% 55%)", boxShadow: "0 0 6px hsl(45 95% 50% / 0.7)" }}
          >
            <span style={{ fontSize: 5, color: "hsl(0 0% 10%)", fontWeight: 900, letterSpacing: 1 }}>TAXI</span>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[24px] rounded-md"
            style={{ background: "hsl(45 85% 45%)", boxShadow: `inset 0 -4px 0 ${shadow}` }}
          >
            {/* checker band */}
            <div
              className="absolute top-1/2 left-2 right-2 h-[6px] -translate-y-1/2"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, hsl(0 0% 10%) 0 6px, hsl(0 0% 95%) 6px 12px)",
              }}
            />
            {Lamps}
          </div>
          <Wheel left={18} />
          <Wheel left={138} />
        </div>
      );

    case "limo":
      // Extra long sedan with three windows
      return (
        <div className="relative w-[230px] h-[44px]">
          <div
            className="absolute top-0 left-[34px] right-[34px] h-[20px] rounded-t-[10px]"
            style={{ background: trimBg, boxShadow: `inset 0 -3px 0 ${shadow}` }}
          />
          <div className="absolute top-[4px] left-[46px] w-[40px] h-[12px] rounded-sm" style={{ background: "hsl(210 30% 22%)" }} />
          <div className="absolute top-[4px] left-[96px] w-[40px] h-[12px] rounded-sm" style={{ background: "hsl(210 30% 22%)" }} />
          <div className="absolute top-[4px] right-[46px] w-[40px] h-[12px] rounded-sm" style={{ background: "hsl(210 30% 22%)" }} />
          <div
            className="absolute bottom-0 left-0 right-0 h-[22px] rounded-md"
            style={{ background: bodyBg, boxShadow: `inset 0 -4px 0 ${shadow}` }}
          >
            {Lamps}
          </div>
          <Wheel left={22} />
          <Wheel left={120} />
          <Wheel left={194} />
        </div>
      );
  }
}

const VARIANTS: CarVariant[] = ["sedan", "coupe", "roadster", "truck", "taxi", "limo"];
const BODY_PALETTE = [
  "220 20% 14%", // near-black
  "0 45% 22%",   // oxblood
  "30 35% 25%",  // burnt umber
  "150 25% 18%", // forest
  "210 35% 22%", // navy
  "275 20% 20%", // plum
  "40 30% 35%",  // dusty tan
];
const TRIM_PALETTE = [
  "220 15% 10%",
  "0 0% 8%",
  "30 25% 18%",
  "210 25% 14%",
];

export interface SpawnedCar {
  id: number;
  variant: CarVariant;
  bodyHsl: string;
  trimHsl: string;
  direction: "ltr" | "rtl";
  x: number;
  bottomPct: number;
  scale: number;
  speed: number; // px per frame
}

let nextCarId = 1;

export function spawnRandomCar(viewportWidth: number): SpawnedCar {
  const variant = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
  // Taxi keeps its branded palette; others randomize
  const bodyHsl = variant === "taxi" ? "45 85% 45%" : BODY_PALETTE[Math.floor(Math.random() * BODY_PALETTE.length)];
  const trimHsl = TRIM_PALETTE[Math.floor(Math.random() * TRIM_PALETTE.length)];
  const direction: "ltr" | "rtl" = Math.random() < 0.5 ? "ltr" : "rtl";
  // Two lanes: far lane slightly higher and smaller (cheap perspective)
  const farLane = Math.random() < 0.45;
  const bottomPct = farLane ? 5.5 : 2;
  const scale = farLane ? 0.7 : 1;
  const speed = (1.6 + Math.random() * 1.8) * (farLane ? 0.75 : 1);
  const startX = direction === "ltr" ? -280 : viewportWidth + 40;
  return {
    id: nextCarId++,
    variant,
    bodyHsl,
    trimHsl,
    direction,
    x: startX,
    bottomPct,
    scale,
    speed: direction === "ltr" ? speed : -speed,
  };
}
