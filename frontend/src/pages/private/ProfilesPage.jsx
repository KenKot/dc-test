import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);

  console.log(BASE_URL + "/api/profiles");

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(BASE_URL + "/api/profiles", {
        withCredentials: true,
      });
      console.log(response?.data);

      setProfiles(response?.data?.activeMembers);
    } catch (error) {
      console.log(error);
    }
  };

  if (profiles.length === 0) {
    return <div>No members yet</div>;
  }

  return (
    <div>
      <h1>Members</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile._id}>
            <Link to={`/profile/${profile._id}`}>
              {profile.firstname} {profile.lastname}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilesPage;
