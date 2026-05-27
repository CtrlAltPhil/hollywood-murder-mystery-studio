import { useMemo } from "react";

interface LightningBoltProps {
  /** Horizontal anchor as % of viewport */
  xPct: number;
  /** Bottom anchor as % (where the bolt stops); top is always 0 */
  endYPct: number;
  /** Branching seed — different per strike for variety */
  seed: number;
  /** Opacity of the bolt itself (the flash overlay is separate) */
  opacity: number;
}

/**
 * Procedurally generated forked lightning bolt.
 *
 * The main trunk is a jagged polyline from the top of the screen
 * down to endYPct. A handful of branches fork off at random nodes.
 * Rendered as SVG with a glow filter so it reads as a real bolt
 * rather than a CSS line.
 */
export function LightningBolt({ xPct, endYPct, seed, opacity }: LightningBoltProps) {
  const { trunk, branches, filterId } = useMemo(() => buildBolt(seed), [seed]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ opacity, mixBlendMode: "screen" }}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        transform={`translate(${xPct} 0) scale(1 ${endYPct / 100})`}
        filter={`url(#${filterId})`}
      >
        {/* Outer glow */}
        <polyline
          points={trunk}
          fill="none"
          stroke="hsl(210 100% 75% / 0.55)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bright core */}
        <polyline
          points={trunk}
          fill="none"
          stroke="hsl(0 0% 100%)"
          strokeWidth="0.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {branches.map((b, i) => (
          <g key={i}>
            <polyline
              points={b}
              fill="none"
              stroke="hsl(210 100% 80% / 0.45)"
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={b}
              fill="none"
              stroke="hsl(0 0% 100%)"
              strokeWidth="0.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

function buildBolt(seed: number) {
  const rand = mulberry32(seed);
  // Build trunk: zig-zag from y=0 to y=100 in the local coordinate system.
  // Horizontal jitter accumulates so the bolt drifts naturally.
  const trunkPts: Array<[number, number]> = [];
  let x = 0;
  const segments = 14;
  for (let i = 0; i <= segments; i++) {
    const y = (i / segments) * 100;
    if (i !== 0 && i !== segments) {
      x += (rand() - 0.5) * 6; // drift
    }
    trunkPts.push([x, y]);
  }

  // Branches: 1–3 forks at random interior nodes
  const branchCount = 1 + Math.floor(rand() * 3);
  const branches: string[] = [];
  for (let b = 0; b < branchCount; b++) {
    const startIdx = 2 + Math.floor(rand() * (trunkPts.length - 4));
    const [bx, by] = trunkPts[startIdx];
    const direction = rand() < 0.5 ? -1 : 1;
    const branchPts: Array<[number, number]> = [[bx, by]];
    let cx = bx;
    let cy = by;
    const len = 3 + Math.floor(rand() * 4);
    for (let i = 0; i < len; i++) {
      cx += direction * (1 + rand() * 2);
      cy += 2 + rand() * 3;
      if (cy > 100) break;
      branchPts.push([cx, cy]);
    }
    branches.push(branchPts.map(([px, py]) => `${px.toFixed(2)},${py.toFixed(2)}`).join(" "));
  }

  return {
    trunk: trunkPts.map(([px, py]) => `${px.toFixed(2)},${py.toFixed(2)}`).join(" "),
    branches,
    filterId: `lightning-glow-${seed}`,
  };
}

// Deterministic small PRNG so a given seed always yields the same bolt
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
