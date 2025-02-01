import { useNavigate } from "react-router-dom";

const RSVPList = ({ rsvps }) => {
  const navigate = useNavigate();

  const attending = rsvps.filter((rsvp) => rsvp.status === "attending");
  const notAttending = rsvps.filter((rsvp) => rsvp.status !== "attending");

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">RSVPs</h2>

      <div className="flex justify-between mb-4">
        {/* <p className="font-semibold">Attending: {attending.length}</p> */}
        {/* <p className="font-semibold">Not Attending: {notAttending.length}</p> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-green-700 text-center">
            Attending: {attending?.length}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {attending.map((rsvp) => (
              <div
                key={rsvp.rsvpId}
                onClick={() => navigate(`/profile/${rsvp.user._id}`)}
                className="border p-4 rounded shadow-md bg-green-100 cursor-pointer hover:bg-green-200 transition"
              >
                <p className="font-bold">
                  Name: {rsvp.user.firstname} {rsvp.user.lastname}
                </p>
                <p>Email: {rsvp.user.email}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-red-700 text-center">
            Not Attending: {notAttending?.length}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {notAttending.map((rsvp) => (
              <div
                key={rsvp.rsvpId}
                onClick={() => navigate(`/profile/${rsvp.user._id}`)}
                className="border p-4 rounded shadow-md bg-red-100 cursor-pointer hover:bg-red-200 transition"
              >
                <p className="font-bold">
                  Name: {rsvp.user.firstname} {rsvp.user.lastname}
                </p>
                <p>Email: {rsvp.user.email || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSVPList;
