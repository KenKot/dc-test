import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/utils/constants";
import EventCard from "@/components/EventCard";
import ReactPaginate from "react-paginate";

const LIMIT = 2;

const PublicEvents = () => {
  const [activeTab, setActiveTab] = useState("future"); // can be "future" or "past"

  // for pagination
  const [currPage, setCurrPage] = useState(0);
  const [numOfPages, setNumOfPages] = useState(0);

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const type = activeTab; // initially is future, but can be "future" or "past"
    fetchEvents(type);
  }, [activeTab, currPage]);

  const fetchEvents = async (type) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/events?skip=${
          LIMIT * currPage
        }&limit=${LIMIT}&type=${type}&getCount=true`,
        { withCredentials: true }
      );

      setEvents(response.data.events);
      setNumOfPages(Math.ceil(response.data.numOfEvents / LIMIT)); // for pagination
    } catch (error) {
      setError("Unable to retrieve Events");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrPage(selected);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  if (isLoading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="flex bg-gray-200 rounded-lg w-fit p-1">
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
      </div>
      <div></div>

      {events.length > 0 ? (
        <>
          <h1 className="text-3xl">Events</h1>
          {events.map((event) => (
            <EventCard
              key={event._id}
              id={event._id}
              event={event}
              isLarge={true}
              className="my-4"
            />
          ))}
          <h1>Num of Pages: {numOfPages}</h1>
          <h1>Curr Page: {currPage}</h1>

          {/* PAGINATION */}
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
        <h1 className="text-3xl">No Events</h1>
      )}
    </div>
  );
};

export default PublicEvents;
