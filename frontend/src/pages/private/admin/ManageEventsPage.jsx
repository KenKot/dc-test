import { useAuthStore } from "@/store/authStore";
import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const ManageEvents = () => {
  const { user } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [sendEmailAnnouncement, setSendEmailAnnouncement] = useState(false); // Default is unchecked

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/events`, {
        withCredentials: true, // Include auth cookies
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}/api/events`,
        {
          title,
          description,
          startDate,
          endDate,
          location,
          sendEmailAnnouncement, // Include checkbox value in request
        },
        { withCredentials: true }
      );
      alert("Event created successfully!");
      setTitle("");
      setDescription("");
      setStartDate(new Date());
      setEndDate(new Date());
      setLocation("");
      setSendEmailAnnouncement(false); // Reset checkbox
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`${BASE_URL}/api/events/${eventId}`, {
          withCredentials: true,
        });
        alert("Event deleted successfully!");
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event");
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              setEndDate(date);
            }}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={startDate}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* New Checkbox for Send Email Announcement */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={sendEmailAnnouncement}
              onChange={(e) => setSendEmailAnnouncement(e.target.checked)}
              className="mr-2"
            />
            Send Email Announcement (disabled)
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Event
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">All Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div key={event._id} className="border p-4 rounded">
            <h3 className="font-bold">{event.title}</h3>
            <p>{event.description}</p>
            <p>
              Start: {format(new Date(event.startDate), "MMMM d, yyyy h:mm a")}
            </p>
            <p>End: {format(new Date(event.endDate), "MMMM d, yyyy h:mm a")}</p>
            <p>Location: {event.location}</p>
            <button
              onClick={() => handleDelete(event._id)}
              className="bg-red-500 text-white px-2 py-1 rounded mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageEvents;
