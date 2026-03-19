import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { CreateEventDialog } from "./create-dialog";
import { DeleteButton } from "@/components/delete-button";
import { deleteEvent } from "@/app/actions/events";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: { _count: { select: { flyers: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle={`${events.length} event${events.length !== 1 ? "s" : ""}`}
        action={<CreateEventDialog />}
      />
      <div className="px-8 pb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              <th className="table-label text-left py-2 pr-6">Name</th>
              <th className="table-label text-left py-2 pr-6">Date</th>
              <th className="table-label text-left py-2 pr-6">Landing URL</th>
              <th className="table-label text-right py-2 pr-6">Flyers</th>
              <th className="table-label py-2 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                  No events yet
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e.id} className="group" style={{ borderColor: "var(--border)" }}>
                  <td className="py-3 pr-6 font-medium">
                    <Link
                      href={`/events/${e.id}`}
                      className="hover:underline underline-offset-2"
                      style={{ color: "inherit" }}
                    >
                      {e.name} →
                    </Link>
                  </td>
                  <td className="py-3 pr-6 font-mono text-sm">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    <a
                      href={e.landingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-[var(--foreground)]"
                    >
                      {e.landingUrl}
                    </a>
                  </td>
                  <td className="py-3 pr-6 text-right font-mono text-sm">{e._count.flyers}</td>
                  <td className="py-3 flex items-center">
                    <CreateEventDialog initial={{
                      id: e.id,
                      name: e.name,
                      date: new Date(e.date).toISOString().split("T")[0],
                      landingUrl: e.landingUrl,
                      description: e.description ?? "",
                    }} />
                    <DeleteButton
                      id={e.id}
                      action={deleteEvent}
                      title={`Delete "${e.name}"?`}
                      description={`This will permanently delete ${e.name} along with ${e._count.flyers} flyer${e._count.flyers !== 1 ? "s" : ""} and all associated drops, QR codes, and engagement records. This cannot be undone.`}
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
