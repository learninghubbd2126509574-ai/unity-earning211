import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected application error occurred.'
    };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application ErrorBoundary caught error:', error, info);
  }

  override render() {
    if (this.state.hasError) {
      let friendlyMsg = this.state.errorMessage;
      try {
        const parsed = JSON.parse(this.state.errorMessage);
        if (parsed?.error) {
          friendlyMsg = `${parsed.error} (${parsed.operationType || 'operation'} · ${parsed.path || 'database'})`;
        }
      } catch {
        // Use raw message
      }

      return (
        <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4 font-sans">
          <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEF7E0] border border-[#F3DFA2] text-[#B47B00] flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-[#1E2329]">
                Connection or Permission Issue
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed break-words">
                {friendlyMsg}
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-2.5 px-4 rounded-lg bg-[#0A4D8C] hover:bg-[#083D70] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <RotateCcw size={14} />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
