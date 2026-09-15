import React, { useState, useEffect } from 'react';
import { Resource, Category, PricingModel } from '../types/resource';
import { Button, Field, Modal } from './ui';

interface ResourceFormModalProps {
  isOpen: boolean; onClose: () => void;
  onSave: (data: Omit<Resource, 'id' | 'addedAt'> & { id?: string }) => void;
  initialData?: Resource | null; categories: Category[];
}
export const ResourceFormModal: React.FC<ResourceFormModalProps> = ({ isOpen, onClose, onSave, initialData, categories }) => {
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
  const [error, setError] = useState('');
  useEffect(() => {
    setName(initialData?.name || '');
    setWebsiteUrl(initialData?.websiteUrl || '');
    setCategoryId(initialData?.categoryId || categories[0]?.id || 'baas');
    setIconSymbol(initialData?.iconSymbol || '⚡');
    setShortDescription(initialData?.shortDescription || '');
    setMainUseCase(initialData?.mainUseCase || '');
    setPricing(initialData?.pricing || 'Freemium');
    setPricingDetails(initialData?.pricingDetails || '');
    setBestFor(initialData?.bestFor || '');
    setPersonalNotes(initialData?.personalNotes || '');
    setIsFavorite(initialData?.isFavorite || false);
    setError('');
  }, [initialData, categories, isOpen]);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !websiteUrl.trim()) { setError('Please provide a tool name and website URL.'); return; }
    try {
      const parsed = new URL(websiteUrl.trim());
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error('bad scheme');
    } catch {
      setError('Website URL must be a valid http(s) URL.');
      return;
    }
    try {
      onSave({
        id: initialData?.id, name: name.trim(), websiteUrl: websiteUrl.trim(),
        categoryId: categoryId || categories[0]?.id || 'baas', iconSymbol: iconSymbol.trim() || '⚡',
        shortDescription: shortDescription.trim(), mainUseCase: mainUseCase.trim(), pricing,
        pricingDetails: pricingDetails.trim(), bestFor: bestFor.trim() || 'General development use',
        personalNotes: personalNotes.trim(), isFavorite
      });
      onClose();
    } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
  };
  return <Modal id="resource-form-modal" isOpen={isOpen} onClose={onClose}
    title={initialData ? `Edit Resource: ${initialData.name}` : 'Add New Tool to Library'}
    footer={<><Button onClick={onClose}>Cancel</Button><Button id="save-resource-btn" type="submit" form="resource-form" variant="primary">{initialData ? 'Save Changes' : 'Add to Library'}</Button></>}>
    <form id="resource-form" onSubmit={handleSubmit} className="form-body">
      {error && <p role="alert" className="form-error">{error}</p>}
      <div className="form-grid">
        <Field label="Tool Name *"><input type="text" required value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Supabase, Claude Code, v0" /></Field>
        <Field label="Category *"><select value={categoryId} onChange={event => setCategoryId(event.target.value)}>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></Field>
        <Field label="Icon / Emoji"><input type="text" maxLength={4} value={iconSymbol} onChange={event => setIconSymbol(event.target.value)} placeholder="⚡" /></Field>
        <Field label="Website URL *"><input type="url" required value={websiteUrl} onChange={event => setWebsiteUrl(event.target.value)} placeholder="https://example.com" /></Field>
        <Field label="Pricing"><select value={pricing} onChange={event => setPricing(event.target.value as PricingModel)}><option value="Free">Free</option><option value="Freemium">Freemium</option><option value="Paid">Paid</option></select></Field>
        <Field label="Pricing Details"><input type="text" value={pricingDetails} onChange={event => setPricingDetails(event.target.value)} placeholder="e.g. Free tier, Pro $20/mo" /></Field>
      </div>
      <Field className="field-callout" label={'🎯 "Best For" Field (Decision Recommendation) *'} help="This powers decision-oriented browsing so you know immediately which tool to pick.">
        <input type="text" required value={bestFor} onChange={event => setBestFor(event.target.value)} placeholder="e.g. Best database experience & rapid SQL MVPs" />
      </Field>
      <Field label="Short Description *"><textarea required rows={2} value={shortDescription} onChange={event => setShortDescription(event.target.value)} placeholder="One or two sentences explaining what the tool does..." /></Field>
      <Field label="Main Use Case"><input type="text" value={mainUseCase} onChange={event => setMainUseCase(event.target.value)} placeholder="e.g. Full-stack application backend with relational database power." /></Field>
      <Field label="Personal Notes & Impressions"><textarea rows={2} value={personalNotes} onChange={event => setPersonalNotes(event.target.value)} placeholder="Your honest thoughts, testing experience, or project ideas..." /></Field>
      <label className="checkbox-field" htmlFor="form-is-favorite"><input type="checkbox" id="form-is-favorite" checked={isFavorite} onChange={event => setIsFavorite(event.target.checked)} />Star / Bookmark this tool immediately</label>
    </form>
  </Modal>;
};
