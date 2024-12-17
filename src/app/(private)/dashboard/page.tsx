"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/lib/validators";
import useFetch from "@/hooks/useFetch";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";
import { getDashboardActivities } from "@/actions/dashboard";

const Dashboard = () => {
  const { isLoaded, user } = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  useEffect(() => {
    setValue("username", user?.username);
  }, [isLoaded]);

  const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);
  const {
    loading: dashboardActivitiesLoading,
    error: dashboardActivitiesError,
    fn: fnGetDashboardActivities,
    data: dashboardData,
  } = useFetch(getDashboardActivities);

  useEffect(() => {
    const fetchDashboardActivites = async () => {
      await fnGetDashboardActivities();
    };
    fetchDashboardActivites();
  }, []);

  const onSubmit = async (data: { username: string }) => {
    fnUpdateUsername(data.username);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName}</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardActivitiesLoading ? (
            <p>Loading activities...</p>
          ) : (
            dashboardData && (
              <ul>
                {dashboardData.map((activity) => (
                  <a
                    key={activity.id}
                    className="hover:underline hover:text-blue-500"
                    href={activity.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <li>
                      {`${activity.event.title} with ${activity.name} for ${activity.event.duration} minutes`}
                    </li>
                  </a>
                ))}
              </ul>
            )
          )}
        </CardContent>
      </Card>

      {/* 
      {
    id: 'd0f7f7a5-b393-4abb-9607-76ff97c8e12a',
    eventId: 'dfe4859f-9d05-4a7c-a118-3a5f79bb38b6',
    userId: 'a46a4840-2f07-4095-b5aa-2949b9442a31',
    name: 'test',
    email: 'test@gmail.com',
    additionalInfo: '',
    startTime: 2024-12-18T19:00:00.000Z,
    endTime: 2024-12-18T19:30:00.000Z,
    meetLink: 'https://meet.google.com/exq-drsq-kor',
    googleEventId: 'hrtbiffm4tg4m2oca8b7eqn14k',
    createdAt: 2024-12-16T20:37:46.268Z,
    updatedAd: 2024-12-16T20:37:46.268Z,
    event: { title: 'First Public Event' }
  } */}

      <Card>
        <CardHeader>
          <CardTitle>Your Unique Link</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span>{window?.location?.origin}/</span>
                <Input placeholder="username" {...register("username")} />
              </div>
              {errors?.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.username?.message as string}
                </p>
              )}
              {error && (
                <p className="text-red-500 text-sm mt-1">{error?.message}</p>
              )}
            </div>
            {loading && (
              <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            )}
            <Button className="bg-blue-500 hover:bg-blue-600" type="submit">
              Update Username
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
