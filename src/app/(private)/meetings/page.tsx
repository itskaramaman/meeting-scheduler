import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMeetings } from "@/actions/meetings";
import MeetingList from "./_components/MeetingList";
import { Suspense } from "react";

export const metadata = {
  title: "Your Meetings | Meeting Scheduler",
  description: "View and Manage your upcoming and past meetings.",
};

const MeetingPage = async () => {
  const upcomingMeetings = await UpcomingMeetings();
  const pastMeetings = await PastMeetings();

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="mx-auto">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        <Suspense fallback={<div>Loading upcoming meetings...</div>}>
          {upcomingMeetings}
        </Suspense>
      </TabsContent>
      <TabsContent value="past">
        <Suspense fallback={<div>Loading past meetings...</div>}>
          {pastMeetings}
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

async function UpcomingMeetings() {
  const meetings = await getMeetings("upcoming");
  return <MeetingList meetings={meetings} type="upcoming" />;
}

async function PastMeetings() {
  const meetings = await getMeetings("past");
  return <MeetingList meetings={meetings} type="past" />;
}

export default MeetingPage;
