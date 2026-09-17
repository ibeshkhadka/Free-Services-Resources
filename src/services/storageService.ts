import { Category, Resource, FilterOptions } from '../types/resource';
import { INITIAL_CATEGORIES, INITIAL_RESOURCES } from '../data/seedData';

const STORAGE_KEY_RESOURCES = 'resource_hub_items_v1';
const STORAGE_KEY_CATEGORIES = 'resource_hub_categories_v1';

// Only http/https URLs are ever safe to render into an <a href>; anything
// else (e.g. a javascript: URL from imported data) is rejected here.
const isSafeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

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
    // Seed based on key existence, not array emptiness, so a user who deletes
    // every category doesn't get the seed data resurrected on the next read.
    if (localStorage.getItem(STORAGE_KEY_CATEGORIES) === null) {
      this.setStorageItem(STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    return this.getStorageItem<Category[]>(STORAGE_KEY_CATEGORIES, []);
  }

  saveCategory(category: Partial<Category> & { name: string }): Category {
    const categories = this.getCategories();
    const id = category.id || crypto.randomUUID(); // collision-safe ids
    const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newCat: Category = {
      id,
      name: category.name,
      slug,
      description: category.description || '',
      iconName: category.iconName || 'Folder',
      color: category.color || 'blue'
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

  // Returns how many resources referenced the deleted category so the caller
  // can warn instead of silently stranding them.
  deleteCategory(categoryId: string): { orphanedResources: number } {
    const orphaned = this.getResources().filter((r) => r.categoryId === categoryId).length;
    const categories = this.getCategories().filter((c) => c.id !== categoryId);
    this.setStorageItem(STORAGE_KEY_CATEGORIES, categories);
    return { orphanedResources: orphaned };
  }

  // --- Resources ---
  getResources(): Resource[] {
    // Same exists-check as getCategories: empty-but-present means the user
    // deliberately deleted everything — don't re-seed.
    if (localStorage.getItem(STORAGE_KEY_RESOURCES) === null) {
      this.setStorageItem(STORAGE_KEY_RESOURCES, INITIAL_RESOURCES);
      return INITIAL_RESOURCES;
    }
    return this.getStorageItem<Resource[]>(STORAGE_KEY_RESOURCES, []);
  }

  saveResource(resource: Omit<Resource, 'id' | 'addedAt'> & { id?: string; addedAt?: string }): Resource {
    const resources = this.getResources();
    const isNew = !resource.id;
    const now = new Date().toISOString();

    const completeResource: Resource = {
      ...resource,
      id: resource.id || crypto.randomUUID(), // collision-safe ids
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

      // Previously items were stored verbatim, so a resource missing required
      // fields would crash the app the moment filterResources ran on it.
      // Normalize every item instead of trusting the input.
      const normalizeResource = (raw: Partial<Resource>): Resource | null => {
        if (!raw || typeof raw.name !== 'string' || !raw.name.trim()) return null;
        const url = typeof raw.websiteUrl === 'string' ? raw.websiteUrl : '';
        return {
          id: typeof raw.id === 'string' && raw.id ? raw.id : crypto.randomUUID(),
          name: raw.name,
          shortDescription: typeof raw.shortDescription === 'string' ? raw.shortDescription : '',
          categoryId: typeof raw.categoryId === 'string' ? raw.categoryId : '',
          mainUseCase: typeof raw.mainUseCase === 'string' ? raw.mainUseCase : '',
          pricing: raw.pricing === 'Free' || raw.pricing === 'Paid' ? raw.pricing : 'Freemium',
          // Refuse non-http(s) URLs so imported data can't inject
          // javascript: hrefs into rendered links.
          websiteUrl: isSafeUrl(url) ? url : '',
          personalNotes: typeof raw.personalNotes === 'string' ? raw.personalNotes : '',
          isFavorite: Boolean(raw.isFavorite),
          rating: typeof raw.rating === 'number' ? raw.rating : undefined,
          iconSymbol: typeof raw.iconSymbol === 'string' ? raw.iconSymbol : undefined,
          addedAt: typeof raw.addedAt === 'string' ? raw.addedAt : new Date().toISOString(),
          updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : undefined,
        };
      };

      const resources = parsed.resources
        .map(normalizeResource)
        .filter((r: Resource | null): r is Resource => r !== null);
      const dropped = parsed.resources.length - resources.length;

      if (parsed.categories && Array.isArray(parsed.categories)) {
        this.setStorageItem(STORAGE_KEY_CATEGORIES, parsed.categories);
      }
      this.setStorageItem(STORAGE_KEY_RESOURCES, resources);

      const suffix = dropped > 0 ? ` (${dropped} malformed item${dropped === 1 ? '' : 's'} skipped.)` : '';
      return {
        success: true,
        message: `Imported ${resources.length} resources successfully.${suffix}`,
        count: resources.length
      };
    } catch (e: unknown) {
      return { success: false, message: `Import error: ${e instanceof Error ? e.message : 'Invalid JSON'}` };
    }
  }

  // Filter and search logic
  filterResources(resources: Resource[], options: FilterOptions): Resource[] {
    let result = [...resources];

    // Global Search across: name, shortDescription, category, use cases, personalNotes
    if (options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      result = result.filter((r) => {
        return (
          // Optional chaining: imported/legacy items may lack these fields
          // despite the type; a missing field shouldn't blank the page.
          r.name?.toLowerCase().includes(q) ||
          r.shortDescription?.toLowerCase().includes(q) ||
          r.mainUseCase?.toLowerCase().includes(q) ||
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

    // Sorting
    switch (options.sortBy) {
      case 'recent':
        // NaN comparator (missing addedAt) made sort order arbitrary;
        // treat missing dates as oldest instead.
        result.sort((a, b) => (new Date(b.addedAt).getTime() || 0) - (new Date(a.addedAt).getTime() || 0));
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
