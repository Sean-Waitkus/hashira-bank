// ═══════════════════════════════════════════════════════════════════
// UI: LoginScreen — the "Sign in with Discord" entry point.
// ═══════════════════════════════════════════════════════════════════

function LoginScreen() {
  return (
    <div className="app">
      <Header />
      <div className="login-screen fade-in">
        <div className="lock-icon">🔒</div>
        <p>Sign in with Discord to access the Hashira-o7 guild bank. You must be a member of the org's Discord server with the required role.</p>
        <button className="btn btn-discord" onClick={() => window.location.href = getDiscordAuthUrl()}>
          ⬡ Sign in with Discord
        </button>
      </div>
    </div>
  );
}
