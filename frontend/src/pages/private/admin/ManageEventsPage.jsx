import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateEvent from "@/components/admin/manage-events/CreateEvent";
import ViewEvents from "@/components/admin/manage-events/ViewEvents";

const ManageEvents = () => {
  return (
    <Tabs defaultValue="manage" className="w-full mt-4">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 h-auto">
        <TabsTrigger
          value="manage"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2"
        >
          Manage Events
        </TabsTrigger>
        <TabsTrigger
          value="create"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2"
        >
          Create Event
        </TabsTrigger>
      </TabsList>
      <TabsContent value="manage">
        <ViewEvents />
      </TabsContent>
      <TabsContent value="create">
        <CreateEvent />
      </TabsContent>
    </Tabs>
  );
};

export default ManageEvents;
