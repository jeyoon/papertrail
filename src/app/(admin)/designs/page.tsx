import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { CreateDesignDialog } from "./create-dialog";
import { DeleteButton } from "@/components/delete-button";
import { deleteDesign } from "@/app/actions/designs";

export const dynamic = "force-dynamic";

export default async function DesignsPage() {
  const designs = await prisma.design.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { flyers: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Designs"
        subtitle="Flyer variants for A/B testing"
        action={<CreateDesignDialog />}
      />
      <div className="px-8 pb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              <th className="table-label text-left py-2 pr-6">Name</th>
              <th className="table-label text-left py-2 pr-6">Description</th>
              <th className="table-label text-left py-2 pr-6">Created</th>
              <th className="table-label text-right py-2 pr-6">Flyers</th>
              <th className="table-label py-2 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {designs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                  No designs yet
                </td>
              </tr>
            ) : (
              designs.map((d) => (
                <tr key={d.id} className="group" style={{ borderColor: "var(--border)" }}>
                  <td className="py-3 pr-6 font-medium">{d.name}</td>
                  <td className="py-3 pr-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {d.description ?? "—"}
                  </td>
                  <td className="py-3 pr-6 font-mono text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-6 text-right font-mono text-sm">{d._count.flyers}</td>
                  <td className="py-3 flex items-center">
                    <CreateDesignDialog initial={{
                      id: d.id,
                      name: d.name,
                      description: d.description ?? "",
                    }} />
                    <DeleteButton
                      id={d.id}
                      action={deleteDesign}
                      title={`Delete "${d.name}"?`}
                      description={`This will permanently delete ${d.name} along with ${d._count.flyers} flyer${d._count.flyers !== 1 ? "s" : ""} and all associated drops, QR codes, and engagement records. This cannot be undone.`}
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
