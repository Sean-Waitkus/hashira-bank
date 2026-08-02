// ═══════════════════════════════════════════════════════════════════
// QUERY: transferItem — Admin-only: take or release custody of an
// item. The recipient is always the currently logged-in admin (the
// backend derives it from their verified access token) — there's no
// "who to transfer to" field, so only a bank admin can ever be the
// recipient. Mirrors Query_TransferItem.gs.
// ═══════════════════════════════════════════════════════════════════

async function transferItemApi(itemId, release, user) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'transferItem',
      id: itemId,
      release: !!release,
      userId: user.id,
      accessToken: user.accessToken
    })
  });
  return res.json();
}
