import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMeetings } from "@/actions/meetings";

export const metadata = {
  title: "Your Meetings | Meeting Scheduler",
  description: "View and Manage your upcoming and past meetings.",
};

const MeetingPage = async () => {
  const { upcomingBookings, pastBookings } = await getMeetings();

  console.log(upcomingBookings, pastBookings);
  return (
    <Tabs defaultValue="upcoming" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="past">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default MeetingPage;
