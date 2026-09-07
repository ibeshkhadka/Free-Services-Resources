import React from 'react';
import { Category, PricingModel } from '../types/resource';
import { CategoryIcon } from './CategoryIcon';
import {
  Layers,
  Star,
  Clock,
  Compass,
  Plus,
  Tag,
  CreditCard,
  X,
  SlidersHorizontal
} from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  selectedPricing: PricingModel | 'all';
  onSelectPricing: (pricing: PricingModel | 'all') => void;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  allTags: string[];
  onlyFavorites: boolean;
  onToggleFavorites: (val: boolean) => void;
  showRecentOnly: boolean;
  onToggleRecent: (val: boolean) => void;
  isDecisionMode: boolean;
  onToggleDecisionMode: (val: boolean) => void;
  onOpenAddCategoryModal: () => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
  favoritesCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedPricing,
  onSelectPricing,
  selectedTag,
  onSelectTag,
  allTags,
  onlyFavorites,
  onToggleFavorites,
  showRecentOnly,
  onToggleRecent,
  isDecisionMode,
  onToggleDecisionMode,
  onOpenAddCategoryModal,
  categoryCounts,
  totalCount,
  favoritesCount,
  mobileOpen,
  onCloseMobile
}) => {
  const content = (
    <div className="flex flex-col h-full space-y-6 text-sm">
      {/* Primary Navigation Views */}
      <div className="space-y-1">
        <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
          Views
        </div>
        <button
          id="nav-all-resources"
          onClick={() => {
            onToggleFavorites(false);
            onToggleRecent(false);
            onToggleDecisionMode(false);
            onSelectCategory('all');
            onCloseMobile();
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
            !onlyFavorites && !showRecentOnly && !isDecisionMode && selectedCategory === 'all'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
              : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4" />
            <span>All Resources</span>
          </div>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-stone-200/70 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            {totalCount}
          </span>
        </button>

        <button
          id="nav-favorites"
          onClick={() => {
            onToggleFavorites(true);
            onToggleRecent(false);
            onToggleDecisionMode(false);
            onCloseMobile();
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
            onlyFavorites
              ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
              : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>Starred / Bookmarks</span>
          </div>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-stone-200/70 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            {favoritesCount}
          </span>
        </button>

        <button
          id="nav-decision-matrix"
          onClick={() => {
            onToggleDecisionMode(true);
            onToggleFavorites(false);
            onToggleRecent(false);
            onCloseMobile();
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
            isDecisionMode
              ? 'bg-indigo-600 text-white font-semibold shadow-sm'
              : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4" />
            <span>Decision Matrix</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
            Guide
          </span>
        </button>

        <button
          id="nav-recently-added"
          onClick={() => {
            onToggleRecent(true);
            onToggleFavorites(false);
            onToggleDecisionMode(false);
            onCloseMobile();
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
            showRecentOnly
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
              : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4" />
            <span>Recently Added</span>
          </div>
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
            Categories
          </span>
          <button
            id="add-category-sidebar-btn"
            onClick={onOpenAddCategoryModal}
            className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 p-1 rounded hover:bg-stone-200/50 dark:hover:bg-stone-800"
            title="Add custom category"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-0.5">
          {categories.map((cat) => {
            const isSelected =
              !onlyFavorites && !showRecentOnly && !isDecisionMode && selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <button
                key={cat.id}
                id={`cat-nav-${cat.id}`}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onToggleFavorites(false);
                  onToggleRecent(false);
                  onToggleDecisionMode(false);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                    : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <CategoryIcon name={cat.iconName} className="w-4 h-4 shrink-0 opacity-80" />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-stone-200/70 text-stone-700 dark:bg-stone-800 dark:text-stone-300 shrink-0">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing Filters */}
      <div className="space-y-2">
        <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Pricing Model</span>
        </div>
        <div className="grid grid-cols-2 gap-1 px-1">
          {(['all', 'Free', 'Freemium', 'Paid'] as const).map((model) => (
            <button
              key={model}
              id={`filter-pricing-${model.toLowerCase()}`}
              onClick={() => onSelectPricing(model)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md border text-center transition-all ${
                selectedPricing === model
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/70 dark:text-indigo-200 font-semibold'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {model === 'all' ? 'All Prices' : model}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Cloud */}
      {allTags.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between px-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Tags</span>
            </span>
            {selectedTag && (
              <button
                onClick={() => onSelectTag('')}
                className="text-[11px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1 px-1 max-h-48 overflow-y-auto pr-1">
            {allTags.map((tag) => {
              const active = selectedTag.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  id={`tag-pill-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onSelectTag(active ? '' : tag)}
                  className={`px-2 py-0.5 text-[11px] rounded-md transition-colors ${
                    active
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-stone-200 dark:border-stone-800 p-4 bg-stone-50/50 dark:bg-stone-900/30 min-h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-full bg-white dark:bg-stone-950 p-5 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-4">
              <span className="font-bold text-stone-900 dark:text-stone-100">Filters & Navigation</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
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
