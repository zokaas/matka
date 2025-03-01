"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Comment } from "../types/types";

interface CommentsProps {
  activityId: number;
}

const COMMENT_MAX_LENGTH = 300; // Maximum character limit for comments

const CommentsSection: React.FC<CommentsProps> = ({ activityId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charactersLeft, setCharactersLeft] = useState(COMMENT_MAX_LENGTH);
  const [submitting, setSubmitting] = useState(false);

  const backendUrl = "https://matka-zogy.onrender.com";

  const fetchComments = useCallback(async () => {
    if (!activityId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/activity/${activityId}/comments`
      );
      if (!response.ok) throw new Error("Failed to fetch comments");

      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    setCharactersLeft(COMMENT_MAX_LENGTH - newComment.length);
  }, [newComment]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= COMMENT_MAX_LENGTH) {
      setNewComment(e.target.value);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activityId || submitting) return;

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        `${backendUrl}/activity/${activityId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newComment }),
        }
      );

      if (!response.ok) throw new Error("Failed to add comment");

      const addedComment = await response.json();
      setComments([addedComment, ...comments]);
      setNewComment("");
      setCharactersLeft(COMMENT_MAX_LENGTH);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
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
    <div className="space-y-4 mt-3">
      {/* Comment form */}
      <form
        onSubmit={handleSubmitComment}
        className="flex w-full items-center space-x-2"
      >
        {/* Input container with full width */}
        <div className="flex-grow">
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Kirjoita kommentti..."
            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
            maxLength={COMMENT_MAX_LENGTH}
            required
            disabled={submitting}
          />
        </div>

        {/* Send button constrained within container */}
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-purple-600 transition whitespace-nowrap"
          disabled={submitting || newComment.length === 0}
        >
          {submitting ? "Lähetetään..." : "Lähetä"}
        </button>
      </form>

      {/* Character counter */}
      <div className="text-xs text-right text-gray-500">
        {charactersLeft} merkkiä jäljellä
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-500 p-2 text-sm bg-red-50 rounded">
          {error}
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center p-2 text-sm text-gray-500">
            Ladataan kommentteja...
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center text-sm py-2">
            Ei kommentteja vielä. Ole ensimmäinen!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-100 p-3 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start">
                <p className="text-gray-700 text-sm">{comment.text}</p>
                <span className="text-xs text-gray-500 ml-3 whitespace-nowrap">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;