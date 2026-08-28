import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateProject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    githubLink: "",
    liveDemoLink: "",
    thumbnailUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic frontend validation before hitting the API
    if (!form.title.trim() || !form.description.trim() || !form.githubLink.trim()) {
      setError("Title, description, and GitHub link are required");
      return;
    }
    if (!/^https?:\/\/(www\.)?github\.com\/.+/.test(form.githubLink)) {
      setError("GitHub link must be a valid github.com URL");
      return;
    }
    if (form.liveDemoLink && !/^https?:\/\/.+/.test(form.liveDemoLink)) {
      setError("Live demo link must be a valid URL");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/projects", form);
      navigate(`/projects/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post a New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white border rounded-lg p-6">
        <div>
          <label className="text-sm font-medium">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full border rounded-md p-2 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Tags (comma-separated)</label>
          <input
            name="tags"
            placeholder="react, mongodb, express"
            value={form.tags}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">GitHub Repo Link *</label>
          <input
            name="githubLink"
            placeholder="https://github.com/username/repo"
            value={form.githubLink}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Live Demo Link (optional)</label>
          <input
            name="liveDemoLink"
            placeholder="https://your-app.vercel.app"
            value={form.liveDemoLink}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Thumbnail Image URL (optional)</label>
          <input
            name="thumbnailUrl"
            placeholder="https://..."
            value={form.thumbnailUrl}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm mt-1"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2 rounded-md hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Project"}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
