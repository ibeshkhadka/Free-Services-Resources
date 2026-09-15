import React from 'react';
import { ExternalLink, Scale, Star } from 'lucide-react';
import { Category, Resource } from '../types/resource';
import { IconButton } from './ui';

export function PricingBadge({ pricing }: { pricing: Resource['pricing'] }) {
  return <span className="pricing-badge">{pricing}</span>;
}
export function ResourceSymbol({ resource }: { resource: Resource }) {
  return <span className="resource-symbol" aria-hidden="true">{resource.iconSymbol || (resource.name ? resource.name.slice(0, 2).toUpperCase() : '⚡')}</span>;
}
export function ResourceIdentity({ resource, category, onSelect, compactCategory = false }: {
  resource: Resource; category?: Category; onSelect?: (resource: Resource) => void; compactCategory?: boolean;
}) {
  return <div className="resource-identity">
    <ResourceSymbol resource={resource} />
    <div className="resource-title-group">
      <h3 className="resource-title">{onSelect ? <button onClick={() => onSelect(resource)} aria-label={`Full Details: ${resource.name}`}>{resource.name}</button> : resource.name}</h3>
      <div className="resource-meta"><PricingBadge pricing={resource.pricing} />{category && <span>{compactCategory ? `· ${category.name.split('(')[0].trim()}` : category.name}</span>}</div>
    </div>
  </div>;
}
export function ResourceActions({ resource, isCompared, onToggleCompare, onToggleFavorite, list = false }: {
  resource: Resource; isCompared: boolean; list?: boolean;
  onToggleCompare: (resource: Resource, e: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}) {
  return <div className="resource-actions">
    <IconButton label={isCompared ? 'Remove from comparison' : 'Compare tool'} aria-pressed={isCompared} onClick={event => onToggleCompare(resource, event)}><Scale aria-hidden="true" /></IconButton>
    <IconButton id={`fav-btn-${resource.id}`} label={resource.isFavorite ? (list ? 'Remove favorite' : 'Remove bookmark') : (list ? 'Add to favorites' : 'Bookmark resource')} aria-pressed={resource.isFavorite} className={resource.isFavorite ? 'is-starred' : ''} onClick={event => onToggleFavorite(resource.id, event)}><Star aria-hidden="true" /></IconButton>
  </div>;
}
export function WebsiteLink({ resource, label = 'Open official website' }: { resource: Resource; label?: string }) {
  return <a className="button button--quiet icon-button" href={resource.websiteUrl} target="_blank" rel="noopener noreferrer" onClick={event => event.stopPropagation()} aria-label={`${label}: ${resource.name}`} title={label}><ExternalLink aria-hidden="true" /></a>;
}
export function BestFor({ children, label = 'Best For' }: { children: React.ReactNode; label?: string }) {
  return <div className="best-for"><div className="eyebrow">{label}</div><p>{children}</p></div>;
}
