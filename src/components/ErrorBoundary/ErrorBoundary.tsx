import { Component, type ReactNode, type ErrorInfo } from 'react';
import './ErrorBoundary.css';
import * as types from './ErrorBoundary.types';

export class ErrorBoundary extends Component<
  types.ErrorBoundaryProps,
  types.ErrorBoundaryState
> {
  constructor(props: types.ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<types.ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='error-boundary'>
          <div className='error-boundary-content'>
            <div className='error-boundary-icon' aria-hidden='true'>
              ⚠️
            </div>
            <h2 className='error-boundary-title'>Something went wrong</h2>
            <p className='error-boundary-message'>
              We encountered an unexpected error. Please refresh the page to try
              again.
            </p>
            <button
              type='button'
              className='error-boundary-button'
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
