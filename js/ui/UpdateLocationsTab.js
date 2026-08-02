// ═══════════════════════════════════════════════════════════════════
// UI: UpdateLocationsTab — lets a member bulk-update their own item
// storage location and/or home location after a patch. Items already
// transferred to a bank admin are skipped automatically by the backend.
// ═══════════════════════════════════════════════════════════════════

function UpdateLocationsTab({ user, onUpdateLocations, locationStatus, locationResult }) {
  const [mode, setMode] = React.useState('both');
  const [storageLocation, setStorageLocation] = React.useState('');
  const [homeLocation, setHomeLocation] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateLocations(mode, storageLocation, homeLocation);
  };

  return (
    <div className="fade-in">
      <div className="form-panel">
        <h2>⬡ Update My Locations</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '-12px', marginBottom: 20 }}>
          After a patch wipes your home base, use this to update where your submitted items are stored. Items already transferred to a bank admin are skipped automatically.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>What do you want to update?</label>
            <select value={mode} onChange={e => setMode(e.target.value)}>
              <option value="items">Item Storage Locations Only</option>
              <option value="home">Home Location Only</option>
              <option value="both">Both</option>
            </select>
          </div>

          {(mode === 'items' || mode === 'both') && (
            <div className="form-group">
              <label>New Storage Location</label>
              <LocationAutocomplete
                value={storageLocation}
                onChange={setStorageLocation}
                placeholder="e.g., Area18 Storage"
                user={user}
              />
            </div>
          )}

          {(mode === 'home' || mode === 'both') && (
            <div className="form-group">
              <label>New Home Location</label>
              <LocationAutocomplete
                value={homeLocation}
                onChange={setHomeLocation}
                placeholder="e.g., Lorville"
                user={user}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn" disabled={locationStatus === 'submitting'}>
              {locationStatus === 'submitting' ? 'Updating...' : 'Update My Locations'}
            </button>
          </div>

          {locationStatus === 'success' && locationResult && (
            <div className="form-success">
              ✓ Updated {locationResult.updatedCount} item(s)
              {locationResult.skippedTransferred > 0 && ` — skipped ${locationResult.skippedTransferred} transferred item(s)`}
            </div>
          )}
          {locationStatus === 'error' && (
            <div className="form-success" style={{ borderColor: 'rgba(248,113,113,0.3)', color: 'var(--danger)', background: 'rgba(248,113,113,0.1)' }}>
              ✗ Update failed — check your connection
            </div>
          )}
          {locationStatus === 'denied' && (
            <div className="form-success" style={{ borderColor: 'rgba(248,113,113,0.3)', color: 'var(--danger)', background: 'rgba(248,113,113,0.1)' }}>
              ✗ Access denied — your server role may have changed
            </div>
          )}
          {locationStatus === 'ratelimited' && (
            <div className="form-success" style={{ borderColor: 'rgba(251,191,36,0.3)', color: 'var(--warning)', background: 'rgba(251,191,36,0.1)' }}>
              ⚠ Slow down — too many requests. Try again in a moment.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
