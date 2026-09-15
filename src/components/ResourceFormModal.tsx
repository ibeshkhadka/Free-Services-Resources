import React, { useState, useEffect } from 'react';
import { Resource, Category, PricingModel } from '../types/resource';
import { Modal, ModalHeader } from './ui/Modal';

interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resourceData: Omit<Resource, 'id' | 'addedAt'> & { id?: string }) => void;
  initialData?: Resource | null;
  categories: Category[];
}

const inputClass = 'w-full px-3 py-2 text-sm rounded-md border border-hairline-2 bg-raised text-ink placeholder:text-ink-3 transition-colors duration-150';
const labelClass = 'block font-mono text-[10px] uppercase tracking-widest text-ink-3 mb-1.5';

export const ResourceFormModal: React.FC<ResourceFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories
}) => {
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [iconSymbol, setIconSymbol] = useState('⚡');
  const [shortDescription, setShortDescription] = useState('');
  const [mainUseCase, setMainUseCase] = useState('');
  const [pricing, setPricing] = useState<PricingModel>('Freemium');
  const [pricingDetails, setPricingDetails] = useState('');
  const [bestFor, setBestFor] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setWebsiteUrl(initialData.websiteUrl || '');
      setCategoryId(initialData.categoryId || (categories[0]?.id ?? ''));
      setIconSymbol(initialData.iconSymbol || '⚡');
      setShortDescription(initialData.shortDescription || '');
      setMainUseCase(initialData.mainUseCase || '');
      setPricing(initialData.pricing || 'Freemium');
      setPricingDetails(initialData.pricingDetails || '');
      setBestFor(initialData.bestFor || '');
      setPersonalNotes(initialData.personalNotes || '');
      setIsFavorite(initialData.isFavorite || false);
    } else {
      setName('');
      setWebsiteUrl('');
      setCategoryId(categories[0]?.id || 'baas');
      setIconSymbol('⚡');
      setShortDescription('');
      setMainUseCase('');
      setPricing('Freemium');
      setPricingDetails('');
      setBestFor('');
      setPersonalNotes('');
      setIsFavorite(false);
    }
  }, [initialData, categories, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = websiteUrl.trim();
    if (!name.trim() || !url) {
      alert('Please provide a tool name and website URL.');
      return;
    }
    // Only http(s) URLs are rendered into <a href> elsewhere — reject
    // anything else (including javascript: URLs) at entry.
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error('bad scheme');
    } catch {
      alert('Website URL must be a valid http(s) URL.');
      return;
    }

    onSave({
      id: initialData?.id,
      name: name.trim(),
      websiteUrl: url,
      categoryId: categoryId || categories[0]?.id || 'baas',
      iconSymbol: iconSymbol.trim() || '⚡',
      shortDescription: shortDescription.trim(),
      mainUseCase: mainUseCase.trim(),
      pricing,
      pricingDetails: pricingDetails.trim(),
      bestFor: bestFor.trim() || 'General development use',
      personalNotes: personalNotes.trim(),
      isFavorite,
    });

    onClose();
  };

  return (
    <Modal
      id="resource-form-modal"
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={initialData ? `Edit Resource: ${initialData.name}` : 'Add New Tool to Library'}
    >
      <ModalHeader
        title={initialData ? `Edit Resource: ${initialData.name}` : 'Add New Tool to Library'}
        onClose={onClose}
        closeLabel="Cancel"
      />

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5">
        {/* Row 1: Name, Icon & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="form-icon" className={labelClass}>
              Icon / Emoji
            </label>
            <input
              id="form-icon"
              type="text"
              maxLength={4}
              value={iconSymbol}
              onChange={(e) => setIconSymbol(e.target.value)}
              className={`${inputClass} text-center text-base`}
              placeholder="⚡"
            />
          </div>

          <div className="sm:col-span-5">
            <label htmlFor="form-name" className={labelClass}>
              Tool Name *
            </label>
            <input
              id="form-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Supabase, Claude Code, v0"
            />
          </div>

          <div className="sm:col-span-5">
            <label htmlFor="form-category" className={labelClass}>
              Category *
            </label>
            <select
              id="form-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputClass}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Website URL & Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7">
            <label htmlFor="form-url" className={labelClass}>
              Website URL *
            </label>
            <input
              id="form-url"
              type="url"
              required
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className={`${inputClass} font-mono text-xs`}
              placeholder="https://example.com"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="form-pricing" className={labelClass}>
              Pricing
            </label>
            <select
              id="form-pricing"
              value={pricing}
              onChange={(e) => setPricing(e.target.value as PricingModel)}
              className={inputClass}
            >
              <option value="Free">Free</option>
              <option value="Freemium">Freemium</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="form-pricing-details" className={labelClass}>
              Pricing Details
            </label>
            <input
              id="form-pricing-details"
              type="text"
              value={pricingDetails}
              onChange={(e) => setPricingDetails(e.target.value)}
              className={inputClass}
              placeholder="e.g. Free tier, Pro $20/mo"
            />
          </div>
        </div>

        {/* Row 3: "Best For" (decision recommendation) */}
        <div className="border-l-2 border-accent pl-4 py-1">
          <label htmlFor="form-best-for" className={`${labelClass} text-accent`}>
            "Best For" Field (Decision Recommendation) *
          </label>
          <input
            id="form-best-for"
            type="text"
            required
            value={bestFor}
            onChange={(e) => setBestFor(e.target.value)}
            className={inputClass}
            placeholder="e.g. Best database experience & rapid SQL MVPs"
          />
        </div>

        {/* Row 4: Short Description */}
        <div>
          <label htmlFor="form-description" className={labelClass}>
            Short Description *
          </label>
          <textarea
            id="form-description"
            required
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className={inputClass}
            placeholder="One or two sentences explaining what the tool does..."
          />
        </div>

        {/* Row 5: Main Use Case */}
        <div>
          <label htmlFor="form-use-case" className={labelClass}>
            Main Use Case
          </label>
          <input
            id="form-use-case"
            type="text"
            value={mainUseCase}
            onChange={(e) => setMainUseCase(e.target.value)}
            className={inputClass}
            placeholder="e.g. Full-stack application backend with relational database power."
          />
        </div>

        {/* Row 6: Personal Notes */}
        <div>
          <label htmlFor="form-notes" className={labelClass}>
            Personal Notes &amp; Impressions
          </label>
          <textarea
            id="form-notes"
            rows={2}
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
            className={inputClass}
            placeholder="Your honest thoughts, testing experience, or project ideas..."
          />
        </div>

        {/* Bookmark checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="form-is-favorite"
            checked={isFavorite}
            onChange={(e) => setIsFavorite(e.target.checked)}
            className="w-4 h-4 rounded accent-[var(--accent)]"
          />
          <label
            htmlFor="form-is-favorite"
            className="text-sm text-ink-2 cursor-pointer"
          >
            Star / Bookmark this tool immediately
          </label>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-hairline flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-hairline-2 text-ink-2 hover:text-ink hover:border-ink-3 text-sm font-medium transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            id="save-resource-btn"
            type="submit"
            className="px-5 py-2 rounded-md bg-accent text-on-accent hover:bg-accent-hover text-sm font-medium transition-colors duration-150"
          >
            {initialData ? 'Save Changes' : 'Add to Library'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
