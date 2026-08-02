// ═══════════════════════════════════════════════════════════════════
// CONFIG — Update these for your deployment. This is a plain script
// (no JSX), loaded before everything else so CONFIG is available
// globally to every other file on the page.
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  // Google Apps Script web app URL (after deploying)
  APPS_SCRIPT_URL: 'YOUR_APPS_SCRIPT_WEB_APP_URL',

  // Discord OAuth — Client ID only (secret stays on backend)
  DISCORD_CLIENT_ID: 'YOUR_DISCORD_CLIENT_ID',
  DISCORD_REDIRECT_URI: window.location.origin + window.location.pathname,

  // Your org name
  ORG_NAME: 'Hashira-o7',

  // Item categories — keep this in sync with CATEGORIES in the
  // Apps Script backend's Config.gs
  CATEGORIES: [
    'Ship Components',
    'FPS Weapons & Armor',
    'Mining/Salvage Materials',
    'Commodities & Trade Goods',
    'Wikelo',
    'Other'
  ],

  CATEGORY_COLORS: {
    'Ship Components': '#38bdf8',
    'FPS Weapons & Armor': '#f87171',
    'Mining/Salvage Materials': '#fbbf24',
    'Commodities & Trade Goods': '#34d399',
    'Wikelo': '#f472b6',
    'Other': '#a78bfa'
  }
};
