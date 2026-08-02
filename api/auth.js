// ═══════════════════════════════════════════════════════════════════
// AUTH — Discord OAuth: building the login URL, reading the
// authorization code back from the redirect, and exchanging it via
// our Apps Script backend. Plain JS (no JSX).
// ═══════════════════════════════════════════════════════════════════

function getDiscordAuthUrl() {
  const params = new URLSearchParams({
    client_id: CONFIG.DISCORD_CLIENT_ID,
    redirect_uri: CONFIG.DISCORD_REDIRECT_URI,
    response_type: 'code',  // Authorization code flow (not implicit)
    scope: 'identify guilds.members.read'
  });
  return `https://discord.com/api/oauth2/authorize?${params}`;
}

// Extract ?code= from URL after Discord redirect
function getAuthCode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('code');
}

// Exchange the code via our Apps Script backend
async function authenticateWithCode(code) {
  const url = `${CONFIG.APPS_SCRIPT_URL}?action=auth&code=${encodeURIComponent(code)}`;
  const res = await fetch(url);
  return res.json();
}
