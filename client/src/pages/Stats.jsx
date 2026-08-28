import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const StatCard = ({ label, value }) => (
  <div className="bg-white border rounded-lg p-6 text-center">
    <p className="text-3xl font-bold text-brand-600">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

const Stats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await api.get("/stats");
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="text-center mt-16 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <StatCard label="Total Projects" value={stats.totalProjects} />
        <StatCard label="Total Users" value={stats.totalUsers} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-500 mb-1">🏆 Most Liked Project</p>
          {stats.mostLikedProject ? (
            <Link to={`/projects/${stats.mostLikedProject._id}`} className="font-semibold text-brand-600">
              {stats.mostLikedProject.title} ({stats.mostLikedProject.likesCount} likes)
            </Link>
          ) : (
            <p className="text-gray-400 text-sm">No data yet</p>
          )}
        </div>
        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-500 mb-1">⭐ Top Rated Project</p>
          {stats.topRatedProject ? (
            <Link to={`/projects/${stats.topRatedProject._id}`} className="font-semibold text-brand-600">
              {stats.topRatedProject.title} ({stats.topRatedProject.ratingAverage} avg)
            </Link>
          ) : (
            <p className="text-gray-400 text-sm">No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
