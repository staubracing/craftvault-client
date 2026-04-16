import { useState, useEffect, useMemo } from 'react';
import { Palette } from 'lucide-react';
import { colorsApi } from '../../api';
import type { Color } from '../../types';
import { SearchInput, EmptyState, LoadingSpinner } from '../../components/ui';
import './Colors.css';

export function Colors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  useEffect(() => {
    colorsApi
      .getAll()
      .then((res) => setColors(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return colors;
    const q = search.toLowerCase();
    return colors.filter(
      (c) =>
        c.dmc_code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.hex_value?.toLowerCase().includes(q) ?? false),
    );
  }, [colors, search]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="page-error">Failed to load colors: {error}</div>;

  return (
    <div className="page page--wide colors-page">
      <div className="page-header">
        <div>
          <h1>DMC Colors</h1>
          <p className="page-subtitle">
            {filtered.length === colors.length
              ? `${colors.length} colors`
              : `${filtered.length} of ${colors.length} colors`}
          </p>
        </div>
      </div>

      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
        placeholder="Search by DMC code, name, or hex..."
        className="colors-page__search"
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Palette}
          title="No colors found"
          description="Try adjusting your search terms"
        />
      ) : (
        <div className="colors-grid">
          {filtered.map((color) => (
            <button
              key={color.id}
              className={`color-chip ${selectedColor?.id === color.id ? 'color-chip--selected' : ''}`}
              onClick={() =>
                setSelectedColor(selectedColor?.id === color.id ? null : color)
              }
              title={`${color.dmc_code} — ${color.name}`}
            >
              <div
                className="color-chip__swatch"
                style={{ background: color.hex_value || '#e7e5e4' }}
              />
              <span className="color-chip__code">{color.dmc_code}</span>
            </button>
          ))}
        </div>
      )}

      {selectedColor && (
        <div className="color-detail">
          <div
            className="color-detail__swatch"
            style={{ background: selectedColor.hex_value || '#e7e5e4' }}
          />
          <div className="color-detail__info">
            <h3>{selectedColor.name}</h3>
            <p>DMC {selectedColor.dmc_code}</p>
            {selectedColor.hex_value && (
              <p className="color-detail__hex">{selectedColor.hex_value}</p>
            )}
            {selectedColor.symbol && (
              <p>Symbol: {selectedColor.symbol}</p>
            )}
          </div>
          <button
            className="color-detail__close"
            onClick={() => setSelectedColor(null)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
