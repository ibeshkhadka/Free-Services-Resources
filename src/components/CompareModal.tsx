import React from 'react';
import { Resource, Category } from '../types/resource';
import { X, Scale, ExternalLink, Target } from 'lucide-react';
import { Modal } from './ui/Modal';
import { PricingBadge } from './ui/PricingBadge';
import { IconTile } from './ui/IconTile';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedResources: Resource[];
  categories: Category[];
  onRemoveFromCompare: (id: string) => void;
  onClearAll: () => void;
  onOpenResourceDetails: (resource: Resource) => void;
}

const metaLabel = 'font-mono text-[10px] uppercase tracking-widest text-ink-3';

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedResources,
  categories,
  onRemoveFromCompare,
  onClearAll,
  onOpenResourceDetails
}) => {
  return (
    <Modal
      id="compare-modal-window"
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Side-by-Side Comparison"
      maxWidth="max-w-6xl"
    >
      {/* Header */}
      <div className="p-5 border-b border-hairline flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-md bg-accent-soft text-accent shrink-0">
            <Scale className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-base font-semibold text-ink">
              Side-by-Side Comparison ({comparedResources.length} Tools)
            </h2>
            <p className="text-xs text-ink-3">
              Compare features and architectural fit to make the right choice.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {comparedResources.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-ink-3 hover:text-ink px-2 py-1 rounded-md hover:bg-surface transition-colors duration-150"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close comparison"
            className="p-1.5 rounded-md text-ink-3 hover:text-ink hover:bg-surface transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {comparedResources.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <Scale className="w-12 h-12 mx-auto text-hairline-2" aria-hidden="true" />
          <h3 className="font-display text-base font-semibold text-ink">
            No tools selected for comparison
          </h3>
          <p className="text-sm text-ink-2 max-w-sm mx-auto">
            Click the scale icon on any resource card to compare multiple tools side-by-side.
          </p>
        </div>
      ) : (
        <div className="p-5 sm:p-6 overflow-x-auto overflow-y-auto">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${comparedResources.length}, minmax(280px, 1fr))` }}
          >
            {comparedResources.map((res) => {
              const cat = categories.find((c) => c.id === res.categoryId);
              return (
                <div
                  key={res.id}
                  className="rounded-lg border border-hairline bg-paper p-4 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Column header */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-hairline">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <IconTile glyph={res.iconSymbol || (res.name ? res.name.slice(0, 2).toUpperCase() : '')} size="sm" />
                        <div className="min-w-0">
                          <h3 className="text-sm font-medium text-ink truncate">
                            {res.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <PricingBadge pricing={res.pricing} />
                            {cat && (
                              <span className="text-xs text-ink-3 truncate">
                                · {cat.name.split('(')[0].trim()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveFromCompare(res.id)}
                        aria-label={`Remove ${res.name} from comparison`}
                        className="p-1 rounded-md text-ink-3 hover:text-danger hover:bg-danger-soft transition-colors duration-150 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Best For */}
                    <div className="border-l-2 border-accent pl-3">
                      <div className={`${metaLabel} flex items-center gap-1 mb-1`}>
                        <Target className="w-3 h-3" aria-hidden="true" />
                        <span>Best For</span>
                      </div>
                      <div className="font-display text-sm text-ink">
                        {res.bestFor}
                      </div>
                    </div>

                    {/* Use case */}
                    <div>
                      <span className={`${metaLabel} block mb-1`}>
                        Primary Use Case
                      </span>
                      <p className="text-sm text-ink-2 leading-relaxed">
                        {res.mainUseCase}
                      </p>
                    </div>

                    {/* Personal notes */}
                    {res.personalNotes && (
                      <div>
                        <span className={`${metaLabel} block mb-1`}>
                          Personal Notes
                        </span>
                        <p className="text-sm text-ink-2 leading-relaxed">
                          {res.personalNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Column footer */}
                  <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onOpenResourceDetails(res);
                        onClose();
                      }}
                      className="text-xs font-medium text-accent hover:text-accent-hover transition-colors duration-150"
                    >
                      Full Details
                    </button>
                    <a
                      href={res.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-ink text-paper hover:bg-ink-2 transition-colors duration-150"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
};
