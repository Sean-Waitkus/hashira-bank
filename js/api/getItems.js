// ═══════════════════════════════════════════════════════════════════
// QUERY: getItems — Fetches inventory from the backend, with support
// for pagination, category filtering, search, and a "mine only" mode.
// Mirrors Query_GetItems.gs on the Apps Script side.
// ═══════════════════════════════════════════════════════════════════

async function fetchItemsApi(user, params) {
  params = params || {};

  const qs = new URLSearchParams({
    action: 'getItems',
    userId: user.id,
    accessToken: user.accessToken
  });

  if (params.page) qs.set('page', params.page);
  if (params.pageSize) qs.set('pageSize', params.pageSize);
  if (params.category) qs.set('category', params.category);
  if (params.search) qs.set('search', params.search);
  if (params.mine) qs.set('mine', params.mine);

  const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?${qs.toString()}`);
  return res.json();
}
