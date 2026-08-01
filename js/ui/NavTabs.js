// ═══════════════════════════════════════════════════════════════════
// UI: NavTabs — the Inventory / Submit Item / My Items tab switcher.
// ═══════════════════════════════════════════════════════════════════

function NavTabs({ tab, setTab }) {
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
    </div>
  );
}
