import type { Product } from '../../data/products';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text?: string;
  timestamp: Date;
  product?: Product;
  products?: Product[];
  isError?: boolean;
  isQuickSuggestions?: boolean;
}

export interface QuickSuggestion {
  id: string;
  label: string;
  prompt: string;
}
