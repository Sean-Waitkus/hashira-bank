// ═══════════════════════════════════════════════════════════════════
// CONFIG — Update these for your deployment. This is a plain script
// (no JSX), loaded before everything else so CONFIG is available
// globally to every other file on the page.
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  // Google Apps Script web app URL (after deploying)
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxylZelaJ1KMI5xdHj2BDRdksix3nsycJYW_0G8bYoJBtZGpyVHmRZPhhKS1y1WeTuVkw/exec',

  // Discord OAuth — Client ID only (secret stays on backend)
  DISCORD_CLIENT_ID: '1533142397758734356',
  DISCORD_REDIRECT_URI: 'https://sean-waitkus.github.io/hashira-bank/',

  // Your org name
  ORG_NAME: 'Hashira-o7',

  // Item categories — keep this in sync with CATEGORIES in the
  // Apps Script backend's Config.gs
  CATEGORIES: [
    'Ship Components',
    'FPS Weapons & Armor',
    'Mining/Salvage Materials',
    'Commodities & Trade Goods',
    'aUEC',
    'Wikelo',
    'Other'
  ],

  CATEGORY_COLORS: {
    'Ship Components': '#38bdf8',
    'FPS Weapons & Armor': '#f87171',
    'Mining/Salvage Materials': '#fbbf24',
    'Commodities & Trade Goods': '#34d399',
    'aUEC': '#2dd4bf',
    'Wikelo': '#f472b6',
    'Other': '#a78bfa'
  }
};