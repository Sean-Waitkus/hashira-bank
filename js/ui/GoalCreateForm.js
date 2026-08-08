// ═══════════════════════════════════════════════════════════════════
// UI: GoalCreateForm — admin-only. Creates a new goal: a title,
// optional description, and a batch-style list of needed items,
// following the same row-based pattern as the item Submit form.
// ═══════════════════════════════════════════════════════════════════

function GoalCreateForm({ onCreate, onCancel, createStatus }) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const emptyRow = () => ({ itemName: '', category: CONFIG.CATEGORIES[0], quantityNeeded: 1 });
  const [rows, setRows] = React.useState([emptyRow()]);

  const updateRow = (i, field, val) => setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  const addRow = () => setRows(prev => [...prev, emptyRow()]);
  const removeRow = (i) => setRows(prev => prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    const validRows = rows.filter(r => r.itemName.trim() && r.quantityNeeded > 0);
    if (!title.trim() || validRows.length === 0) return;
    onCreate(title, description, validRows);
  };

  return (
    <div className="form-panel fade-in" style={{ maxWidth: 700, marginBottom: 24 }}>
      <h2>⬡ New Community Goal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Goal Title</label>
          <input
            type="text"
            required
            placeholder="e.g., Idris Frigate Fund"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Description (optional)</label>
          <textarea
            placeholder="What are we working towards, and why?"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <label style={{
          display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-dim)', marginBottom: 10
        }}>
          Items Needed
        </label>

        {rows.map((row, i) => (
          <div key={i} style={{ border: '1px solid var(--border-dim)', padding: 16, marginBottom: 12, background: 'rgba(255,255,255,0.01)' }}>
            {rows.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Item {i + 1}
                </span>
                <button type="button" className="btn btn-small btn-danger" onClick={() => removeRow(i)}>
                  Remove
                </button>
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Titanium"
                  value={row.itemName}
                  onChange={e => updateRow(i, 'itemName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Quantity Needed</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={row.quantityNeeded}
                  onChange={e => updateRow(i, 'quantityNeeded', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Category (optional)</label>
              <select value={row.category} onChange={e => updateRow(i, 'category', e.target.value)}>
                {CONFIG.CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <div className="form-actions" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="btn btn-small" onClick={addRow}>
            + Add Another Item
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-small btn-danger" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={createStatus === 'submitting'}>
              {createStatus === 'submitting' ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </div>

        {createStatus === 'error' && (
          <div className="form-success" style={{ borderColor: 'rgba(248,113,113,0.3)', color: 'var(--danger)', background: 'rgba(248,113,113,0.1)' }}>
            ✗ Failed to create goal
          </div>
        )}
      </form>
    </div>
  );
}
