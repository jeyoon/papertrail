import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { CreateLocationDialog } from "./create-dialog";
import { DeleteButton } from "@/components/delete-button";
import { deleteLocation } from "@/app/actions/locations";

export const dynamic = "force-dynamic";

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { drops: true, visits: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Locations"
        subtitle={`${locations.length} store${locations.length !== 1 ? "s" : ""}`}
        action={<CreateLocationDialog />}
      />
      <div className="px-8 pb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              <th className="table-label text-left py-2 pr-6">Name</th>
              <th className="table-label text-left py-2 pr-6">Address</th>
              <th className="table-label text-left py-2 pr-6">Notes</th>
              <th className="table-label text-right py-2 pr-6">Drops</th>
              <th className="table-label text-right py-2 pr-6">Visits</th>
              <th className="table-label py-2 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {locations.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                  No locations yet — add your first store above
                </td>
              </tr>
            ) : (
              locations.map((l) => (
                <tr
                  key={l.id}
                  className="group"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="py-3 pr-6 font-medium">{l.name}</td>
                  <td className="py-3 pr-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {l.address}
                  </td>
                  <td className="py-3 pr-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {l.notes ?? "—"}
                  </td>
                  <td className="py-3 pr-6 text-right font-mono text-sm">{l._count.drops}</td>
                  <td className="py-3 pr-6 text-right font-mono text-sm">{l._count.visits}</td>
                  <td className="py-3 flex items-center">
                    <CreateLocationDialog initial={{
                      id: l.id,
                      name: l.name,
                      address: l.address,
                      notes: l.notes ?? "",
                    }} />
                    <DeleteButton
                      id={l.id}
                      action={deleteLocation}
                      title={`Delete "${l.name}"?`}
                      description={`This will permanently delete ${l.name} along with ${l._count.drops} drop${l._count.drops !== 1 ? "s" : ""}, ${l._count.visits} visit${l._count.visits !== 1 ? "s" : ""}, and all associated engagement records. This cannot be undone.`}
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
