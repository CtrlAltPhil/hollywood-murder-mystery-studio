import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReturnToTitle = () => {
    // Best-effort: clear in-memory state by reloading; saves are intact.
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="w-full h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-md border-2 border-zinc-700 bg-zinc-900 p-8 rounded-lg shadow-2xl">
          <h1 className="text-2xl font-bold text-yellow-400 uppercase tracking-widest mb-4">
            Something went wrong
          </h1>
          <p className="text-zinc-300 text-sm mb-2">
            The detective tripped over a loose floorboard. Your saved games are safe.
          </p>
          {this.state.error?.message && (
            <p className="text-zinc-500 text-xs italic mb-6 break-words">
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={this.handleReload}
            className="w-full text-lg py-3 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 rounded transition-all hover:scale-105 cursor-pointer"
          >
            RELOAD
          </button>
        </div>
      </div>
    );
  }
}
