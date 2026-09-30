import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard ErrorBoundary caught error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 bg-white border border-rose-300 rounded-[2px] shadow-sm">
          <div className="flex items-center gap-2 text-rose-700 font-bold mb-2">
            <AlertTriangle size={20} />
            <span>Something went wrong while rendering this section.</span>
          </div>
          <p className="text-xs text-slate-600 mb-4 font-mono bg-slate-50 p-2.5 rounded-[2px] border border-slate-200">
            {this.state.error?.toString()}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="btn-classic text-xs flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
          >
            <RefreshCw size={13} />
            <span>Reload Module</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
