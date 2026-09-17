import React, { useEffect, useRef, useState } from 'react';
import { Resource, Category } from '../types/resource';
import { ExternalLink, Star, Trash2, Edit3, Copy, Check, Scale } from 'lucide-react';
import { Modal, Button, IconButton } from './ui';
import { PricingBadge, ResourceSymbol } from './ResourceParts';

interface ResourceDetailModalProps {
  resource: Resource | null; category?: Category; isOpen: boolean; onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void; isCompared: boolean; onToggleCompare: (resource: Resource) => void;
  onSavePersonalNotes?: (id: string, notes: string) => void;
}
export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource, category, isOpen, onClose, onToggleFavorite, onDelete, isCompared, onToggleCompare, onSavePersonalNotes
}) => {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const notesInput = useRef<HTMLTextAreaElement>(null);
  const editNotesButton = useRef<HTMLButtonElement>(null);
  const wasEditingNotes = useRef(false);
  useEffect(() => { setCopied(false); setError(''); setEditingNotes(false); setNotesDraft(''); setNotesSaved(false); }, [resource?.id, isOpen]);
  useEffect(() => {
    if (editingNotes) { notesInput.current?.focus(); wasEditingNotes.current = true; }
    else if (wasEditingNotes.current) { editNotesButton.current?.focus(); wasEditingNotes.current = false; }
  }, [editingNotes]);
  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);
  const handleCopyLink = async () => {
    if (!resource) return;
    setCopying(true); setError(''); setCopied(false);
    try { await navigator.clipboard.writeText(resource.websiteUrl); setCopied(true); }
    catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
    finally { setCopying(false); }
  };
  const saveNotes = () => {
    if (!resource) return;
    try { onSavePersonalNotes?.(resource.id, notesDraft); setEditingNotes(false); setError(''); setNotesSaved(true); }
    catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
  };
  return <Modal id="resource-detail-modal" isOpen={isOpen && Boolean(resource)} onClose={onClose} title={resource?.name || ''}
    footer={resource && <div className="detail-actions">
      <Button id="delete-resource-modal-btn" variant="danger" onClick={() => { if (window.confirm(`Are you sure you want to delete ${resource.name}?`)) { onDelete(resource.id); onClose(); } }}><Trash2 aria-hidden="true" />Delete</Button>
      <Button id="detail-compare-toggle-btn" aria-pressed={isCompared} onClick={() => onToggleCompare(resource)}><Scale aria-hidden="true" />{isCompared ? 'In Compare' : 'Add to Compare'}</Button>
      <Button id="detail-fav-btn" aria-pressed={resource.isFavorite} onClick={() => onToggleFavorite(resource.id)} className={resource.isFavorite ? 'is-starred' : ''}><Star aria-hidden="true" />{resource.isFavorite ? 'Bookmarked' : 'Bookmark'}</Button>
      <IconButton label="Copy URL" disabled={copying} aria-busy={copying} onClick={handleCopyLink}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</IconButton>
      <a id="open-website-btn" href={resource.websiteUrl} target="_blank" rel="noopener noreferrer" className="button button--primary"><span>Visit Website</span><ExternalLink aria-hidden="true" /></a>
    </div>}>
    {resource && <div className="detail-content">
      <div className="resource-meta"><ResourceSymbol resource={resource} /><PricingBadge pricing={resource.pricing} />{category && <span>{category.name}</span>}</div>
      <p className="detail-description">{resource.shortDescription}</p>
      {error && <p role="alert" className="form-error">{error}</p>}
      <span role="status" className="sr-only">{copied ? 'Copied' : notesSaved ? 'Personal notes saved.' : ''}</span>
      <div className="detail-facts">
        <section><h3 className="eyebrow">Main Use Case</h3><p>{resource.mainUseCase}</p></section>
      </div>
      <section className="notes-section">
        <div className="notes-heading"><h3 className="eyebrow" id="personal-notes-heading">Personal Notes &amp; Verdict</h3>
          {editingNotes ? <Button variant="primary" onClick={saveNotes}>Save</Button> : <button ref={editNotesButton} className="text-button" onClick={() => { setNotesDraft(resource.personalNotes || ''); setNotesSaved(false); setEditingNotes(true); }}><Edit3 aria-hidden="true" />Edit Note</button>}
        </div>
        {editingNotes ? <textarea ref={notesInput} aria-labelledby="personal-notes-heading" className="field-input" rows={3} value={notesDraft} onChange={event => setNotesDraft(event.target.value)} placeholder="Write personal impressions, production experiences, tips..." /> :
          <p className="notes-text">{resource.personalNotes || 'No personal notes added yet. Click edit to record your thoughts.'}</p>}
      </section>
      <div className="detail-meta"><span>Added {new Date(resource.addedAt).toLocaleDateString()}</span>{resource.websiteUrl && <span>{resource.websiteUrl}</span>}</div>
    </div>}
  </Modal>;
};
