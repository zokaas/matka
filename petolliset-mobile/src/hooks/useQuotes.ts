// src/hooks/useQuotes.ts
import { useState, useEffect } from 'react';
import { Quote } from '../types/types';
import apiService from '../services/apiService';

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const quotesData = await apiService.getAllQuotes();
      setQuotes(quotesData);
      
      if (quotesData.length > 0) {
        const randomQuote = quotesData[Math.floor(Math.random() * quotesData.length)];
        setCurrentQuote(randomQuote.text);
      } else {
        setCurrentQuote('Lisää motivaatiota! Lähetä oma sitaattisi.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
      setCurrentQuote('Virhe sitaattien lataamisessa.');
    } finally {
      setLoading(false);
    }
  };

  const addQuote = async (text: string) => {
    try {
      await apiService.addQuote(text);
      await fetchQuotes(); // Refresh quotes
      return true;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return { quotes, currentQuote, loading, error, addQuote, refetch: fetchQuotes };
};