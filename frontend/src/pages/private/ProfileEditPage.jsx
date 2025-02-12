import ImageUploader from "@/components/ImageUploader";
import { useAuthStore } from "@/store/authStore";
import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";

const ProfileEditPage = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [major, setMajor] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/profiles/edit`, {
        withCredentials: true,
      });
      const data = response?.data?.profile;
      setProfile(data);
      setBio(data?.bio || "");
      setMajor(data?.major || "");
      setPhoneNumber(formatPhoneNumber(data?.phoneNumber || ""));
      setEmergencyContact(data?.emergencyContact || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const formatPhoneNumber = (value) => {
    const numbersOnly = value.replace(/\D/g, "");
    if (numbersOnly.length <= 3) return numbersOnly;
    if (numbersOnly.length <= 6)
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
      3,
      6
    )}-${numbersOnly.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(formatPhoneNumber(e.target.value));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${BASE_URL}/api/profiles/edit`,
        {
          bio,
          major,
          phoneNumber: phoneNumber.replace(/\D/g, ""),
          emergencyContact,
        },
        { withCredentials: true }
      );
      alert("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!profile) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <div className="flex flex-col items-center mb-4">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700">
            {user?.firstname?.charAt(0) || ""}
            {user?.lastname?.charAt(0) || ""}
          </div>
        )}
      </div>

      {/* IMAGE UPLOADER COMPONENT*/}
      <ImageUploader />

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-semibold">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Write something about yourself..."
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold">Major</label>
          <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Your major"
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700">Private Information</h3>
          <p className="text-sm text-gray-500 mb-2">
            This information is only visible to administrators.
          </p>

          <div>
            <label className="block font-semibold">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength="12"
              className="w-full p-2 border rounded"
              placeholder="XXX-XXX-XXXX"
            />
          </div>

          <div>
            <label className="block font-semibold">Emergency Contact</label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Emergency contact details"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEditPage;
