// ═══════════════════════════════════════════════════════════════════
// UI: GoalItemRow — one needed item within a goal: name, category,
// progress bar, and (admin-only) a way to transfer already-confirmed
// items linked here to a different goal that needs the same item.
// Members no longer contribute here directly — that happens via the
// Submit tab, with an admin's "Take Custody" as the confirmation.
// ═══════════════════════════════════════════════════════════════════

function GoalItemRow({ goalId, item, user, allGoals, onTransferGoalContribution }) {
  const [openMoveId, setOpenMoveId] = React.useState(null); // which linkedItem's move UI is expanded
  const [targetSelection, setTargetSelection] = React.useState('');
  const [moving, setMoving] = React.useState(false);

  const needed = Number(item.quantityNeeded) || 0;
  const contributed = Number(item.quantityContributed) || 0;
  const percent = needed > 0 ? Math.min(100, Math.round((contributed / needed) * 100)) : 0;
  const isComplete = contributed >= needed;

  const linkedItems = item.linkedItems || [];

  // Other goal items (in ANY other goal, not archived) that share this
  // item's name — the eligibility rule for a transfer to exist at all.
  const eligibleTargets = [];
  (allGoals || []).forEach(g => {
    if (g.status === 'Archived') return; // can't transfer INTO an archived goal
    (g.items || []).forEach(it => {
      if (it.id === item.id) return;
      if ((it.itemName || '').trim().toLowerCase() !== (item.itemName || '').trim().toLowerCase()) return;
      eligibleTargets.push({
        goalItemId: it.id,
        goalTitle: g.title,
        remaining: Math.max(0, (Number(it.quantityNeeded) || 0) - (Number(it.quantityContributed) || 0))
      });
    });
  });

  const handleMoveClick = (linkedItemId) => {
    setOpenMoveId(prev => prev === linkedItemId ? null : linkedItemId);
    setTargetSelection('');
  };

  const handleConfirmMove = async (linkedItemId) => {
    if (!targetSelection) return;
    setMoving(true);
    await onTransferGoalContribution(linkedItemId, targetSelection);
    setMoving(false);
    setOpenMoveId(null);
    setTargetSelection('');
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontWeight: 600 }}>
          {item.itemName}
          {item.category && (
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 400 }}> · {item.category}</span>
          )}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          {contributed} / {needed}
        </span>
      </div>

      <div className="progress-track">
        <div className={`progress-fill ${isComplete ? 'complete' : ''}`} style={{ width: percent + '%' }}></div>
      </div>

      {isComplete && (
        <div style={{ marginTop: 6, color: 'var(--success)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          ✓ Fully funded
        </div>
      )}

      {user.isAdmin && linkedItems.length > 0 && eligibleTargets.length > 0 && (
        <div style={{ marginTop: 10, borderTop: '1px solid var(--border-dim)', paddingTop: 10 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            Confirmed items linked here — transfer to another goal
          </div>
          {linkedItems.map(li => (
            <div key={li.id} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span>×{li.quantity} from {li.contributor} <span style={{ color: 'var(--text-dim)' }}>({li.date})</span></span>
                <button className="btn btn-small" onClick={() => handleMoveClick(li.id)}>
                  {openMoveId === li.id ? 'Cancel' : 'Move ▸'}
                </button>
              </div>
              {openMoveId === li.id && (
                <div style={{ marginTop: 6 }}>
                  <select
                    value={targetSelection}
                    onChange={e => setTargetSelection(e.target.value)}
                    style={{ width: '100%', marginBottom: 6 }}
                  >
                    <option value="">Select target goal...</option>
                    {eligibleTargets.map(t => (
                      <option key={t.goalItemId} value={t.goalItemId}>
                        {t.goalTitle} — {t.remaining} still needed
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-small"
                    disabled={!targetSelection || moving}
                    onClick={() => handleConfirmMove(li.id)}
                    style={{ width: '100%' }}
                  >
                    {moving ? '...' : 'Confirm'}
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
