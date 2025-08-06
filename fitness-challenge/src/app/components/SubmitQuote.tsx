"use client";

import { useState } from "react";
import apiService from "../service/apiService";
import { useTheme } from "@/app/hooks/useTheme";

export default function SubmitQuote() {
  const { t } = useTheme();
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim()) {
      setMessage(`⚠️ ${t.submitQuote.pleaseEnterQuote}`);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await apiService.quote.addQuote(quote);
      setQuote("");
      setMessage(`✅ ${t.submitQuote.quoteSubmittedSuccessfully}`);
    } catch (error) {
      setMessage(
        `❌ ${
          error instanceof Error ? error.message : t.submitQuote.failedToSubmitQuote
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-semibold mb-4">
        {t.submitQuoteTitle}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder={t.submitQuotePlaceholder}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          rows={3}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : " text-white hover:bg-slate-700"
          }`}
        >
          {loading ? t.submitQuote.submitting : t.submitButton}
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}