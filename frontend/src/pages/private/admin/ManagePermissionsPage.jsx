import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import PendingApplicantCard from "@/components/admin/manage-permissions/PendingApplicantCard";
import BannedMembers from "@/components/admin/manage-permissions/BannedMembers";
import CurrentMembers from "@/components/admin/manage-permissions/CurrentMembers";
import PendingApplicants from "@/components/admin/manage-permissions/PendingApplicants";

const ManagePermissions = () => {
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

export default ManagePermissions;
