import React from 'react';
import { Resource, Category } from '../types/resource';
import { Star, ExternalLink, Scale, ArrowRight } from 'lucide-react';
import { PricingBadge } from './ui/PricingBadge';
import { IconButton } from './ui/IconButton';
import { IconTile } from './ui/IconTile';
import { toneOf } from './ui/categoryTone';

interface ResourceCardProps {
  resource: Resource;
  category?: Category;
  viewMode: 'grid' | 'list';
  onSelect: (resource: Resource) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  isCompared: boolean;
  onToggleCompare: (resource: Resource, e: React.MouseEvent) => void;
}

const monogram = (r: Resource) =>
  r.iconSymbol || (r.name ? r.name.slice(0, 2).toUpperCase() : '');

/** Cards are divs with nested interactive elements, so they get explicit
 *  role/tabIndex/keyboard handling instead of becoming a <button>. */
const cardKeyHandlers = (onSelect: () => void) => ({
  role: 'button' as const,
  tabIndex: 0,
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  },
});

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  category,
  viewMode,
  onSelect,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
}) => {
  // Compact List View
  const tone = toneOf(category?.color);

  if (viewMode === 'list') {
    return (
      <div
        id={`resource-list-item-${resource.id}`}
        onClick={() => onSelect(resource)}
        {...cardKeyHandlers(() => onSelect(resource))}
        className={`group flex flex-col md:flex-row md:items-center justify-between gap-3 py-4 cursor-pointer transition-colors duration-150 border-b border-hairline focus-visible:bg-surface/50 ${
          isCompared ? 'bg-accent-soft/50' : 'hover:bg-surface/50'
        }`}
      >
        <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
          <IconTile glyph={monogram(resource)} size="md" color={category?.color} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-lg text-ink group-hover:text-accent transition-colors duration-150">
                {resource.name}
              </h3>
              <PricingBadge pricing={resource.pricing} />
              {category && (
                <span className={`text-xs font-medium ${tone.text}`}>
                  · {category.name.split('(')[0].trim()}
                </span>
              )}
            </div>

            <p className="text-sm text-ink-2 line-clamp-1">
              {resource.shortDescription}
            </p>

            {/* Best For tag in list view */}
            <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-2 truncate">
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-ink-3">
                Best for
              </span>
              <span className="truncate">{resource.bestFor}</span>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1 self-end md:self-auto shrink-0">
          <IconButton
            label={isCompared ? 'Remove from comparison' : 'Compare tool'}
            aria-pressed={isCompared}
            tone={isCompared ? 'accent' : 'default'}
            onClick={(e) => onToggleCompare(resource, e)}
          >
            <Scale className="w-4 h-4" />
          </IconButton>

          <IconButton
            label={resource.isFavorite ? 'Remove favorite' : 'Add to favorites'}
            aria-pressed={resource.isFavorite}
            tone={resource.isFavorite ? 'sienna' : 'default'}
            onClick={(e) => onToggleFavorite(resource.id, e)}
          >
            <Star
              className={`w-4 h-4 ${resource.isFavorite ? 'fill-sienna' : ''}`}
            />
          </IconButton>

          <a
            href={resource.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open website"
            aria-label={`Open ${resource.name} website`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md text-ink-3 hover:text-ink hover:bg-surface transition-colors duration-150"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Full Grid Card View
  return (
    <div
      id={`resource-card-${resource.id}`}
      onClick={() => onSelect(resource)}
      {...cardKeyHandlers(() => onSelect(resource))}
      className={`group relative flex flex-col justify-between rounded-lg border bg-raised p-5 transition-[colors,box-shadow] duration-150 cursor-pointer hover:shadow-rest hover:border-hairline-2 focus-visible:border-accent ${
        isCompared ? 'border-accent' : 'border-hairline'
      }`}
    >
      <div>
        {/* Card header: icon, name, pricing, category & star */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <IconTile glyph={monogram(resource)} size="md" color={category?.color} />
            <div className="min-w-0">
              <h3 className="font-display text-lg font-medium text-ink group-hover:text-accent transition-colors duration-150 truncate">
                {resource.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <PricingBadge pricing={resource.pricing} />
                {category && (
                  <span className={`text-xs font-medium ${tone.text} truncate`}>
                    · {category.name.split('(')[0].trim()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            <IconButton
              label={isCompared ? 'Remove from comparison' : 'Compare tool'}
              aria-pressed={isCompared}
              tone={isCompared ? 'accent' : 'default'}
              onClick={(e) => onToggleCompare(resource, e)}
            >
              <Scale className="w-3.5 h-3.5" />
            </IconButton>

            <IconButton
              id={`fav-btn-${resource.id}`}
              label={resource.isFavorite ? 'Remove bookmark' : 'Bookmark resource'}
              aria-pressed={resource.isFavorite}
              tone={resource.isFavorite ? 'sienna' : 'default'}
              onClick={(e) => onToggleFavorite(resource.id, e)}
            >
              <Star
                className={`w-4 h-4 ${resource.isFavorite ? 'fill-sienna' : ''}`}
              />
            </IconButton>
          </div>
        </div>

        {/* Short description — body copy at readable size & contrast */}
        <p className="text-sm text-ink-2 leading-relaxed mb-3 line-clamp-2">
          {resource.shortDescription}
        </p>

        {/* "Best For" line — hairline-separated, typographic instead of a box */}
        <div className="mb-3 flex items-baseline gap-2">
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-ink-3">
            Best for
          </span>
          <span className="font-display text-sm text-ink line-clamp-1">
            {resource.bestFor}
          </span>
        </div>

        {/* Main use case */}
        <div className="text-sm text-ink-2 mb-3">
          <span className="text-ink-3">Use case: </span>
          <span className="line-clamp-2">{resource.mainUseCase}</span>
        </div>
      </div>

      {/* Footer: link & details arrow */}
      <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2 mt-auto">
        <a
          href={resource.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title="Open official website"
          aria-label={`Open ${resource.name} website`}
          className="inline-flex items-center gap-1.5 text-xs text-ink-3 hover:text-accent transition-colors duration-150"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="truncate max-w-[200px]">
            {resource.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </span>
        </a>
        <span
          className="text-ink-3 group-hover:text-accent group-hover:translate-x-0.5 transition-[colors,transform] duration-150"
          aria-hidden="true"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
