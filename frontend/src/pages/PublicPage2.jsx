import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/utils/constants";

const LIMIT = 1;

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
  }, [activeTab, currPage]);

  const fetchEvents = async (type) => {
    try {
      setIsLoading(true);
      setError(null);
      // console.log("fetchEvents() fired");

      const response = await axios.get(
        `${BASE_URL}/api/events?skip=${
          LIMIT * currPage
        }&limit=${LIMIT}&type=${type}&getCount=true`,
        { withCredentials: true }
      );

      setEvents(response.data.events);
      setNumOfPages(Math.ceil(response.data.numOfEvents / LIMIT)); //for pagination
    } catch (error) {
      setError("Unable to retreive Events");
    } finally {
      setIsLoading(false);
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
            <div className="border-2 border-black my-4" key={event._id}>
              <img
                src="/public-event-default.jpeg"
                alt={event.title}
                className="w-[300px] h-[200px] object-cover rounded-lg"
              />
              <h2 className="text-2xl">TITLE: {event.title}</h2>
              <h2 className="text-2xl">ID: {event._id}</h2>
              <h2 className="text-1xl">DATE: {event.startDate}</h2>
              <h2 className="text-1xl">DESCRIPTION: {event.description}</h2>
            </div>
          ))}
          <h1>Num of Pages:{numOfPages}</h1>
          <h1>curr page:{currPage}</h1>

          {/* PAGINATION */}
          <div className="p-10 cursor-pointer flex justify-center space-x-2">
            {/* Previous Page Button */}
            {currPage > 0 && (
              <span
                className="px-4 py-2 border rounded-lg bg-gray-200 hover:bg-gray-300"
                // onClick={() => setCurrPage((prev) => Math.max(prev - 1, 0))}
                onClick={() => setCurrPage((currPage) => currPage - 1)}
              >
                Prev
              </span>
            )}

            {/* Page Number Buttons */}
            {[...Array(numOfPages).keys()].map((pN) => (
              <span
                className={
                  "text-xl p-4 " + (pN === currPage && "font-bold underline")
                }
                key={pN}
                onClick={() => {
                  setCurrPage(pN);
                }}
              >
                {pN + 1}
              </span>
            ))}

            {/* Next Page Button */}
            {currPage < numOfPages - 1 && (
              <span
                className="px-4 py-2 border rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => setCurrPage((curr) => curr + 1)}
              >
                Next
              </span>
            )}
          </div>
        </>
      ) : (
        <h1 className="text-3xl">No Events</h1>
      )}
    </div>
  );
};

export default PublicPage2;
