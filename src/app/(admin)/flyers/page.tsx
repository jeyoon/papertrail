import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { CreateFlyerDialog } from "./create-dialog";
import { DeleteButton } from "@/components/delete-button";
import { deleteFlyer } from "@/app/actions/flyers";

export const dynamic = "force-dynamic";

export default async function FlyersPage() {
  const [flyers, events, designs] = await Promise.all([
    prisma.flyer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        event: true,
        design: true,
        _count: { select: { drops: true, printOrders: true } },
      },
    }),
    prisma.event.findMany({ orderBy: { name: "asc" } }),
    prisma.design.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Flyers"
        subtitle="Event × design pairings"
        action={<CreateFlyerDialog events={events} designs={designs} />}
      />
      <div className="px-8 pb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              <th className="table-label text-left py-2 pr-6">Event</th>
              <th className="table-label text-left py-2 pr-6">Design</th>
              <th className="table-label text-right py-2 pr-6">Drops</th>
              <th className="table-label text-right py-2 pr-6">Print Orders</th>
              <th className="table-label py-2 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {flyers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                  No flyers yet — create an event + design pairing above
                </td>
              </tr>
            ) : (
              flyers.map((p) => (
                <tr key={p.id} className="group" style={{ borderColor: "var(--border)" }}>
                  <td className="py-3 pr-6 font-medium">{p.event.name}</td>
                  <td className="py-3 pr-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {p.design.name}
                  </td>
                  <td className="py-3 pr-6 text-right font-mono text-sm">{p._count.drops}</td>
                  <td className="py-3 pr-6 text-right font-mono text-sm">{p._count.printOrders}</td>
                  <td className="py-3">
                    <DeleteButton
                      id={p.id}
                      action={deleteFlyer}
                      title="Delete this flyer?"
                      description={`This will permanently delete the ${p.event.name} / ${p.design.name} flyer along with ${p._count.drops} drop${p._count.drops !== 1 ? "s" : ""}, ${p._count.printOrders} print order${p._count.printOrders !== 1 ? "s" : ""}, and all engagement records. This cannot be undone.`}
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
