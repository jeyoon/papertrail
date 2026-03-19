"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDesign(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await prisma.design.create({
    data: { name, description: description || null },
  });

  revalidatePath("/designs");
}

export async function updateDesign(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await prisma.design.update({
    where: { id },
    data: { name, description: description || null },
  });

  revalidatePath("/designs");
}

export async function deleteDesign(id: string) {
  await prisma.$transaction(async (tx) => {
    const drops = await tx.drop.findMany({
      where: { flyer: { designId: id } },
      select: { id: true },
    });
    const dropIds = drops.map((d) => d.id);

    await tx.engagement.deleteMany({ where: { dropId: { in: dropIds } } });
    await tx.dropoffAttempt.deleteMany({ where: { dropId: { in: dropIds } } });
    await tx.drop.deleteMany({ where: { id: { in: dropIds } } });
    await tx.printOrder.deleteMany({ where: { flyer: { designId: id } } });
    await tx.flyer.deleteMany({ where: { designId: id } });
    await tx.design.delete({ where: { id } });
  });

  revalidatePath("/designs");
}
