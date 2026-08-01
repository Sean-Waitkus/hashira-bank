// ═══════════════════════════════════════════════════════════════════
// UI: ItemCard — a single inventory item, including admin-only
// controls (confirm, transfer custody, remove). Uses React.useState
// directly (not a bare useState) so it doesn't depend on script load
// order relative to App.js's destructured hooks.
// ═══════════════════════════════════════════════════════════════════

function ItemCard({ item, user, onDelete, onConfirm, onTransfer }) {
  const [transferInput, setTransferInput] = React.useState(item.transferredTo || '');
  const [transferring, setTransferring] = React.useState(false);

  const handleTransferClick = async () => {
    setTransferring(true);
    await onTransfer(item.id, transferInput);
    setTransferring(false);
  };

  return (
    <div className="item-card" data-cat={item.category}>
      <div className="item-header">
        <div className="item-name">{item.itemName}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <StatusBadge status={item.status} />
          <div className="item-qty">×{item.quantity}</div>
        </div>
      </div>

      <div className="item-category" style={{ color: CONFIG.CATEGORY_COLORS[item.category] }}>
        {item.category}
      </div>

      {item.notes && <div className="item-notes">{item.notes}</div>}

      {(item.storageLocation || item.homeLocation) && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: 8, lineHeight: 1.6 }}>
          {item.storageLocation && <div>📦 Storage: {item.storageLocation}</div>}
          {item.homeLocation && <div>🏠 Home: {item.homeLocation}</div>}
        </div>
      )}

      {item.transferredTo && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--warning)', marginBottom: 8 }}>
          ⇄ Transferred to: {item.transferredTo}
        </div>
      )}

      <div className="item-meta">
        <div className="item-contributor">
          ⬡ {item.contributor}
          {item.inGameName && (
            <span style={{ color: 'var(--text-dim)' }}> · IGN: {item.inGameName}</span>
          )}
        </div>
        <div className="item-date">{item.date}</div>
      </div>

      {user.isAdmin && (
        <div className="item-admin-delete" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
          {item.status === 'Pending' && (
            <button className="btn btn-small" onClick={() => onConfirm(item.id)}>
              Confirm Item
            </button>
          )}

          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="text"
              placeholder="Transfer to admin..."
              value={transferInput}
              onChange={e => setTransferInput(e.target.value)}
              style={{ flex: 1, fontSize: '0.8rem', padding: '6px 10px' }}
            />
            <button className="btn btn-small" onClick={handleTransferClick} disabled={transferring}>
              {transferring ? '...' : 'Transfer'}
            </button>
          </div>

          {item.contributorId !== user.id && (
            <button className="btn btn-small btn-danger" onClick={() => onDelete(item.id)}>
              Admin Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}
