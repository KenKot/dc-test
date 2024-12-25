import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PendingApplicantCard from "@/components/admin/PendingApplicantCard";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";

const PendingApplicants = () => {
  const [pendingMembers, setPendingMembers] = useState([]);
  console.log("PendingApplicants.jsx fired");

  const fetchPendingMembers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/admin/pending-members`,
        {
          withCredentials: true,
        }
      );
      setPendingMembers(response?.data?.pendingMembers);
    } catch (error) {
      console.error("Failed to fetch pending members:", error);
    }
  };

  useEffect(() => {
    fetchPendingMembers();
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await axios.post(
        BASE_URL + "/api/admin/update-role",
        {
          userIdToUpdate: id,
          newRole: "member",
        },
        { withCredentials: true }
      );

      setPendingMembers((members) =>
        members.filter((member) => member._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.post(
        BASE_URL + "/api/admin/update-role",
        {
          userIdToUpdate: id,
          newRole: "banned",
        },
        { withCredentials: true }
      );

      setPendingMembers((members) =>
        members.filter((member) => member._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Pending Applicants</h2>
        <p>Here you can view and manage pending applicants.</p>
        {pendingMembers.length === 0 ? (
          <p>There are no pending members</p>
        ) : (
          pendingMembers.map((member) => (
            <PendingApplicantCard
              key={member._id}
              firstName={member.firstname}
              lastName={member.lastname}
              email={member.email}
              onApprove={() => handleApprove(member._id)}
              onReject={() => handleReject(member._id)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default PendingApplicants;
