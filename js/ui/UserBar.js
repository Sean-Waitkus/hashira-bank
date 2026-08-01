// ═══════════════════════════════════════════════════════════════════
// UI: UserBar — shows the logged-in Discord identity, role badge,
// and a logout button. Rendered at the top of the authenticated app.
// ═══════════════════════════════════════════════════════════════════

function UserBar({ user, onLogout }) {
  return (
    <div className="user-bar">
      <div className="user-info">
        {user.avatar && (
          <img
            className="user-avatar"
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
            alt=""
          />
        )}
        <span>{user.displayName || user.username}</span>
        {user.isAdmin && <span className="admin-badge">Admin</span>}
        {!user.isAdmin && <span className="role-badge">Member</span>}
      </div>
      <button className="btn btn-small btn-danger" onClick={onLogout}>Logout</button>
    </div>
  );
}
