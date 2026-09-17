import React from 'react';
import { Resource, Category } from '../types/resource';
import { Scale, ExternalLink, Trash2 } from 'lucide-react';
import { Modal, Button, IconButton, EmptyState } from './ui';
import { ResourceIdentity } from './ResourceParts';

interface CompareModalProps {
  isOpen: boolean; onClose: () => void; comparedResources: Resource[]; categories: Category[];
  onRemoveFromCompare: (id: string) => void; onClearAll: () => void;
  onOpenResourceDetails: (resource: Resource) => void;
}
export const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose, comparedResources, categories, onRemoveFromCompare, onClearAll, onOpenResourceDetails }) => {
  const hasNotes = comparedResources.some(resource => resource.personalNotes);
  return <Modal id="compare-modal-window" size="wide" isOpen={isOpen} onClose={onClose}
    title={`Side-by-Side Comparison (${comparedResources.length} Tools)`}
    subtitle="Compare features and architectural fit to make the right choice."
    bodyProps={{ tabIndex: comparedResources.length ? 0 : undefined, role: 'region', 'aria-label': 'Side-by-Side Comparison' }}>
    {comparedResources.length === 0 ? <EmptyState icon={<Scale aria-hidden="true" />} title="No tools selected for comparison">Click the scale icon (<Scale className="inline-icon" aria-hidden="true" />) on any resource card to compare multiple tools side-by-side.</EmptyState> : <>
      <div className="compare-toolbar"><Button variant="quiet" onClick={onClearAll}>Clear all</Button></div>
      <table className="comparison-table" style={{ '--compare-count': comparedResources.length } as React.CSSProperties}>
        <thead><tr><th scope="col"><span className="sr-only">Compare features</span></th>
          {comparedResources.map(resource => <th key={resource.id} scope="col"><div className="comparison-column-head">
            <ResourceIdentity resource={resource} category={categories.find(cat => cat.id === resource.categoryId)} compactCategory />
            <IconButton label={`Remove from compare: ${resource.name}`} onClick={() => onRemoveFromCompare(resource.id)}><Trash2 aria-hidden="true" /></IconButton>
          </div></th>)}
        </tr></thead>
        <tbody>
          <tr><th scope="row">Primary Use Case</th>{comparedResources.map(resource => <td key={resource.id}>{resource.mainUseCase}</td>)}</tr>
          {hasNotes && <tr><th scope="row">Personal Notes</th>{comparedResources.map(resource => <td key={resource.id}>{resource.personalNotes ? `"${resource.personalNotes}"` : null}</td>)}</tr>}
          <tr><th scope="row"><span className="sr-only">Full Details</span></th>{comparedResources.map(resource => <td key={resource.id}><div className="compare-links">
            <button className="text-button" onClick={() => { onOpenResourceDetails(resource); onClose(); }}>Full Details</button>
            <a href={resource.websiteUrl} target="_blank" rel="noopener noreferrer" className="button button--primary">Visit<ExternalLink aria-hidden="true" /></a>
          </div></td>)}</tr>
        </tbody>
      </table>
    </>}
  </Modal>;
};
