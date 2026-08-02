// ═══════════════════════════════════════════════════════════════════
// App — Top-level component. Holds all state and handlers, and
// delegates rendering to the UI components (Header, LoginScreen,
// ErrorScreen, UserBar, NavTabs, InventoryTab, SubmitTab, MyItemsTab,
// UpdateLocationsTab, MetricsTab) and data calls to the API files.
//
// NOTE on data freshness strategy:
// - Inventory is paginated + filtered/searched SERVER-SIDE (see
//   Query_GetItems.gs), so `items` only ever holds the current page.
// - Single-item mutations (confirm, delete, transfer) patch `items`
//   and `myItems` directly instead of refetching the whole list —
//   there's no reason to re-fetch 30 items to reflect a change to one.
// - Adding items and bulk location updates DO trigger a real refetch,
//   since those can change sort order / which page something belongs
//   on / affect many rows at once — trying to patch those locally
//   would mean re-implementing the backend's filter+sort logic here.
// - My Items is fetched separately (unpaginated) whenever that tab is
//   opened, since a member's own items shouldn't be limited to
//   whatever page of the main Inventory happens to be loaded.
// ═══════════════════════════════════════════════════════════════════

const { useState, useEffect, useCallback, useRef } = React;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [tab, setTab] = useState('inventory');

  // ── Inventory (paginated) ──
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 30, totalItems: 0, totalPages: 1 });
  const [stats, setStats] = useState({ totalListings: 0, totalItems: 0, contributors: 0 });
  const [catCounts, setCatCounts] = useState({});
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const searchDebounceRef = useRef(null);

  // ── My Items (separate, unpaginated, fetched lazily on tab open) ──
  const [myItems, setMyItems] = useState([]);
  const [myItemsLoading, setMyItemsLoading] = useState(false);

  // ── Submit form ──
  const emptyItemRow = () => ({
    itemName: '', category: CONFIG.CATEGORIES[0], quantity: 1, notes: '', inGameName: '',
    storageLocation: '', homeLocation: ''
  });
  const [batchItems, setBatchItems] = useState([emptyItemRow()]);
  const [formStatus, setFormStatus] = useState(null);

  // ── Update Locations ──
  const [locationStatus, setLocationStatus] = useState(null);
  const [locationResult, setLocationResult] = useState(null);

  // ── Metrics (admin-only) ──
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  // ── Auth Flow ──
  useEffect(() => {
    const code = getAuthCode();

    if (code) {
      window.history.replaceState(null, '', window.location.pathname);

      authenticateWithCode(code)
        .then(result => {
          if (result.success) {
            setUser(result.user);
            sessionStorage.setItem('guild_user', JSON.stringify(result.user));
          } else {
            setAuthError(result);
          }
          setLoading(false);
        })
        .catch(err => {
          setAuthError({ error: 'NETWORK_ERROR', message: 'Failed to connect to the server. Please try again.' });
          setLoading(false);
        });
    } else {
      const stored = sessionStorage.getItem('guild_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
      setLoading(false);
    }
  }, []);

  // ── Fetch Inventory (paginated + filtered) ──
  const fetchInventory = useCallback(async (overrides) => {
    setItemsLoading(true);
    const params = {
      page: overrides?.page ?? page,
      pageSize: 30,
      category: overrides?.category ?? filterCategory,
      search: overrides?.search ?? searchQuery
    };
    try {
      const data = await fetchItemsApi(user, params);
      if (data.error === 'ACCESS_DENIED') {
        setAuthError({ error: 'ACCESS_REVOKED', message: 'Your access has been revoked. Your server role may have changed.' });
        setUser(null);
        sessionStorage.removeItem('guild_user');
      } else if (data.error === 'RATE_LIMITED' || data.error === 'ROLE_CHECK_FAILED') {
        console.warn('Could not refresh inventory:', data.message || data.error);
      } else if (data.success) {
        setItems(data.items || []);
        setPagination(data.pagination || { page: 1, pageSize: 30, totalItems: 0, totalPages: 1 });
        setStats(data.stats || { totalListings: 0, totalItems: 0, contributors: 0 });
        setCatCounts(data.catCounts || {});
      }
    } catch (e) {
      console.error('Failed to fetch items:', e);
    }
    setItemsLoading(false);
  }, [user, page, filterCategory, searchQuery]);

  useEffect(() => {
    if (user) fetchInventory({ page: 1 });
  }, [user]);

  // ── Category filter (resets to page 1) ──
  const handleCategoryChange = (cat) => {
    setFilterCategory(cat);
    setPage(1);
    fetchInventory({ category: cat, page: 1 });
  };

  // ── Search (debounced, resets to page 1) ──
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setPage(1);
      fetchInventory({ search: value, page: 1 });
    }, 350);
  };

  // ── Pagination controls ──
  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchInventory({ page: newPage });
  };

  // ── Fetch My Items (unpaginated, lazy-loaded when tab opens) ──
  const fetchMyItems = useCallback(async () => {
    setMyItemsLoading(true);
    try {
      const data = await fetchItemsApi(user, { mine: user.id });
      if (data.success) {
        setMyItems(data.items || []);
      }
    } catch (e) {
      console.error('Failed to fetch my items:', e);
    }
    setMyItemsLoading(false);
  }, [user]);

  useEffect(() => {
    if (tab === 'myitems' && user) {
      fetchMyItems();
    }
  }, [tab, user, fetchMyItems]);

  // ── Submit Batch Form Helpers ──
  const updateBatchRow = (index, field, value) => {
    setBatchItems(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const addBatchRow = () => {
    setBatchItems(prev => [...prev, emptyItemRow()]);
  };

  const removeBatchRow = (index) => {
    setBatchItems(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== index));
  };

  // Adding items changes sort order/pagination in a way that's not
  // safe to patch locally, so this is the one write action that still
  // does a real refetch (of both the inventory and, if loaded, My Items).
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validRows = batchItems.filter(row => row.itemName.trim());
    if (validRows.length === 0) return;

    setFormStatus('submitting');

    try {
      const result = await submitItemsApi(validRows, user);
      if (result.success) {
        setBatchItems([emptyItemRow()]);
        setFormStatus('success');
        setPage(1);
        fetchInventory({ page: 1 });
        if (tab === 'myitems') fetchMyItems();
        setTimeout(() => setFormStatus(null), 3000);
      } else if (result.error === 'ACCESS_DENIED') {
        setFormStatus('denied');
      } else if (result.error === 'RATE_LIMITED') {
        setFormStatus('ratelimited');
        setTimeout(() => setFormStatus(null), 4000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus(null), 3000);
      }
    } catch (e) {
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 3000);
    }
  };

  // ── Delete Item — local-only update, no refetch ──
  const handleDelete = async (itemId) => {
    try {
      const result = await deleteItemApi(itemId, user);
      if (result.success) {
        setItems(prev => prev.filter(i => i.id !== itemId));
        setMyItems(prev => prev.filter(i => i.id !== itemId));
      } else if (result.error === 'FORBIDDEN') {
        alert(result.message);
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  // ── Confirm Item (admin: Pending → Confirmed) — local-only update ──
  const handleConfirmItem = async (itemId) => {
    try {
      const result = await updateItemApi({ id: itemId, status: 'Confirmed' }, user);
      if (result.success) {
        setItems(prev => prev.map(i => i.id === itemId ? { ...i, status: 'Confirmed' } : i));
        setMyItems(prev => prev.map(i => i.id === itemId ? { ...i, status: 'Confirmed' } : i));
      } else if (result.message) {
        alert(result.message);
      }
    } catch (e) {
      console.error('Confirm error:', e);
    }
  };

  // ── Transfer Item Custody — local-only update ──
  // (admin-only, self-service — see Query_TransferItem.gs)
  const handleTransferItem = async (itemId, release) => {
    try {
      const result = await transferItemApi(itemId, release, user);
      if (result.success) {
        const transferredTo = result.transferredTo || '';
        setItems(prev => prev.map(i => i.id === itemId ? { ...i, transferredTo } : i));
        setMyItems(prev => prev.map(i => i.id === itemId ? { ...i, transferredTo } : i));
      } else if (result.message) {
        alert(result.message);
      }
      return result;
    } catch (e) {
      console.error('Transfer error:', e);
    }
  };

  // ── Update My Locations (post-patch bulk update) — genuinely bulk,
  // so a real refetch is the right call here. ──
  const handleUpdateLocations = async (mode, storageLocation, homeLocation) => {
    setLocationStatus('submitting');
    try {
      const result = await updateLocationsApi(mode, storageLocation, homeLocation, user);
      if (result.success) {
        setLocationResult(result);
        setLocationStatus('success');
        fetchInventory({ page: page });
        if (tab === 'myitems') fetchMyItems();
        setTimeout(() => setLocationStatus(null), 5000);
      } else if (result.error === 'ACCESS_DENIED') {
        setLocationStatus('denied');
      } else if (result.error === 'RATE_LIMITED') {
        setLocationStatus('ratelimited');
        setTimeout(() => setLocationStatus(null), 4000);
      } else {
        setLocationStatus('error');
        setTimeout(() => setLocationStatus(null), 3000);
      }
    } catch (e) {
      setLocationStatus('error');
      setTimeout(() => setLocationStatus(null), 3000);
    }
  };

  // ── Fetch Metrics (admin-only) ──
  const fetchMetrics = useCallback(async () => {
    setMetricsLoading(true);
    try {
      const data = await fetchMetricsApi(user);
      if (data.success) {
        setMetrics(data);
      }
    } catch (e) {
      console.error('Failed to fetch metrics:', e);
    }
    setMetricsLoading(false);
  }, [user]);

  useEffect(() => {
    if (tab === 'metrics' && user?.isAdmin) {
      fetchMetrics();
    }
  }, [tab, user, fetchMetrics]);

  const logout = () => {
    sessionStorage.removeItem('guild_user');
    setUser(null);
    setAuthError(null);
  };

  // ── Render: Loading ──
  if (loading) {
    return <LoadingScreen />;
  }

  // ── Render: Auth Error ──
  if (authError) {
    return <ErrorScreen authError={authError} onRetry={() => setAuthError(null)} />;
  }

  // ── Render: Login ──
  if (!user) {
    return <LoginScreen />;
  }

  // ── Render: Authenticated App ──
  return (
    <div className="app">
      <Header />
      <UserBar user={user} onLogout={logout} />
      <NavTabs tab={tab} setTab={setTab} user={user} />

      {tab === 'inventory' && (
        <InventoryTab
          items={items}
          itemsLoading={itemsLoading}
          stats={stats}
          catCounts={catCounts}
          pagination={pagination}
          onPageChange={handlePageChange}
          filterCategory={filterCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          user={user}
          onDelete={handleDelete}
          onConfirm={handleConfirmItem}
          onTransfer={handleTransferItem}
        />
      )}

      {tab === 'submit' && (
        <SubmitTab
          user={user}
          batchItems={batchItems}
          updateBatchRow={updateBatchRow}
          addBatchRow={addBatchRow}
          removeBatchRow={removeBatchRow}
          handleSubmit={handleSubmit}
          formStatus={formStatus}
        />
      )}

      {tab === 'myitems' && (
        <MyItemsTab myItems={myItems} myItemsLoading={myItemsLoading} onDelete={handleDelete} />
      )}

      {tab === 'locations' && (
        <UpdateLocationsTab
          user={user}
          onUpdateLocations={handleUpdateLocations}
          locationStatus={locationStatus}
          locationResult={locationResult}
        />
      )}

      {tab === 'metrics' && user.isAdmin && (
        <MetricsTab metrics={metrics} metricsLoading={metricsLoading} />
      )}
    </div>
  );
}
