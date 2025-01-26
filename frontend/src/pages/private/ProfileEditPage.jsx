import { useAuthStore } from "@/store/authStore";
import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ProfileEditPage = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);

  // const [firstName, setFirstName] = useState(user.firstName);
  // const [lastName, setLastName] = useState(user.lastName);

  console.log("info on user store:", user);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/profiles/edit`, {
        withCredentials: true,
      });
      console.log(response?.data);

      // const member = response?.data?.member

      setProfile(response?.data?.member);
    } catch (error) {
      console.log(error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Member</h1>
      <h2>
        {profile.firstname} {profile.lastname}
      </h2>
      <h3>About:</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda,
        consequuntur dolorem. Maxime veniam voluptate dolore eveniet culpa rerum
        animi delectus quam odio rem possimus excepturi incidunt, architecto
        voluptatum. Pariatur, error!
      </p>
    </div>
  );
};

export default ProfileEditPage;
