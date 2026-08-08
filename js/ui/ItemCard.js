// ═══════════════════════════════════════════════════════════════════
// UI: ItemCard — a single inventory item, including admin-only
// controls (confirm, transfer custody, remove, allocate to a goal).
// Uses React.useState directly (not a bare useState) so it doesn't
// depend on script load order relative to App.js's destructured hooks.
// ═══════════════════════════════════════════════════════════════════

function ItemCard({ item, user, allGoals, onDelete, onConfirm, onTransfer, onAllocateToGoal }) {
  const [transferring, setTransferring] = React.useState(false);
  const [showAllocate, setShowAllocate] = React.useState(false);
  const [allocateSelection, setAllocateSelection] = React.useState('');
  const [allocating, setAllocating] = React.useState(false);

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

  const handleAllocate = async () => {
    if (!allocateSelection) return;
    setAllocating(true);
    await onAllocateToGoal(item.id, allocateSelection);
    setAllocating(false);
    setShowAllocate(false);
    setAllocateSelection('');
  };

  const handleUnlink = async () => {
    setAllocating(true);
    await onAllocateToGoal(item.id, '');
    setAllocating(false);
  };

  const isOwnItem = item.contributorId === user.id;

  // Options for the allocate dropdown: every needed item across all
  // active (non-archived) goals that still needs more. No item-name
  // matching required here — the admin is making a direct judgment
  // call about which bank item fulfills which need.
  const allocateOptions = [];
  (allGoals || []).forEach(g => {
    if (g.status === 'Archived') return;
    (g.items || []).forEach(it => {
      const remaining = Math.max(0, (Number(it.quantityNeeded) || 0) - (Number(it.quantityContributed) || 0));
      if (remaining <= 0) return;
      allocateOptions.push({ goalItemId: it.id, goalTitle: g.title, itemName: it.itemName, remaining });
    });
  });

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

      {item.goalInfo && (
        localTransferredTo ? (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--success)', marginBottom: 8 }}>
            ✓ Counted toward: {item.goalInfo.goalTitle} — {item.goalInfo.itemName}
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', marginBottom: 8 }}>
            🎯 Pledged toward: {item.goalInfo.goalTitle} — {item.goalInfo.itemName} (awaiting admin custody)
          </div>
        )
      )}

      {(item.storageLocation || item.homeLocation) && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', color: 'var(--text-dim)', marginBottom: 8, lineHeight: 1.6 }}>
          {item.storageLocation && <div>📦 Storage: {item.storageLocation}</div>}
          {item.homeLocation && <div>🏠 Home: {item.homeLocation}</div>}
        </div>
      )}

      {localTransferredTo && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', color: 'var(--warning)', marginBottom: 8 }}>
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

          {/* Allocate general (unlinked) inventory to a goal, or unlink
              an already-allocated item — symmetric with the other
              admin goal controls elsewhere in the app. */}
          {item.goalInfo ? (
            <button className="btn btn-small" onClick={handleUnlink} disabled={allocating}>
              {allocating ? '...' : 'Unlink from Goal'}
            </button>
          ) : allocateOptions.length > 0 && (
            <div>
              {showAllocate ? (
                <div>
                  <select
                    value={allocateSelection}
                    onChange={e => setAllocateSelection(e.target.value)}
                    style={{ width: '100%', marginBottom: 6 }}
                  >
                    <option value="">Select a goal need...</option>
                    {allocateOptions.map(o => (
                      <option key={o.goalItemId} value={o.goalItemId}>
                        {o.goalTitle} — {o.itemName} ({o.remaining} needed)
                      </option>
                    ))}
                  </select>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-small" disabled={!allocateSelection || allocating} onClick={handleAllocate} style={{ flex: 1 }}>
                      {allocating ? '...' : 'Confirm'}
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => setShowAllocate(false)} style={{ flex: 1 }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button className="btn btn-small" onClick={() => setShowAllocate(true)}>
                  Allocate to Goal
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
