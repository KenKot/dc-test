import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";

const ApplicationFormPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    phone: "",
    email: "",
    reason: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/contact/apply`,
        formData,
        {
          withCredentials: true,
        }
      );

      setStatus(response.data.success || "Application submitted successfully!");
      setFormData({
        name: "",
        dob: "",
        phone: "",
        email: "",
        reason: "",
      });
    } catch (error) {
      console.error(error);
      setStatus("Submission failed. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-red-600 mb-8">
        Why Join Delta Chi?
      </h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est,
        assumenda! Explicabo obcaecati sequi inventore, et facilis recusandae,
        atque, sunt doloribus iure aliquam enim voluptates fuga? Dolore
        quibusdam odio ea maiores!
      </p>
      <h1 className="text-4xl font-bold text-red-600 mb-8">Application Form</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-6 rounded-md shadow-md space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="flex-1 p-3 border rounded-md"
          />
          <input
            type="text"
            name="dob"
            placeholder="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            required
            className="flex-1 p-3 border rounded-md"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="flex-1 p-3 border rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="flex-1 p-3 border rounded-md"
          />
        </div>

        <textarea
          name="reason"
          placeholder="Why do you want to join?"
          value={formData.reason}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md h-36"
        ></textarea>

        <button
          type="submit"
          className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500 transition"
        >
          Submit
        </button>

        {status && (
          <p className="text-sm text-center text-gray-700 mt-2">{status}</p>
        )}
      </form>
    </div>
  );
};

export default ApplicationFormPage;
