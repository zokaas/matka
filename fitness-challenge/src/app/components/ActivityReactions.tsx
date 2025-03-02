"use client";

import React, { useState, useEffect } from "react";
import { Reaction } from "../types/types";

interface ReactionsProps {
  activityId: number;
}

const REACTION_TYPES = [
  { type: "like", emoji: "👍" },
  { type: "support", emoji: "💪" },
  { type: "celebrate", emoji: "🎉" },
  { type: "inspire", emoji: "✨" },
  { type: "focus", emoji: "🎯" },
  { type: "determination", emoji: "🔥" },
  { type: "teamwork", emoji: "🤝" },
  { type: "global", emoji: "🌍" },
  { type: "love", emoji: "💖" },
  { type: "speed", emoji: "🏃‍♀️" },
  { type: "strong", emoji: "🏋️‍♀️" },
];

const ActivityReactions: React.FC<ReactionsProps> = ({ activityId }) => {
  const [reactions, setReactions] = useState<{ [key: string]: boolean }>({});
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const backendUrl = "https://matka-zogy.onrender.com";

  // Fetch existing reactions when component mounts
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/activity/${activityId}/reactions`
        );

        if (response.ok) {
          const reactionData: Reaction[] = await response.json();

          // Initialize reactions and counts from backend
          const initialReactions: { [key: string]: boolean } = {};
          const initialCounts: { [key: string]: number } = {};

          reactionData.forEach(({ type, count }) => {
            initialReactions[type] = false;
            initialCounts[type] = count;
          });

          setReactions(initialReactions);
          setCounts(initialCounts);
        }
      } catch (error) {
        console.error("Error fetching reactions:", error);
      }
    };

    fetchReactions();
  }, [activityId]);

  const toggleReaction = async (reactionType: string) => {
    try {
      // Optimistically update UI
      const newReactions = { ...reactions };
      const newCounts = { ...counts };

      // Toggle the reaction
      newReactions[reactionType] = !newReactions[reactionType];
      newCounts[reactionType] = newReactions[reactionType]
        ? (newCounts[reactionType] || 0) + 1
        : Math.max(0, (newCounts[reactionType] || 0) - 1);

      setReactions(newReactions);
      setCounts(newCounts);

      // Send reaction to backend
      const response = await fetch(
        `${backendUrl}/activity/${activityId}/reactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: reactionType }),
        }
      );

      if (!response.ok) {
        // If backend call fails, revert local state
        setReactions(reactions);
        setCounts(counts);
        console.error("Failed to update reaction");
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
      // Revert local state on error
      setReactions(reactions);
      setCounts(counts);
    }
  };

  // Get active reactions (ones with counts > 0)
  const activeReactions = Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      type,
      count,
      emoji: REACTION_TYPES.find((r) => r.type === type)?.emoji || "👍",
    }));

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        !(event.target as Element).closest(".emoji-container")
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {/* Display active reactions */}
      {activeReactions.map(({ type, emoji, count }) => (
        <button
          key={type}
          onClick={() => toggleReaction(type)}
          className="flex items-center bg-gray-100 hover:bg-gray-200 
                    px-4 py-2 rounded-full transition-colors"
          aria-label={type}
        >
          <span className="text-base mr-1">{emoji}</span>
          <span className="text-sm text-gray-700 font-medium">{count}</span>
        </button>
      ))}

      {/* Add reaction button */}
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 
                  active:bg-gray-300 w-10 h-10 rounded-full transition-colors"
        aria-label="Add reaction"
      >
        <span className="text-gray-500 text-xl">+</span>
      </button>

      {/* Emoji picker popup */}
      {showEmojiPicker && (
        <div
          className="emoji-container absolute z-10 mt-12 p-3 bg-white rounded-lg shadow-lg 
                      border border-gray-200 flex flex-wrap gap-2 max-w-xs"
        >
          {REACTION_TYPES.map(({ type, emoji }) => (
            <button
              key={type}
              onClick={() => {
                toggleReaction(type);
                setShowEmojiPicker(false);
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-xl
                        transition-colors ${
                          reactions[type]
                            ? "bg-purple-100 text-purple-600"
                            : "hover:bg-gray-100"
                        }`}
              aria-label={type}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityReactions;
