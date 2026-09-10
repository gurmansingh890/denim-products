import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-surface-container p-8 rounded border border-primary/10 shadow-lg space-y-6">
            <span className="material-symbols-outlined text-5xl text-secondary">error</span>
            <h2 className="font-headline-lg text-2xl text-primary font-bold">Something Went Wrong</h2>
            <p className="font-body-md text-sm text-on-surface-variant">
              An unexpected error occurred while rendering this page. Please try refreshing or returning to the homepage.
            </p>
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary text-white py-3 rounded font-label-md text-sm hover:bg-primary-container transition-colors"
              >
                Reload Page
              </button>
              <a
                href="/"
                className="w-full border border-outline-variant text-primary py-3 rounded font-label-md text-sm block hover:bg-surface-container-high transition-colors"
              >
                Go to Homepage
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
