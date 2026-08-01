// ═══════════════════════════════════════════════════════════════════
// UI: SubmitTab — the batch item submission form. Users can add
// multiple rows before submitting them all in a single request.
// ═══════════════════════════════════════════════════════════════════

function SubmitTab({
  user,
  batchItems,
  updateBatchRow,
  addBatchRow,
  removeBatchRow,
  handleSubmit,
  formStatus
}) {
  return (
    <div className="fade-in">
      <div className="form-panel" style={{ maxWidth: 760 }}>
        <h2>⬡ Submit Items to Hashira-o7 Bank</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '-12px', marginBottom: 20 }}>
          Submitting as <strong style={{ color: 'var(--accent)' }}>{user.displayName || user.username}</strong> (Discord).
        </p>
        <form onSubmit={handleSubmit}>
          {batchItems.map((row, index) => (
            <div key={index} style={{
              border: '1px solid var(--border-dim)',
              padding: 20,
              marginBottom: 16,
              position: 'relative',
              background: 'rgba(255,255,255,0.01)'
            }}>
              {batchItems.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Item {index + 1}
                  </span>
                  <button
                    type="button"
                    className="btn btn-small btn-danger"
                    onClick={() => removeBatchRow(index)}
                  >
                    Remove Row
                  </button>
                </div>
              )}
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Attrition-4 Laser Repeater"
                  value={row.itemName}
                  onChange={e => updateBatchRow(index, 'itemName', e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={row.category}
                    onChange={e => updateBatchRow(index, 'category', e.target.value)}
                  >
                    {CONFIG.CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={row.quantity}
                    onChange={e => updateBatchRow(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>In-Game Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Star Citizen character name"
                  value={row.inGameName}
                  onChange={e => updateBatchRow(index, 'inGameName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  placeholder="Size, location, condition, etc."
                  value={row.notes}
                  onChange={e => updateBatchRow(index, 'notes', e.target.value)}
                />
              </div>
            </div>
          ))}

          <div className="form-actions" style={{ justifyContent: 'space-between' }}>
            <button type="button" className="btn btn-small" onClick={addBatchRow}>
              + Add Another Item
            </button>
            <button type="submit" className="btn" disabled={formStatus === 'submitting'}>
              {formStatus === 'submitting'
                ? 'Submitting...'
                : batchItems.length > 1
                  ? `Submit ${batchItems.length} Items to Bank`
                  : 'Submit to Bank'}
            </button>
          </div>
          {formStatus === 'success' && (
            <div className="form-success">✓ Submitted successfully</div>
          )}
          {formStatus === 'error' && (
            <div className="form-success" style={{ borderColor: 'rgba(248,113,113,0.3)', color: 'var(--danger)', background: 'rgba(248,113,113,0.1)' }}>
              ✗ Submission failed — check your connection
            </div>
          )}
          {formStatus === 'denied' && (
            <div className="form-success" style={{ borderColor: 'rgba(248,113,113,0.3)', color: 'var(--danger)', background: 'rgba(248,113,113,0.1)' }}>
              ✗ Access denied — your server role may have changed
            </div>
          )}
          {formStatus === 'ratelimited' && (
            <div className="form-success" style={{ borderColor: 'rgba(251,191,36,0.3)', color: 'var(--warning)', background: 'rgba(251,191,36,0.1)' }}>
              ⚠ Slow down — too many requests. Try again in a moment.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
