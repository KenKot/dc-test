import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";

const Texter = () => {
  const [users, setUsers] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/texter/user-text-info`, {
        withCredentials: true,
      });
      const grouped = groupUsersByRole(res.data.users);
      setUsers(grouped);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load recipients");
    } finally {
      setLoading(false);
    }
  };

  const groupUsersByRole = (data) => {
    const roles = {};
    data.forEach((user) => {
      if (!roles[user.role]) roles[user.role] = [];
      roles[user.role].push({
        label: `${user.label}`,
        value: user.value,
      });
    });
    return Object.entries(roles).map(([role, options]) => ({
      label: role.charAt(0).toUpperCase() + role.slice(1),
      options,
    }));
  };

  const handleSend = async () => {
    try {
      if (selectedRecipients.length === 0 || !message.trim()) {
        return alert("Please select recipients and enter a message.");
      }
      const res = await axios.post(
        `${BASE_URL}/api/messages/send`,
        {
          recipients: selectedRecipients.map((r) => r.value),
          message,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        setSuccess("Message sent successfully!");
        setMessage("");
        setSelectedRecipients([]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl text-center text-red-700 font-bold mb-6">
        Send Message
      </h2>

      <label className="block font-semibold mb-2">Recipient</label>
      <Select
        isMulti
        options={users}
        value={selectedRecipients}
        onChange={setSelectedRecipients}
        placeholder="Select recipients..."
        className="mb-4"
      />

      <label className="block font-semibold mb-2">Message</label>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md mb-4"
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter text message"
      />

      <div className="flex justify-between">
        <button
          onClick={handleSend}
          className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600"
        >
          Send Message
        </button>
        <button
          onClick={() => {
            setMessage("");
            setSelectedRecipients([]);
            setSuccess(null);
            setError(null);
          }}
          className="border border-gray-400 py-2 px-6 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>

      {success && <p className="text-green-600 text-center mt-4">{success}</p>}
    </div>
  );
};

export default Texter;
