// ═══════════════════════════════════════════════════════════════════
// UI: GoalCard — one community goal. Collapsed shows title + overall
// progress; expanded also shows description, per-item progress with
// contribute controls, and admin-only controls (reorder, archive).
// ═══════════════════════════════════════════════════════════════════

function GoalCard({ goal, isExpanded, onToggle, user, allGoals, onArchive, onMoveUp, onMoveDown, isFirst, isLast, onTransferGoalContribution }) {
  const overall = goal.overallProgress;
  const percent = overall.percent;
  const isComplete = goal.status === 'Completed';

  return (
    <div className="goal-card">
      <div className="goal-header" onClick={onToggle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="goal-title">
            {goal.title}
            {isComplete && <span className="goal-complete-badge">✓ Complete</span>}
          </div>
          <div className="progress-track" style={{ marginTop: 10 }}>
            <div className={`progress-fill ${isComplete ? 'complete' : ''}`} style={{ width: percent + '%' }}></div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 6 }}>
            {overall.contributed} / {overall.needed} ({percent}%)
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 16, flexShrink: 0 }}>
          {user.isAdmin && (
            <div className="goal-priority-controls" onClick={e => e.stopPropagation()}>
              <button className="btn btn-small" disabled={isFirst} onClick={onMoveUp} title="Move up">▲</button>
              <button className="btn btn-small" disabled={isLast} onClick={onMoveDown} title="Move down">▼</button>
            </div>
          )}
          <span className="goal-expand-icon">{isExpanded ? '−' : '+'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="goal-body fade-in">
          {goal.description && (
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>{goal.description}</p>
          )}

          {goal.status === 'Active' && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 20 }}>
              💡 To contribute, mark an item for this goal on the <strong>Submit Item</strong> tab. It counts toward progress once an admin takes custody of it.
            </p>
          )}

          {goal.items.map(item => (
            <GoalItemRow
              key={item.id}
              goalId={goal.id}
              item={item}
              user={user}
              allGoals={allGoals}
              onTransferGoalContribution={onTransferGoalContribution}
            />
          ))}

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 8 }}>
            Created by {goal.createdBy} on {goal.createdDate}
          </div>

          {user.isAdmin && (
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-small btn-danger" onClick={() => onArchive(goal.id)}>
                Archive Goal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
