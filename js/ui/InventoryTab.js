// ═══════════════════════════════════════════════════════════════════
// UI: InventoryTab — stats bar, search, category filters, and the
// full item grid (with admin-only remove buttons on others' items).
// ═══════════════════════════════════════════════════════════════════

function InventoryTab({
  items,
  itemsLoading,
  filteredItems,
  filterCategory,
  setFilterCategory,
  searchQuery,
  setSearchQuery,
  catCounts,
  user,
  onDelete
}) {
  return (
    <div className="fade-in">
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-value">{items.length}</div>
          <div className="stat-label">Total Listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{items.reduce((sum, i) => sum + Number(i.quantity), 0)}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{new Set(items.map(i => i.contributor)).size}</div>
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
          onChange={e => setSearchQuery(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      <div className="category-filters">
        <button
          className={`cat-filter ${filterCategory === 'All' ? 'active' : ''}`}
          onClick={() => setFilterCategory('All')}
        >
          All ({items.length})
        </button>
        {CONFIG.CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-filter ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            <span className="cat-dot" style={{ backgroundColor: CONFIG.CATEGORY_COLORS[cat] }}></span>
            {cat} ({catCounts[cat] || 0})
          </button>
        ))}
      </div>

      {itemsLoading ? (
        <div className="loading"><div className="spinner"></div>Loading inventory...</div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>No items found. Be the first to contribute to the guild bank!</p>
        </div>
      ) : (
        <div className="item-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="item-card" data-cat={item.category}>
              <div className="item-header">
                <div className="item-name">{item.itemName}</div>
                <div className="item-qty">×{item.quantity}</div>
              </div>
              <div className="item-category" style={{ color: CONFIG.CATEGORY_COLORS[item.category] }}>
                {item.category}
              </div>
              {item.notes && <div className="item-notes">{item.notes}</div>}
              <div className="item-meta">
                <div className="item-contributor">
                  ⬡ {item.contributor}
                  {item.inGameName && (
                    <span style={{ color: 'var(--text-dim)' }}> · IGN: {item.inGameName}</span>
                  )}
                </div>
                <div className="item-date">{item.date}</div>
              </div>
              {/* Admin delete button on all items */}
              {user.isAdmin && item.contributorId !== user.id && (
                <div className="item-admin-delete">
                  <button className="btn btn-small btn-danger" onClick={() => onDelete(item.id)}>
                    Admin Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
