import React from 'react';
import { Category, PricingModel } from '../types/resource';
import { CategoryIcon } from './CategoryIcon';
import { Layers, Star, Clock, Plus } from 'lucide-react';
import { Button, IconButton, Modal } from './ui';

interface SidebarProps {
  categories: Category[]; selectedCategory: string; onSelectCategory: (id: string) => void;
  selectedPricing: PricingModel | 'all'; onSelectPricing: (pricing: PricingModel | 'all') => void;
  onlyFavorites: boolean; onToggleFavorites: (val: boolean) => void;
  showRecentOnly: boolean; onToggleRecent: (val: boolean) => void;
  onOpenAddCategoryModal: () => void; categoryCounts: Record<string, number>;
  totalCount: number; favoritesCount: number; mobileOpen: boolean; onCloseMobile: () => void;
}
function NavItem({ selected, icon, children, count, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  selected: boolean; icon: React.ReactNode; count?: number;
}) {
  return <button className="nav-button" aria-pressed={selected} {...props}><span className="nav-label">{icon}<span>{children}</span></span>{count !== undefined && <span className="count">{count}</span>}</button>;
}
export const Sidebar: React.FC<SidebarProps> = props => {
  const { categories, selectedCategory, onSelectCategory, selectedPricing, onSelectPricing,
    onlyFavorites, onToggleFavorites, showRecentOnly, onToggleRecent, onOpenAddCategoryModal,
    categoryCounts, totalCount, favoritesCount, mobileOpen, onCloseMobile } = props;
  // Render only the open mobile copy to avoid duplicate control IDs.
  const content = (mobile = false) => <nav className="sidebar-content" aria-label="Filters & Navigation">
    <section className="nav-section" aria-label="Views">
      <div className="nav-heading"><h2 className="eyebrow">Views</h2></div>
      <NavItem id={mobile ? 'mobile-nav-all-resources' : 'nav-all-resources'} selected={!onlyFavorites && !showRecentOnly && selectedCategory === 'all'} icon={<Layers aria-hidden="true" />} count={totalCount} onClick={() => { onToggleFavorites(false); onToggleRecent(false); onSelectCategory('all'); onCloseMobile(); }}>All Resources</NavItem>
      <NavItem id={mobile ? 'mobile-nav-favorites' : 'nav-favorites'} selected={onlyFavorites} icon={<Star aria-hidden="true" />} count={favoritesCount} onClick={() => { onToggleFavorites(true); onToggleRecent(false); onCloseMobile(); }}>Starred / Bookmarks</NavItem>
      <NavItem id={mobile ? 'mobile-nav-recently-added' : 'nav-recently-added'} selected={showRecentOnly} icon={<Clock aria-hidden="true" />} onClick={() => { onToggleRecent(true); onToggleFavorites(false); onCloseMobile(); }}>Recently Added</NavItem>
    </section>
    <section className="nav-section" aria-label="Categories">
      <div className="nav-heading"><h2 className="eyebrow">Categories</h2><IconButton id={mobile ? 'mobile-add-category-sidebar-btn' : 'add-category-sidebar-btn'} label="Add custom category" onClick={() => { onCloseMobile(); onOpenAddCategoryModal(); }}><Plus aria-hidden="true" /></IconButton></div>
      {categories.map(cat => <NavItem key={cat.id} id={`${mobile ? 'mobile-' : ''}cat-nav-${cat.id}`} selected={!onlyFavorites && !showRecentOnly && selectedCategory === cat.id} icon={<CategoryIcon name={cat.iconName} aria-hidden="true" />} count={categoryCounts[cat.id] || 0} onClick={() => { onSelectCategory(cat.id); onToggleFavorites(false); onToggleRecent(false); onCloseMobile(); }}>{cat.name}</NavItem>)}
    </section>
    <section aria-label="Pricing Model"><div className="nav-heading"><h2 className="eyebrow">Pricing Model</h2></div>
      <div className="pricing-filters">{(['all', 'Free', 'Freemium', 'Paid'] as const).map(model => <Button key={model} id={`${mobile ? 'mobile-' : ''}filter-pricing-${model.toLowerCase()}`} aria-pressed={selectedPricing === model} onClick={() => onSelectPricing(model)}>{model === 'all' ? 'All Prices' : model}</Button>)}</div>
    </section>
  </nav>;
  return <>
    <aside className="sidebar">{content()}</aside>
    <Modal id="mobile-sidebar" isOpen={mobileOpen} onClose={onCloseMobile} title="Filters & Navigation" className="modal-drawer">{content(true)}</Modal>
  </>;
};
