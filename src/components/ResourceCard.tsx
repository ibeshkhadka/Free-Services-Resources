import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Resource, Category } from '../types/resource';
import { ResourceIdentity, ResourceActions, WebsiteLink } from './ResourceParts';
import { IconButton } from './ui';

interface ResourceCardProps {
  resource: Resource; category?: Category; viewMode: 'grid' | 'list';
  onSelect: (resource: Resource) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  isCompared: boolean; onToggleCompare: (resource: Resource, e: React.MouseEvent) => void;
}
export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, category, viewMode, onSelect, onToggleFavorite, isCompared, onToggleCompare }) => {
  const list = viewMode === 'list';
  const actions = <ResourceActions resource={resource} isCompared={isCompared} onToggleCompare={onToggleCompare} onToggleFavorite={onToggleFavorite} list={list} />;
  const openFromSurface = (event: React.MouseEvent<HTMLElement>) => {
    if (!(event.target as HTMLElement).closest('button, a, input, select, textarea')) onSelect(resource);
  };
  return <article id={`${list ? 'resource-list-item' : 'resource-card'}-${resource.id}`} className={`${list ? 'resource-row' : 'resource-card'} ${isCompared ? 'is-compared' : ''}`} onClick={openFromSurface}>
    <div>
      <ResourceIdentity resource={resource} category={category} onSelect={onSelect} compactCategory={!list} />
      <p className="resource-description">{resource.shortDescription}</p>
    </div>
    {list ? <div className="row-actions">{actions}<WebsiteLink resource={resource} label="Open website" /></div> :
      <div className="resource-footer"><div className="resource-actions"><WebsiteLink resource={resource} /><IconButton label={`Full Details: ${resource.name}`} onClick={() => onSelect(resource)}><ArrowRight aria-hidden="true" /></IconButton></div>{actions}</div>}
  </article>;
};
