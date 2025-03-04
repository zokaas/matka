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

const COMMENT_MAX_LENGTH = 300;

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

  const fetchComments = useCallback(async () => {
    if (!activityId) return;
    try {
      setLoading(true);
      const data = await apiService.comment.getComments(activityId);
      setComments(data);
      onCommentCountUpdate?.(data.length);
    } catch {
      setError("Kommenttien lataaminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  }, [activityId, onCommentCountUpdate]);

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
      onCommentCountUpdate?.(comments.length + 1);
      setNewComment("");
      setCharactersLeft(COMMENT_MAX_LENGTH);
    } catch {
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

  if (!isExpanded) return null;

  return (
    <div>
        <form
          onSubmit={handleSubmitComment}
          className="flex flex-col bg-white rounded-lg p-3"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Kirjoita kommentti..."
            className="w-full bg-transparent focus:outline-none text-sm resize-none overflow-y-auto p-2 border rounded-md min-h-[60px] max-h-[180px]"
            maxLength={COMMENT_MAX_LENGTH}
            required
            disabled={submitting}
          />
          <div className="flex justify-between items-center mt-2">
            <span
              className={`text-xs ${
                charactersLeft < 20 ? "text-red-500" : "text-gray-500"
              }`}
            >
              {charactersLeft} merkkiä jäljellä
            </span>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-xs text-white bg-purple-500 hover:bg-purple-600 transition-colors ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={newComment.length === 0 || submitting}
            >
              {submitting ? "Lähetetään..." : "Lähetä"}
            </button>
          </div>
        </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs bg-red-100 border border-red-400 p-2 rounded-md"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3 max-h-[50vh] overflow-auto pt-4">
        {loading ? (
          <div className="text-center text-xs text-gray-500 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-4 w-4 border-t-2 border-gray-400 border-solid rounded-full"
            ></motion.div>
            <span className="ml-2">Ladataan...</span>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center text-xs py-2">
            Ei kommentteja vielä.
          </p>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="bg-purple-100 p-3 rounded border text-xs flex justify-between items-start"
            >
              <p className="text-gray-700 break-words w-full whitespace-pre-wrap">
                {comment.text}
              </p>
              <div className="text-gray-500 text-[10px] ml-2 flex flex-col">
                <span>
                  {new Date(comment.createdAt).toLocaleDateString("fi-FI", {
                    day: "numeric",
                    month: "numeric",
                  })}
                </span>
                <span>
                  {new Date(comment.createdAt).toLocaleTimeString("fi-FI", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
