import React from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="block bg-white shadow-lg rounded-xl border border-purple-100 p-5 hover:shadow-2xl hover:-translate-y-1 transition-all hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-900">{project.title}</h3>
        <span className="text-xs text-gray-400">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {project.tags?.map((tag) => (
          <span key={tag} className="bg-brand-50 text-brand-700 text-xs px-2 py-0.5 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <span>by {project.ownerName}</span>
        <div className="flex items-center gap-3">
          <span>❤️ {project.likesCount}</span>
          <span>⭐ {project.ratingAverage || 0}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
