import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: "'Outfit', sans-serif",
          backgroundColor: '#F8FBFA',
          color: '#111414',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            backgroundColor: '#111414',
            border: '2px solid #65B7BB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(101, 183, 187, 0.25)'
          }}>
            <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>UP</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '10px' }}>
            BITE UP
          </h1>
          <p style={{ color: 'rgba(17, 20, 20, 0.7)', maxWidth: '420px', marginBottom: '24px', lineHeight: 1.5, fontSize: '0.95rem' }}>
            Something went wrong while loading. Please refresh to try again.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#65B7BB',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(101, 183, 187, 0.4)'
              }}
            >
              RELOAD WEBSITE
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                } catch {}
                window.location.reload();
              }}
              style={{
                backgroundColor: '#111414',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              RESET CACHE & RELOAD
            </button>
          </div>
          {this.state.error?.message && (
            <details style={{ marginTop: '20px', maxWidth: '420px', textAlign: 'left', fontSize: '0.78rem', color: 'rgba(17, 20, 20, 0.6)' }}>
              <summary style={{ cursor: 'pointer', textAlign: 'center' }}>Technical Details</summary>
              <pre style={{ marginTop: '8px', padding: '10px', background: '#eef4f4', borderRadius: '8px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
