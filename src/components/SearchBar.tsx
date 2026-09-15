import React, { useEffect, useRef } from 'react';
import { Search, X, ArrowUpDown, LayoutGrid, List, Filter } from 'lucide-react';
import { SortOption } from '../types/resource';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  activeCategoryName?: string;
  activePricing?: string;
  activeBestForFilter?: string;
  onClearFilter: (type: 'category' | 'tag' | 'pricing' | 'bestFor' | 'all') => void;
  onOpenMobileFilters: () => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  activeCategoryName,
  activePricing,
  activeBestForFilter,
  onClearFilter,
  onOpenMobileFilters,
  resultCount
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' — only when not typing in any editable element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const isEditing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (e.key === '/' && !isEditing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasActiveFilters = Boolean(
    activeCategoryName || (activePricing && activePricing !== 'all') || activeBestForFilter || searchQuery
  );

  const chip = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border font-mono text-[10px] uppercase tracking-wider';
  const controlBtn = 'p-1.5 rounded-md transition-colors duration-150';

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-3">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            aria-label="Search tools"
            placeholder="Search tools by name, category, use case, 'best for'..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-10 py-2 text-sm rounded-md border border-hairline-2 bg-raised text-ink placeholder:text-ink-3 hover:border-ink-3 transition-colors duration-150"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="text-ink-3 hover:text-ink p-0.5 rounded transition-colors duration-150"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded border border-hairline-2 text-ink-3">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Sort / view / mobile filters */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            id="mobile-filters-trigger"
            onClick={onOpenMobileFilters}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border border-hairline-2 text-ink-2 hover:text-ink hover:border-ink-3 transition-colors duration-150"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="relative">
            <ArrowUpDown className="w-3.5 h-3.5 text-ink-3 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="sort-select"
              aria-label="Sort resources by"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none pl-8 pr-3 py-2 text-xs rounded-md border border-transparent bg-surface text-ink-2 hover:text-ink transition-colors duration-150"
            >
              <option value="recent">Recently Added</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="rating">Top Rated</option>
              <option value="favorites">Bookmarks First</option>
            </select>
          </div>

          <div className="flex items-center rounded-md border border-hairline-2 overflow-hidden" role="group" aria-label="View mode">
            <button
              id="view-grid-btn"
              onClick={() => onViewModeChange('grid')}
              aria-pressed={viewMode === 'grid'}
              aria-label="Grid View"
              className={`${controlBtn} ${
                viewMode === 'grid' ? 'bg-ink text-paper' : 'text-ink-3 hover:text-ink hover:bg-surface'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="view-list-btn"
              onClick={() => onViewModeChange('list')}
              aria-pressed={viewMode === 'list'}
              aria-label="Compact List View"
              className={`${controlBtn} ${
                viewMode === 'list' ? 'bg-ink text-paper' : 'text-ink-3 hover:text-ink hover:bg-surface'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active filter chips & result counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-3">
            {resultCount} {resultCount === 1 ? 'tool' : 'tools'}
          </span>

          {activeCategoryName && (
            <span className={`${chip} border-hairline-2 bg-surface text-ink-2`}>
              <span>Category: {activeCategoryName}</span>
              <button
                onClick={() => onClearFilter('category')}
                aria-label={`Clear category filter: ${activeCategoryName}`}
                className="hover:text-ink transition-colors duration-150"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activePricing && activePricing !== 'all' && (
            <span className={`${chip} border-hairline-2 bg-surface text-ink-2`}>
              <span>Pricing: {activePricing}</span>
              <button
                onClick={() => onClearFilter('pricing')}
                aria-label={`Clear pricing filter: ${activePricing}`}
                className="hover:text-ink transition-colors duration-150"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeBestForFilter && (
            <span className={`${chip} border-accent/40 bg-accent-soft text-accent`}>
              <span>Decision: {activeBestForFilter}</span>
              <button
                onClick={() => onClearFilter('bestFor')}
                aria-label={`Clear decision filter: ${activeBestForFilter}`}
                className="hover:text-accent-hover transition-colors duration-150"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {hasActiveFilters && (
            <button
              onClick={() => onClearFilter('all')}
              className="text-ink-3 hover:text-ink underline underline-offset-2 ml-1 transition-colors duration-150"
            >
              Reset all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
