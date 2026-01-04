
import { describe, it, expect, vi } from 'vitest';
import { getRecommendations } from './geminiService';
import { UserBook } from '../types';

// Mock the @google/genai library
vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: JSON.stringify([
            { title: "AI Book", author: "AI Author", reason: "AI Reason" }
          ])
        })
      }
    })),
    Type: {
      ARRAY: 'ARRAY',
      OBJECT: 'OBJECT',
      STRING: 'STRING'
    }
  };
});

describe('geminiService', () => {
  const mockBooks: UserBook[] = [
    {
      id: '1',
      title: 'Liked Book',
      authors: ['Author A'],
      description: '',
      categories: ['Fiction'],
      isbn: '111',
      thumbnailUrl: '',
      status: 'read',
      rating: 5,
      notes: ''
    }
  ];

  it('should throw error if user has no relevant data', async () => {
    await expect(getRecommendations([], 'tr')).rejects.toThrow();
  });

  it('should return recommendations when data is provided', async () => {
    const result = await getRecommendations(mockBooks, 'tr');
    
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("AI Book");
    expect(result[0].reason).toBe("AI Reason");
  });
  
  it('should handle english language selection', async () => {
     // Checking if it runs without error implies the prompt generation logic for 'en' didn't crash
     const result = await getRecommendations(mockBooks, 'en');
     expect(result).toHaveLength(1);
  });
});
