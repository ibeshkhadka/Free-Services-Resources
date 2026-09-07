export type PricingModel = 'Free' | 'Freemium' | 'Paid';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string; // lucide icon identifier e.g. 'Database', 'Bot', 'Sparkles', 'Palette', etc.
  color: string; // accent color class
  decisionThemes: {
    label: string;
    description: string;
    filterValue?: string;
  }[];
}

export interface Resource {
  id: string;
  name: string;
  shortDescription: string;
  categoryId: string;
  tags: string[];
  mainUseCase: string;
  pricing: PricingModel;
  pricingDetails?: string;
  keyStrengths: string[];
  keyLimitations: string[];
  websiteUrl: string;
  personalNotes: string;
  bestFor: string;
  isFavorite: boolean;
  rating?: number; // 1-5
  iconUrl?: string; // external image/favicon or fallback
  iconSymbol?: string; // short 1-2 char symbol or emoji
  addedAt: string; // ISO date
  updatedAt?: string;
}

export type SortOption = 'recent' | 'name-asc' | 'name-desc' | 'rating' | 'favorites';

export interface FilterOptions {
  searchQuery: string;
  selectedCategory: string; // 'all' or categoryId
  selectedPricing: PricingModel | 'all';
  selectedTag: string; // '' or tag name
  onlyFavorites: boolean;
  bestForFilter: string; // specific decision filter
  sortBy: SortOption;
}
