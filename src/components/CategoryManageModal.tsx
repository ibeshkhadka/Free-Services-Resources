import React, { useState } from 'react';
import { Category } from '../types/resource';
import { X, Plus, FolderPlus, Trash2 } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div
        id="category-manage-modal"
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto z-10 flex flex-col"
      >
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Manage Categories
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6 text-xs">
          {/* Add New Category Form */}
          <form onSubmit={handleCreate} className="space-y-4 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80">
            <span className="font-bold text-stone-900 dark:text-stone-100 block text-xs">
              + Add New Custom Category
            </span>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                placeholder="e.g. Vector Databases, LLM Observability, UI Kits"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                placeholder="Short summary of this tool category..."
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Icon
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                {AVAILABLE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setIconName(icon)}
                    className={`p-2 rounded-lg border transition-colors ${
                      iconName === icon
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                    title={icon}
                  >
                    <CategoryIcon name={icon} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Decision Theme 1
                </label>
                <input
                  type="text"
                  value={decisionFilter1}
                  onChange={(e) => setDecisionFilter1(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                  placeholder="e.g. Best for Speed"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Decision Theme 2
                </label>
                <input
                  type="text"
                  value={decisionFilter2}
                  onChange={(e) => setDecisionFilter2(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                  placeholder="e.g. Best Open Source"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold"
            >
              Add Category
            </button>
          </form>

          {/* Current Categories List */}
          <div className="space-y-2">
            <span className="font-bold text-stone-900 dark:text-stone-100 block text-xs">
              Existing Categories ({categories.length})
            </span>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900"
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon name={cat.iconName} className="w-4 h-4 text-stone-500" />
                    <div>
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {cat.name}
                      </span>
                      <p className="text-[10px] text-stone-400 line-clamp-1">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  {/* Allow deleting non-default or custom categories */}
                  {!['baas', 'ai-agents', 'ai-app-gen', 'ai-design-ui'].includes(cat.id) && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete category "${cat.name}"?`)) {
                          onDeleteCategory(cat.id);
                        }
                      }}
                      className="p-1 rounded text-stone-400 hover:text-rose-500"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
