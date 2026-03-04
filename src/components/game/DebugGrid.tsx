interface DebugGridProps {
  visible: boolean;
}

export function DebugGrid({ visible }: DebugGridProps) {
  if (!visible) return null;

  // 5% grid = 20 columns x 20 rows
  const cols = 20;
  const rows = 20;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {/* Vertical lines */}
      {Array.from({ length: cols + 1 }, (_, i) => (
        <div
          key={`v${i}`}
          className="absolute top-0 bottom-0"
          style={{
            left: `${i * 5}%`,
            width: '1px',
            background: i % 4 === 0 ? 'rgba(255,255,0,0.4)' : 'rgba(255,255,255,0.15)',
          }}
        >
          {i % 2 === 0 && (
            <span className="absolute top-0 text-[7px] text-yellow-300/80 bg-black/60 px-0.5 leading-none">
              {i * 5}
            </span>
          )}
        </div>
      ))}
      {/* Horizontal lines */}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <div
          key={`h${i}`}
          className="absolute left-0 right-0"
          style={{
            top: `${i * 5}%`,
            height: '1px',
            background: i % 4 === 0 ? 'rgba(255,255,0,0.4)' : 'rgba(255,255,255,0.15)',
          }}
        >
          {i % 2 === 0 && (
            <span className="absolute left-0 text-[7px] text-yellow-300/80 bg-black/60 px-0.5 leading-none">
              {i * 5}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
