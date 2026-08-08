// ═══════════════════════════════════════════════════════════════════
// UI: GoalItemRow — one needed item within a goal: name, category,
// progress bar, and an inline "Contribute" control. Uses
// React.useState directly so it doesn't depend on script load order.
// ═══════════════════════════════════════════════════════════════════

function GoalItemRow({ goalId, item, onContribute, goalIsActive }) {
  const [showInput, setShowInput] = React.useState(false);
  const [qty, setQty] = React.useState(1);
  const [submitting, setSubmitting] = React.useState(false);

  const needed = Number(item.quantityNeeded) || 0;
  const contributed = Number(item.quantityContributed) || 0;
  const remaining = Math.max(0, needed - contributed);
  const percent = needed > 0 ? Math.min(100, Math.round((contributed / needed) * 100)) : 0;
  const isComplete = remaining <= 0;

  const handleConfirm = async () => {
    setSubmitting(true);
    await onContribute(goalId, item.id, qty);
    setSubmitting(false);
    setShowInput(false);
    setQty(1);
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

      {isComplete ? (
        <div style={{ marginTop: 6, color: 'var(--success)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          ✓ Fully funded
        </div>
      ) : goalIsActive && (
        showInput ? (
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <input
              type="number"
              min="1"
              max={remaining}
              value={qty}
              onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: 90, padding: '6px 10px', fontSize: '0.85rem' }}
              autoFocus
            />
            <button className="btn btn-small" onClick={handleConfirm} disabled={submitting}>
              {submitting ? '...' : 'Confirm'}
            </button>
            <button className="btn btn-small btn-danger" onClick={() => setShowInput(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="btn btn-small" style={{ marginTop: 8 }} onClick={() => setShowInput(true)}>
            Contribute
          </button>
        )
      )}
    </div>
  );
}
