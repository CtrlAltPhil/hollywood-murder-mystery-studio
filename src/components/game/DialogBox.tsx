import { useState, useEffect, useCallback } from 'react';
import { DialogNode, DialogOption } from '@/types/game';

interface DialogBoxProps {
  node: DialogNode;
  isRevisit?: boolean;
  onOptionSelect: (option: DialogOption) => void;
  onContinue: () => void;
  playDialogBlip?: (speaker: string) => void;
}

export function DialogBox({ node, isRevisit, onOptionSelect, onContinue, playDialogBlip }: DialogBoxProps) {
  // Use shortText on revisit if available
  const activeText = isRevisit && node.shortText ? node.shortText : node.text;

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayedText(activeText.slice(0, index));
      if (playDialogBlip && activeText[index - 1] !== ' ') {
        playDialogBlip(node.speaker);
      }
      if (index >= activeText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [node.id, activeText]);

  const skipTyping = useCallback(() => {
    if (isTyping) {
      setDisplayedText(activeText);
      setIsTyping(false);
    }
  }, [isTyping, activeText]);

  const hasOptions = node.options && node.options.length > 0;

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 flex justify-center pointer-events-none">
      {/* Backdrop click to skip typewriter */}
      {isTyping && (
        <div className="absolute inset-0 pointer-events-auto" onClick={skipTyping} />
      )}

      <div className="relative pointer-events-auto w-[92%] max-w-3xl mb-3 bg-zinc-900/85 backdrop-blur-sm border-2 border-amber-500/60 rounded-md p-4 shadow-[0_0_18px_hsla(0,0%,0%,0.6)]">
        {/* Speaker name */}
        <div className="mb-2">
          <span
            className="text-amber-400 font-bold text-sm uppercase tracking-wider"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            {node.speaker}
          </span>
        </div>

        {/* Speech text */}
        <div
          className="text-zinc-100 text-sm leading-relaxed mb-3 min-h-[3rem] cursor-pointer"
          style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px', lineHeight: '1.8' }}
          onClick={skipTyping}
        >
          {displayedText}
          {isTyping && <span className="animate-pulse text-amber-400">▌</span>}
        </div>

        {/* Options or Continue */}
        {!isTyping && (
          <div className="space-y-1">
            {hasOptions ? (
              node.options!.map((option, i) => (
                <button
                  key={i}
                  onClick={() => onOptionSelect(option)}
                  className="block w-full text-left px-3 py-2 text-amber-300 hover:text-amber-100 hover:bg-amber-500/20 rounded transition-colors"
                  style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', lineHeight: '1.6' }}
                >
                  {`${i + 1}. ${option.text}`}
                </button>
              ))
            ) : (
              <button
                onClick={onContinue}
                className="block w-full text-center px-3 py-2 text-amber-400 hover:text-amber-200 animate-pulse"
                style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px' }}
              >
                ▸ Click to continue ◂
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
