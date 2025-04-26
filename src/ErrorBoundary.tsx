import { Component, ErrorInfo, ReactNode } from 'react';

interface State {
  hasError: boolean;
}

interface Props {
  children: ReactNode;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state to indicate an error occurred
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log('Error caught in boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return <h1>Error: Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
