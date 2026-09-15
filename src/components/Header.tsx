import React, { useEffect, useRef } from 'react';
import {
  Plus,
  Moon,
  Sun,
  Scale,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAddModal: () => void;
  onOpenCompare: () => void;
  compareCount: number;
  onExportData: () => void;
  onImportClick: () => void;
  onResetDefaults: () => void;
  totalResources: number;
  totalFavorites: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenAddModal,
  onOpenCompare,
  compareCount,
  onExportData,
  onImportClick,
  onResetDefaults,
  totalResources,
  totalFavorites
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the data menu on Escape as well as outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const iconBtn = 'p-2 rounded-md text-ink-2 hover:text-ink hover:bg-surface transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none';

  return (
    <header className="sticky top-0 z-30 w-full border-b border-hairline bg-paper/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-md bg-accent text-on-accent flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <h1 className="font-display text-xl font-semibold tracking-tight text-ink truncate">
                Resource Hub
              </h1>
              <span className="hidden sm:inline-block rounded-sm border border-hairline-2 px-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-3">
                Library
              </span>
            </div>
            <p className="text-xs text-ink-3 truncate hidden sm:block">
              Decision &amp; bookmark engine for developer &amp; AI tools
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {compareCount > 0 && (
            <button
              id="compare-modal-btn"
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 bg-accent-soft text-accent hover:bg-accent hover:text-on-accent"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare ({compareCount})</span>
            </button>
          )}

          <button
            id="add-resource-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md bg-accent text-on-accent hover:bg-accent-hover active:translate-y-px transition-[colors,transform] duration-150"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Resource</span>
          </button>

          {/* Data menu */}
          <div className="relative" ref={menuRef}>
            <button
              id="data-menu-trigger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className={iconBtn}
            >
              <div className="w-4 h-4 flex flex-col justify-center items-center gap-0.5" aria-hidden="true">
                <span className="w-3.5 h-px bg-current rounded" />
                <span className="w-3.5 h-px bg-current rounded" />
                <span className="w-3.5 h-px bg-current rounded" />
              </div>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-lg border border-hairline bg-raised shadow-overlay py-1.5 z-50 text-xs text-ink-2"
                >
                  <div className="px-3 py-1.5 border-b border-hairline font-mono text-[10px] uppercase tracking-widest text-ink-3">
                    Library: {totalResources} items · {totalFavorites} starred
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => {
                      onExportData();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-surface hover:text-ink flex items-center gap-2 transition-colors duration-150"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Library (JSON)</span>
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      onImportClick();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-surface hover:text-ink flex items-center gap-2 transition-colors duration-150"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import Library (JSON)</span>
                  </button>
                  <div className="border-t border-hairline my-1" />
                  <button
                    role="menuitem"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Reset library to the original curated seed resources and categories?'
                        )
                      ) {
                        onResetDefaults();
                      }
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-danger hover:bg-danger-soft flex items-center gap-2 transition-colors duration-150"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Seed Defaults</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            className={iconBtn}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
