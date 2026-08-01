// ═══════════════════════════════════════════════════════════════════
// UI: MetricsTab — admin-only view of contributions by user by
// category. The tab itself is only shown to admins (see NavTabs), and
// the backend independently re-checks admin status on every request.
// ═══════════════════════════════════════════════════════════════════

function MetricsTab({ metrics, metricsLoading }) {
  return (
    <div className="fade-in">
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20 }}>
        Contribution Metrics
      </h2>
      {metricsLoading ? (
        <div className="loading"><div className="spinner"></div>Loading metrics...</div>
      ) : !metrics || !metrics.rows || metrics.rows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>No contribution data yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="my-items-table">
            <thead>
              <tr>
                {metrics.headers.map((h, i) => <th key={i}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {metrics.rows.map((row, i) => (
                <tr key={i} style={row[0] === 'TOTAL' ? { fontWeight: 700 } : {}}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
