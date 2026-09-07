import React from 'react';
import { Resource, Category } from '../types/resource';
import {
  X,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Target,
  Trash2
} from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedResources: Resource[];
  categories: Category[];
  onRemoveFromCompare: (id: string) => void;
  onClearAll: () => void;
  onOpenResourceDetails: (resource: Resource) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedResources,
  categories,
  onRemoveFromCompare,
  onClearAll,
  onOpenResourceDetails
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div
        id="compare-modal-window"
        className="relative w-full max-w-6xl bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto z-10 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Side-by-Side Comparison ({comparedResources.length} Tools)
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Compare strengths, limitations, and architectural fit to make the right choice.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedResources.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 px-2 py-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        {comparedResources.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Scale className="w-12 h-12 mx-auto text-stone-300 dark:text-stone-600" />
            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              No tools selected for comparison
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Click the scale icon (<Scale className="w-3.5 h-3.5 inline mx-0.5" />) on any resource card to compare multiple tools side-by-side.
            </p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 overflow-x-auto overflow-y-auto">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparedResources.length}, minmax(280px, 1fr))` }}>
              {comparedResources.map((res) => {
                const cat = categories.find((c) => c.id === res.categoryId);
                return (
                  <div
                    key={res.id}
                    className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 p-4 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      {/* Column Header */}
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-200 dark:border-stone-800">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{res.iconSymbol || '⚡'}</span>
                          <div>
                            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                              {res.name}
                            </h3>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full border bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                                {res.pricing}
                              </span>
                              {cat && (
                                <span className="text-[10px] text-stone-400">
                                  · {cat.name.split('(')[0].trim()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveFromCompare(res.id)}
                          className="p-1 rounded text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove from compare"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Best For Callout */}
                      <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60">
                        <div className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1 mb-0.5">
                          <Target className="w-3 h-3" />
                          <span>Best For</span>
                        </div>
                        <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                          {res.bestFor}
                        </div>
                      </div>

                      {/* Main Use Case */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                          Primary Use Case
                        </span>
                        <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-white dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200/80 dark:border-stone-800">
                          {res.mainUseCase}
                        </p>
                      </div>

                      {/* Strengths */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Key Strengths</span>
                        </span>
                        <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                          {res.keyStrengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Limitations */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          <span>Key Limitations</span>
                        </span>
                        <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                          {res.keyLimitations.map((l, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{l}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Personal Notes */}
                      {res.personalNotes && (
                        <div className="p-2.5 rounded-lg bg-stone-100/70 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                            Personal Notes
                          </span>
                          <p className="text-[11px] text-stone-600 dark:text-stone-300 italic">
                            "{res.personalNotes}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Column Footer Links */}
                    <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          onOpenResourceDetails(res);
                          onClose();
                        }}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Full Details
                      </button>
                      <a
                        href={res.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
