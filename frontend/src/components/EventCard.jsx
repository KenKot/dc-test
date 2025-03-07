import React from "react";

const EventCard = ({ event, isLarge = false, maxDescLength }) => {
  const defaultLength = isLarge ? 200 : 80;
  const maxLength = maxDescLength || defaultLength;

  const truncatedDescription =
    event.description && event.description.length > maxLength
      ? event.description.slice(0, maxLength) + "..."
      : event.description;

  return (
    <div
      className={`flex ${
        isLarge ? "flex-col md:flex-row gap-6" : "flex gap-4"
      }`}
    >
      <img
        src={event.image?.url || "/public-event-default.jpeg"}
        alt={event.title}
        className={`rounded-lg object-cover ${
          isLarge ? "w-full md:w-1/2 h-[250px]" : "w-24 h-24"
        }`}
      />
      <div className={`${isLarge ? "md:w-1/2" : ""}`}>
        <h2
          className={`${
            isLarge ? "text-2xl font-bold" : "text-lg font-semibold"
          }`}
        >
          {event.title}
        </h2>
        <p className="text-gray-500 text-sm mb-2">{event.startDate}</p>
        <p className={`${isLarge ? "text-gray-700" : "text-sm text-gray-700"}`}>
          {truncatedDescription}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
