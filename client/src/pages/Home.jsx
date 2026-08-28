import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard";
import SearchFilterBar from "../components/SearchFilterBar";
import Pagination from "../components/Pagination";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ q: "", tag: "", sort: "recent" });
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/projects", {
        params: { page, limit: 9, ...filters },
      });
      setProjects(data.projects);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearch = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-10 mb-8 shadow-xl">
      <h1 className="text-4xl font-bold mb-3">

      Welcome to our New Project *  Build *Learn *Inspire 🚀

     </h1>

  <p className="text-lg">

    Discover, showcase, and review amazing  projects.

  </p>

</div>
      <h1 className="text-2xl font-bold mb-1">Project Feed</h1>
      <p className="text-gray-500 mb-6">Discover what fellow students are building.</p>

      <SearchFilterBar onSearch={handleSearch} />

      {loading ? (
        <p className="text-gray-400">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400">No projects found. Be the first to post one!</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default Home;
