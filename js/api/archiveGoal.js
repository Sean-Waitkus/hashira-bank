// ═══════════════════════════════════════════════════════════════════
// QUERY: archiveGoal — Admin-only: archives (soft-deletes) a goal.
// Mirrors Query_ArchiveGoal.gs.
// ═══════════════════════════════════════════════════════════════════

async function archiveGoalApi(goalId, user) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'archiveGoal',
      id: goalId,
      userId: user.id,
      accessToken: user.accessToken
    })
  });
  return res.json();
}
