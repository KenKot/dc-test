import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/utils/constants";
import { Link } from "react-router-dom";
import EventCard from "@/components/EventCard";

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
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-2">Events</h1>
      <p className="text-lg text-gray-600 mb-6">Check out new events</p>

      {events.length > 0 ? (
        <>
          {/* Featured Event */}
          <EventCard event={events[0]} isLarge={true} />

          {/* Other Events List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {events.slice(1, 4).map((event) => (
              <>
                <EventCard key={event._id} event={event} />
              </>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link to="/public-events">
              <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition">
                View More
              </button>
            </Link>
          </div>
        </>
      ) : (
        <h1 className="text-3xl text-center">No Events</h1>
      )}
    </div>
  );
};

export default WelcomePage;
