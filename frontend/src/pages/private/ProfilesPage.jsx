import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(BASE_URL + "/api/profiles", {
        withCredentials: true,
      });
      setProfiles(response?.data?.activeMembers || []);
    } catch (error) {
      console.log(error);
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">No members yet</div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Member Directory</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {profiles.map((profile) => (
          <Link
            to={`/profile/${profile._id}`}
            key={profile._id}
            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              {profile.profileImage?.url ? (
                <img
                  src={profile.profileImage.url}
                  alt={`${profile.firstname} ${profile.lastname}`}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg font-semibold text-gray-700">
                  {profile.firstname.charAt(0)}
                  {profile.lastname.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-blue-600">
                  {profile.firstname} {profile.lastname}
                </p>
                <p className="text-gray-500">{profile.role}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfilesPage;
