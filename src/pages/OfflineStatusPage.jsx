
// components/common/ErrorBoundary.jsx
import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('Page crashed:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="p-6 text-red-700">
          <h2 className="font-bold">Something went wrong</h2>
          <pre className="text-xs whitespace-pre-wrap">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}