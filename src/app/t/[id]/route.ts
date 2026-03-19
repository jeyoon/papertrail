import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const drop = await prisma.drop.findUnique({
    where: { id },
    include: { flyer: { include: { event: true } } },
  });

  if (!drop) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.engagement.create({
    data: { dropId: drop.id },
  });

  return NextResponse.redirect(drop.flyer.event.landingUrl);
}
