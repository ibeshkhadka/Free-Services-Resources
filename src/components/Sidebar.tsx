import React from 'react';
import { Category, PricingModel } from '../types/resource';
import { CategoryIcon } from './CategoryIcon';
import { Layers, Star, Clock, Plus, X } from 'lucide-react';
import { toneOf } from './ui/categoryTone';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  selectedPricing: PricingModel | 'all';
  onSelectPricing: (pricing: PricingModel | 'all') => void;
  onlyFavorites: boolean;
  onToggleFavorites: (val: boolean) => void;
  showRecentOnly: boolean;
  onToggleRecent: (val: boolean) => void;
  onOpenAddCategoryModal: () => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
  favoritesCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const sectionLabel = 'px-3 font-mono text-[10px] uppercase tracking-widest text-ink-3';

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedPricing,
  onSelectPricing,
  onlyFavorites,
  onToggleFavorites,
  showRecentOnly,
  onToggleRecent,
  onOpenAddCategoryModal,
  categoryCounts,
  totalCount,
  favoritesCount,
  mobileOpen,
  onCloseMobile
}) => {
  const navItem = (active: boolean) =>
    `w-full flex items-center justify-between px-3 py-2 border-l-2 text-sm transition-colors duration-150 text-left ${
      active
        ? 'border-accent text-accent font-medium'
        : 'border-transparent text-ink-2 hover:text-ink hover:bg-surface/60'
    }`;

  const content = (
    <div className="flex flex-col h-full space-y-6 text-sm">
      {/* Primary Navigation Views */}
      <div className="space-y-0.5">
        <div className={`${sectionLabel} py-1`} id="sidebar-views-label">Views</div>
        <button
          id="nav-all-resources"
          onClick={() => {
            onToggleFavorites(false);
            onToggleRecent(false);
            onSelectCategory('all');
            onCloseMobile();
          }}
          className={navItem(!onlyFavorites && !showRecentOnly && selectedCategory === 'all')}
        >
          <span className="flex items-center gap-2.5">
            <Layers className="w-4 h-4" />
            <span>All Resources</span>
          </span>
          <span className="font-mono text-xs text-ink-3">{totalCount}</span>
        </button>

        <button
          id="nav-favorites"
          onClick={() => {
            onToggleFavorites(true);
            onToggleRecent(false);
            onCloseMobile();
          }}
          className={navItem(onlyFavorites)}
        >
          <span className="flex items-center gap-2.5">
            <Star className="w-4 h-4" />
            <span>Starred / Bookmarks</span>
          </span>
          <span className="font-mono text-xs text-ink-3">{favoritesCount}</span>
        </button>

        <button
          id="nav-recently-added"
          onClick={() => {
            onToggleRecent(true);
            onToggleFavorites(false);
            onCloseMobile();
          }}
          className={navItem(showRecentOnly)}
        >
          <span className="flex items-center gap-2.5">
            <Clock className="w-4 h-4" />
            <span>Recently Added</span>
          </span>
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-0.5">
        <div className="flex items-center justify-between px-3 py-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-3">
            Categories
          </span>
          <button
            id="add-category-sidebar-btn"
            onClick={onOpenAddCategoryModal}
            aria-label="Add custom category"
            className="p-1 rounded-md text-ink-3 hover:text-ink hover:bg-surface transition-colors duration-150"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {categories.map((cat) => {
          const isSelected = !onlyFavorites && !showRecentOnly && selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;
          const tone = toneOf(cat.color);

          return (
            <button
              key={cat.id}
              id={`cat-nav-${cat.id}`}
              onClick={() => {
                onSelectCategory(cat.id);
                onToggleFavorites(false);
                onToggleRecent(false);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 border-l-2 text-xs transition-colors duration-150 text-left ${
                isSelected
                  ? `${tone.bg} ${tone.text} ${tone.border} font-medium`
                  : 'border-transparent text-ink-2 hover:text-ink hover:bg-surface/60'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <CategoryIcon name={cat.iconName} className={`w-4 h-4 shrink-0 ${isSelected ? '' : tone.text}`} />
                <span className="truncate">{cat.name}</span>
              </span>
              <span className={`font-mono text-xs shrink-0 ${isSelected ? '' : 'text-ink-3'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Pricing Filters */}
      <div className="space-y-2">
        <div className={`${sectionLabel} flex items-center gap-1.5 py-1`}>
          <span>Pricing Model</span>
        </div>
        <div className="grid grid-cols-2 gap-1 px-1">
          {(['all', 'Free', 'Freemium', 'Paid'] as const).map((model) => (
            <button
              key={model}
              id={`filter-pricing-${model.toLowerCase()}`}
              onClick={() => onSelectPricing(model)}
              className={`px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider rounded-md border text-center transition-colors duration-150 ${
                selectedPricing === model
                  ? 'border-accent bg-accent-soft text-accent font-medium'
                  : 'border-hairline text-ink-2 hover:border-hairline-2 hover:text-ink'
              }`}
            >
              {model === 'all' ? 'All Prices' : model}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-hairline p-4 bg-paper min-h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-ink/50"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters & Navigation"
            className="relative w-72 max-w-full bg-paper p-5 shadow-overlay overflow-y-auto flex flex-col"
          >
            <div className="flex items-center justify-between pb-4 border-b border-hairline mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-3">
                Filters &amp; Navigation
              </span>
              <button
                onClick={onCloseMobile}
                aria-label="Close filters"
                className="p-1 rounded-md hover:bg-surface text-ink-3 hover:text-ink transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
