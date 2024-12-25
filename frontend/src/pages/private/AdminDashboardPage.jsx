import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import PendingApplicantCard from "@/components/admin/PendingApplicantCard";
import BannedMembers from "@/components/admin/BannedMembers";
import CurrentMembers from "@/components/admin/CurrentMembers";
import PendingApplicants from "@/components/admin/PendingApplicants";

const AdminDashboardPage = () => {
  return (
    <Tabs defaultValue="pending" className="w-full mt-4">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
        <TabsTrigger
          value="pending"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2"
        >
          Approve/Reject Pending Applicants
        </TabsTrigger>
        <TabsTrigger
          value="current"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2"
        >
          Update Current Members
        </TabsTrigger>
        <TabsTrigger
          value="banned"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2"
        >
          Update Banned/Rejected Members
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pending">
        <PendingApplicants />
      </TabsContent>
      <TabsContent value="current">
        <CurrentMembers />
      </TabsContent>
      <TabsContent value="banned">
        <BannedMembers />
      </TabsContent>
    </Tabs>
  );
};

// const AdminDashboardPage = () => {
//   const [pendingMembers, setPendingMembers] = useState([]);

//   const fetchPendingMembers = async () => {
//     try {
//       const response = await axios.get(
//         BASE_URL + "/api/admin/pending-members",
//         {
//           withCredentials: true,
//         }
//       );

//       setPendingMembers(response?.data?.pendingMembers);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchPendingMembers();
//   }, []);

//   const handleApprove = (id) => {
//     // Implement your approve logic here
//     console.log(`Approved applicant with id: ${id}`);
//     setPendingMembers(pendingMembers.filter((member) => member._id !== id));
//   };

//   const handleReject = (id) => {
//     // Implement your reject logic here
//     console.log(`Rejected applicant with id: ${id}`);
//     setPendingMembers(pendingMembers.filter((member) => member._id !== id));
//   };

//   return (
//     <Tabs defaultValue="pending" className="w-full mt-4">
//       <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
//         <TabsTrigger
//           value="pending"
//           className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2"
//         >
//           Pending Applicants
//         </TabsTrigger>
//         <TabsTrigger
//           value="current"
//           className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2"
//         >
//           Current Members
//         </TabsTrigger>
//         <TabsTrigger
//           value="banned"
//           className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2"
//         >
//           Banned/Rejected Members
//         </TabsTrigger>
//       </TabsList>
//       <TabsContent value="pending">
//         <Card>
//           <CardContent className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Pending Applicants</h2>
//             <p>Here you can view and manage pending applicants.</p>
//             {pendingMembers?.length === 0 ? (
//               <p> Loading</p>
//             ) : (
//               pendingMembers?.map((member) => (
//                 <PendingApplicantCard
//                   key={member._id}
//                   firstName={member.firstname}
//                   lastName={member.lastname}
//                   email={member.email}
//                   onApprove={() => handleApprove(member._id)}
//                   onReject={() => handleReject(member._id)}
//                 />
//               ))
//             )}
//           </CardContent>
//         </Card>
//       </TabsContent>
//       <TabsContent value="current">
//         <Card>
//           <CardContent className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Current Members</h2>
//             <p>Here you can view and manage current members.</p>
//           </CardContent>
//         </Card>
//       </TabsContent>
//       <TabsContent value="banned">
//         <Card>
//           <CardContent className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Banned/Rejected Members</h2>
//             <p>Here you can view and manage banned or rejected members.</p>
//           </CardContent>
//         </Card>
//       </TabsContent>
//     </Tabs>
//   );
// };

export default AdminDashboardPage;
