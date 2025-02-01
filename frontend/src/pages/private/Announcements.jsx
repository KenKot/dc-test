import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { format } from "date-fns";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/announcements`, {
        withCredentials: true,
      });
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-6">Loading announcements...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-6">{error}</p>;
  }

  const pinnedAnnouncements = announcements.filter((a) => a.isPinned);
  const regularAnnouncements = announcements.filter((a) => !a.isPinned);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {pinnedAnnouncements.length > 0 && (
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Pinned Announcements:
          </h1>
          <ul className="space-y-4 mb-6">
            {pinnedAnnouncements.map((announcement) => (
              <li key={announcement._id} className="border-b pb-2">
                <h2 className="text-lg font-semibold">{announcement.title}</h2>
                <p className="text-gray-600">{announcement.content}</p>
                <p className="text-sm text-gray-400">
                  {format(
                    new Date(announcement.createdAt),
                    "MMMM d, yyyy h:mm a"
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <br />

      <h1 className="text-2xl font-bold text-gray-800 mb-4">Announcements:</h1>
      {regularAnnouncements.length > 0 ? (
        <ul className="space-y-4">
          {regularAnnouncements.map((announcement) => (
            <li key={announcement._id} className="border-b pb-2">
              <h2 className="text-lg font-semibold">{announcement.title}</h2>
              <p className="text-gray-600">{announcement.content}</p>
              <p className="text-sm text-gray-400">
                {format(
                  new Date(announcement.createdAt),
                  "MMMM d, yyyy h:mm a"
                )}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No regular announcements available.</p>
      )}
    </div>
  );
};

export default AnnouncementsPage;
