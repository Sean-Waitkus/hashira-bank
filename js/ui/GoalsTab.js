// ═══════════════════════════════════════════════════════════════════
// UI: GoalsTab — the front-page "Community Goals" view. Renders the
// accordion list of goals (only one expanded at a time, controlled by
// expandedGoalId from App.js), the admin-only "+ New Goal" form, and
// computes the swapped order when an admin clicks a priority arrow.
// ═══════════════════════════════════════════════════════════════════

function GoalsTab({
  goals,
  goalsLoading,
  expandedGoalId,
  onToggleExpand,
  user,
  onArchive,
  onReorder,
  onTransferGoalContribution,
  showCreateForm,
  setShowCreateForm,
  onCreateGoal,
  createStatus
}) {
  const handleMove = (index, direction) => {
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= goals.length) return;
    const reordered = [...goals];
    const tmp = reordered[index];
    reordered[index] = reordered[swapWith];
    reordered[swapWith] = tmp;
    // We know exactly which two goals traded places — pass both IDs
    // so the backend can auto-reallocate shared items between them.
    onReorder(reordered.map(g => g.id), goals[index].id, goals[swapWith].id);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>
          Community Goals
        </h2>
        {user.isAdmin && !showCreateForm && (
          <button className="btn btn-small" onClick={() => setShowCreateForm(true)}>
            + New Goal
          </button>
        )}
      </div>

      {showCreateForm && (
        <GoalCreateForm
          onCreate={onCreateGoal}
          onCancel={() => setShowCreateForm(false)}
          createStatus={createStatus}
        />
      )}

      {goalsLoading ? (
        <div className="loading"><div className="spinner"></div>Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <p>No active community goals right now.{user.isAdmin ? ' Create one to get started!' : ''}</p>
        </div>
      ) : (
        goals.map((goal, index) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            isExpanded={goal.id === expandedGoalId}
            onToggle={() => onToggleExpand(goal.id)}
            user={user}
            allGoals={goals}
            onArchive={onArchive}
            onMoveUp={() => handleMove(index, -1)}
            onMoveDown={() => handleMove(index, 1)}
            isFirst={index === 0}
            isLast={index === goals.length - 1}
            onTransferGoalContribution={onTransferGoalContribution}
          />
        ))
      )}
    </div>
  );
}
