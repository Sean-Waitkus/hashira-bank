// ═══════════════════════════════════════════════════════════════════
// QUERY: searchLocations — Fetches matching locations for a search
// string, used to power autocomplete. Now requires a logged-in,
// role-verified user (see Router.gs) — the location data itself is
// public, but the endpoint no longer is, since an open URL is still
// attack surface for Apps Script quota abuse.
// ═══════════════════════════════════════════════════════════════════

async function searchLocationsApi(query, user) {
  const url = `${CONFIG.APPS_SCRIPT_URL}?action=searchLocations&query=${encodeURIComponent(query || '')}&accessToken=${encodeURIComponent(user.accessToken)}`;
  const res = await fetch(url);
  return res.json();
}
