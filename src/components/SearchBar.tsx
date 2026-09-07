import React, { useEffect, useRef } from 'react';
import {
  Search,
  X,
  ArrowUpDown,
  LayoutGrid,
  List,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { SortOption } from '../types/resource';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  activeCategoryName?: string;
  activeTagName?: string;
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
  activeTagName,
  activePricing,
  activeBestForFilter,
  onClearFilter,
  onOpenMobileFilters,
  resultCount
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' or 'cmd+k'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasActiveFilters = Boolean(
    activeCategoryName || activeTagName || (activePricing && activePricing !== 'all') || activeBestForFilter || searchQuery
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        {/* Search input field */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            placeholder="Search tools by name, category, use case, tags, 'best for'..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-12 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-xs"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hidden sm:inline-block">
                /
              </span>
            )}
          </div>
        </div>

        {/* Controls: Sort & View & Mobile Filters */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Mobile Filter Trigger */}
          <button
            id="mobile-filters-trigger"
            onClick={onOpenMobileFilters}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 shadow-xs"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="relative flex items-center">
            <div className="relative">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                aria-label="Sort resources by"
                className="appearance-none pl-8 pr-7 py-2 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/80 cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
              >
                <option value="recent">Recently Added</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="rating">Top Rated</option>
                <option value="favorites">Bookmarks First</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center p-0.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
            <button
              id="view-grid-btn"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="view-list-btn"
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
              title="Compact List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Result Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-stone-700 dark:text-stone-300">
            {resultCount} {resultCount === 1 ? 'tool' : 'tools'}
          </span>

          {activeCategoryName && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
              <span>Category: {activeCategoryName}</span>
              <button
                onClick={() => onClearFilter('category')}
                className="hover:text-stone-950 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeTagName && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <span>Tag: #{activeTagName}</span>
              <button
                onClick={() => onClearFilter('tag')}
                className="hover:text-indigo-950 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activePricing && activePricing !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <span>Pricing: {activePricing}</span>
              <button
                onClick={() => onClearFilter('pricing')}
                className="hover:text-amber-950 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeBestForFilter && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span>Decision: {activeBestForFilter}</span>
              <button
                onClick={() => onClearFilter('bestFor')}
                className="hover:text-emerald-950 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {hasActiveFilters && (
            <button
              onClick={() => onClearFilter('all')}
              className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 underline ml-1"
            >
              Reset all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
