// ═══════════════════════════════════════════════════════════════════
// QUERY: reorderGoals — Admin-only: sets goal priority order.
// Mirrors Query_ReorderGoals.gs.
// ═══════════════════════════════════════════════════════════════════

async function reorderGoalsApi(orderedIds, user) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'reorderGoals',
      orderedIds: orderedIds,
      userId: user.id,
      accessToken: user.accessToken
    })
  });
  return res.json();
}
