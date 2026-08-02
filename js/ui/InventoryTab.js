// ═══════════════════════════════════════════════════════════════════
// UI: InventoryTab — stats bar, search, category filters, paginated
// item grid, and pagination controls (with admin-only controls on
// each card). All filtering/searching/pagination happens SERVER-SIDE
// (see Query_GetItems.gs) — `items` here is always just the current
// page's results, already filtered and searched.
// ═══════════════════════════════════════════════════════════════════

function InventoryTab({
  items,
  itemsLoading,
  stats,
  catCounts,
  pagination,
  onPageChange,
  filterCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  user,
  onDelete,
  onConfirm,
  onTransfer
}) {
  return (
    <div className="fade-in">
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-value">{stats.totalListings}</div>
          <div className="stat-label">Total Listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalItems}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.contributors}</div>
          <div className="stat-label">Contributors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{CONFIG.CATEGORIES.length}</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search items, notes, or contributors..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      <div className="category-filters">
        <button
          className={`cat-filter ${filterCategory === 'All' ? 'active' : ''}`}
          onClick={() => onCategoryChange('All')}
        >
          All ({stats.totalListings})
        </button>
        {CONFIG.CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-filter ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            <span className="cat-dot" style={{ backgroundColor: CONFIG.CATEGORY_COLORS[cat] }}></span>
            {cat} ({catCounts[cat] || 0})
          </button>
        ))}
      </div>

      {itemsLoading ? (
        <div className="loading"><div className="spinner"></div>Loading inventory...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>No items found. Be the first to contribute to the guild bank!</p>
        </div>
      ) : (
        <React.Fragment>
          <div className="item-grid">
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                user={user}
                onDelete={onDelete}
                onConfirm={onConfirm}
                onTransfer={onTransfer}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              marginTop: -16,
              marginBottom: 40
            }}>
              <button
                className="btn btn-small"
                disabled={pagination.page <= 1}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                ← Prev
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-small"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}
