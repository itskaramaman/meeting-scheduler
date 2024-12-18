"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/lib/validators";
import useFetch from "@/hooks/useFetch";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";
import { getDashboardActivities } from "@/actions/dashboard";
import { z } from "zod";

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
    fn: fnGetDashboardActivities,
    data: dashboardData,
  } = useFetch(getDashboardActivities);
  type DashboardDataType = Awaited<ReturnType<typeof getDashboardActivities>>;
  const typedDashboardData: DashboardDataType = dashboardData;

  useEffect(() => {
    const fetchDashboardActivites = async () => {
      await fnGetDashboardActivities();
    };
    fetchDashboardActivites();
  }, []);

  const onSubmit: SubmitHandler<z.infer<typeof usernameSchema>> = async (data: {
    username: string;
  }) => {
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
                {typedDashboardData.map((activity) => (
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
