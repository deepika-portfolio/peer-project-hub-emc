import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import StarRating from "../components/StarRating";

const ProjectDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [error, setError] = useState("");

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      setError("Project not found");
    }
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleLike = async () => {
    if (!currentUser) return navigate("/login");
    const { data } = await api.post(`/projects/${id}/like`);
    setLiked(data.liked);
    setProject((p) => ({ ...p, likesCount: data.likesCount }));
  };

  const handleFavorite = async () => {
    if (!currentUser) return navigate("/login");
    const { data } = await api.post(`/projects/${id}/favorite`);
    setFavorited(data.favorited);
  };

  const handleRate = async (rating) => {
    if (!currentUser) return navigate("/login");
    setMyRating(rating);
    const { data } = await api.post(`/projects/${id}/rate`, { rating });
    setProject((p) => ({ ...p, ratingAverage: data.ratingAverage, ratingCount: data.ratingCount }));
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    await api.delete(`/projects/${id}`);
    navigate("/");
  };

  if (error) return <p className="text-center mt-16 text-red-500">{error}</p>;
  if (!project) return <p className="text-center mt-16 text-gray-400">Loading...</p>;

  const isOwner = currentUser && currentUser.uid === project.ownerUid;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <Link to={`/profile/${project.ownerUid}`} className="text-sm text-brand-600">
              by {project.ownerName}
            </Link>
          </div>
          {isOwner && (
            <div className="flex gap-2 text-sm">
              <Link to={`/projects/${id}/edit`} className="px-3 py-1.5 border rounded-md">
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 border border-red-300 text-red-600 rounded-md"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-700 mt-4 whitespace-pre-wrap">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tags.map((tag) => (
            <span key={tag} className="bg-brand-50 text-brand-700 text-xs px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          <a
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md"
          >
            View on GitHub
          </a>
          {project.liveDemoLink && (
            <a
              href={project.liveDemoLink}
              target="_blank"
              rel="noreferrer"
              className="bg-brand-600 text-white text-sm px-4 py-2 rounded-md"
            >
              Live Demo
            </a>
          )}
        </div>

        <div className="flex items-center gap-6 mt-6 pt-4 border-t">
          <button onClick={handleLike} className="flex items-center gap-1 text-sm">
            {liked ? "❤️" : "🤍"} {project.likesCount} Likes
          </button>
          <button onClick={handleFavorite} className="flex items-center gap-1 text-sm">
            {favorited ? "🔖 Favorited" : "📑 Add to Favorites"}
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span>
              Rate: ({project.ratingAverage || 0} avg / {project.ratingCount} ratings)
            </span>
            <StarRating value={myRating} onChange={handleRate} />
          </div>
        </div>
      </div>

      <CommentSection projectId={id} />
    </div>
  );
};

export default ProjectDetail;
