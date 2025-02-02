import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);

  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/profiles/${id}`, {
        withCredentials: true,
      });
      setProfile(response?.data?.profile); // Ensure `profile` matches backend response
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  if (!profile) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700">
          {profile.firstname?.charAt(0)}
          {profile.lastname?.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {profile.firstname} {profile.lastname}
          </h1>
          <p className="text-gray-500">
            {profile.major || "Major not provided"}
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Bio</h3>
        <p className="text-gray-600 mt-1">
          {profile.bio || "This member has not added an about section yet."}
        </p>
      </div>

      {/* Admin-Only Info */}
      {isAdmin && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-red-600">
            Admin Viewable Only Info
          </h3>
          <p className="text-gray-600">
            <strong>Phone:</strong> {profile.phoneNumber || "Not provided"}
          </p>
          <p className="text-gray-600">
            <strong>Emergency Contact:</strong>{" "}
            {profile.emergencyContact || "Not provided"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
