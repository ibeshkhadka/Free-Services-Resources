import React, { useEffect, useState } from 'react';
import { Resource, Category } from '../types/resource';
import {
  ExternalLink,
  Star,
  Calendar,
  FileText,
  Edit3,
  Copy,
  Check,
  Scale,
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { PricingBadge } from './ui/PricingBadge';
import { IconTile } from './ui/IconTile';
import { IconButton } from './ui/IconButton';

interface ResourceDetailModalProps {
  resource: Resource | null;
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (resource: Resource) => void;
  onSavePersonalNotes?: (id: string, notes: string) => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  category,
  isOpen,
  onClose,
  onToggleFavorite,
  onEdit,
  onDelete,
  isCompared,
  onToggleCompare,
  onSavePersonalNotes
}) => {
  const [copied, setCopied] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  // Reset the notes editor whenever the viewed resource changes; the modal
  // stays mounted while closed, so the draft would otherwise leak from the
  // previously-opened resource onto this one (and could be saved over it).
  useEffect(() => {
    setEditingNotes(false);
    setNotesDraft('');
  }, [resource?.id]);

  if (!resource) return null;

  const handleCopyLink = async () => {
    // navigator.clipboard is undefined on insecure origins (e.g. LAN http);
    // only claim success when the write actually succeeded.
    try {
      await navigator.clipboard.writeText(resource.websiteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — leave the icon unchanged
    }
  };

  const handleStartEditNotes = () => {
    setNotesDraft(resource.personalNotes || '');
    setEditingNotes(true);
  };

  const handleSaveNotes = () => {
    if (onSavePersonalNotes) {
      onSavePersonalNotes(resource.id, notesDraft);
    }
    setEditingNotes(false);
  };

  const metaLabel = 'font-mono text-[10px] uppercase tracking-widest text-ink-3';

  return (
    <Modal
      id="resource-detail-modal"
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={resource.name}
    >
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-hairline flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <IconTile
            glyph={resource.iconSymbol || (resource.name ? resource.name.slice(0, 2).toUpperCase() : '')}
            size="lg"
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-display text-xl font-semibold text-ink">
                {resource.name}
              </h2>
              <PricingBadge pricing={resource.pricing} />
              {category && (
                <span className="text-xs text-ink-3">
                  · {category.name.split('(')[0].trim()}
                </span>
              )}
            </div>

            <p className="text-sm text-ink-2 leading-relaxed">
              {resource.shortDescription}
            </p>
          </div>
        </div>

        <button
          id="close-detail-modal-btn"
          onClick={onClose}
          aria-label="Close details"
          className="p-1.5 rounded-md text-ink-3 hover:text-ink hover:bg-surface transition-colors duration-150 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
        {/* Best For — typographic highlight */}
        <div className="border-l-2 border-accent pl-4 py-1">
          <div className={`${metaLabel} mb-1`}>
            Decision Recommendation (Best For)
          </div>
          <div className="font-display text-lg text-ink">
            {resource.bestFor}
          </div>
        </div>

        {/* Use case & pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className={`${metaLabel} block mb-1.5`}>
              Main Use Case
            </span>
            <p className="text-sm text-ink-2 leading-relaxed">
              {resource.mainUseCase}
            </p>
          </div>

          <div>
            <span className={`${metaLabel} block mb-1.5`}>
              Pricing Breakdown
            </span>
            <p className="text-sm text-ink-2 leading-relaxed">
              {resource.pricingDetails || `Billed under standard ${resource.pricing.toLowerCase()} tier.`}
            </p>
          </div>
        </div>

        {/* Personal notes */}
        <div className="pt-4 border-t border-hairline space-y-2">
          <div className="flex items-center justify-between">
            <div className={`${metaLabel} flex items-center gap-1.5`}>
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Personal Notes &amp; Verdict</span>
            </div>
            {!editingNotes ? (
              <button
                onClick={handleStartEditNotes}
                className="text-xs font-medium text-accent hover:text-accent-hover inline-flex items-center gap-1 transition-colors duration-150"
              >
                <Edit3 className="w-3 h-3" aria-hidden="true" />
                <span>Edit Note</span>
              </button>
            ) : (
              <button
                onClick={handleSaveNotes}
                className="px-2.5 py-0.5 text-xs bg-accent text-on-accent rounded-sm font-medium hover:bg-accent-hover transition-colors duration-150"
              >
                Save
              </button>
            )}
          </div>

          {editingNotes ? (
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              rows={3}
              aria-label="Personal notes draft"
              className="w-full p-2.5 text-sm rounded-md border border-hairline-2 bg-paper text-ink placeholder:text-ink-3 transition-colors duration-150"
              placeholder="Write personal impressions, production experiences, tips..."
            />
          ) : (
            <p className="text-sm text-ink-2 leading-relaxed">
              {resource.personalNotes || 'No personal notes added yet. Click edit to record your thoughts.'}
            </p>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-ink-3 pt-4 border-t border-hairline">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <span>Added {new Date(resource.addedAt).toLocaleDateString()}</span>
          </span>
          {resource.websiteUrl && (
            <span className="truncate max-w-xs font-mono text-[11px]">
              {resource.websiteUrl}
            </span>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(resource)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-hairline-2 text-ink-2 hover:text-ink hover:border-ink-3 transition-colors duration-150"
            >
              <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Edit</span>
            </button>
            <button
              id="delete-resource-modal-btn"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${resource.name}?`)) {
                  onDelete(resource.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-danger hover:bg-danger-soft transition-colors duration-150"
            >
              <span>Delete</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="detail-compare-toggle-btn"
              onClick={() => onToggleCompare(resource)}
              aria-pressed={isCompared}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150 ${
                isCompared
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-hairline-2 text-ink-2 hover:text-ink hover:border-ink-3'
              }`}
            >
              <Scale className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isCompared ? 'In Compare' : 'Add to Compare'}</span>
            </button>

            <button
              id="detail-fav-btn"
              onClick={() => onToggleFavorite(resource.id)}
              aria-pressed={resource.isFavorite}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150 ${
                resource.isFavorite
                  ? 'border-sienna/40 bg-sienna-soft text-sienna'
                  : 'border-hairline-2 text-ink-2 hover:text-ink hover:border-ink-3'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${resource.isFavorite ? 'fill-sienna' : ''}`}
                aria-hidden="true"
              />
              <span>{resource.isFavorite ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <IconButton label="Copy URL" onClick={handleCopyLink}>
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
            </IconButton>

            <a
              id="open-website-btn"
              href={resource.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md bg-accent text-on-accent hover:bg-accent-hover transition-colors duration-150"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
