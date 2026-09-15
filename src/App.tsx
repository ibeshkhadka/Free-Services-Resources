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
import { Button, IconButton, EmptyState } from './components/ui';
import {
  Scale,
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

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState<PricingModel | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showRecentOnly, setShowRecentOnly] = useState(false);
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
  const [importing, setImporting] = useState(false);
  const [toastError, setToastError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, error = false) => {
    setToastError(error);
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
    showToast(orphanedResources > 0
      ? `Category removed. ${orphanedResources} resource${orphanedResources === 1 ? '' : 's'} now uncategorized.`
      : 'Category removed.');
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

    if (!window.confirm('Importing replaces your entire library. Continue?')) {
      e.target.value = '';
      return;
    }

    setImporting(true);
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
          showToast(result.message, true);
        }
      }
    };
    reader.onerror = () => showToast(reader.error?.message || 'Import error: Invalid JSON', true);
    reader.onloadend = () => setImporting(false);
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

  return (
    <div className={`app-shell ${comparedResourceIds.length ? 'has-comparison' : ''}`}>
      <input type="file" ref={fileInputRef} onChange={handleImportFile} accept=".json" hidden aria-label="Import Library (JSON)" />
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenAddModal={() => { setResourceToEdit(null); setIsFormModalOpen(true); }}
        onOpenCompare={() => setIsCompareModalOpen(true)} compareCount={comparedResourceIds.length}
        onExportData={handleExportData} onImportClick={() => fileInputRef.current?.click()}
        onResetDefaults={handleResetDefaults} totalResources={resources.length} totalFavorites={favoritesCount} importing={importing} />
      <div className="page-layout">
        <Sidebar categories={categories} selectedCategory={selectedCategory}
          onSelectCategory={id => { setSelectedCategory(id); setBestForFilter(''); }}
          selectedPricing={selectedPricing} onSelectPricing={setSelectedPricing}
          onlyFavorites={onlyFavorites} onToggleFavorites={setOnlyFavorites}
          showRecentOnly={showRecentOnly} onToggleRecent={setShowRecentOnly}
          onOpenAddCategoryModal={() => setIsCategoryModalOpen(true)}
          categoryCounts={categoryCounts} totalCount={resources.length} favoritesCount={favoritesCount}
          mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />
        <main className="main-content" aria-label="Resource library" aria-busy={importing}>
          {activeCategoryObj && <section className="category-intro">
            <div className="category-heading"><h2>{activeCategoryObj.name}</h2><span className="count">{categoryCounts[activeCategoryObj.id] || 0} tools</span></div>
            <p>{activeCategoryObj.description}</p>
          </section>}
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery}
            sortBy={sortBy} onSortChange={setSortBy} viewMode={viewMode} onViewModeChange={setViewMode}
            activeCategoryName={selectedCategory !== 'all' ? activeCategoryObj?.name : undefined}
            activePricing={selectedPricing !== 'all' ? selectedPricing : undefined}
            activeBestForFilter={bestForFilter || undefined} onClearFilter={handleClearFilter}
            onOpenMobileFilters={() => setMobileSidebarOpen(true)} resultCount={filteredResources.length} />
          {importing && <progress className="import-progress" aria-label="Import Library (JSON)" />}
          {filteredResources.length === 0 ? <EmptyState icon={<Inbox aria-hidden="true" />} title="No matching tools found"
            actions={<><Button variant="primary" onClick={() => handleClearFilter('all')}>Clear All Filters</Button><Button onClick={() => { setResourceToEdit(null); setIsFormModalOpen(true); }}>+ Add New Resource</Button></>}>
            Try clearing your search query or removing active filters to see all available tools.
          </EmptyState> : <div className={viewMode === 'grid' ? 'resource-grid' : 'resource-list'}>
            {filteredResources.map(res => <ResourceCard key={res.id} resource={res}
              category={categories.find(c => c.id === res.categoryId)} viewMode={viewMode}
              onSelect={setSelectedResourceDetail} onToggleFavorite={handleToggleFavorite}
              isCompared={comparedResourceIds.includes(res.id)} onToggleCompare={handleToggleCompare} />)}
          </div>}
        </main>
      </div>
      {comparedResourceIds.length > 0 && !isCompareModalOpen && <div id="compare-floating-drawer" className="compare-drawer" role="region" aria-label="Comparison">
        <div className="compare-summary"><Scale aria-hidden="true" /><span>{comparedResourceIds.length} {comparedResourceIds.length === 1 ? 'tool' : 'tools'} selected</span></div>
        <Button className="compare-launch" variant="primary" onClick={() => setIsCompareModalOpen(true)}>Compare Side-by-Side</Button>
        <IconButton label="Clear selection" onClick={() => setComparedResourceIds([])}><X aria-hidden="true" /></IconButton>
      </div>}
      <ResourceDetailModal resource={selectedResourceDetail}
        category={categories.find(c => c.id === selectedResourceDetail?.categoryId)}
        isOpen={Boolean(selectedResourceDetail)} onClose={() => setSelectedResourceDetail(null)}
        onToggleFavorite={handleToggleFavorite}
        onEdit={r => { setSelectedResourceDetail(null); setResourceToEdit(r); setIsFormModalOpen(true); }}
        onDelete={handleDeleteResource}
        isCompared={Boolean(selectedResourceDetail && comparedResourceIds.includes(selectedResourceDetail.id))}
        onToggleCompare={handleToggleCompare} onSavePersonalNotes={handleSavePersonalNotes} />
      <ResourceFormModal isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setResourceToEdit(null); }}
        onSave={handleSaveResource} initialData={resourceToEdit} categories={categories} />
      <CompareModal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)}
        comparedResources={comparedResources} categories={categories}
        onRemoveFromCompare={id => setComparedResourceIds(comparedResourceIds.filter(cid => cid !== id))}
        onClearAll={() => setComparedResourceIds([])} onOpenResourceDetails={setSelectedResourceDetail} />
      <CategoryManageModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}
        categories={categories} onSaveCategory={handleSaveCategory} onDeleteCategory={handleDeleteCategory} />
      <div role={toastError ? 'alert' : 'status'} aria-live={toastError ? 'assertive' : 'polite'} aria-atomic="true">
        {toastMessage && <div className={`toast ${toastError ? 'is-error' : ''}`}>{toastError ? <AlertCircle aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}<span>{toastMessage}</span></div>}
      </div>
    </div>
  );
}
