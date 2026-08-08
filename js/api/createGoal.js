// ═══════════════════════════════════════════════════════════════════
// QUERY: createGoal — Admin-only: creates a new community goal.
// Mirrors Query_CreateGoal.gs.
// ═══════════════════════════════════════════════════════════════════

async function createGoalApi(title, description, items, user) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      action: 'createGoal',
      title: title,
      description: description,
      items: items,
      contributor: user.displayName || user.username,
      userId: user.id,
      accessToken: user.accessToken
    })
  });
  return res.json();
}
