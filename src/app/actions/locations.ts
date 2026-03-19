"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLocation(formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const notes = formData.get("notes") as string;

  await prisma.location.create({
    data: { name, address, notes: notes || null },
  });

  revalidatePath("/locations");
}

export async function updateLocation(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const notes = formData.get("notes") as string;

  await prisma.location.update({
    where: { id },
    data: { name, address, notes: notes || null },
  });

  revalidatePath("/locations");
}

export async function deleteLocation(id: string) {
  await prisma.$transaction(async (tx) => {
    const drops = await tx.drop.findMany({ where: { locationId: id }, select: { id: true } });
    const visits = await tx.visit.findMany({ where: { locationId: id }, select: { id: true } });
    const dropIds = drops.map((d) => d.id);
    const visitIds = visits.map((v) => v.id);

    await tx.engagement.deleteMany({ where: { dropId: { in: dropIds } } });
    // DropoffAttempt links to both a drop and a visit — delete by either FK
    await tx.dropoffAttempt.deleteMany({
      where: { OR: [{ dropId: { in: dropIds } }, { visitId: { in: visitIds } }] },
    });
    await tx.drop.deleteMany({ where: { locationId: id } });
    await tx.visit.deleteMany({ where: { locationId: id } });
    await tx.location.delete({ where: { id } });
  });

  revalidatePath("/locations");
}
