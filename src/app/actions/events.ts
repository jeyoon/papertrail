"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const name = formData.get("name") as string;
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;
  const landingUrl = formData.get("landingUrl") as string;

  await prisma.event.create({
    data: {
      name,
      date: new Date(date),
      description: description || null,
      landingUrl,
    },
  });

  revalidatePath("/events");
}

export async function updateEvent(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;
  const landingUrl = formData.get("landingUrl") as string;

  await prisma.event.update({
    where: { id },
    data: { name, date: new Date(date), description: description || null, landingUrl },
  });

  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
}

export async function deleteEvent(id: string) {
  await prisma.$transaction(async (tx) => {
    // Collect all drop IDs belonging to this event's flyers
    const drops = await tx.drop.findMany({
      where: { flyer: { eventId: id } },
      select: { id: true },
    });
    const dropIds = drops.map((d) => d.id);

    // Delete leaf records first, then walk up the tree
    await tx.engagement.deleteMany({ where: { dropId: { in: dropIds } } });
    await tx.dropoffAttempt.deleteMany({ where: { dropId: { in: dropIds } } });
    await tx.drop.deleteMany({ where: { id: { in: dropIds } } });
    await tx.printOrder.deleteMany({ where: { flyer: { eventId: id } } });
    await tx.flyer.deleteMany({ where: { eventId: id } });
    await tx.event.delete({ where: { id } });
  });

  revalidatePath("/events");
}
