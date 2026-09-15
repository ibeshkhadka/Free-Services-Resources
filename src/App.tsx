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
import { Inbox, Scale, CheckCircle2, X } from 'lucide-react';
import { toneOf } from './components/ui/categoryTone';

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

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState<PricingModel | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showRecentOnly, setShowRecentOnly] = useState(false);
  const [bestForFilter, setBestForFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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
    const { orphanedResources } = storageService.deleteCategory(catId);
    setCategories(storageService.getCategories());
    if (selectedCategory === catId) {
      setSelectedCategory('all');
    }
    showToast(
      orphanedResources > 0
        ? `Category removed. ${orphanedResources} resource${orphanedResources === 1 ? '' : 's'} now uncategorized.`
        : 'Category removed.'
    );
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

    // Import replaces the entire library — confirm before a destructive swap.
    if (!window.confirm('Importing replaces your entire library. Continue?')) {
      e.target.value = '';
      return;
    }

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
        setBestForFilter('');
        setOnlyFavorites(false);
        setShowRecentOnly(false);
        break;
    }
  };

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const activeTone = toneOf(activeCategoryObj?.color);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
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
        onOpenCompare={() => setIsCompareModalOpen(true)}
        compareCount={comparedResourceIds.length}
        onExportData={handleExportData}
        onImportClick={() => fileInputRef.current?.click()}
        onResetDefaults={handleResetDefaults}
        totalResources={resources.length}
        totalFavorites={favoritesCount}
      />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-6xl w-full mx-auto">
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
          onlyFavorites={onlyFavorites}
          onToggleFavorites={setOnlyFavorites}
          showRecentOnly={showRecentOnly}
          onToggleRecent={setShowRecentOnly}
          onOpenAddCategoryModal={() => setIsCategoryModalOpen(true)}
          categoryCounts={categoryCounts}
          totalCount={resources.length}
          favoritesCount={favoritesCount}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 min-w-0">
          {/* Category banner (when a category is selected) */}
          {activeCategoryObj && (
            <div className={`border-b border-hairline border-l-2 ${activeTone.border} pl-4 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2`}>
              <div className="flex items-baseline gap-3 min-w-0">
                <h2 className="font-display text-xl font-semibold text-ink truncate">
                  {activeCategoryObj.name}
                </h2>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-ink-3">
                  {categoryCounts[activeCategoryObj.id] || 0} tools
                </span>
              </div>
              <p className="text-sm text-ink-2 sm:text-right">
                {activeCategoryObj.description}
              </p>
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
            activePricing={selectedPricing !== 'all' ? selectedPricing : undefined}
            activeBestForFilter={bestForFilter || undefined}
            onClearFilter={handleClearFilter}
            onOpenMobileFilters={() => setMobileSidebarOpen(true)}
            resultCount={filteredResources.length}
          />

          {/* Resource Cards Grid / List */}
          {filteredResources.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Inbox className="w-10 h-10 mx-auto text-ink-3" aria-hidden="true" />
              <h3 className="font-display text-lg font-semibold text-ink">
                No matching tools found
              </h3>
              <p className="text-sm text-ink-2 max-w-md mx-auto">
                Try clearing your search query or removing active filters to see all available tools.
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => handleClearFilter('all')}
                  className="px-4 py-2 text-xs font-medium rounded-md bg-accent text-on-accent hover:bg-accent-hover transition-colors duration-150"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => {
                    setResourceToEdit(null);
                    setIsFormModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-medium rounded-md border border-hairline-2 text-ink-2 hover:text-ink hover:border-ink-3 transition-colors duration-150"
                >
                  + Add New Resource
                </button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
                  />
                );
              })}
            </div>
          ) : (
            <div className="border-t border-hairline">
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
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Floating Compare Drawer */}
      {comparedResourceIds.length > 0 && !isCompareModalOpen && (
        <div
          id="compare-floating-drawer"
          role="status"
          className="animate-rise fixed bottom-5 right-5 z-40 bg-ink text-paper px-4 py-3 rounded-lg shadow-overlay flex items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-medium">
              {comparedResourceIds.length} {comparedResourceIds.length === 1 ? 'tool' : 'tools'} selected
            </span>
          </div>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3 py-1 text-xs font-medium rounded-sm bg-paper text-ink hover:bg-surface transition-colors duration-150"
          >
            Compare Side-by-Side
          </button>
          <button
            onClick={() => setComparedResourceIds([])}
            aria-label="Clear selection"
            className="p-1 rounded hover:bg-paper/10 text-paper/60 hover:text-paper transition-colors duration-150"
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
        <div
          role="status"
          className="animate-rise fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-md bg-ink text-paper text-xs font-medium shadow-overlay flex items-center gap-2"
        >
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
