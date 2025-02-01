import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import BannedMemberCard from "./BannedMemberCard";

const BannedMembers = () => {
  const [bannedMembers, setBannedMembers] = useState([]);
  // console.log("BannedMembers.jsx fired");

  const fetchBannedMembers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/banned-members`, {
        withCredentials: true,
      });
      setBannedMembers(response?.data?.bannedMembers);
    } catch (error) {
      console.error("Failed to fetch banned members:", error);
    }
  };

  useEffect(() => {
    fetchBannedMembers();
  }, []);

  const unbanMember = async (id) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/admin/update-role`,
        {
          userIdToUpdate: id,
          newRole: "member", // Default role after unban
        },
        { withCredentials: true }
      );

      setBannedMembers((members) =>
        members.filter((member) => member._id !== id)
      );
    } catch (error) {
      console.error("Failed to unban member:", error);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Banned Members</h2>

        {bannedMembers.length === 0 ? (
          <p>There are no banned members</p>
        ) : (
          bannedMembers.map((member) => (
            <BannedMemberCard
              key={member._id}
              firstName={member.firstname}
              lastName={member.lastname}
              email={member.email}
              banDetails={member.banDetails}
              onUnban={() => unbanMember(member._id)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default BannedMembers;
