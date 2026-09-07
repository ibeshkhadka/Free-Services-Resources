import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Category, Resource, PricingModel, SortOption, FilterOptions } from './types/resource';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { ResourceCard } from './components/ResourceCard';
import { ResourceDetailModal } from './components/ResourceDetailModal';
import { ResourceFormModal } from './components/ResourceFormModal';
import { CompareModal } from './components/CompareModal';
import { CategoryManageModal } from './components/CategoryManageModal';
import { DecisionMatrix } from './components/DecisionMatrix';
import {
  Compass,
  Plus,
  Scale,
  Sparkles,
  Inbox,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

export default function App() {
  // --- Persistent & Theme State ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('resource_hub_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // --- Filtering & Sorting State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState<PricingModel | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showRecentOnly, setShowRecentOnly] = useState(false);
  const [isDecisionMode, setIsDecisionMode] = useState(false);
  const [bestForFilter, setBestForFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // --- Modals & Overlays ---
  const [selectedResourceDetail, setSelectedResourceDetail] = useState<Resource | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState<Resource | null>(null);
  const [comparedResourceIds, setComparedResourceIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // --- Toast Notifications ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Synchronize Dark Mode Class on Document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('resource_hub_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('resource_hub_theme', 'light');
    }
  }, [darkMode]);

  // Initial Data Load
  useEffect(() => {
    const loadedCats = storageService.getCategories();
    const loadedRes = storageService.getResources();
    setCategories(loadedCats);
    setResources(loadedRes);
  }, []);

  // Compute Tags Across All Resources
  const allTags = useMemo(() => {
    const set = new Set<string>();
    resources.forEach((r) => {
      r.tags?.forEach((t) => set.add(t));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [resources]);

  // Compute Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((c) => {
      counts[c.id] = resources.filter((r) => r.categoryId === c.id).length;
    });
    return counts;
  }, [categories, resources]);

  const favoritesCount = useMemo(() => {
    return resources.filter((r) => r.isFavorite).length;
  }, [resources]);

  // Filtered and Sorted Resources
  const filteredResources = useMemo(() => {
    const filterOptions: FilterOptions = {
      searchQuery,
      selectedCategory,
      selectedPricing,
      selectedTag,
      onlyFavorites,
      bestForFilter,
      sortBy: showRecentOnly ? 'recent' : sortBy
    };
    return storageService.filterResources(resources, filterOptions);
  }, [
    resources,
    searchQuery,
    selectedCategory,
    selectedPricing,
    selectedTag,
    onlyFavorites,
    showRecentOnly,
    bestForFilter,
    sortBy
  ]);

  // Compared resources array
  const comparedResources = useMemo(() => {
    return resources.filter((r) => comparedResourceIds.includes(r.id));
  }, [resources, comparedResourceIds]);

  // --- Handlers ---
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowFav = storageService.toggleFavorite(id);
    setResources(storageService.getResources());

    // Also update detail modal if currently looking at it
    if (selectedResourceDetail && selectedResourceDetail.id === id) {
      setSelectedResourceDetail({ ...selectedResourceDetail, isFavorite: isNowFav });
    }

    showToast(isNowFav ? 'Saved to Bookmarks' : 'Removed from Bookmarks');
  };

  const handleToggleCompare = (resource: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (comparedResourceIds.includes(resource.id)) {
      setComparedResourceIds(comparedResourceIds.filter((id) => id !== resource.id));
      showToast(`Removed ${resource.name} from comparison`);
    } else {
      if (comparedResourceIds.length >= 4) {
        showToast('You can compare up to 4 tools at a time.');
        return;
      }
      setComparedResourceIds([...comparedResourceIds, resource.id]);
      showToast(`Added ${resource.name} to comparison`);
    }
  };

  const handleSaveResource = (
    data: Omit<Resource, 'id' | 'addedAt'> & { id?: string }
  ) => {
    const saved = storageService.saveResource(data);
    setResources(storageService.getResources());
    showToast(data.id ? `Updated ${saved.name}` : `Added ${saved.name} to library`);
    if (selectedResourceDetail && selectedResourceDetail.id === saved.id) {
      setSelectedResourceDetail(saved);
    }
  };

  const handleDeleteResource = (id: string) => {
    storageService.deleteResource(id);
    setResources(storageService.getResources());
    setComparedResourceIds(comparedResourceIds.filter((cid) => cid !== id));
    if (selectedResourceDetail?.id === id) {
      setSelectedResourceDetail(null);
    }
    showToast('Resource deleted.');
  };

  const handleSavePersonalNotes = (id: string, notes: string) => {
    const res = resources.find((r) => r.id === id);
    if (res) {
      const updated = storageService.saveResource({ ...res, personalNotes: notes });
      setResources(storageService.getResources());
      if (selectedResourceDetail?.id === id) {
        setSelectedResourceDetail(updated);
      }
      showToast('Personal notes saved.');
    }
  };

  const handleSaveCategory = (catData: Partial<Category> & { name: string }) => {
    storageService.saveCategory(catData);
    setCategories(storageService.getCategories());
    showToast(`Category "${catData.name}" saved.`);
  };

  const handleDeleteCategory = (catId: string) => {
    storageService.deleteCategory(catId);
    setCategories(storageService.getCategories());
    if (selectedCategory === catId) {
      setSelectedCategory('all');
    }
    showToast('Category removed.');
  };

  const handleExportData = () => {
    const json = storageService.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resource-hub-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported library as JSON.');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const result = storageService.importData(text);
        if (result.success) {
          setCategories(storageService.getCategories());
          setResources(storageService.getResources());
          showToast(result.message);
        } else {
          alert(result.message);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefaults = () => {
    const reset = storageService.resetToDefaults();
    setCategories(reset.categories);
    setResources(reset.resources);
    setComparedResourceIds([]);
    showToast('Reset to curated seed resources.');
  };

  const handleClearFilter = (type: 'category' | 'tag' | 'pricing' | 'bestFor' | 'all') => {
    switch (type) {
      case 'category':
        setSelectedCategory('all');
        break;
      case 'tag':
        setSelectedTag('');
        break;
      case 'pricing':
        setSelectedPricing('all');
        break;
      case 'bestFor':
        setBestForFilter('');
        break;
      case 'all':
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedPricing('all');
        setSelectedTag('');
        setBestForFilter('');
        setOnlyFavorites(false);
        setShowRecentOnly(false);
        break;
    }
  };

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-stone-50/70 text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Hidden File Input for Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
        className="hidden"
      />

      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenAddModal={() => {
          setResourceToEdit(null);
          setIsFormModalOpen(true);
        }}
        onOpenDecisionGuide={() => {
          setIsDecisionMode((prev) => !prev);
          setOnlyFavorites(false);
          setShowRecentOnly(false);
        }}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        compareCount={comparedResourceIds.length}
        onExportData={handleExportData}
        onImportClick={() => fileInputRef.current?.click()}
        onResetDefaults={handleResetDefaults}
        totalResources={resources.length}
        totalFavorites={favoritesCount}
      />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => {
            setSelectedCategory(id);
            setBestForFilter('');
          }}
          selectedPricing={selectedPricing}
          onSelectPricing={setSelectedPricing}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          allTags={allTags}
          onlyFavorites={onlyFavorites}
          onToggleFavorites={setOnlyFavorites}
          showRecentOnly={showRecentOnly}
          onToggleRecent={setShowRecentOnly}
          isDecisionMode={isDecisionMode}
          onToggleDecisionMode={setIsDecisionMode}
          onOpenAddCategoryModal={() => setIsCategoryModalOpen(true)}
          categoryCounts={categoryCounts}
          totalCount={resources.length}
          favoritesCount={favoritesCount}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 min-w-0">
          {/* Decision Matrix Section (When Decision Mode is active or top of category) */}
          {isDecisionMode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    Decision-Oriented Explorer
                  </h2>
                </div>
                <button
                  onClick={() => setIsDecisionMode(false)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Return to standard grid
                </button>
              </div>

              <DecisionMatrix
                categories={categories}
                resources={resources}
                activeCategoryId={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onSelectResource={(res) => setSelectedResourceDetail(res)}
                onFilterByBestFor={(query) => {
                  setBestForFilter(query);
                  setIsDecisionMode(false);
                }}
                activeBestForFilter={bestForFilter}
              />
            </div>
          ) : (
            <>
              {/* Category Quick Decision Banner (if viewing specific category) */}
              {activeCategoryObj && (
                <div className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                          {activeCategoryObj.name}
                        </h2>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold">
                          {categoryCounts[activeCategoryObj.id] || 0} tools
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {activeCategoryObj.description}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsDecisionMode(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors shrink-0 self-start sm:self-auto"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Decision Guide</span>
                    </button>
                  </div>

                  {/* Decision Pills for this Category */}
                  {activeCategoryObj.decisionThemes && activeCategoryObj.decisionThemes.length > 0 && (
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                        Browse by Decision Criteria:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeCategoryObj.decisionThemes.map((theme) => {
                          const active = bestForFilter.toLowerCase() === theme.filterValue?.toLowerCase();
                          return (
                            <button
                              key={theme.label}
                              id={`cat-theme-${theme.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                              onClick={() => {
                                setBestForFilter(active ? '' : theme.filterValue || '');
                              }}
                              className={`px-2.5 py-1 text-xs rounded-lg transition-all border ${
                                active
                                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 font-semibold shadow-2xs'
                                  : 'bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                              }`}
                              title={theme.description}
                            >
                              {theme.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Global Search & Control Bar */}
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                activeCategoryName={selectedCategory !== 'all' ? activeCategoryObj?.name : undefined}
                activeTagName={selectedTag || undefined}
                activePricing={selectedPricing !== 'all' ? selectedPricing : undefined}
                activeBestForFilter={bestForFilter || undefined}
                onClearFilter={handleClearFilter}
                onOpenMobileFilters={() => setMobileSidebarOpen(true)}
                resultCount={filteredResources.length}
              />

              {/* Resource Cards Grid / List */}
              {filteredResources.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 bg-white/50 dark:bg-stone-900/30 space-y-3">
                  <Inbox className="w-10 h-10 mx-auto text-stone-400" />
                  <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                    No matching tools found
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Try clearing your search query or removing active filters to see all available tools.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleClearFilter('all')}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => {
                        setResourceToEdit(null);
                        setIsFormModalOpen(true);
                      }}
                      className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      + Add New Resource
                    </button>
                  </div>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredResources.map((res) => {
                    const cat = categories.find((c) => c.id === res.categoryId);
                    const isCompared = comparedResourceIds.includes(res.id);
                    return (
                      <ResourceCard
                        key={res.id}
                        resource={res}
                        category={cat}
                        viewMode="grid"
                        onSelect={(r) => setSelectedResourceDetail(r)}
                        onToggleFavorite={handleToggleFavorite}
                        isCompared={isCompared}
                        onToggleCompare={handleToggleCompare}
                        onSelectTag={(tag, e) => {
                          e.stopPropagation();
                          setSelectedTag(tag);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredResources.map((res) => {
                    const cat = categories.find((c) => c.id === res.categoryId);
                    const isCompared = comparedResourceIds.includes(res.id);
                    return (
                      <ResourceCard
                        key={res.id}
                        resource={res}
                        category={cat}
                        viewMode="list"
                        onSelect={(r) => setSelectedResourceDetail(r)}
                        onToggleFavorite={handleToggleFavorite}
                        isCompared={isCompared}
                        onToggleCompare={handleToggleCompare}
                        onSelectTag={(tag, e) => {
                          e.stopPropagation();
                          setSelectedTag(tag);
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating Compare Drawer (when 1+ items selected) */}
      {comparedResourceIds.length > 0 && !isCompareModalOpen && (
        <div
          id="compare-floating-drawer"
          className="fixed bottom-5 right-5 z-40 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-800 dark:border-stone-200 animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400 dark:text-amber-600" />
            <span className="text-xs font-bold">
              {comparedResourceIds.length} {comparedResourceIds.length === 1 ? 'tool' : 'tools'} selected
            </span>
          </div>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors shadow-xs"
          >
            Compare Side-by-Side
          </button>
          <button
            onClick={() => setComparedResourceIds([])}
            className="p-1 rounded hover:bg-stone-800 dark:hover:bg-stone-200 text-stone-400 hover:text-white dark:hover:text-stone-900"
            title="Clear selection"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <ResourceDetailModal
        resource={selectedResourceDetail}
        category={categories.find((c) => c.id === selectedResourceDetail?.categoryId)}
        isOpen={Boolean(selectedResourceDetail)}
        onClose={() => setSelectedResourceDetail(null)}
        onToggleFavorite={handleToggleFavorite}
        onEdit={(r) => {
          setSelectedResourceDetail(null);
          setResourceToEdit(r);
          setIsFormModalOpen(true);
        }}
        onDelete={handleDeleteResource}
        isCompared={Boolean(
          selectedResourceDetail && comparedResourceIds.includes(selectedResourceDetail.id)
        )}
        onToggleCompare={handleToggleCompare}
        onSavePersonalNotes={handleSavePersonalNotes}
      />

      {/* Add / Edit Resource Modal */}
      <ResourceFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setResourceToEdit(null);
        }}
        onSave={handleSaveResource}
        initialData={resourceToEdit}
        categories={categories}
      />

      {/* Compare Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        comparedResources={comparedResources}
        categories={categories}
        onRemoveFromCompare={(id) => {
          setComparedResourceIds(comparedResourceIds.filter((cid) => cid !== id));
        }}
        onClearAll={() => setComparedResourceIds([])}
        onOpenResourceDetails={(r) => setSelectedResourceDetail(r)}
      />

      {/* Manage Custom Categories Modal */}
      <CategoryManageModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-stone-900/95 text-white dark:bg-stone-100/95 dark:text-stone-900 text-xs font-medium shadow-xl border border-stone-800 dark:border-stone-200 flex items-center gap-2 backdrop-blur-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
