import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";

const Profile = () => {
  const { uid } = useParams();
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const isOwnProfile = currentUser?.uid === uid;

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/users/${uid}`);
      setData(data);
      setBio(data.user.bio || "");
    } catch (err) {
      setError("Profile not found. Post a project to auto-create your profile!");
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const handleSaveBio = async () => {
    await api.post("/users/profile", { bio });
    setEditing(false);
    fetchProfile();
  };

  if (error) return <p className="text-center mt-16 text-gray-400">{error}</p>;
  if (!data) return <p className="text-center mt-16 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold">{data.user.name}</h1>
        <p className="text-sm text-gray-400">{data.user.email}</p>

        {editing ? (
          <div className="mt-3">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full border rounded-md p-2 text-sm"
              placeholder="Tell others about yourself..."
            />
            <button
              onClick={handleSaveBio}
              className="mt-2 bg-brand-600 text-white text-sm px-4 py-1.5 rounded-md"
            >
              Save
            </button>
          </div>
        ) : (
          <p className="text-gray-700 mt-3">{data.user.bio || "No bio yet."}</p>
        )}

        {isOwnProfile && !editing && (
          <button onClick={() => setEditing(true)} className="text-brand-600 text-sm mt-2">
            Edit Bio
          </button>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-3">
        Projects Posted ({data.projects.length})
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.projects.map((p) => (
          <ProjectCard key={p._id} project={p} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
