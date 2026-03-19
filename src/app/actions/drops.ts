"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import QRCode from "qrcode";

export async function createDrop(formData: FormData) {
  const flyerId = formData.get("flyerId") as string;
  const locationId = formData.get("locationId") as string;

  const drop = await prisma.drop.create({
    data: { flyerId, locationId },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const trackingUrl = `${baseUrl}/t/${drop.id}`;
  const qrCode = await QRCode.toDataURL(trackingUrl, {
    width: 400,
    margin: 2,
    color: { dark: "#1c1208", light: "#f5f0e6" },
  });

  await prisma.drop.update({ where: { id: drop.id }, data: { qrCode } });
  revalidatePath("/drops");
}

export async function deleteDrop(id: string) {
  await prisma.$transaction(async (tx) => {
    await tx.engagement.deleteMany({ where: { dropId: id } });
    await tx.dropoffAttempt.deleteMany({ where: { dropId: id } });
    await tx.drop.delete({ where: { id } });
  });

  revalidatePath("/drops");
}
