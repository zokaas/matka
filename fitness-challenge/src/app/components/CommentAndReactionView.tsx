"use client";

import React, { useState, useEffect } from "react";
import { Comment, Reaction } from "../types/types";

interface CommentAndReactionViewProps {
  activityId: number;
}

const REACTION_EMOJI_MAP = {
  "like": "🤝",
  "support": "🏃‍♀️",
  "celebrate": "🏋️‍♀️",
  "inspire": "✨",
  "focus": "🎯",
  "determination": "🔥",
  "teamwork": "🤝",
  "global": "🌍",
  "love": "💖",
  "speed": "🏃‍♀️",
  "strong": "🏋️‍♀️",
};

const CommentAndReactionView: React.FC<CommentAndReactionViewProps> = ({ activityId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = "https://matka-zogy.onrender.com";

  useEffect(() => {
    const fetchReactionsAndCommentCount = async () => {
      try {
        // Fetch reactions
        const reactionsResponse = await fetch(
          `${backendUrl}/activity/${activityId}/reactions`
        );
        
        if (reactionsResponse.ok) {
          const reactionsData = await reactionsResponse.json();
          setReactions(reactionsData);
        }
        
        // Fetch comment count without loading all comments yet
        const commentsResponse = await fetch(
          `${backendUrl}/activity/${activityId}/comments`
        );
        
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          // Just store the comments count for display
          setComments(commentsData);
        }
      } catch (error) {
        console.error("Error fetching reactions or comments:", error);
        setError("Failed to load reactions or comments");
      }
    };

    fetchReactionsAndCommentCount();
  }, [activityId, backendUrl]);

  const loadFullComments = async () => {
    if (showComments) {
      // Already loaded, just toggle visibility
      setShowComments(false);
      return;
    }
    
    try {
      setLoading(true);
      // Fetch full comments when user clicks to view them
      const response = await fetch(
        `${backendUrl}/activity/${activityId}/comments`
      );
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        setShowComments(true);
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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

  // Get emoji for reaction type
  const getEmojiForType = (type: string) => {
    return REACTION_EMOJI_MAP[type as keyof typeof REACTION_EMOJI_MAP] || "👍";
  };

  return (
    <div className="mt-4 pt-3">
      {/* Reactions Display - Horizontally laid out buttons */}
      {reactions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {reactions.map(({ type, count }) => (
            <div 
              key={type}
              className="flex items-center bg-gray-100 px-3 py-2 rounded-full"
            >
              <span className="text-base mr-1">
                {getEmojiForType(type)}
              </span>
              <span className="text-sm font-medium">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Comments Button - Purple text like in screenshot */}
      {comments.length > 0 && (
        <div>
          <button
            onClick={loadFullComments}
            className="text-purple-600 hover:text-purple-800 text-sm flex items-center mt-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {showComments 
              ? "Piilota kommentit" 
              : `Näytä kommentit (${comments.length})`}
          </button>
        </div>
      )}

      {/* Comments Display */}
      {showComments && (
        <div className="mt-3 space-y-3">
          {loading ? (
            <div className="text-center p-2 text-sm text-gray-500">
              <svg
                className="animate-spin h-4 w-4 mx-auto mb-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Ladataan kommentteja...
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded border">
                <div className="flex justify-between items-start">
                  <p className="text-gray-700 text-sm">{comment.text}</p>
                  <div className="text-xs text-gray-500 ml-2">
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {error && (
        <div className="text-red-500 p-2 text-xs mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default CommentAndReactionView;