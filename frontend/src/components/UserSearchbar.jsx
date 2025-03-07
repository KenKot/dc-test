import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { Link } from "react-router-dom";

const UserSearchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        fetchProfiles(searchTerm);
      } else {
        setProfiles([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchProfiles = async (term) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/profiles/search?searchTerm=${term}&limit=5`,
        { withCredentials: true }
      );
      setProfiles(response.data.activeMembers || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search users by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <ul className="border rounded p-2">
        {profiles.map((profile) => (
          <li
            key={profile._id}
            className="py-2 border-b flex items-center gap-3"
          >
            <Link
              to={`/profile/${profile._id}`}
              className="flex items-center gap-2"
              onClick={() => {
                setSearchTerm("");
                setProfiles([]);
              }}
            >
              {profile.profileImage?.url ? (
                <img
                  src={profile.profileImage.url}
                  alt={`${profile.firstname} ${profile.lastname}`}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                  {profile.firstname?.charAt(0)}
                  {profile.lastname?.charAt(0)}
                </div>
              )}
              <span>
                {profile.firstname} {profile.lastname}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearchbar;
