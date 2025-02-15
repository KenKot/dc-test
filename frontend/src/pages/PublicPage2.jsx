import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/utils/constants";

const LIMIT = 4;

const PublicPage2 = () => {
  const [activeTab, setActiveTab] = useState("future"); // can be "future" or "past"

  //for pagination
  const [currPage, setCurrPage] = useState(0);
  const [numOfPages, setNumOfPages] = useState(0);

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const type = activeTab; //initially is future, but can be "future" or "past"
    fetchEvents(type);
  }, [activeTab]);

  const fetchEvents = async (type) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/events?skip=${
          LIMIT * currPage
        }&limit=${LIMIT}&type=${type}&getCount=true`,
        { withCredentials: true }
      );

      const events = response.data.events;
      setEvents(response.data.events);
      setNumOfPages(Math.ceil(response.data.numOfEvents / LIMIT)); //for pagination

      setIsLoading(false);
    } catch (error) {
      setError("Unable to retreive Events");
    }
  };

  const renderPageButtons = () => {
    let buttons = [];

    for (let i = 0; i < numOfPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-4 py-2 border rounded-lg transition ${
            currPage === i
              ? "bg-blue-700 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setCurrPage(i)}
        >
          {i + 1}
        </button>
      );
    }

    return buttons;
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
            onClick={() => setActiveTab("future")}
          >
            Upcoming Events
          </button>
          <button
            className={`px-6 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "past"
                ? "bg-yellow-500 text-black"
                : "bg-gray-200 text-gray-500"
            }`}
            onClick={() => setActiveTab("past")}
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
            <div className="border-2 border-black my-4" key={event._id}>
              <img
                src="/public-event-default.jpeg"
                alt={event.title}
                className="w-[300px] h-[200px] object-cover rounded-lg"
              />
              <h2 className="text-2xl">TITLE: {event.title}</h2>
              <h2 className="text-1xl">DATE: {event.startDate}</h2>
              <h2 className="text-1xl">DESCRIPTION: {event.description}</h2>
            </div>
          ))}
          <h1>Num of Pages:{numOfPages}</h1>
        </>
      ) : (
        <h1 className="text-3xl">No Events</h1>
      )}
    </div>
  );
};

export default PublicPage2;
