// ═══════════════════════════════════════════════════════════════════
// UI: ErrorScreen — shown for any login/access failure (not in
// server, missing role, rate limited, or an unexpected error).
// ═══════════════════════════════════════════════════════════════════

function ErrorScreen({ authError, onRetry }) {
  let icon = '🚫';
  let title = 'Access Denied';
  let message = authError.message || authError.error || 'An unknown error occurred.';

  if (authError.error === 'NOT_IN_SERVER') {
    icon = '🔗';
    title = 'Not a Server Member';
  } else if (authError.error === 'INSUFFICIENT_ROLE') {
    icon = '🛡️';
    title = 'Missing Required Role';
  } else if (authError.error === 'RATE_LIMITED') {
    icon = '⏳';
    title = 'Slow Down';
    message = message || 'Too many login attempts right now. Please wait a moment and try again.';
  }

  return (
    <div className="app">
      <Header />
      <div className="error-screen fade-in">
        <div className="error-icon">{icon}</div>
        <h2>{title}</h2>
        <p>{message}</p>
        <button className="btn" onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
}
