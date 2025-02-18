import { useAuthStore } from "@/store/authStore";
import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import EventImageUploader from "@/components/admin/EventImageUploader";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 2;
const DEFAULT_IMAGE = "/public-event-default.jpeg";

const ManageEvents = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("future");
  const [currPage, setCurrPage] = useState(0);
  const [numOfPages, setNumOfPages] = useState(0);
  const [numOfEvents, setNumOfEvents] = useState(0);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [eventImageId, setEventImageId] = useState(null);

  useEffect(() => {
    fetchEvents(currPage);
  }, [activeTab, currPage]);

  const fetchEvents = async (page) => {
    const skip = page * ITEMS_PER_PAGE;
    try {
      const response = await axios.get(
        `${BASE_URL}/api/events?skip=${skip}&limit=${ITEMS_PER_PAGE}&type=${activeTab}&getCount=true`,
        { withCredentials: true }
      );

      setEvents(response.data.events);
      setNumOfEvents(response.data.numOfEvents);
      setNumOfPages(Math.ceil(response.data.numOfEvents / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrPage(selected);
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
          eventImageId,
        },
        { withCredentials: true }
      );
      alert("Event created successfully!");
      setTitle("");
      setDescription("");
      setStartDate(new Date());
      setEndDate(new Date());
      setLocation("");
      setEventImageId(null);
      fetchEvents(currPage);
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
        fetchEvents(currPage);
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event");
      }
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>

      {/* Image Uploader for New Event */}
      <EventImageUploader
        onImageSelect={setEventImageId}
        autoSelectFirst={true}
      />

      {/* Create Event Form */}
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

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Event
        </button>
      </form>

      <h1 className="text-3xl">Manage Public Events</h1>

      {/* Tabs for Upcoming & Past Events */}
      <div className="flex bg-gray-200 rounded-lg w-fit p-1 mb-4">
        <button
          className={`px-6 py-2 text-sm font-semibold rounded-lg transition ${
            activeTab === "future"
              ? "bg-yellow-500 text-black"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("future");
            setCurrPage(0);
          }}
        >
          Upcoming Events
        </button>
        <button
          className={`px-6 py-2 text-sm font-semibold rounded-lg transition ${
            activeTab === "past"
              ? "bg-yellow-500 text-black"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={() => {
            setActiveTab("past");
            setCurrPage(0);
          }}
        >
          Past Events
        </button>
      </div>

      {/* Event List */}
      <h2 className="text-xl font-bold mb-4">
        {activeTab === "future"
          ? `Upcoming Events (${numOfEvents})`
          : `Past Events (${numOfEvents})`}
      </h2>

      {events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event._id} className="border p-4 rounded">
                <img
                  src={event.image?.url || DEFAULT_IMAGE}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="font-bold">{event.title}</h3>
                <p>{event.description}</p>
                <p>
                  Start:{" "}
                  {format(new Date(event.startDate), "MMMM d, yyyy h:mm a")}
                </p>
                <p>
                  End: {format(new Date(event.endDate), "MMMM d, yyyy h:mm a")}
                </p>
                <p>Location: {event.location}</p>

                <button
                  onClick={() => navigate(`/admin/events/${event._id}`)}
                  className="bg-green-500 text-white px-3 py-1 rounded mt-2 mr-2 hover:bg-green-700"
                >
                  Edit Event
                </button>

                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            pageCount={numOfPages}
            onPageChange={handlePageChange}
            forcePage={currPage}
            containerClassName="flex items-center justify-center gap-2 mt-4"
            pageClassName="px-3 py-1 rounded border hover:bg-gray-100"
            previousClassName="px-3 py-1 rounded border hover:bg-gray-100"
            nextClassName="px-3 py-1 rounded border hover:bg-gray-100"
            activeClassName="bg-yellow-500 text-black border-yellow-500"
            disabledClassName="opacity-50 cursor-not-allowed"
            renderOnZeroPageCount={null}
          />
        </>
      ) : (
        <h1 className="text-3xl text-center">No Events</h1>
      )}
    </div>
  );
};

export default ManageEvents;
