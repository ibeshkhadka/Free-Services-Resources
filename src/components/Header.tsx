import React, { useEffect, useRef, useState } from 'react';
import { Plus, Moon, Sun, Scale, Download, Upload, RotateCcw, BookOpen, MoreHorizontal } from 'lucide-react';
import { Button, IconButton } from './ui';

interface HeaderProps {
  darkMode: boolean; onToggleDarkMode: () => void; onOpenAddModal: () => void;
  onOpenCompare: () => void; compareCount: number; onExportData: () => void;
  onImportClick: () => void; onResetDefaults: () => void;
  totalResources: number; totalFavorites: number; importing?: boolean;
}
export const Header: React.FC<HeaderProps> = ({
  darkMode, onToggleDarkMode, onOpenAddModal, onOpenCompare, compareCount,
  onExportData, onImportClick, onResetDefaults, totalResources, totalFavorites, importing
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnPointer = (event: PointerEvent) => {
      if (!anchor.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', closeOnPointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.removeEventListener('pointerdown', closeOnPointer); document.removeEventListener('keydown', closeOnEscape); };
  }, [menuOpen]);
  return <header className="site-header">
    <div className="header-inner">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true"><BookOpen /></span>
        <div><div className="brand-title"><h1>Resource Hub</h1><span className="eyebrow">Library</span></div>
          <p className="brand-subtitle">Decision &amp; bookmark engine for developer &amp; AI tools</p></div>
      </div>
      <div className="header-actions">
        {compareCount > 0 && <Button id="compare-modal-btn" className="header-compare" onClick={onOpenCompare}><Scale aria-hidden="true" /><span>Compare ({compareCount})</span></Button>}
        <Button id="add-resource-btn" variant="primary" className="header-add" onClick={onOpenAddModal}><Plus aria-hidden="true" /><span>Add Resource</span></Button>
        <div className="popover-anchor" ref={anchor} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false); }}>
          <button ref={trigger} id="data-menu-trigger" className="button button--quiet icon-button" onClick={() => setMenuOpen(!menuOpen)} title="Library options & data management" aria-label="Library options & data management" aria-expanded={menuOpen} aria-controls="library-menu"><MoreHorizontal aria-hidden="true" /></button>
          {menuOpen && <div id="library-menu" className="library-menu">
            <p className="menu-caption">Library: {totalResources} items · {totalFavorites} starred</p>
            <Button variant="quiet" className="menu-action" onClick={() => { onExportData(); setMenuOpen(false); }}><Download aria-hidden="true" />Export Library (JSON)</Button>
            <Button variant="quiet" className="menu-action" disabled={importing} aria-busy={importing} onClick={() => { onImportClick(); setMenuOpen(false); }}><Upload aria-hidden="true" />Import Library (JSON)</Button>
            <Button variant="danger" className="menu-action menu-danger" onClick={() => { if (window.confirm('Reset library to the original curated seed resources and categories?')) onResetDefaults(); setMenuOpen(false); }}><RotateCcw aria-hidden="true" />Reset to Seed Defaults</Button>
          </div>}
        </div>
        <IconButton id="theme-toggle-btn" label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} onClick={onToggleDarkMode}>{darkMode ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</IconButton>
      </div>
    </div>
  </header>;
};
