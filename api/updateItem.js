// ═══════════════════════════════════════════════════════════════════
// QUERY: updateItem — Patches fields on an existing item.
// Mirrors Query_UpdateItem.gs on the Apps Script side.
// ═══════════════════════════════════════════════════════════════════

async function updateItemApi(fields, user) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'updateItem',
      ...fields,
      userId: user.id,
      accessToken: user.accessToken
    })
  });
  return res.json();
}
