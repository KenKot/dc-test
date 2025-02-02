import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";

const DashboardAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPinnedAnnouncements();
  }, []);

  const fetchPinnedAnnouncements = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/announcements/pinned`, {
        withCredentials: true,
      });

      setAnnouncements(response.data?.pinnedAnnouncements);
    } catch (error) {
      console.error("Error fetching pinned announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Loading pinned announcements...
      </p>
    );
  }

  return (
    <div className="mt-6 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
      {announcements?.length > 0 ? (
        <ul className="space-y-4">
          {announcements.map((announcement) => (
            <li key={announcement._id} className="border-b pb-2">
              <h3 className="text-lg font-semibold">{announcement.title}</h3>
              <p className="text-gray-600">{announcement.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No pinned announcements.</p>
      )}
    </div>
  );
};

export default DashboardAnnouncements;
