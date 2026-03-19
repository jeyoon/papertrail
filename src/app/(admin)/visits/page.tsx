import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { LogVisitDialog } from "./log-visit-dialog";

export const dynamic = "force-dynamic";

export default async function VisitsPage() {
  const [visits, locations, drops] = await Promise.all([
    prisma.visit.findMany({
      orderBy: { visitedAt: "desc" },
      include: {
        location: true,
        dropoffAttempts: {
          include: {
            drop: {
              include: { flyer: { include: { event: true, design: true } } },
            },
          },
        },
      },
    }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
    prisma.drop.findMany({
      include: {
        location: true,
        flyer: { include: { event: true, design: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Visits"
        subtitle={`${visits.length} recorded visit${visits.length !== 1 ? "s" : ""}`}
        action={<LogVisitDialog locations={locations} drops={drops} />}
      />
      <div className="px-8 pb-8 space-y-3">
        {visits.length === 0 ? (
          <div className="py-10 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
            No visits logged yet
          </div>
        ) : (
          visits.map((v) => (
            <div
              key={v.id}
              className="border"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              {/* Visit header */}
              <div className="px-5 py-3 flex items-center justify-between border-b" style={{ borderColor: "var(--border)" }}>
                <div>
                  <span className="font-medium">{v.location.name}</span>
                  <span className="mx-2 text-xs" style={{ color: "var(--muted-foreground)" }}>·</span>
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{v.visitedBy}</span>
                </div>
                <div className="font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {new Date(v.visitedAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                    hour: "numeric", minute: "2-digit",
                  })}
                </div>
              </div>

              {/* Dropoff attempts */}
              {v.dropoffAttempts.length > 0 && (
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {v.dropoffAttempts.map((a) => (
                    <div key={a.id} className="px-5 py-2.5 flex items-center gap-4">
                      <span className={`stamp stamp-${a.status}`}>{a.status}</span>
                      <div className="flex-1 text-sm">
                        {a.drop.flyer.event.name}
                        <span className="mx-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>/</span>
                        <span style={{ color: "var(--muted-foreground)" }}>{a.drop.flyer.design.name}</span>
                      </div>
                      {a.quantity != null && (
                        <div className="font-mono text-sm" style={{ color: "var(--muted-foreground)" }}>
                          {a.quantity} pcs
                        </div>
                      )}
                      {a.comment && (
                        <div className="text-xs italic max-w-48 truncate" style={{ color: "var(--muted-foreground)" }}>
                          "{a.comment}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {v.notes && (
                <div className="px-5 py-2 border-t text-xs italic" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                  {v.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
