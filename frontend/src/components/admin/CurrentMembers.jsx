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

  const updateRole = async (id, newRole, banReason) => {
    try {
      let payLoad = {
        userIdToUpdate: id,
        newRole: newRole,
      };

      if (banReason) payLoad.banReason = banReason;

      const response = await axios.post(
        BASE_URL + "/api/admin/update-role",
        payLoad,
        { withCredentials: true }
      );

      setCurrentMembers((members) => {
        return members.map((member) => {
          if (member._id === id) {
            return { ...member, role: newRole };
          }
          return member;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Current Members</h2>

        {currentMembers?.length === 0 ? (
          <div>There are no current members</div>
        ) : (
          currentMembers?.map((member) => (
            <CurrentMemberCard
              key={member._id}
              firstName={member.firstname}
              lastName={member.lastname}
              email={member.email}
              role={member.role}
              onUpdate={(newRole, banReason) =>
                updateRole(member._id, newRole, banReason)
              }
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentMembers;
