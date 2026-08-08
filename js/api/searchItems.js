// ═══════════════════════════════════════════════════════════════════
// QUERY: searchItems — Fetches matching items for a search string,
// used to power item name autocomplete. Mirrors searchLocations.js.
// Requires a logged-in, role-verified user.
// ═══════════════════════════════════════════════════════════════════

async function searchItemsApi(query, user) {
  const url = `${CONFIG.APPS_SCRIPT_URL}?action=searchItems&query=${encodeURIComponent(query || '')}&accessToken=${encodeURIComponent(user.accessToken)}`;
  const res = await fetch(url);
  return res.json();
}
