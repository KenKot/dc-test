import { useAuthStore } from "@/store/authStore";
import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const EventsPage = () => {
  const { user } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/events`, {
        withCredentials: true,
      });

      setEvents(response.data.events || []);
    } catch (error) {
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId, rsvpId, currentStatus) => {
    try {
      if (!rsvpId) {
        // RSVP for the first time
        await axios.post(
          `${BASE_URL}/api/events/${eventId}/rsvps`,
          { status: "attending" },
          { withCredentials: true }
        );
      } else {
        // Toggle RSVP status
        const newStatus =
          currentStatus === "attending" ? "not attending" : "attending";
        await axios.patch(
          `${BASE_URL}/api/rsvps/${rsvpId}`,
          { status: newStatus },
          { withCredentials: true }
        );
      }

      fetchEvents();
      alert("RSVP status updated!");
    } catch (error) {
      alert("Failed to RSVP. Please try again later.");
    }
  };

  if (!user) return <div>Loading...</div>;

  if (loading) return <div className="text-center mt-8">Loading events...</div>;

  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="border p-4 rounded">
              <h3 className="font-bold">{event.title}</h3>
              <p>{event.description}</p>
              <p>
                <strong>Start:</strong>{" "}
                {format(new Date(event.startDate), "MMMM d, yyyy h:mm a")}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {format(new Date(event.endDate), "MMMM d, yyyy h:mm a")}
              </p>
              <p>
                <strong>Your RSVP:</strong>{" "}
                {event.userRSVPStatus ? event.userRSVPStatus : "Not RSVPed"}
              </p>

              <button
                onClick={() =>
                  handleRSVP(event._id, event.userRSVPId, event.userRSVPStatus)
                }
                className={`px-4 py-2 rounded mt-2 ${
                  event.userRSVPStatus === "attending"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                {event.userRSVPStatus === "attending" ? "Un-RSVP" : "RSVP"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-3">
            No upcoming events available.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
