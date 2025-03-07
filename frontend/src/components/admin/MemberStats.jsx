import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";

const MemberStats = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingRequests: 0,
    totalAnnouncements: 0,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/website-stats`, {
        withCredentials: true,
      });

      if (!response.data.success) throw new Error("Invalid response format");

      setStats(response.data.stats);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div className="bg-yellow-500 p-6 rounded-lg shadow-md text-center">
        <h3 className="text-black font-semibold text-lg">Total Members</h3>
        <p className="text-4xl font-bold text-red-700">{stats.totalMembers}</p>
      </div>
      <div className="bg-yellow-500 p-6 rounded-lg shadow-md text-center">
        <h3 className="text-black font-semibold text-lg">Pending Requests</h3>
        <p className="text-4xl font-bold text-red-700">
          {stats.pendingRequests}
        </p>
      </div>
      <div className="bg-yellow-500 p-6 rounded-lg shadow-md text-center">
        <h3 className="text-black font-semibold text-lg">Announcements</h3>
        <p className="text-4xl font-bold text-red-700">
          {stats.totalAnnouncements}
        </p>
      </div>
      <div className="bg-yellow-500 p-6 rounded-lg shadow-md text-center">
        <h3 className="text-black font-semibold text-lg">Total Events</h3>
        <p className="text-4xl font-bold text-red-700">{stats.totalEvents}</p>
      </div>
    </div>
  );
};

export default MemberStats;
