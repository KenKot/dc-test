import { useAuthStore } from "@/store/authStore";
import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 2;
const DEFAULT_IMAGE = "/public-event-default.jpeg";

const ViewEvents = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("future");
  const [currPage, setCurrPage] = useState(0);
  const [numOfPages, setNumOfPages] = useState(0);
  const [numOfEvents, setNumOfEvents] = useState(0);
  const [events, setEvents] = useState([]);

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

  //   if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Sub-tabs for Future/Past Events */}
      <div className="flex bg-gray-200 rounded-lg w-fit p-1 mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {events.map((event) => (
              <div key={event._id} className="border p-4 rounded">
                <img
                  src={event.image?.url || DEFAULT_IMAGE}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="font-bold">{event.title}</h3>
                <p className="mb-2">{event.description}</p>
                <p className="text-sm">
                  Start:{" "}
                  {format(new Date(event.startDate), "MMMM d, yyyy h:mm a")}
                </p>
                <p className="text-sm mb-2">
                  End: {format(new Date(event.endDate), "MMMM d, yyyy h:mm a")}
                </p>
                <p className="text-sm mb-4">Location: {event.location}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/events/${event._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
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
            containerClassName="flex items-center justify-center gap-2 my-8"
            pageClassName="px-3 py-1 rounded border hover:bg-gray-100"
            previousClassName="px-3 py-1 rounded border hover:bg-gray-100"
            nextClassName="px-3 py-1 rounded border hover:bg-gray-100"
            activeClassName="bg-yellow-500 text-black border-yellow-500"
            disabledClassName="opacity-50 cursor-not-allowed"
            renderOnZeroPageCount={null}
          />
        </>
      ) : (
        <h1 className="text-xl text-center text-gray-500">No Events Found</h1>
      )}
    </div>
  );
};

export default ViewEvents;
