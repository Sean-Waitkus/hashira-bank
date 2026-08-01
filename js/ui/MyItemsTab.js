// ═══════════════════════════════════════════════════════════════════
// UI: MyItemsTab — a member's own contributions, with the ability to
// remove any of their own items (regardless of admin status).
// ═══════════════════════════════════════════════════════════════════

function MyItemsTab({ myItems, onDelete }) {
  return (
    <div className="fade-in">
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20 }}>
        My Contributions
      </h2>
      {myItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>You haven't contributed any items yet. Head to the Submit tab to add your first!</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="my-items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myItems.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.itemName}</td>
                  <td>
                    <span style={{ color: CONFIG.CATEGORY_COLORS[item.category], fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      {item.category}
                    </span>
                  </td>
                  <td>{item.quantity}</td>
                  <td style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.date}</td>
                  <td>
                    <button className="btn btn-small btn-danger" onClick={() => onDelete(item.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
