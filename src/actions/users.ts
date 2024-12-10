"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateUsername(username: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authorized");
  }

  // check if username is already taken
  const existingUsername = await db.user.findUnique({ where: { username } });

  if (existingUsername && existingUsername.id !== userId) {
    throw new Error("Username is already taken.");
  }

  // if username is available then set the new username in db as well as cleark
  await db.user.update({
    where: {
      clerkUserId: userId,
    },
    data: {
      username,
    },
  });

  await clerkClient.users.updateUser(userId, { username });

  return { success: true };
}
