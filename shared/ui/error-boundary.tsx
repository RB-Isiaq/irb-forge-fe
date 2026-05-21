"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-64 gap-4 p-8 text-center">
          <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
            <AlertTriangle size={22} className="text-warning" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-text-primary mb-1">Something went wrong</p>
            <p className="text-[13px] text-text-muted max-w-sm">
              An unexpected error occurred. Try refreshing or contact support if the problem
              persists.
            </p>
          </div>
          <button
            type="button"
            onClick={this.reset}
            className="px-4 py-2 rounded-lg border border-border text-[13px] font-medium text-text-secondary hover:bg-gray-100 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
