import { useEffect } from "react";

interface LetterOverlayProps {
  title: string;
  body: string; // can include line breaks via \n\n
  signature?: string;
  onClose: () => void;
}

// A full-screen "read this document" overlay used when the player chooses
// to Look at a paper-style inventory item (e.g. the Talent Inheritance
// Agreement). Click anywhere or press Escape to dismiss.
export function LetterOverlay({ title, body, signature, onClose }: LetterOverlayProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center cursor-pointer p-6"
      onClick={onClose}
    >
      {/* Aged paper */}
      <div
        className="relative w-[80%] max-w-2xl max-h-[85%] overflow-y-auto px-10 py-8 shadow-[0_20px_60px_hsla(0,0%,0%,0.8)]"
        style={{
          background:
            "linear-gradient(135deg, hsl(40, 35%, 88%) 0%, hsl(38, 30%, 80%) 100%)",
          border: "2px solid hsl(35, 40%, 35%)",
          color: "hsl(25, 40%, 15%)",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "10px",
          lineHeight: "1.9",
          imageRendering: "pixelated",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="text-center mb-6 pb-3 border-b-2"
          style={{ borderColor: "hsl(35, 40%, 35%)", fontSize: "12px" }}
        >
          {title}
        </div>

        {body.split("\n\n").map((para, i) => (
          <p key={i} className="mb-4">
            {para}
          </p>
        ))}

        {signature && (
          <div
            className="mt-6 pt-3 text-right italic"
            style={{ borderTop: "1px dashed hsl(35, 40%, 35%)" }}
          >
            {signature}
          </div>
        )}

        <div
          className="absolute bottom-2 right-4 animate-pulse"
          style={{ fontSize: "8px", color: "hsl(25, 40%, 30%)" }}
        >
          ▼ click to close
        </div>
      </div>
    </div>
  );
}
