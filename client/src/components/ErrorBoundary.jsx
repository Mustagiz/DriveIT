import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import styles from './ErrorBoundary.module.css';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('🚨 [DriveIT Global Error Boundary Caught]:', error, errorInfo);
    
    // Dispatch custom event for Sentry / Telemetry trackers
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('driveit:client-error', { 
        detail: { 
          message: error?.message || 'Unknown Error',
          stack: error?.stack,
          componentStack: errorInfo?.componentStack
        } 
      }));
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <AlertTriangle size={32} />
            </div>

            <h1 className={styles.title}>
              Something went unexpected
            </h1>

            <p className={styles.message}>
              We encountered an issue rendering this section of DriveIT. Your session state and bookings are safely preserved.
            </p>

            {this.state.error?.message && (
              <div className={styles.errorBox}>
                <strong>Error:</strong> {this.state.error.message}
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                onClick={this.handleReload}
                className={styles.reloadBtn}
              >
                <RefreshCw size={16} />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className={styles.homeBtn}
              >
                <Home size={16} />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
