// ═══════════════════════════════════════════════════════════════════
// UI: ItemAutocomplete — a text input with a live-search dropdown of
// matching items. Mirrors LocationAutocomplete.js exactly. Uses
// React.useState/useRef directly (not bare hooks) so it doesn't
// depend on script load order.
// ═══════════════════════════════════════════════════════════════════

function ItemAutocomplete({ value, onChange, placeholder, user }) {
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const debounceRef = React.useRef(null);

  const runSearch = async (val) => {
    try {
      const data = await searchItemsApi(val, user);
      if (data.success) setSuggestions(data.results || []);
    } catch (e) {
      console.error('Item search failed:', e);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setShowSuggestions(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 250);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    runSearch(value);
  };

  const handleSelect = (item) => {
    onChange(item);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'var(--bg-deep)',
          border: '1px solid var(--border-glow)',
          maxHeight: 220,
          overflowY: 'auto'
        }}>
          {suggestions.map((item, i) => (
            <div
              key={i}
              className="location-suggestion"
              onMouseDown={() => handleSelect(item)}
              style={{
                padding: '8px 12px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-dim)'
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
