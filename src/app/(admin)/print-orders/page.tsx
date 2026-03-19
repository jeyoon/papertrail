import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { CreatePrintOrderDialog } from "./create-dialog";
import { DeleteButton } from "@/components/delete-button";
import { deletePrintOrder } from "@/app/actions/print-orders";

export const dynamic = "force-dynamic";

export default async function PrintOrdersPage() {
  const [orders, flyers] = await Promise.all([
    prisma.printOrder.findMany({
      orderBy: { orderedAt: "desc" },
      include: { flyer: { include: { event: true, design: true } } },
    }),
    prisma.flyer.findMany({
      include: { event: true, design: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalPrinted = orders.reduce((sum, o) => sum + o.quantity, 0);

  return (
    <div>
      <PageHeader
        title="Print Orders"
        subtitle={`${totalPrinted.toLocaleString()} total printed across ${orders.length} order${orders.length !== 1 ? "s" : ""}`}
        action={<CreatePrintOrderDialog flyers={flyers} />}
      />
      <div className="px-8 pb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              <th className="table-label text-left py-2 pr-6">Flyer</th>
              <th className="table-label text-right py-2 pr-6">Quantity</th>
              <th className="table-label text-left py-2 pr-6">Ordered</th>
              <th className="table-label text-left py-2 pr-6">Notes</th>
              <th className="table-label py-2 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                  No print orders yet
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="group" style={{ borderColor: "var(--border)" }}>
                  <td className="py-3 pr-6">
                    <div className="font-medium">{o.flyer.event.name}</div>
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {o.flyer.design.name}
                    </div>
                  </td>
                  <td className="py-3 pr-6 text-right font-mono font-medium text-base">
                    {o.quantity.toLocaleString()}
                  </td>
                  <td className="py-3 pr-6 font-mono text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {new Date(o.orderedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {o.notes ?? "—"}
                  </td>
                  <td className="py-3 flex items-center">
                    <CreatePrintOrderDialog
                      flyers={flyers}
                      initial={{
                        id: o.id,
                        quantity: o.quantity,
                        orderedAt: new Date(o.orderedAt).toISOString().split("T")[0],
                        notes: o.notes ?? "",
                        flyerLabel: `${o.flyer.event.name} / ${o.flyer.design.name}`,
                      }}
                    />
                    <DeleteButton
                      id={o.id}
                      action={deletePrintOrder}
                      title="Delete this print order?"
                      description={`This will permanently delete the print order for ${o.flyer.event.name} / ${o.flyer.design.name} (${o.quantity.toLocaleString()} units, ordered ${new Date(o.orderedAt).toLocaleDateString()}). This cannot be undone.`}
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
