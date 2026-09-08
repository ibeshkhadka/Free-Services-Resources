import React from 'react';
import { Resource, Category } from '../types/resource';
import {
  Star,
  ExternalLink,
  Scale,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

interface ResourceCardProps {
  resource: Resource;
  category?: Category;
  viewMode: 'grid' | 'list';
  onSelect: (resource: Resource) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  isCompared: boolean;
  onToggleCompare: (resource: Resource, e: React.MouseEvent) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  category,
  viewMode,
  onSelect,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
}) => {
  const pricingColors = {
    Free: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    Freemium: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
    Paid: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
  };

  // Compact List View
  if (viewMode === 'list') {
    return (
      <div
        id={`resource-list-item-${resource.id}`}
        onClick={() => onSelect(resource)}
        className={`group flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border transition-all cursor-pointer bg-white hover:border-indigo-300 dark:bg-stone-900/90 dark:hover:border-indigo-600 shadow-2xs ${
          isCompared
            ? 'border-amber-400 dark:border-amber-500 ring-1 ring-amber-400'
            : 'border-stone-200/90 dark:border-stone-800'
        }`}
      >
        <div className="flex items-start md:items-center gap-3.5 flex-1 min-w-0">
          {/* Logo / Badge */}
          <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center shrink-0 text-lg select-none">
            {resource.iconSymbol || (resource.name ? resource.name.slice(0, 2).toUpperCase() : '⚡')}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">
                {resource.name}
              </h3>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  pricingColors[resource.pricing] || pricingColors.Freemium
                }`}
              >
                {resource.pricing}
              </span>
              {category && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                  {category.name}
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
              {resource.shortDescription}
            </p>

            {/* Best For Tag in List View */}
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
              <span className="shrink-0 text-xs">🎯</span>
              <span className="truncate">{resource.bestFor}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {/* Compare toggle */}
          <button
            onClick={(e) => onToggleCompare(resource, e)}
            className={`p-1.5 rounded-lg text-xs transition-colors border ${
              isCompared
                ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-200'
                : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title={isCompared ? 'Remove from comparison' : 'Compare tool'}
          >
            <Scale className="w-4 h-4" />
          </button>

          {/* Favorite toggle */}
          <button
            onClick={(e) => onToggleFavorite(resource.id, e)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={resource.isFavorite ? 'Remove favorite' : 'Add to favorites'}
          >
            <Star
              className={`w-4 h-4 ${
                resource.isFavorite
                  ? 'fill-amber-400 text-amber-500'
                  : 'text-stone-400'
              }`}
            />
          </button>

          {/* External link */}
          <a
            href={resource.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Open website"
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
      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-200 cursor-pointer bg-white hover:border-indigo-300 hover:shadow-md dark:bg-stone-900/80 dark:hover:border-indigo-500/70 p-5 ${
        isCompared
          ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/30'
          : 'border-stone-200/90 dark:border-stone-800/90'
      }`}
    >
      <div>
        {/* Card Header: Icon, Name, Pricing, Category & Star */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center shrink-0 text-xl select-none group-hover:scale-105 transition-transform">
              {resource.iconSymbol || (resource.name ? resource.name.slice(0, 2).toUpperCase() : '⚡')}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-base">
                  {resource.name}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    pricingColors[resource.pricing] || pricingColors.Freemium
                  }`}
                >
                  {resource.pricing}
                </span>
                {category && (
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">
                    · {category.name.split('(')[0].trim()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Compare Toggle */}
            <button
              onClick={(e) => onToggleCompare(resource, e)}
              className={`p-1.5 rounded-lg text-xs transition-colors border ${
                isCompared
                  ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-200'
                  : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={isCompared ? 'Remove from comparison' : 'Compare tool'}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            {/* Favorite Star */}
            <button
              id={`fav-btn-${resource.id}`}
              onClick={(e) => onToggleFavorite(resource.id, e)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={resource.isFavorite ? 'Remove bookmark' : 'Bookmark resource'}
            >
              <Star
                className={`w-4 h-4 ${
                  resource.isFavorite
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-stone-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-3 line-clamp-2">
          {resource.shortDescription}
        </p>

        {/* "Best For" Decision Callout Badge */}
        <div className="mb-3.5 px-3 py-2 rounded-xl bg-indigo-50/70 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/50">
          <div className="flex items-start gap-1.5">
            <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">🎯</span>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 dark:text-indigo-300 block">
                Best For
              </span>
              <span className="text-xs font-medium text-stone-800 dark:text-stone-200 line-clamp-1">
                {resource.bestFor}
              </span>
            </div>
          </div>
        </div>

        {/* Main Use Case */}
        <div className="text-xs text-stone-500 dark:text-stone-400 mb-3 bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-lg border border-stone-100 dark:border-stone-800/60">
          <span className="font-semibold text-stone-700 dark:text-stone-300">Use case: </span>
          <span className="line-clamp-2">{resource.mainUseCase}</span>
        </div>
      </div>

      {/* Footer: Link & Details Arrow */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5">
          <a
            href={resource.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-md text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            title="Open official website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
