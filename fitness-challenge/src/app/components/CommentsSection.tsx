"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Comment } from "../types/types";
import apiService from "../service/apiService";

interface CommentsProps {
  activityId: number;
  isExpanded: boolean;
  onCommentCountUpdate?: (count: number) => void;
}

const COMMENT_MAX_LENGTH = 300; // Max characters allowed

const CommentsSection: React.FC<CommentsProps> = ({
  activityId,
  isExpanded,
  onCommentCountUpdate,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charactersLeft, setCharactersLeft] = useState(COMMENT_MAX_LENGTH);
  const [submitting, setSubmitting] = useState(false);

  // Replace the fetchComments function with:
  const fetchComments = useCallback(async () => {
    if (!activityId) return;
    try {
      setLoading(true);
      const data = await apiService.comment.getComments(activityId);
      setComments(data);

      if (onCommentCountUpdate) {
        onCommentCountUpdate(data.length);
      }
    } catch (err) {
      setError("Kommenttien lataaminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  }, [activityId, onCommentCountUpdate]);

  // Replace the handleSubmitComment function with:
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      setError("");

      const addedComment = await apiService.comment.addComment(
        activityId,
        newComment
      );
      setComments([addedComment, ...comments]);

      if (onCommentCountUpdate) {
        onCommentCountUpdate(comments.length + 1);
      }

      setNewComment("");
      setCharactersLeft(COMMENT_MAX_LENGTH);
    } catch (err) {
      setError("Kommentin lisääminen epäonnistui.");
    } finally {
      setSubmitting(false);
    }
  };
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isExpanded) return null;

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-md border">
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="flex flex-col space-y-2">
        <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100">
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Kirjoita kommentti..."
            className="flex-1 bg-transparent focus:outline-none text-sm"
            maxLength={COMMENT_MAX_LENGTH}
            required
            disabled={submitting}
          />
          <button
            type="submit"
            className={`ml-2 px-4 py-2 rounded text-sm text-white bg-purple-500 
                       hover:bg-purple-600 transition-colors ${
                         submitting ? "opacity-50 cursor-not-allowed" : ""
                       }`}
            disabled={newComment.length === 0 || submitting}
          >
            {submitting ? "Lähetetään..." : "Lähetä"}
          </button>
        </div>

        <div
          className={`text-xs text-right ${
            charactersLeft < 20 ? "text-red-500" : "text-gray-500"
          }`}
        >
          {charactersLeft} merkkiä jäljellä
        </div>
      </form>

      {/* Error Message (Animated) */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm bg-red-100 border border-red-400 p-2 rounded-md"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center p-2 text-sm text-gray-500 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-5 w-5 border-t-2 border-gray-400 border-solid rounded-full"
            ></motion.div>
            <span className="ml-2">Ladataan kommentteja...</span>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center text-sm py-2">
            Ei kommentteja vielä. Ole ensimmäinen kommentoija!
          </p>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="bg-gray-50 p-3 rounded border"
            >
              <div className="flex justify-between items-start">
                <p className="text-gray-700 text-sm">{comment.text}</p>
                <div className="text-xs text-gray-500 ml-2">
                  {formatDate(comment.createdAt)}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
