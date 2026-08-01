// ═══════════════════════════════════════════════════════════════════
// QUERY: updateLocations — Bulk-updates the current user's own item
// storage/home locations after a patch. Mirrors Query_UpdateLocations.gs.
// ═══════════════════════════════════════════════════════════════════

async function updateLocationsApi(mode, storageLocation, homeLocation, user) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'updateLocations',
      mode: mode,
      storageLocation: storageLocation,
      homeLocation: homeLocation,
      userId: user.id,
      accessToken: user.accessToken
    })
  });
  return res.json();
}
