import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useState } from "react";

const PublicPage1 = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await axios.post(`${BASE_URL}/api/contact`, formData, {
        withCredentials: true,
      });

      setStatus(response.data.success || "Email sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("Failed to send email. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-6">
        Have a question? Send us a message, and we’ll get back to you as soon as
        possible.
      </p>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md mb-4"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md mb-4"
        />

        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md mb-4 h-32"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>

      {status && (
        <p className="mt-4 text-center text-sm text-gray-700">{status}</p>
      )}
    </div>
  );
};

export default PublicPage1;
