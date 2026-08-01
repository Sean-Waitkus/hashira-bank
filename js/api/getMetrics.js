// ═══════════════════════════════════════════════════════════════════
// QUERY: getMetrics — Admin-only: fetches contribution totals by
// user by category. Mirrors Query_GetMetrics.gs.
// ═══════════════════════════════════════════════════════════════════

async function fetchMetricsApi(user) {
  const url = `${CONFIG.APPS_SCRIPT_URL}?action=getMetrics&userId=${user.id}&accessToken=${encodeURIComponent(user.accessToken)}`;
  const res = await fetch(url);
  return res.json();
}
