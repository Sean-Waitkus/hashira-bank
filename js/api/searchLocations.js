// ═══════════════════════════════════════════════════════════════════
// QUERY: searchLocations — Fetches matching locations for a search
// string, used to power autocomplete. Now requires a logged-in,
// role-verified user (see Router.gs) — the location data itself is
// public, but the endpoint no longer is, since an open URL is still
// attack surface for Apps Script quota abuse.
//
// Pass primary=true to restrict results to major/primary locations
// only (uses the searchPrimaryLocations action) — used for home
// location fields, where every minor sub-outpost isn't a sensible
// choice of "where a member lives."
// ═══════════════════════════════════════════════════════════════════

async function searchLocationsApi(query, user, primary) {
  const action = primary ? 'searchPrimaryLocations' : 'searchLocations';
  const url = `${CONFIG.APPS_SCRIPT_URL}?action=${action}&query=${encodeURIComponent(query || '')}&accessToken=${encodeURIComponent(user.accessToken)}`;
  const res = await fetch(url);
  return res.json();
}
