import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setForm({
          title: data.title,
          description: data.description,
          tags: data.tags.join(", "),
          githubLink: data.githubLink,
          liveDemoLink: data.liveDemoLink || "",
          thumbnailUrl: data.thumbnailUrl || "",
        });
      } catch (err) {
        setError("Failed to load project");
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.put(`/projects/${id}`, form);
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <p className="text-center mt-16 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
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
            value={form.tags}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">GitHub Repo Link *</label>
          <input
            name="githubLink"
            value={form.githubLink}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Live Demo Link</label>
          <input
            name="liveDemoLink"
            value={form.liveDemoLink}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Thumbnail Image URL</label>
          <input
            name="thumbnailUrl"
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
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProject;
