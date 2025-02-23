"use client";

import { useState, useEffect } from "react";

const backendUrl = "https://matka-zogy.onrender.com"; // Backend URL

export default function Quotes() {
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch(`${backendUrl}/quotes`); // ✅ Correct endpoint
        if (!response.ok) throw new Error("Failed to fetch quotes");

        const quotesData = await response.json();
        if (quotesData.length > 0) {
          const randomQuote =
            quotesData[Math.floor(Math.random() * quotesData.length)].text; // ✅ Pick random quote
          setQuote(randomQuote);
        } else {
          setQuote("No quotes available yet."); // ✅ Fallback if no quotes exist
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
      {/* Display a single random quote */}
      {loading ? (
        <p className="text-gray-500">Loading quote...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="italic text-gray-700 text-lg">❝ {quote} ❞</p>
      )}
    </section>
  );
}
