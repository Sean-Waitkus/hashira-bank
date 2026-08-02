// ═══════════════════════════════════════════════════════════════════
// UI: StatusBadge — small colored label for an item's status.
// ═══════════════════════════════════════════════════════════════════

function StatusBadge({ status }) {
  const colors = {
    Pending: 'var(--warning)',
    Confirmed: 'var(--success)',
    Available: 'var(--accent)',
    Claimed: 'var(--text-dim)',
    Removed: 'var(--danger)'
  };
  const color = colors[status] || 'var(--text-dim)';

  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.725rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      padding: '2px 8px',
      border: `1px solid ${color}`,
      color: color,
      background: 'rgba(255,255,255,0.02)',
      whiteSpace: 'nowrap'
    }}>
      {status}
    </span>
  );
}