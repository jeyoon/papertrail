"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DropoffStatus } from "@/generated/prisma/enums";

export async function createVisit(formData: FormData) {
  const locationId = formData.get("locationId") as string;
  const visitedBy = formData.get("visitedBy") as string;
  const visitedAt = formData.get("visitedAt") as string;
  const notes = formData.get("notes") as string;

  // Collect dropoff attempt rows (serialized as JSON)
  const attemptsJson = formData.get("attempts") as string;
  const attempts: Array<{
    dropId: string;
    quantity: string;
    status: string;
    comment: string;
  }> = attemptsJson ? JSON.parse(attemptsJson) : [];

  await prisma.visit.create({
    data: {
      locationId,
      visitedBy,
      visitedAt: visitedAt ? new Date(visitedAt) : new Date(),
      notes: notes || null,
      dropoffAttempts: {
        create: attempts.map((a) => ({
          dropId: a.dropId,
          quantity: a.quantity ? parseInt(a.quantity, 10) : null,
          status: a.status as DropoffStatus,
          comment: a.comment || null,
        })),
      },
    },
  });

  revalidatePath("/visits");
}
