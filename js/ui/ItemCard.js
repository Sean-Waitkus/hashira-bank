// ═══════════════════════════════════════════════════════════════════
// UI: ItemCard — a single inventory item, including admin-only
// controls (confirm, transfer custody, remove). Uses React.useState
// directly (not a bare useState) so it doesn't depend on script load
// order relative to App.js's destructured hooks.
// ═══════════════════════════════════════════════════════════════════

function ItemCard({ item, user, onDelete, onConfirm, onTransfer }) {
  const [transferring, setTransferring] = React.useState(false);

  // Local mirror of the "Transferred To" value, so the card updates the
  // instant a transfer succeeds — using the admin name the BACKEND
  // resolved and returned, rather than waiting for the full item list
  // to be refetched from the server.
  const [localTransferredTo, setLocalTransferredTo] = React.useState(item.transferredTo || '');

  // Stay in sync if the item prop itself changes (e.g. after the
  // background refetch completes, or someone else transferred it).
  React.useEffect(() => {
    setLocalTransferredTo(item.transferredTo || '');
  }, [item.transferredTo]);

  const handleTakeCustody = async () => {
    setTransferring(true);
    const result = await onTransfer(item.id, false);
    if (result && result.success) {
      setLocalTransferredTo(result.transferredTo || '');
    }
    setTransferring(false);
  };

  const handleRelease = async () => {
    setTransferring(true);
    const result = await onTransfer(item.id, true);
    if (result && result.success) {
      setLocalTransferredTo('');
    }
    setTransferring(false);
  };

  const isOwnItem = item.contributorId === user.id;

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

      {localTransferredTo && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--warning)', marginBottom: 8 }}>
          ⇄ Transferred to: {localTransferredTo}
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

          {/* "Take Custody" doesn't make sense on your own contributed item —
              but "Release Custody" stays available regardless of who
              contributed it, since another admin may have taken custody. */}
          {(localTransferredTo || !isOwnItem) && (
            <div style={{ display: 'flex', gap: 6 }}>
              {localTransferredTo ? (
                <button className="btn btn-small" onClick={handleRelease} disabled={transferring} style={{ flex: 1 }}>
                  {transferring ? '...' : 'Release Custody'}
                </button>
              ) : (
                <button className="btn btn-small" onClick={handleTakeCustody} disabled={transferring} style={{ flex: 1 }}>
                  {transferring ? '...' : 'Take Custody'}
                </button>
              )}
            </div>
          )}

          <button className="btn btn-small btn-danger" onClick={() => onDelete(item.id)}>
            {isOwnItem ? 'Remove' : 'Admin Remove'}
          </button>
        </div>
      )}
    </div>
  );
}
