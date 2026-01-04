
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as booksService from './services/booksService';

// Mock the services
vi.mock('./services/booksService');
vi.mock('./services/geminiService');

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset window.matchMedia for theme check
    window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }));
  });

  it('renders the initial state correctly (Discovery)', async () => {
    // Mock discovery load
    (booksService.getBooksByCategory as any).mockResolvedValue([]);
    
    render(<App />);
    
    expect(screen.getByText('MyShelf')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Kitap, yazar veya ISBN ara/i)).toBeInTheDocument();
  });

  it('performs search and displays results', async () => {
    const mockResults = [
      {
        id: '1',
        title: 'Integration Test Book',
        authors: ['Tester'],
        description: 'Desc',
        categories: ['Code'],
        isbn: '123',
        thumbnailUrl: '',
        status: 'want_to_read',
        rating: 0,
        notes: ''
      }
    ];

    (booksService.searchBooks as any).mockResolvedValue(mockResults);

    render(<App />);

    // Type in search box
    const input = screen.getByPlaceholderText(/Kitap, yazar veya ISBN ara/i);
    fireEvent.change(input, { target: { value: 'Integration' } });
    
    // Trigger search (assuming the Enter key or form submit triggers it)
    fireEvent.submit(input.closest('form')!);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Integration Test Book')).toBeInTheDocument();
    });
  });

  it('adds a book to the library', async () => {
    const mockBook = {
        id: '1',
        title: 'Book to Add',
        authors: ['Author'],
        thumbnailUrl: '',
        status: 'want_to_read',
        rating: 0
    };

    (booksService.searchBooks as any).mockResolvedValue([mockBook]);
    render(<App />);

    // Search
    const input = screen.getByPlaceholderText(/Kitap, yazar veya ISBN ara/i);
    fireEvent.change(input, { target: { value: 'Book' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
        expect(screen.getByText('Book to Add')).toBeInTheDocument();
    });

    // Click on the book to open details (mocking the flow)
    fireEvent.click(screen.getByText('Book to Add'));

    // Wait for modal and click "Want to Read" (İstek Listesi)
    // Note: The text depends on the language default (TR)
    await waitFor(() => {
        const addButtons = screen.getAllByText('İstek'); // Partial match for "İstek Listesine Ekle" or similar
        // Just finding one button to click is enough for integration proof
        if(addButtons[0]) fireEvent.click(addButtons[0]);
    });
    
    // Verify it is added by checking if "Kitaplıkta Ekli" (In Library) logic appears or checking Shelf tab
    // Let's switch to Library tab
    const libraryNav = screen.getByText('Kitaplığım'); // Nav button
    fireEvent.click(libraryNav);
    
    expect(screen.getByText('Book to Add')).toBeInTheDocument();
  });
});
