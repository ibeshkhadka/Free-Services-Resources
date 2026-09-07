import React, { useState, useEffect } from 'react';
import { Resource, Category, PricingModel } from '../types/resource';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';

interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resourceData: Omit<Resource, 'id' | 'addedAt'> & { id?: string }) => void;
  initialData?: Resource | null;
  categories: Category[];
}

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

  // Dynamic lists
  const [strengths, setStrengths] = useState<string[]>(['']);
  const [limitations, setLimitations] = useState<string[]>(['']);
  const [tagsInput, setTagsInput] = useState('');

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
      setStrengths(initialData.keyStrengths?.length ? [...initialData.keyStrengths] : ['']);
      setLimitations(initialData.keyLimitations?.length ? [...initialData.keyLimitations] : ['']);
      setTagsInput(initialData.tags?.join(', ') || '');
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
      setStrengths(['']);
      setLimitations(['']);
      setTagsInput('');
    }
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const handleAddStrength = () => setStrengths([...strengths, '']);
  const handleRemoveStrength = (index: number) => {
    setStrengths(strengths.filter((_, i) => i !== index));
  };
  const handleStrengthChange = (index: number, val: string) => {
    const updated = [...strengths];
    updated[index] = val;
    setStrengths(updated);
  };

  const handleAddLimitation = () => setLimitations([...limitations, '']);
  const handleRemoveLimitation = (index: number) => {
    setLimitations(limitations.filter((_, i) => i !== index));
  };
  const handleLimitationChange = (index: number, val: string) => {
    const updated = [...limitations];
    updated[index] = val;
    setLimitations(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !websiteUrl.trim()) {
      alert('Please provide a tool name and website URL.');
      return;
    }

    const cleanedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const cleanedStrengths = strengths.map((s) => s.trim()).filter((s) => s.length > 0);
    const cleanedLimitations = limitations.map((l) => l.trim()).filter((l) => l.length > 0);

    onSave({
      id: initialData?.id,
      name: name.trim(),
      websiteUrl: websiteUrl.trim(),
      categoryId: categoryId || categories[0]?.id || 'baas',
      iconSymbol: iconSymbol.trim() || '⚡',
      shortDescription: shortDescription.trim(),
      mainUseCase: mainUseCase.trim(),
      pricing,
      pricingDetails: pricingDetails.trim(),
      bestFor: bestFor.trim() || 'General development use',
      personalNotes: personalNotes.trim(),
      isFavorite,
      keyStrengths: cleanedStrengths,
      keyLimitations: cleanedLimitations,
      tags: cleanedTags
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div
        id="resource-form-modal"
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto z-10 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛠️</span>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {initialData ? `Edit Resource: ${initialData.name}` : 'Add New Tool to Library'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Row 1: Name, Icon & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Icon / Emoji
              </label>
              <input
                type="text"
                maxLength={4}
                value={iconSymbol}
                onChange={(e) => setIconSymbol(e.target.value)}
                className="w-full text-center py-2 text-base rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                placeholder="⚡"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Tool Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
                placeholder="e.g. Supabase, Claude Code, v0"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
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
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Website URL *
              </label>
              <input
                type="url"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
                placeholder="https://example.com"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Pricing
              </label>
              <select
                value={pricing}
                onChange={(e) => setPricing(e.target.value as PricingModel)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Pricing Details
              </label>
              <input
                type="text"
                value={pricingDetails}
                onChange={(e) => setPricingDetails(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
                placeholder="e.g. Free tier, Pro $20/mo"
              />
            </div>
          </div>

          {/* Row 3: "Best For" Decision Badge (High Priority) */}
          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
            <label className="block font-bold text-indigo-900 dark:text-indigo-200 mb-1">
              🎯 "Best For" Field (Decision Recommendation) *
            </label>
            <input
              type="text"
              required
              value={bestFor}
              onChange={(e) => setBestFor(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              placeholder="e.g. Best database experience & rapid SQL MVPs"
            />
            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
              This powers decision-oriented browsing so you know immediately which tool to pick.
            </p>
          </div>

          {/* Row 4: Short Description */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Short Description *
            </label>
            <textarea
              required
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              placeholder="One or two sentences explaining what the tool does..."
            />
          </div>

          {/* Row 5: Main Use Case */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Main Use Case
            </label>
            <input
              type="text"
              value={mainUseCase}
              onChange={(e) => setMainUseCase(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              placeholder="e.g. Full-stack application backend with relational database power."
            />
          </div>

          {/* Row 6: Key Strengths (Dynamic list) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-emerald-800 dark:text-emerald-300">
                Key Strengths
              </label>
              <button
                type="button"
                onClick={handleAddStrength}
                className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Strength</span>
              </button>
            </div>
            {strengths.map((str, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={str}
                  onChange={(e) => handleStrengthChange(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  placeholder={`Strength ${idx + 1}`}
                />
                {strengths.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStrength(idx)}
                    className="text-stone-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Row 7: Key Limitations (Dynamic list) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-amber-800 dark:text-amber-300">
                Key Limitations
              </label>
              <button
                type="button"
                onClick={handleAddLimitation}
                className="text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Limitation</span>
              </button>
            </div>
            {limitations.map((lim, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={lim}
                  onChange={(e) => handleLimitationChange(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  placeholder={`Limitation ${idx + 1}`}
                />
                {limitations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLimitation(idx)}
                    className="text-stone-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Row 8: Tags (Comma-separated) */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              placeholder="PostgreSQL, Auth, Realtime, Open Source"
            />
          </div>

          {/* Row 9: Personal Notes */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Personal Notes & Impressions
            </label>
            <textarea
              rows={2}
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              placeholder="Your honest thoughts, testing experience, or project ideas..."
            />
          </div>

          {/* Bookmark Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="form-is-favorite"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-stone-300"
            />
            <label
              htmlFor="form-is-favorite"
              className="font-medium text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              Star / Bookmark this tool immediately
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
            >
              Cancel
            </button>
            <button
              id="save-resource-btn"
              type="submit"
              className="px-5 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white font-semibold shadow-xs"
            >
              {initialData ? 'Save Changes' : 'Add to Library'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
