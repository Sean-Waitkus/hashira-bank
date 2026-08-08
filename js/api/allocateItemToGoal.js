// ═══════════════════════════════════════════════════════════════════
// QUERY: allocateItemToGoal — Admin-only: links a general inventory
// item to a goal need, or clears an existing link (pass an empty
// targetGoalItemId). Mirrors Query_AllocateItemToGoal.gs.
// ═══════════════════════════════════════════════════════════════════

async function allocateItemToGoalApi(inventoryItemId, targetGoalItemId, user) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'allocateItemToGoal',
      inventoryItemId: inventoryItemId,
      targetGoalItemId: targetGoalItemId || '',
      userId: user.id,
      accessToken: user.accessToken
    })
  });
  return res.json();
}
