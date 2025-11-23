'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '20px',
                }}>
                    <div style={{
                        maxWidth: '500px',
                        textAlign: 'center',
                    }}>
                        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>
                            Application Error
                        </h2>
                        <p style={{ color: '#666', marginBottom: '24px' }}>
                            A critical error occurred. Please refresh the page.
                        </p>
                        {process.env.NODE_ENV === 'development' && (
                            <div style={{
                                marginBottom: '24px',
                                padding: '12px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px',
                                textAlign: 'left',
                                fontSize: '14px',
                                color: '#ff0000',
                            }}>
                                {error.message}
                            </div>
                        )}
                        <button
                            onClick={reset}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}