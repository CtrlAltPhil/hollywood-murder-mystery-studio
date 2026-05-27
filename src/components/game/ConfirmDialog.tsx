import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="absolute inset-0 z-[60] bg-black/85 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        className="bg-zinc-900 border-2 border-zinc-700 p-6 rounded-lg shadow-2xl max-w-sm w-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-yellow-400 uppercase tracking-widest mb-3 text-center title-glow">
          {title}
        </h3>
        <p className="text-zinc-300 text-sm mb-6 text-center leading-relaxed">{message}</p>
        <div className="flex flex-col gap-2">
          <Button
            onClick={onConfirm}
            className={
              destructive
                ? 'w-full text-base py-5 bg-red-900/80 hover:bg-red-800 text-white border border-red-700 transition-all hover:scale-105'
                : 'w-full text-base py-5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 transition-all hover:scale-105'
            }
          >
            {confirmLabel}
          </Button>
          <Button
            onClick={onCancel}
            variant="ghost"
            className="w-full text-base py-5 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
