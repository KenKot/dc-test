import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import CurrentMemberCard from "./CurrentMemberCard";

const CurrentMembers = () => {
  const [currentMembers, setCurrentMembers] = useState([]);
  console.log("CurrentMembers.jsx fired");

  const fetchCurrentMembers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/admin/current-members`,
        {
          withCredentials: true,
        }
      );
      setCurrentMembers(response?.data?.currentMembers);
    } catch (error) {
      console.error("Failed to fetch pending members:", error);
    }
  };

  useEffect(() => {
    fetchCurrentMembers();
  }, []);

  const updateRole = async (id, newRole) => {
    try {
      const response = await axios.post(
        BASE_URL + "/api/admin/update-role",
        {
          userIdToUpdate: id,
          newRole: newRole,
        },
        { withCredentials: true }
      );

      setCurrentMembers((members) =>
        members.map((member) =>
          member._id === id ? { ...member, role: newRole } : member
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Current Members</h2>

        {currentMembers?.length === 0 ? (
          <p>There are no current members</p>
        ) : (
          currentMembers?.map((member) => (
            <CurrentMemberCard
              key={member._id}
              firstName={member.firstname}
              lastName={member.lastname}
              email={member.email}
              role={member.role}
              onUpdate={(newRole) => updateRole(member._id, newRole)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentMembers;
