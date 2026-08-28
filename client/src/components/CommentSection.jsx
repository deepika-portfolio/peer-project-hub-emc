import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StarRating from "./StarRating";

const CommentSection = ({ projectId }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/projects/${projectId}/comments`);
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!text.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    try {
      await api.post(`/projects/${projectId}/comments`, { text, rating: rating || null });
      setText("");
      setRating(0);
      fetchComments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-3">Comments & Reviews ({comments.length})</h2>

      {currentUser && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Leave a comment or review..."
            className="w-full border rounded-md p-2 text-sm"
            rows={3}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Optional rating:</span>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <button
              type="submit"
              className="bg-brand-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-brand-700"
            >
              Post
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </form>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm">No comments yet. Be the first to review!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c._id} className="bg-white border rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{c.authorName}</span>
                {c.rating && <StarRating value={c.rating} readOnly />}
              </div>
              <p className="text-sm text-gray-700 mt-1">{c.text}</p>
              <span className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
