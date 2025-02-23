"use client";

import { useState } from "react";

const backendUrl = "https://matka-zogy.onrender.com"; // Backend URL

export default function SubmitQuote() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!quote.trim()) {
    setMessage("⚠️ Please enter a quote!");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    const response = await fetch(`${backendUrl}/quotes`, {
      // ✅ Fixed API URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: quote }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit the quote");
    }

    setQuote("");
    setMessage("✅ Quote submitted successfully!");
  } catch (error) {
    setMessage(`❌ ${(error as Error).message}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-semibold mb-4">
        Submit a Motivational Quote
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter your quote..."
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
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
