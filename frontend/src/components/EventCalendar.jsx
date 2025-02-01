import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { useAuthStore } from "@/store/authStore";
import enUS from "date-fns/locale/en-US";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const EventCalendar = () => {
  const { user } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/events`, {
        withCredentials: true,
      });

      const formattedEvents = response.data.events.map((event) => ({
        id: event._id,
        title: event.title,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        location: event.location,
        description: event.description,
        userRSVPStatus: event.userRSVPStatus,
        userRSVPId: event.userRSVPId,
      }));

      setEvents(formattedEvents);
      return formattedEvents;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  };

  const handleRSVP = async (eventId, rsvpId) => {
    try {
      if (!rsvpId) {
        await axios.post(
          `${BASE_URL}/api/events/${eventId}/rsvps`,
          {},
          { withCredentials: true }
        );
      } else {
        await axios.patch(
          `${BASE_URL}/api/rsvps/${rsvpId}`,
          {},
          { withCredentials: true }
        );
      }

      const updatedEvents = await fetchEvents();
      const updatedEvent = updatedEvents.find((e) => e.id === eventId);
      if (updatedEvent) setSelectedEvent(updatedEvent);

      alert("RSVP status updated!");
    } catch (error) {
      alert("Failed to update RSVP. Please try again later.");
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick}
      />

      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
            <p>
              <strong>📅 Date:</strong>{" "}
              {format(selectedEvent.start, "MMMM d, yyyy h:mm a")}
            </p>
            <p>
              <strong>📍 Location:</strong>{" "}
              {selectedEvent.location || "Not specified"}
            </p>
            <p>
              <strong>📝 Description:</strong>{" "}
              {selectedEvent.description || "No description provided."}
            </p>
            <p>
              <strong>Your RSVP:</strong>{" "}
              {selectedEvent.userRSVPStatus === "attending"
                ? "attending"
                : "Not RSVPed"}
            </p>
            <button
              onClick={() =>
                handleRSVP(selectedEvent.id, selectedEvent.userRSVPId)
              }
              className={`px-4 py-2 rounded mt-4 ${
                selectedEvent.userRSVPStatus === "attending"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {selectedEvent.userRSVPStatus === "attending"
                ? "Un-RSVP"
                : "RSVP"}
            </button>
            <button
              onClick={closeModal}
              className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
