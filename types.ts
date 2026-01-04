
export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  categories: string[];
  isbn: string;
  thumbnailUrl: string;
  pageCount?: number;
  publishedDate?: string;
  publisher?: string;
  language?: string;
}

export interface UserBook extends Book {
  status: 'want_to_read' | 'reading' | 'read' | 'dropped';
  rating: number;
  notes: string;
}

export interface Recommendation {
  title: string;
  author: string;
  reason: string;
}

export interface SearchFilters {
  category?: string;
  printType?: 'all' | 'books' | 'magazines';
  orderBy?: 'relevance' | 'newest';
}

export interface HomeConfig {
  enabledCategories: string[];
}
