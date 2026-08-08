// ═══════════════════════════════════════════════════════════════════
// QUERY: getGoals — Fetches community goals from the backend.
// Mirrors Query_GetGoals.gs.
// ═══════════════════════════════════════════════════════════════════

async function fetchGoalsApi(user) {
  const url = `${CONFIG.APPS_SCRIPT_URL}?action=getGoals&userId=${user.id}&accessToken=${encodeURIComponent(user.accessToken)}`;
  const res = await fetch(url);
  return res.json();
}
