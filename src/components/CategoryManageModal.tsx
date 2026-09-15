import React, { useState } from 'react';
import { Category } from '../types/resource';
import { Plus, Trash2 } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { Modal, ModalHeader } from './ui/Modal';

interface CategoryManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSaveCategory: (categoryData: Partial<Category> & { name: string }) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const AVAILABLE_ICONS = [
  'Database',
  'Bot',
  'Sparkles',
  'Palette',
  'Terminal',
  'Cloud',
  'Wrench',
  'Shield',
  'Globe',
  'Layers',
  'Code2',
  'Cpu',
  'Boxes',
  'Zap'
];

const inputClass = 'w-full px-3 py-2 text-sm rounded-md border border-hairline-2 bg-raised text-ink placeholder:text-ink-3 transition-colors duration-150';
const labelClass = 'block font-mono text-[10px] uppercase tracking-widest text-ink-3 mb-1.5';

export const CategoryManageModal: React.FC<CategoryManageModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategory,
  onDeleteCategory
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Folder');
  const [decisionFilter1, setDecisionFilter1] = useState('');
  const [decisionFilter2, setDecisionFilter2] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const decisionThemes = [
      { label: `All ${name}`, description: `Browse all ${name} tools`, filterValue: '' }
    ];

    if (decisionFilter1.trim()) {
      decisionThemes.push({
        label: decisionFilter1.trim(),
        description: `Tools best for ${decisionFilter1}`,
        filterValue: decisionFilter1.trim().toLowerCase()
      });
    }

    if (decisionFilter2.trim()) {
      decisionThemes.push({
        label: decisionFilter2.trim(),
        description: `Tools best for ${decisionFilter2}`,
        filterValue: decisionFilter2.trim().toLowerCase()
      });
    }

    onSaveCategory({
      name: name.trim(),
      description: description.trim(),
      iconName,
      color: 'indigo',
      decisionThemes
    });

    setName('');
    setDescription('');
    setDecisionFilter1('');
    setDecisionFilter2('');
    onClose();
  };

  return (
    <Modal
      id="category-manage-modal"
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Manage Categories"
      maxWidth="max-w-lg"
    >
      <ModalHeader title="Manage Categories" onClose={onClose} closeLabel="Close" />

      <div className="p-5 overflow-y-auto space-y-6">
        {/* Add form */}
        <form onSubmit={handleCreate} className="space-y-4 p-4 rounded-lg border border-hairline bg-paper">
          <span className="font-medium text-ink block text-sm">
            + Add New Custom Category
          </span>

          <div>
            <label htmlFor="cat-name" className={labelClass}>
              Category Name *
            </label>
            <input
              id="cat-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Vector Databases, LLM Observability, UI Kits"
            />
          </div>

          <div>
            <label htmlFor="cat-description" className={labelClass}>
              Description
            </label>
            <input
              id="cat-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="Short summary of this tool category..."
            />
          </div>

          <div>
            <span className={labelClass} id="cat-icon-label">
              Icon
            </span>
            <div
              role="radiogroup"
              aria-labelledby="cat-icon-label"
              className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1"
            >
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  role="radio"
                  aria-checked={iconName === icon}
                  aria-label={`Icon: ${icon}`}
                  onClick={() => setIconName(icon)}
                  className={`p-2 rounded-md border transition-colors duration-150 ${
                    iconName === icon
                      ? 'border-accent bg-accent-soft text-accent'
                      : 'border-hairline text-ink-2 hover:border-hairline-2 hover:text-ink'
                  }`}
                >
                  <CategoryIcon name={icon} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cat-theme-1" className={labelClass}>
                Decision Theme 1
              </label>
              <input
                id="cat-theme-1"
                type="text"
                value={decisionFilter1}
                onChange={(e) => setDecisionFilter1(e.target.value)}
                className={inputClass}
                placeholder="e.g. Best for Speed"
              />
            </div>
            <div>
              <label htmlFor="cat-theme-2" className={labelClass}>
                Decision Theme 2
              </label>
              <input
                id="cat-theme-2"
                type="text"
                value={decisionFilter2}
                onChange={(e) => setDecisionFilter2(e.target.value)}
                className={inputClass}
                placeholder="e.g. Best Open Source"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-accent text-on-accent hover:bg-accent-hover text-sm font-medium transition-colors duration-150"
          >
            Add Category
          </button>
        </form>

        {/* Existing categories */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-3 block">
            Existing Categories ({categories.length})
          </span>
          <div className="space-y-1.5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-2.5 rounded-md border border-hairline bg-paper"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CategoryIcon name={cat.iconName} className="w-4 h-4 text-ink-3 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-medium text-ink text-sm">
                      {cat.name}
                    </span>
                    <p className="text-xs text-ink-3 line-clamp-1">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {!['baas', 'ai-agents', 'ai-app-gen', 'ai-design-ui'].includes(cat.id) && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete category "${cat.name}"?`)) {
                        onDeleteCategory(cat.id);
                      }
                    }}
                    aria-label={`Delete category ${cat.name}`}
                    className="p-1.5 rounded-md text-ink-3 hover:text-danger hover:bg-danger-soft transition-colors duration-150 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
