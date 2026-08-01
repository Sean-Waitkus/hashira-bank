// ═══════════════════════════════════════════════════════════════════
// QUERY: addItems — Submits a batch of new items to the backend.
// Mirrors Query_AddItem.gs on the Apps Script side.
// ═══════════════════════════════════════════════════════════════════

async function submitItemsApi(items, user) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'addItems',
      items: items,
      contributor: user.displayName || user.username,
      userId: user.id,
      accessToken: user.accessToken
    })
  });
  return res.json();
}
