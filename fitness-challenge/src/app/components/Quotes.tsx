"use client";

import { useState, useEffect } from "react";
import apiService from "../service/apiService";
import { useTheme } from "@/app/hooks/useTheme";

export default function Quotes() {
  const { t } = useTheme();
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const quotesData = await apiService.quote.getAllQuotes();

        if (quotesData.length > 0) {
          const randomQuote =
            quotesData[Math.floor(Math.random() * quotesData.length)].text;
          setQuote(randomQuote);
        } else {
          setQuote(t.quotes.noQuotesAvailable);
        }
      } catch (error) {
        setError(t.quotes.couldNotLoadQuotes);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [t.quotes.noQuotesAvailable, t.quotes.couldNotLoadQuotes]);

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg text-center">
      {loading ? (
        <p className="text-gray-500">{t.quotes.loadingQuote}...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="italic text-gray-700 text-lg">{quote}</p>
      )}
    </section>
  );
}