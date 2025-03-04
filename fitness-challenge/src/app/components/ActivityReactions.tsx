"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReactionsProps {
  activityId: number;
}

interface ReactionData {
  type: string;
  count: number;
}

const backendUrl = "https://matka-zogy.onrender.com";

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
  // For tracking the user's recent reactions (UI state)
  const [userReactions, setUserReactions] = useState<{
    [key: string]: boolean;
  }>({});

  // The actual reaction counts from the server
  const [reactionCounts, setReactionCounts] = useState<{
    [key: string]: number;
  }>({});

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch reactions on component mount
  useEffect(() => {
    const fetchReactions = async () => {
      if (!activityId) return;

      try {
        setIsLoading(true);
        setError("");

        // Try a normal fetch first
        const response = await fetch(
          `${backendUrl}/activity/${activityId}/reactions`
        );

        // If normal endpoint fails, try the raw SQL fallback endpoint
        let data: ReactionData[];
        if (!response.ok && response.status === 500) {
          const fallbackResponse = await fetch(
            `${backendUrl}/activity/${activityId}/reactions/raw`
          );
          if (!fallbackResponse.ok) {
            throw new Error("Failed to fetch reactions");
          }
          data = await fallbackResponse.json();
        } else if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        } else {
          data = await response.json();
        }

        // Process the reaction data
        const counts: { [key: string]: number } = {};
        data.forEach(({ type, count }) => {
          counts[type] = count;
        });

        setReactionCounts(counts);
      } catch (error) {
        console.error("Error fetching reactions:", error);
        setError("Could not load reactions");

        // Fallback to empty reactions
        setReactionCounts({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchReactions();
  }, [activityId]);

  // Add a reaction
  const addReaction = async (reactionType: string) => {
    try {
      // Optimistic UI update
      setReactionCounts((prev) => ({
        ...prev,
        [reactionType]: (prev[reactionType] || 0) + 1,
      }));

      // Mark as clicked by user
      setUserReactions((prev) => ({
        ...prev,
        [reactionType]: true,
      }));

      // Try to send to server
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
        // If the server request fails, we don't rollback the UI
        // Because we're allowing unlimited reactions
        console.warn("Server rejected reaction, but keeping UI updated");
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
      // No rollback - just let the user keep their reaction
    }

    // Close emoji picker
    setShowEmojiPicker(false);
  };

  // Memoized active reactions
  const activeReactions = useMemo(
    () =>
      Object.entries(reactionCounts)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => ({
          type,
          count,
          emoji: REACTION_TYPES.find((r) => r.type === type)?.emoji || "👍",
        })),
    [reactionCounts]
  );

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        !(event.target as Element).closest(".emoji-picker")
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-3 flex items-center">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin mr-2"></div>
        <span className="text-sm text-gray-500">Loading reactions...</span>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2 items-center">
      {/* Error message (if any) */}
      {error && (
        <div className="w-full text-xs text-gray-500 mb-1">
          {error} - Using local reactions instead
        </div>
      )}

      {/* Display active reactions */}
      {activeReactions.map(({ type, emoji, count }) => (
        <motion.button
          key={type}
          whileTap={{ scale: 0.9 }}
          className={`flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors shadow-sm ${
            userReactions[type] ? "border border-purple-300" : ""
          }`}
          onClick={() => addReaction(type)}
          aria-label={type}
        >
          <span className="text-base mr-1">{emoji}</span>
          <span className="text-sm text-gray-700 font-medium">{count}</span>
        </motion.button>
      ))}

      {/* Add reaction button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 
                 w-10 h-10 rounded-full transition-colors shadow-sm"
        aria-label="Add reaction"
      >
        <span className="text-gray-500 text-xl">+</span>
      </motion.button>

      {/* Emoji picker popup */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="emoji-picker absolute z-10 mt-12 p-3 bg-white rounded-lg shadow-lg 
                     border border-gray-200 flex flex-wrap gap-2 max-w-xs"
          >
            {REACTION_TYPES.map(({ type, emoji }) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.9 }}
                onClick={() => addReaction(type)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-xl 
                         transition-colors ${
                           userReactions[type]
                             ? "bg-purple-100 text-purple-600"
                             : "hover:bg-gray-100"
                         }`}
                aria-label={type}
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityReactions;
