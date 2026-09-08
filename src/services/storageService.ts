import { Category, Resource, FilterOptions } from '../types/resource';
import { INITIAL_CATEGORIES, INITIAL_RESOURCES } from '../data/seedData';

const STORAGE_KEY_RESOURCES = 'resource_hub_items_v1';
const STORAGE_KEY_CATEGORIES = 'resource_hub_categories_v1';

class StorageService {
  private getStorageItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return fallback;
    }
  }

  private setStorageItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to storage:`, e);
    }
  }

  // --- Categories ---
  getCategories(): Category[] {
    const categories = this.getStorageItem<Category[]>(STORAGE_KEY_CATEGORIES, []);
    if (!categories || categories.length === 0) {
      this.setStorageItem(STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    return categories;
  }

  saveCategory(category: Partial<Category> & { name: string }): Category {
    const categories = this.getCategories();
    const id = category.id || `cat-${Date.now()}`;
    const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newCat: Category = {
      id,
      name: category.name,
      slug,
      description: category.description || '',
      iconName: category.iconName || 'Folder',
      color: category.color || 'blue',
      decisionThemes: category.decisionThemes || [
        { label: `All ${category.name}`, description: 'Browse all resources', filterValue: '' }
      ]
    };

    const existingIndex = categories.findIndex((c) => c.id === id);
    if (existingIndex >= 0) {
      categories[existingIndex] = newCat;
    } else {
      categories.push(newCat);
    }

    this.setStorageItem(STORAGE_KEY_CATEGORIES, categories);
    return newCat;
  }

  deleteCategory(categoryId: string): void {
    const categories = this.getCategories().filter((c) => c.id !== categoryId);
    this.setStorageItem(STORAGE_KEY_CATEGORIES, categories);
  }

  // --- Resources ---
  getResources(): Resource[] {
    const resources = this.getStorageItem<Resource[]>(STORAGE_KEY_RESOURCES, []);
    if (!resources || resources.length === 0) {
      this.setStorageItem(STORAGE_KEY_RESOURCES, INITIAL_RESOURCES);
      return INITIAL_RESOURCES;
    }
    return resources;
  }

  saveResource(resource: Omit<Resource, 'id' | 'addedAt'> & { id?: string; addedAt?: string }): Resource {
    const resources = this.getResources();
    const isNew = !resource.id;
    const now = new Date().toISOString();

    const completeResource: Resource = {
      ...resource,
      id: resource.id || `res-${Date.now()}`,
      addedAt: resource.addedAt || now,
      updatedAt: now,
      isFavorite: resource.isFavorite ?? false,
    };

    if (isNew) {
      resources.unshift(completeResource);
    } else {
      const index = resources.findIndex((r) => r.id === resource.id);
      if (index >= 0) {
        resources[index] = completeResource;
      } else {
        resources.unshift(completeResource);
      }
    }

    this.setStorageItem(STORAGE_KEY_RESOURCES, resources);
    return completeResource;
  }

  deleteResource(id: string): void {
    const resources = this.getResources().filter((r) => r.id !== id);
    this.setStorageItem(STORAGE_KEY_RESOURCES, resources);
  }

  toggleFavorite(id: string): boolean {
    const resources = this.getResources();
    const resource = resources.find((r) => r.id === id);
    if (!resource) return false;

    resource.isFavorite = !resource.isFavorite;
    resource.updatedAt = new Date().toISOString();
    this.setStorageItem(STORAGE_KEY_RESOURCES, resources);
    return resource.isFavorite;
  }

  resetToDefaults(): { categories: Category[]; resources: Resource[] } {
    this.setStorageItem(STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
    this.setStorageItem(STORAGE_KEY_RESOURCES, INITIAL_RESOURCES);
    return {
      categories: INITIAL_CATEGORIES,
      resources: INITIAL_RESOURCES
    };
  }

  exportData(): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      categories: this.getCategories(),
      resources: this.getResources()
    };
    return JSON.stringify(payload, null, 2);
  }

  importData(jsonString: string): { success: boolean; message: string; count?: number } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.resources || !Array.isArray(parsed.resources)) {
        return { success: false, message: 'Invalid JSON format: missing resources array.' };
      }

      if (parsed.categories && Array.isArray(parsed.categories)) {
        this.setStorageItem(STORAGE_KEY_CATEGORIES, parsed.categories);
      }

      this.setStorageItem(STORAGE_KEY_RESOURCES, parsed.resources);
      return {
        success: true,
        message: `Imported ${parsed.resources.length} resources successfully.`,
        count: parsed.resources.length
      };
    } catch (e: unknown) {
      return { success: false, message: `Import error: ${e instanceof Error ? e.message : 'Invalid JSON'}` };
    }
  }

  // Filter and search logic
  filterResources(resources: Resource[], options: FilterOptions): Resource[] {
    let result = [...resources];

    // Global Search across: name, shortDescription, category, use cases, bestFor, personalNotes
    if (options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      result = result.filter((r) => {
        return (
          r.name.toLowerCase().includes(q) ||
          r.shortDescription.toLowerCase().includes(q) ||
          r.mainUseCase.toLowerCase().includes(q) ||
          r.bestFor.toLowerCase().includes(q) ||
          (r.personalNotes && r.personalNotes.toLowerCase().includes(q))
        );
      });
    }

    // Category filter
    if (options.selectedCategory && options.selectedCategory !== 'all') {
      result = result.filter((r) => r.categoryId === options.selectedCategory);
    }

    // Pricing filter
    if (options.selectedPricing && options.selectedPricing !== 'all') {
      result = result.filter((r) => r.pricing === options.selectedPricing);
    }

    // Favorites filter
    if (options.onlyFavorites) {
      result = result.filter((r) => r.isFavorite);
    }

    // Decision-oriented "Best For" filter
    if (options.bestForFilter) {
      const bf = options.bestForFilter.toLowerCase();
      result = result.filter((r) => {
        return (
          r.bestFor.toLowerCase().includes(bf) ||
          r.mainUseCase.toLowerCase().includes(bf)
        );
      });
    }

    // Sorting
    switch (options.sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'favorites':
        result.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
        break;
    }

    return result;
  }
}

export const storageService = new StorageService();
