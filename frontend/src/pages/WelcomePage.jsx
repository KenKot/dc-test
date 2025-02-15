import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/utils/constants";
import { Link } from "react-router-dom";

const LIMIT = 4;

const WelcomePage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/events?skip=0&limit=${LIMIT}&type=future`,
        { withCredentials: true }
      );

      setEvents(response.data.events);
      setIsLoading(false);
    } catch (error) {
      setError("Unable to retreive Events");
    }
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
          <Link to="/page2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              View All
            </button>
          </Link>
        </>
      ) : (
        <h1 className="text-3xl">No Events</h1>
      )}
    </div>
  );
};

export default WelcomePage;
