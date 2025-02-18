import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EventImageUploader from "@/components/admin/EventImageUploader";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [eventImageId, setEventImageId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
      resetForm();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    setLocation("");
    setEventImageId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <EventImageUploader
          onImageSelect={setEventImageId}
          autoSelectFirst={true}
        />

        <div className="mb-4">
          <label className="block mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={5}
            disabled={isSubmitting}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              // Set end date to same as start date if start date is after current end date
              if (date > endDate) {
                setEndDate(date);
              }
            }}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 border rounded"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Event..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
