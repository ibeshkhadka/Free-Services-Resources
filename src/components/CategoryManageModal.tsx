import React, { useState } from 'react';
import { Category } from '../types/resource';
import { Trash2 } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { Modal, Button, IconButton, Field } from './ui';

interface CategoryManageModalProps {
  isOpen: boolean; onClose: () => void; categories: Category[];
  onSaveCategory: (data: Partial<Category> & { name: string }) => void; onDeleteCategory: (id: string) => void;
}
const AVAILABLE_ICONS = ['Database', 'Bot', 'Sparkles', 'Palette', 'Terminal', 'Cloud', 'Wrench', 'Shield', 'Globe', 'Layers', 'Code2', 'Cpu', 'Boxes', 'Zap'];
export const CategoryManageModal: React.FC<CategoryManageModalProps> = ({ isOpen, onClose, categories, onSaveCategory, onDeleteCategory }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Folder');
  const [decisionFilter1, setDecisionFilter1] = useState('');
  const [decisionFilter2, setDecisionFilter2] = useState('');
  const [error, setError] = useState('');
  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    const decisionThemes = [{ label: `All ${name}`, description: `Browse all ${name} tools`, filterValue: '' }];
    if (decisionFilter1.trim()) decisionThemes.push({ label: decisionFilter1.trim(), description: `Tools best for ${decisionFilter1}`, filterValue: decisionFilter1.trim().toLowerCase() });
    if (decisionFilter2.trim()) decisionThemes.push({ label: decisionFilter2.trim(), description: `Tools best for ${decisionFilter2}`, filterValue: decisionFilter2.trim().toLowerCase() });
    try {
      onSaveCategory({ name: name.trim(), description: description.trim(), iconName, color: 'indigo', decisionThemes });
      setName(''); setDescription(''); setDecisionFilter1(''); setDecisionFilter2(''); setError(''); onClose();
    } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
  };
  return <Modal id="category-manage-modal" size="small" isOpen={isOpen} onClose={onClose} title="Manage Categories">
    <div className="form-body">
      <form onSubmit={handleCreate} className="form-body">
        <h3 className="eyebrow">+ Add New Custom Category</h3>
        {error && <p role="alert" className="form-error">{error}</p>}
        <Field label="Category Name *"><input type="text" required value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Vector Databases, LLM Observability, UI Kits" /></Field>
        <Field label="Description"><input type="text" value={description} onChange={event => setDescription(event.target.value)} placeholder="Short summary of this tool category..." /></Field>
        <fieldset className="icon-picker"><legend className="field-label">Icon</legend>
          <div className="icon-options">{AVAILABLE_ICONS.map(icon => <IconButton key={icon} label={icon} aria-pressed={iconName === icon} onClick={() => setIconName(icon)}><CategoryIcon name={icon} aria-hidden="true" /></IconButton>)}</div>
        </fieldset>
        <div className="form-grid">
          <Field label="Decision Theme 1"><input type="text" value={decisionFilter1} onChange={event => setDecisionFilter1(event.target.value)} placeholder="e.g. Best for Speed" /></Field>
          <Field label="Decision Theme 2"><input type="text" value={decisionFilter2} onChange={event => setDecisionFilter2(event.target.value)} placeholder="e.g. Best Open Source" /></Field>
        </div>
        <Button type="submit" variant="primary">Add Category</Button>
      </form>
      <section className="stack"><h3 className="eyebrow">Existing Categories ({categories.length})</h3>
        <ul className="category-list">{categories.map(cat => <li key={cat.id} className="category-item">
          <CategoryIcon name={cat.iconName} aria-hidden="true" />
          <div className="category-item-copy"><strong>{cat.name}</strong><p>{cat.description}</p></div>
          {!['baas', 'ai-agents', 'ai-app-gen', 'ai-design-ui'].includes(cat.id) && <IconButton label="Delete category" onClick={() => { if (window.confirm(`Delete category "${cat.name}"?`)) onDeleteCategory(cat.id); }}><Trash2 aria-hidden="true" /></IconButton>}
        </li>)}</ul>
      </section>
    </div>
  </Modal>;
};
