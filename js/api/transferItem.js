// ═══════════════════════════════════════════════════════════════════
// QUERY: transferItem — Admin-only: records which admin an item's
// custody was transferred to. Mirrors Query_TransferItem.gs.
// ═══════════════════════════════════════════════════════════════════

async function transferItemApi(itemId, transferredTo, user) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'transferItem',
      id: itemId,
      transferredTo: transferredTo,
      userId: user.id,
      accessToken: user.accessToken
    })
  });
  return res.json();
}
