import React, { useEffect, useRef } from 'react';
import { Search, X, ArrowUpDown, LayoutGrid, List, Filter } from 'lucide-react';
import { SortOption } from '../types/resource';
import { Button, IconButton, FilterChip } from './ui';

interface SearchBarProps {
  searchQuery: string; onSearchChange: (q: string) => void; sortBy: SortOption;
  onSortChange: (sort: SortOption) => void; viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void; activeCategoryName?: string;
  activePricing?: string;
  onClearFilter: (type: 'category' | 'tag' | 'pricing' | 'all') => void;
  onOpenMobileFilters: () => void; resultCount: number;
}
export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery, onSearchChange, sortBy, onSortChange, viewMode, onViewModeChange,
  activeCategoryName, activePricing, onClearFilter, onOpenMobileFilters, resultCount
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey &&
        !target.closest('input, textarea, select, [contenteditable], dialog[open]') &&
        !document.querySelector('dialog[open]')) {
        event.preventDefault(); inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const hasActiveFilters = Boolean(activeCategoryName || (activePricing && activePricing !== 'all') || searchQuery);
  return <section className="search-section" aria-label="Search tools">
    <div className="search-field">
      <Search aria-hidden="true" />
      <input ref={inputRef} id="global-search-input" type="text" aria-label="Search tools by name, category, use case, 'best for'..." placeholder="Search tools by name, category, use case, 'best for'..." value={searchQuery} onChange={event => onSearchChange(event.target.value)} />
      <div className="search-trailing">{searchQuery ? <IconButton label="Clear search" onClick={() => { onSearchChange(''); inputRef.current?.focus(); }}><X aria-hidden="true" /></IconButton> : <span className="shortcut" aria-hidden="true">/</span>}</div>
    </div>
    <div className="results-toolbar">
      <p className="result-count" role="status" aria-live="polite">{resultCount} {resultCount === 1 ? 'tool' : 'tools'}</p>
      <div className="view-controls">
        <Button id="mobile-filters-trigger" className="mobile-filters" onClick={onOpenMobileFilters} aria-haspopup="dialog"><Filter aria-hidden="true" /><span>Filters</span></Button>
        <div className="sort-control"><ArrowUpDown aria-hidden="true" /><select id="sort-select" value={sortBy} onChange={event => onSortChange(event.target.value as SortOption)} aria-label="Sort resources by">
          <option value="recent">Recently Added</option><option value="name-asc">Name (A-Z)</option><option value="name-desc">Name (Z-A)</option><option value="rating">Top Rated</option><option value="favorites">Bookmarks First</option>
        </select></div>
        <div className="view-toggle" role="group" aria-label="View">
          <IconButton id="view-grid-btn" label="Grid View" aria-pressed={viewMode === 'grid'} onClick={() => onViewModeChange('grid')}><LayoutGrid aria-hidden="true" /></IconButton>
          <IconButton id="view-list-btn" label="Compact List View" aria-pressed={viewMode === 'list'} onClick={() => onViewModeChange('list')}><List aria-hidden="true" /></IconButton>
        </div>
      </div>
    </div>
    {hasActiveFilters && <div className="filter-chips">
      {activeCategoryName && <FilterChip onRemove={() => onClearFilter('category')}>{`Category: ${activeCategoryName}`}</FilterChip>}
      {activePricing && activePricing !== 'all' && <FilterChip onRemove={() => onClearFilter('pricing')}>{`Pricing: ${activePricing}`}</FilterChip>}
      <button className="text-button" onClick={() => onClearFilter('all')}>Reset all</button>
    </div>}
  </section>;
};
