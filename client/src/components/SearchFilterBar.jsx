import React, { useState } from "react";

const SearchFilterBar = ({ onSearch }) => {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("recent");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ q, tag, sort });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-6">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by title or description..."
        className="flex-1 border rounded-md p-2 text-sm"
      />
      <input
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Filter by tag (e.g. react)"
        className="sm:w-56 border rounded-md p-2 text-sm"
      />
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border rounded-md p-2 text-sm"
      >
        <option value="recent">Most Recent</option>
        <option value="mostLiked">Most Liked</option>
        <option value="topRated">Top Rated</option>
      </select>
      <button
        type="submit"
        className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm hover:bg-brand-700"
      >
        Search
      </button>
    </form>
  );
};

export default SearchFilterBar;
