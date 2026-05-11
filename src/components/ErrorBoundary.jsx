import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Keep logs in console for debugging without crashing the whole app.
    console.error('UI runtime error caught by ErrorBoundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-sand flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <h1 className="font-serif text-4xl text-ink mb-4">Unexpected UI error</h1>
            <p className="font-sans text-sm text-ink/60 mb-8">
              The page encountered an issue and recovered in safe mode.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="font-sans text-xs tracking-widest uppercase border border-olive/35 text-olive px-5 py-2 hover:bg-olive/10 transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
