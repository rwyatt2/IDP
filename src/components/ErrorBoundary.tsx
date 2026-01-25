import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button, Card } from '@/components/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-danger-100 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-danger-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-500 mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {this.state.error && (
              <pre className="text-left text-xs bg-slate-100 rounded-lg p-4 mb-6 overflow-auto max-h-32 text-slate-600">
                {this.state.error.message}
              </pre>
            )}
            <Button
              variant="primary"
              onClick={this.handleReset}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh Page
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <Card className="p-6 text-center">
      <AlertTriangle className="w-8 h-8 text-danger-500 mx-auto mb-4" />
      <h3 className="font-semibold text-slate-900 mb-2">Failed to load</h3>
      <p className="text-sm text-slate-500 mb-4">{error.message}</p>
      <Button variant="secondary" size="sm" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </Card>
  );
}
