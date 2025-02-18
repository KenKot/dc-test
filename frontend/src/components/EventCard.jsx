const EventCard = ({ event, isLarge = false }) => {
  return (
    <div
      className={`flex ${
        isLarge ? "flex-col md:flex-row gap-6" : "flex gap-4"
      }`}
    >
      <img
        src={event.thumbnail || "/public-event-default.jpeg"}
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
        <p
          className={`${
            isLarge ? "text-gray-700" : "text-gray-700 text-sm truncate"
          }`}
        >
          {event.description}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
