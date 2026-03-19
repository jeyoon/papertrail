import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { CreateDropDialog } from "./create-dialog";
import { DeleteButton } from "@/components/delete-button";
import { deleteDrop } from "@/app/actions/drops";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function DropsPage() {
  const [drops, flyers, locations] = await Promise.all([
    prisma.drop.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        location: true,
        flyer: { include: { event: true, design: true } },
        _count: { select: { engagements: true } },
      },
    }),
    prisma.flyer.findMany({
      include: { event: true, design: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Drops"
        subtitle="Flyer × location — each generates a unique QR code"
        action={<CreateDropDialog flyers={flyers} locations={locations} />}
      />
      <div className="px-8 pb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              <th className="table-label text-left py-2 pr-4 w-16">QR</th>
              <th className="table-label text-left py-2 pr-6">Location</th>
              <th className="table-label text-left py-2 pr-6">Event</th>
              <th className="table-label text-left py-2 pr-6">Design</th>
              <th className="table-label text-right py-2 pr-6">Engagements</th>
              <th className="table-label py-2 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {drops.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                  No drops yet
                </td>
              </tr>
            ) : (
              drops.map((p) => (
                <tr key={p.id} className="group" style={{ borderColor: "var(--border)" }}>
                  <td className="py-2 pr-4">
                    {p.qrCode ? (
                      <a href={p.qrCode} download={`qr-${p.id}.png`} title="Download QR code">
                        <Image
                          src={p.qrCode}
                          alt="QR code"
                          width={40}
                          height={40}
                          className="border"
                          style={{ borderColor: "var(--border)" }}
                          unoptimized
                        />
                      </a>
                    ) : (
                      <div className="w-10 h-10 border flex items-center justify-center text-xs"
                        style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                        —
                      </div>
                    )}
                  </td>
                  <td className="py-2 pr-6 font-medium">{p.location.name}</td>
                  <td className="py-2 pr-6 text-sm">{p.flyer.event.name}</td>
                  <td className="py-2 pr-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {p.flyer.design.name}
                  </td>
                  <td className="py-2 pr-6 text-right font-mono text-sm font-medium">
                    {p._count.engagements}
                  </td>
                  <td className="py-2">
                    <DeleteButton
                      id={p.id}
                      action={deleteDrop}
                      title="Delete this drop?"
                      description={`This will permanently delete the drop at ${p.location.name} (${p.flyer.event.name} / ${p.flyer.design.name}) along with its QR code and ${p._count.engagements} engagement record${p._count.engagements !== 1 ? "s" : ""}. This cannot be undone.`}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
