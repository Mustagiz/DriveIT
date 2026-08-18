import React from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    
    // Auto-reload once if dynamic import chunk failed after a new deployment
    if (error?.message && (
      error.message.includes('Loading chunk') || 
      error.message.includes('dynamically imported module') ||
      error.message.includes('Importing a module script failed')
    )) {
      const hasReloaded = sessionStorage.getItem('driveit_chunk_reload');
      if (!hasReloaded) {
        sessionStorage.setItem('driveit_chunk_reload', 'true');
        window.location.reload();
      }
    }
  }

  handleGoHome = () => {
    try {
      localStorage.removeItem('driveit_saved_page');
      localStorage.removeItem('driveit_saved_ride_id');
      sessionStorage.removeItem('driveit_chunk_reload');
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.origin + '/#/';
    window.location.reload();
  };

  handleRefresh = () => {
    try {
      sessionStorage.removeItem('driveit_chunk_reload');
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '40px 20px',
          textAlign: 'center',
          background: '#F8FAFC'
        }}>
          <div style={{
            background: '#FEF2F2',
            borderRadius: '50%',
            width: '68px',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: '#DC2626',
            boxShadow: '0 8px 24px rgba(220, 38, 38, 0.15)'
          }}>
            <ShieldAlert size={34} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748B', marginBottom: '24px', maxWidth: '440px', lineHeight: 1.5 }}>
            We hit an unexpected error while loading this page. Please try refreshing or return to the homepage.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={this.handleRefresh}
              style={{
                background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                color: '#000000',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '14px',
                fontWeight: '900',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(132, 204, 22, 0.35)'
              }}
            >
              <RefreshCw size={15} />
              <span>Refresh Page</span>
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              style={{
                background: '#FFFFFF',
                color: '#0F172A',
                border: '1.5px solid #CBD5E1',
                padding: '12px 24px',
                borderRadius: '14px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <Home size={15} />
              <span>Go Home</span>
            </button>
          </div>

          {/* Prominent Error Details Banner */}
          {this.state.error && (
            <div style={{
              marginTop: '28px',
              maxWidth: '680px',
              width: '100%',
              background: '#0F172A',
              color: '#F8FAFC',
              borderRadius: '16px',
              padding: '16px 20px',
              textAlign: 'left',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#EF4444', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Diagnostics Error Report
                </span>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = window.location.origin + '/#/';
                    window.location.reload();
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #EF4444',
                    color: '#EF4444',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Purge Cache & Reload ⚡
                </button>
              </div>
              <pre style={{
                margin: 0,
                fontSize: '11.5px',
                color: '#FCA5A5',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: '1.45',
                fontFamily: 'monospace'
              }}>
                {this.state.error?.stack || this.state.error?.message || String(this.state.error)}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

