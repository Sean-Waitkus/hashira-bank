// ═══════════════════════════════════════════════════════════════════
// QUERY: contributeToGoal — Any authenticated member can contribute
// toward a goal item. Mirrors Query_ContributeToGoal.gs.
// ═══════════════════════════════════════════════════════════════════

async function contributeToGoalApi(goalId, goalItemId, quantity, user) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'contributeToGoal',
      goalId: goalId,
      goalItemId: goalItemId,
      quantity: quantity,
      contributor: user.displayName || user.username,
      userId: user.id,
      accessToken: user.accessToken
    })
  });
  return res.json();
}
