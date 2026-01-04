
import { Book, SearchFilters } from '../types';

const transformBook = (item: any): Book => ({
  id: item.id,
  title: item.volumeInfo.title,
  authors: item.volumeInfo.authors || ['Bilinmeyen Yazar'],
  description: item.volumeInfo.description || 'Açıklama mevcut değil.',
  categories: item.volumeInfo.categories || [],
  isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier || 'N/A',
  thumbnailUrl: item.volumeInfo.imageLinks?.thumbnail ? item.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:') : '',
  pageCount: item.volumeInfo.pageCount || 0,
  publishedDate: item.volumeInfo.publishedDate || '',
  publisher: item.volumeInfo.publisher || '',
  language: item.volumeInfo.language || '',
});

export const searchBooks = async (query: string, filters?: SearchFilters): Promise<Book[]> => {
  if (!query) return [];
  
  let apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

  // Apply filters to query or params
  if (filters?.category) {
    apiUrl += `+subject:${encodeURIComponent(filters.category)}`;
  }

  // Parameters
  const orderBy = filters?.orderBy || 'relevance';
  const printType = filters?.printType || 'all';
  
  apiUrl += `&maxResults=10&orderBy=${orderBy}&printType=${printType}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!data.items) return [];

    return data.items.map(transformBook);
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

export const getBooksByCategory = async (category: string): Promise<Book[]> => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(category)}&maxResults=10&orderBy=newest`);
    const data = await response.json();
    
    if (!data.items) return [];

    return data.items.map(transformBook);
  } catch (error) {
    console.error(`Error fetching category ${category}:`, error);
    return [];
  }
};
