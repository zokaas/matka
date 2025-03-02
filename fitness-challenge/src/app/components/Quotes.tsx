"use client";

import { useState, useEffect } from "react";
import apiService from "../service/apiService";

export default function Quotes() {
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
          setQuote("No quotes available yet.");
        }
      } catch (error) {
        setError("⚠️ Could not load quotes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg text-center">
      {loading ? (
        <p className="text-gray-500">Loading quote...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="italic text-gray-700 text-lg">{quote}</p>
      )}
    </section>
  );
}
