import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // You could also log to an external service here
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: '#fff', background: '#111', minHeight: '100vh' }}>
          <h2 style={{ color: '#ff6b6b' }}>Something went wrong</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#ddd' }}>{String(this.state.error && this.state.error.toString())}</pre>
          <details style={{ color: '#999' }}>
            {this.state.info && this.state.info.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
