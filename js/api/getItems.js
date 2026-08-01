// ═══════════════════════════════════════════════════════════════════
// QUERY: getItems — Fetches the current inventory from the backend.
// Mirrors Query_GetItems.gs on the Apps Script side.
// ═══════════════════════════════════════════════════════════════════

async function fetchItemsApi(user) {
  const url = `${CONFIG.APPS_SCRIPT_URL}?action=getItems&userId=${user.id}&accessToken=${encodeURIComponent(user.accessToken)}`;
  const res = await fetch(url);
  return res.json();
}
