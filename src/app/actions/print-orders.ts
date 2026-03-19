"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPrintOrder(formData: FormData) {
  const flyerId = formData.get("flyerId") as string;
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const orderedAt = formData.get("orderedAt") as string;
  const notes = formData.get("notes") as string;

  await prisma.printOrder.create({
    data: {
      flyerId,
      quantity,
      orderedAt: orderedAt ? new Date(orderedAt) : new Date(),
      notes: notes || null,
    },
  });

  revalidatePath("/print-orders");
}

export async function updatePrintOrder(id: string, formData: FormData) {
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const orderedAt = formData.get("orderedAt") as string;
  const notes = formData.get("notes") as string;

  await prisma.printOrder.update({
    where: { id },
    data: { quantity, orderedAt: orderedAt ? new Date(orderedAt) : new Date(), notes: notes || null },
  });

  revalidatePath("/print-orders");
}

export async function deletePrintOrder(id: string) {
  await prisma.printOrder.delete({ where: { id } });
  revalidatePath("/print-orders");
}
