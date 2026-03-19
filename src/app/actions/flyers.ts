"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createFlyer(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const designId = formData.get("designId") as string;

  await prisma.flyer.create({
    data: { eventId, designId },
  });

  revalidatePath("/flyers");
}

export async function deleteFlyer(id: string) {
  await prisma.$transaction(async (tx) => {
    const drops = await tx.drop.findMany({ where: { flyerId: id }, select: { id: true } });
    const dropIds = drops.map((d) => d.id);

    await tx.engagement.deleteMany({ where: { dropId: { in: dropIds } } });
    await tx.dropoffAttempt.deleteMany({ where: { dropId: { in: dropIds } } });
    await tx.drop.deleteMany({ where: { flyerId: id } });
    await tx.printOrder.deleteMany({ where: { flyerId: id } });
    await tx.flyer.delete({ where: { id } });
  });

  revalidatePath("/flyers");
}
