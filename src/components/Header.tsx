import React from 'react';
import {
  Plus,
  Moon,
  Sun,
  Scale,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Search,
  BookMarked
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

  return (
    <header className="sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors duration-200 border-stone-200 bg-white/90 dark:border-stone-800 dark:bg-stone-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-sky-500 p-0.5 shadow-sm flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Resource Hub
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Library
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
              Decision & bookmark engine for developer & AI tools
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Compare Toolbar Indicator */}
          {compareCount > 0 && (
            <button
              id="compare-modal-btn"
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-sm animate-bounce"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare ({compareCount})</span>
            </button>
          )}

          {/* Add Resource Button */}
          <button
            id="add-resource-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add Resource</span>
          </button>

          {/* Settings / Data Menu */}
          <div className="relative">
            <button
              id="data-menu-trigger"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Library options & data management"
            >
              <div className="w-4 h-4 flex flex-col justify-center items-center gap-0.5">
                <span className="w-3.5 h-0.5 bg-current rounded"></span>
                <span className="w-3.5 h-0.5 bg-current rounded"></span>
                <span className="w-3.5 h-0.5 bg-current rounded"></span>
              </div>
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl py-1.5 z-50 text-xs text-stone-700 dark:text-stone-300">
                  <div className="px-3 py-1.5 border-b border-stone-100 dark:border-stone-800 font-medium text-stone-500 dark:text-stone-400 text-[11px]">
                    Library: {totalResources} items · {totalFavorites} starred
                  </div>
                  <button
                    onClick={() => {
                      onExportData();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-stone-500" />
                    <span>Export Library (JSON)</span>
                  </button>
                  <button
                    onClick={() => {
                      onImportClick();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-stone-500" />
                    <span>Import Library (JSON)</span>
                  </button>
                  <div className="border-t border-stone-100 dark:border-stone-800 my-1"></div>
                  <button
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
                    className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Seed Defaults</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
