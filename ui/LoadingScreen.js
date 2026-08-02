// ═══════════════════════════════════════════════════════════════════
// UI: LoadingScreen — shown while exchanging the Discord auth code.
// ═══════════════════════════════════════════════════════════════════

function LoadingScreen() {
  return (
    <div className="app">
      <Header />
      <div className="loading"><div className="spinner"></div>Authenticating with Discord...</div>
    </div>
  );
}
