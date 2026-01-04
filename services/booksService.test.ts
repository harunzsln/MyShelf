
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchBooks, getBooksByCategory } from './booksService';

// Mock global fetch
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('booksService', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchBooks', () => {
    it('should return a list of transformed books when API call is successful', async () => {
      const mockResponse = {
        items: [
          {
            id: '1',
            volumeInfo: {
              title: 'Test Book',
              authors: ['Test Author'],
              description: 'Test Desc',
              categories: ['Fiction'],
              industryIdentifiers: [{ identifier: '123456' }],
              imageLinks: { thumbnail: 'http://example.com/img.jpg' },
              pageCount: 100,
              publishedDate: '2023',
              publisher: 'Test Pub',
              language: 'en'
            }
          }
        ]
      };

      fetchMock.mockResolvedValue({
        json: () => Promise.resolve(mockResponse)
      });

      const result = await searchBooks('query');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Book');
      expect(result[0].thumbnailUrl).toBe('https://example.com/img.jpg'); // Check http -> https replacement
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('q=query'));
    });

    it('should return empty array if query is empty', async () => {
      const result = await searchBooks('');
      expect(result).toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should return empty array on API error', async () => {
      fetchMock.mockRejectedValue(new Error('API Failure'));
      const result = await searchBooks('fail');
      expect(result).toEqual([]);
    });
  });

  describe('getBooksByCategory', () => {
    it('should fetch books with subject query', async () => {
      const mockResponse = { items: [] };
      fetchMock.mockResolvedValue({
        json: () => Promise.resolve(mockResponse)
      });

      await getBooksByCategory('history');

      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('subject:history'));
    });
  });
});
