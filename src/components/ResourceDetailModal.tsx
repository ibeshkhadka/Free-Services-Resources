import React, { useState } from 'react';
import { Resource, Category } from '../types/resource';
import {
  X,
  ExternalLink,
  Star,
  Calendar,
  CreditCard,
  Target,
  FileText,
  Trash2,
  Edit3,
  Copy,
  Check,
  Scale
} from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

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

  if (!isOpen || !resource) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resource.websiteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const pricingBadgeStyles = {
    Free: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    Freemium: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
    Paid: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        id="resource-detail-modal"
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800/80 flex items-start justify-between gap-4 bg-stone-50/50 dark:bg-stone-950/40">
          <div className="flex items-start gap-4">
            {/* Logo / Symbol */}
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-2xl shrink-0 shadow-xs">
              {resource.iconSymbol || (resource.name ? resource.name.slice(0, 2).toUpperCase() : '⚡')}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {resource.name}
                </h2>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    pricingBadgeStyles[resource.pricing] || pricingBadgeStyles.Freemium
                  }`}
                >
                  {resource.pricing}
                </span>
                {category && (
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
                    {category.name}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {resource.shortDescription}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Highlight "Best For" Badge */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/90 via-sky-50/60 to-transparent dark:from-indigo-950/60 dark:via-sky-950/30 dark:to-transparent border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5 shadow-xs">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 dark:text-indigo-300">
                Decision Recommendation (Best For)
              </div>
              <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                {resource.bestFor}
              </div>
            </div>
          </div>

          {/* Main Use Case & Pricing Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600 dark:text-stone-300 block mb-1">
                Main Use Case
              </span>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {resource.mainUseCase}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-600 dark:text-stone-300 block mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3 h-3 text-stone-600 dark:text-stone-300" />
                <span>Pricing Breakdown</span>
              </span>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {resource.pricingDetails || `Billed under standard ${resource.pricing.toLowerCase()} tier.`}
              </p>
            </div>
          </div>

          {/* Personal Notes Section (Editable) */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span>Personal Notes & Verdict</span>
              </div>
              {!editingNotes ? (
                <button
                  onClick={handleStartEditNotes}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs font-medium flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Note</span>
                </button>
              ) : (
                <button
                  onClick={handleSaveNotes}
                  className="px-2.5 py-0.5 text-xs bg-indigo-600 text-white rounded-md font-medium"
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
                className="w-full p-2.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                placeholder="Write personal impressions, production experiences, tips..."
              />
            ) : (
              <p className="text-xs text-stone-600 dark:text-stone-300 italic leading-relaxed">
                {resource.personalNotes || 'No personal notes added yet. Click edit to record your thoughts.'}
              </p>
            )}
          </div>

          {/* Meta Information: Date */}
          <div className="flex items-center gap-4 text-[11px] text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Added {new Date(resource.addedAt).toLocaleDateString()}</span>
            </span>
            {resource.websiteUrl && (
              <span className="truncate max-w-xs text-stone-500">
                {resource.websiteUrl}
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/60 flex flex-wrap items-center justify-between gap-3">
          {/* Left Actions: Delete & Edit */}
          <div className="flex items-center gap-2">
            <button
              id="edit-resource-modal-btn"
              onClick={() => onEdit(resource)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
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
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          {/* Right Actions: Compare, Favorite & External Link */}
          <div className="flex items-center gap-2">
            <button
              id="detail-compare-toggle-btn"
              onClick={() => onToggleCompare(resource)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isCompared
                  ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-200 font-semibold'
                  : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'In Compare' : 'Add to Compare'}</span>
            </button>

            <button
              id="detail-fav-btn"
              onClick={() => onToggleFavorite(resource.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                resource.isFavorite
                  ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-300'
                  : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  resource.isFavorite ? 'fill-amber-400 text-amber-500' : 'text-stone-400'
                }`}
              />
              <span>{resource.isFavorite ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <a
              id="open-website-btn"
              href={resource.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shadow-xs transition-colors"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
