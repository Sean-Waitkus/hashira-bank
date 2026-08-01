// ═══════════════════════════════════════════════════════════════════
// UI: NavTabs — the Inventory / Submit Item / My Items tab switcher.
// ═══════════════════════════════════════════════════════════════════

function NavTabs({ tab, setTab, user }) {
  return (
    <div className="nav-tabs">
      <button className={`nav-tab ${tab === 'inventory' ? 'active' : ''}`} onClick={() => setTab('inventory')}>
        Inventory
      </button>
      <button className={`nav-tab ${tab === 'submit' ? 'active' : ''}`} onClick={() => setTab('submit')}>
        Submit Item
      </button>
      <button className={`nav-tab ${tab === 'myitems' ? 'active' : ''}`} onClick={() => setTab('myitems')}>
        My Items
      </button>
      <button className={`nav-tab ${tab === 'locations' ? 'active' : ''}`} onClick={() => setTab('locations')}>
        Update Locations
      </button>
      {user.isAdmin && (
        <button className={`nav-tab ${tab === 'metrics' ? 'active' : ''}`} onClick={() => setTab('metrics')}>
          Metrics
        </button>
      )}
    </div>
  );
}
