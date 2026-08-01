// ═══════════════════════════════════════════════════════════════════
// App — Top-level component. Holds all state and handlers, and
// delegates rendering to the UI components (Header, LoginScreen,
// ErrorScreen, UserBar, NavTabs, InventoryTab, SubmitTab, MyItemsTab)
// and data calls to the API files (auth.js, getItems.js, addItems.js,
// deleteItem.js).
// ═══════════════════════════════════════════════════════════════════

const { useState, useEffect, useCallback } = React;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [tab, setTab] = useState('inventory');
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const emptyItemRow = () => ({
    itemName: '', category: CONFIG.CATEGORIES[0], quantity: 1, notes: '', inGameName: ''
  });
  const [batchItems, setBatchItems] = useState([emptyItemRow()]);
  const [formStatus, setFormStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Auth Flow ──
  useEffect(() => {
    const code = getAuthCode();

    if (code) {
      // Clean the URL (remove ?code=)
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

  // ── Fetch Items ──
  const fetchItems = useCallback(async () => {
    setItemsLoading(true);
    try {
      const data = await fetchItemsApi(user);
      if (data.error === 'ACCESS_DENIED') {
        setAuthError({ error: 'ACCESS_REVOKED', message: 'Your access has been revoked. Your server role may have changed.' });
        setUser(null);
        sessionStorage.removeItem('guild_user');
      } else if (data.error === 'RATE_LIMITED') {
        console.warn('Rate limited — try refreshing in a moment.');
      } else {
        setItems(data.items || []);
      }
    } catch (e) {
      console.error('Failed to fetch items:', e);
    }
    setItemsLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchItems();
  }, [user, fetchItems]);

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
        fetchItems();
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

  // ── Delete Item ──
  const handleDelete = async (itemId) => {
    try {
      const result = await deleteItemApi(itemId, user);
      if (result.success) {
        fetchItems();
      } else if (result.error === 'FORBIDDEN') {
        alert(result.message);
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('guild_user');
    setUser(null);
    setAuthError(null);
  };

  // ── Derived Data ──
  const filteredItems = items.filter(item => {
    const matchesCat = filterCategory === 'All' || item.category === filterCategory;
    const matchesSearch = !searchQuery ||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contributor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.inGameName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const myItems = items.filter(i => i.contributorId === user?.id);

  const catCounts = CONFIG.CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat).length;
    return acc;
  }, {});

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
      <NavTabs tab={tab} setTab={setTab} />

      {tab === 'inventory' && (
        <InventoryTab
          items={items}
          itemsLoading={itemsLoading}
          filteredItems={filteredItems}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          catCounts={catCounts}
          user={user}
          onDelete={handleDelete}
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
        <MyItemsTab myItems={myItems} onDelete={handleDelete} />
      )}
    </div>
  );
}
