// ═══════════════════════════════════════════════════════════════════
// QUERY: transferGoalContribution — Admin-only: moves a confirmed
// item's credit from one goal to another that needs the same item.
// Mirrors Query_TransferGoalContribution.gs.
// ═══════════════════════════════════════════════════════════════════

async function transferGoalContributionApi(inventoryItemId, targetGoalItemId, user) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'transferGoalContribution',
      inventoryItemId: inventoryItemId,
      targetGoalItemId: targetGoalItemId,
      userId: user.id,
      accessToken: user.accessToken
    })
  });
  return res.json();
}
