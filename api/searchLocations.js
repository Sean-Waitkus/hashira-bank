// ═══════════════════════════════════════════════════════════════════
// QUERY: searchLocations — Fetches matching locations for a search
// string, used to power autocomplete. Unauthenticated, matching the
// backend's design (static reference data, not org data).
// ═══════════════════════════════════════════════════════════════════

async function searchLocationsApi(query) {
  const url = `${CONFIG.APPS_SCRIPT_URL}?action=searchLocations&query=${encodeURIComponent(query || '')}`;
  const res = await fetch(url);
  return res.json();
}
