"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../service/apiService";

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

  // Replace the useEffect for fetching reactions with:
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const reactionData = await apiService.reaction.getReactions(activityId);
        const initialCounts: { [key: string]: number } = {};
        reactionData.forEach(
          ({ type, count }: { type: string; count: number }) => {
            initialCounts[type] = count;
          }
        );
        setCounts(initialCounts);
      } catch (error) {
        console.error("Error fetching reactions:", error);
      }
    };

    fetchReactions();
  }, [activityId]);

  // Replace the toggleReaction function with:
  const toggleReaction = async (reactionType: string) => {
    try {
      const newCounts = { ...counts };
      newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;

      setCounts(newCounts);
      setReactions({ ...reactions, [reactionType]: true });

      await apiService.reaction.toggleReaction(activityId, reactionType);
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };

  // Memoized active reactions for efficiency
  const activeReactions = useMemo(
    () =>
      Object.entries(counts)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => ({
          type,
          count,
          emoji: REACTION_TYPES.find((r) => r.type === type)?.emoji || "👍",
        })),
    [counts]
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

  return (
    <div className="mt-3 flex flex-wrap gap-2 items-center">
      {/* Display active reactions */}
      {activeReactions.map(({ type, emoji, count }) => (
        <motion.button
          key={type}
          whileTap={{ scale: 0.9 }}
          className="flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors shadow-sm"
          onClick={() => toggleReaction(type)}
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
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityReactions;
