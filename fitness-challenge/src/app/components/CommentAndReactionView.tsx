"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Comment, Reaction } from "../types/types";

interface CommentAndReactionViewProps {
  activityId: number;
}

const REACTION_EMOJI_MAP: Record<string, string> = {
  like: "👍",
  support: "💪",
  celebrate: "🎉",
  inspire: "✨",
  determination: "🔥",
  teamwork: "🤝",
  global: "🌍",
  love: "💖",
  speed: "🏃‍♀️",
  strong: "🏋️‍♀️",
  medal: "🥇",
  trophy: "🏆",
  bicycle: "🚴‍♀️",
  swimming: "🏊‍♀️",
  mountain: "⛰️",
  gym: "💯",
  highfive: "✋",
  clap: "👏",
  energy: "⚡",
  rocket: "🚀",
};

const backendUrl = "https://matka-zogy.onrender.com";

const CommentAndReactionView: React.FC<CommentAndReactionViewProps> = ({
  activityId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReactionsAndComments = useCallback(async () => {
    try {
      setError("");
      const [reactionsResponse, commentsResponse] = await Promise.all([
        fetch(`${backendUrl}/activity/${activityId}/reactions`),
        fetch(`${backendUrl}/activity/${activityId}/comments`),
      ]);

      if (reactionsResponse.ok) {
        setReactions(await reactionsResponse.json());
      }

      if (commentsResponse.ok) {
        setComments(await commentsResponse.json());
      }
    } catch (err) {
      setError("Reaktioiden tai kommenttien lataaminen epäonnistui.");
    }
  }, [activityId]);

  useEffect(() => {
    fetchReactionsAndComments();
  }, [fetchReactionsAndComments]);

  const loadFullComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/activity/${activityId}/comments`
      );
      if (!response.ok) throw new Error("Kommenttien lataaminen epäonnistui.");

      setComments(await response.json());
      setShowComments(true);
    } catch (err) {
      setError("Kommenttien lataaminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="pt-3">
      {/* Reactions Display */}
      {reactions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {reactions.map(({ type, count }) => (
            <motion.div
              key={type}
              className="flex items-center bg-gray-100 px-3 py-2 rounded-full shadow-sm"
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-base mr-1">
                {REACTION_EMOJI_MAP[type] || "👍"}
              </span>
              <span className="text-sm font-medium">{count}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Comments Toggle Button */}
      {comments.length > 0 && (
        <button
          onClick={loadFullComments}
          className="text-slate-600 hover:text-slate-800 text-sm flex items-center mt-2 transition-colors"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            whileHover={{ scale: 1.1 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </motion.svg>
          {showComments
            ? "Piilota kommentit"
            : `Näytä kommentit (${comments.length})`}
        </button>
      )}

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-3 space-y-3"
          >
            {loading ? (
              <div className="text-center p-2 text-sm text-gray-500">
                <motion.div
                  className="h-4 w-4 border-t-2 border-gray-500 border-solid rounded-full mx-auto animate-spin"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                Ladataan kommentteja...
              </div>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-gray-50 p-3 rounded border shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-gray-700 text-sm">{comment.text}</p>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-red-500 p-2 text-xs mt-2 bg-red-100 border border-red-400 rounded"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentAndReactionView;
