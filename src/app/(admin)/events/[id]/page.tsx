import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      flyers: {
        include: {
          design: true,
          _count: { select: { drops: true, printOrders: true } },
          drops: {
            include: {
              location: true,
              _count: { select: { engagements: true } },
            },
            orderBy: { engagements: { _count: "desc" } },
          },
          printOrders: true,
        },
      },
    },
  });

  const recentEngagements = await prisma.engagement.findMany({
    where: { drop: { flyer: { eventId: id } } },
    orderBy: { scannedAt: "desc" },
    take: 10,
    include: {
      drop: {
        include: {
          location: true,
          flyer: { include: { design: true } },
        },
      },
    },
  });

  if (!event) {
    return (
      <Box sx={{ p: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Event not found.
        </Typography>
        <Link href="/events" style={{ color: "#FF9B51", textDecoration: "none" }}>
          ← Events
        </Link>
      </Box>
    );
  }

  const totalFlyers = event.flyers.length;
  const totalDrops = event.flyers.reduce((sum, f) => sum + f._count.drops, 0);
  const totalEngagements = event.flyers.reduce(
    (sum, f) => sum + f.drops.reduce((s, d) => s + d._count.engagements, 0),
    0
  );

  // Flatten drops across all flyers for the "Drops by Location" table
  const allDropRows = event.flyers.flatMap((f) =>
    f.drops.map((d) => ({
      dropId: d.id,
      location: d.location.name,
      design: f.design.name,
      engagements: d._count.engagements,
      qrCode: d.qrCode,
    }))
  );
  allDropRows.sort((a, b) => b.engagements - a.engagements);

  const cellStyle = {
    px: 2,
    py: 1.5,
    fontSize: "0.875rem",
    color: "#25343F",
  };

  const headerCellStyle = {
    ...cellStyle,
    fontWeight: 700,
    fontSize: "0.75rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: "#25343F99",
    bgcolor: "#EAEFEF",
  };

  return (
    <Box sx={{ bgcolor: "#f7fafa", minHeight: "100vh", pb: 8 }}>
      {/* Back link */}
      <Box sx={{ px: 4, pt: 4, pb: 1 }}>
        <Link
          href="/events"
          style={{
            color: "#FF9B51",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          ← Events
        </Link>
      </Box>

      {/* Event header */}
      <Box sx={{ px: 4, pb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 1 }}>
          <Typography variant="h4" sx={{ color: "#25343F", fontWeight: 700 }}>
            {event.name}
          </Typography>
          <Chip
            label={new Date(event.date).toLocaleDateString(undefined, {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            sx={{
              bgcolor: "#25343F",
              color: "#f7fafa",
              fontWeight: 600,
              fontSize: "0.8rem",
            }}
          />
        </Box>

        {event.description && (
          <Typography variant="body1" sx={{ color: "#25343F", mb: 1, maxWidth: 680 }}>
            {event.description}
          </Typography>
        )}

        {event.landingUrl && (
          <Typography variant="body2" sx={{ color: "#25343F99", mb: 2 }}>
            <a
              href={event.landingUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#FF9B51", textDecoration: "underline" }}
            >
              {event.landingUrl}
            </a>
          </Typography>
        )}

        {/* Summary stat chips */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Chip
            label={`${totalFlyers} flyer${totalFlyers !== 1 ? "s" : ""}`}
            variant="outlined"
            sx={{ borderColor: "#25343F40", color: "#25343F", fontWeight: 500 }}
          />
          <Chip
            label={`${totalDrops} drop${totalDrops !== 1 ? "s" : ""}`}
            variant="outlined"
            sx={{ borderColor: "#25343F40", color: "#25343F", fontWeight: 500 }}
          />
          <Chip
            label={`${totalEngagements} engagement${totalEngagements !== 1 ? "s" : ""}`}
            sx={{
              bgcolor: "#FF9B51",
              color: "#fff",
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      <Box sx={{ px: 4, display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Flyers section */}
        <Box>
          <Typography
            variant="overline"
            sx={{ color: "#25343F99", letterSpacing: "0.1em", mb: 1, display: "block" }}
          >
            Flyers
          </Typography>
          <Paper
            elevation={0}
            sx={{ border: "1px solid #EAEFEF", borderRadius: 2, overflow: "hidden" }}
          >
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
              <Box component="thead">
                <Box component="tr">
                  {["Design", "Drops", "Print Orders", "Engagements"].map((h) => (
                    <Box component="th" key={h} sx={{ ...headerCellStyle, textAlign: "left" }}>
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {event.flyers.length === 0 ? (
                  <Box component="tr">
                    <Box component="td" colSpan={4} sx={{ ...cellStyle, textAlign: "center", color: "#25343F66", py: 4 }}>
                      No flyers yet
                    </Box>
                  </Box>
                ) : (
                  event.flyers.map((f, idx) => {
                    const flyerEngagements = f.drops.reduce(
                      (s, d) => s + d._count.engagements,
                      0
                    );
                    return (
                      <Box
                        component="tr"
                        key={f.id}
                        sx={{
                          bgcolor: idx === 0 && flyerEngagements > 0 ? "#EAEFEF55" : "transparent",
                          borderTop: idx > 0 ? "1px solid #EAEFEF" : "none",
                        }}
                      >
                        <Box component="td" sx={{ ...cellStyle, fontWeight: 500 }}>
                          {f.design.name}
                        </Box>
                        <Box component="td" sx={{ ...cellStyle, fontFamily: "monospace" }}>
                          {f._count.drops}
                        </Box>
                        <Box component="td" sx={{ ...cellStyle, fontFamily: "monospace" }}>
                          {f._count.printOrders}
                        </Box>
                        <Box component="td" sx={{ ...cellStyle, fontFamily: "monospace", fontWeight: 600, color: flyerEngagements > 0 ? "#FF9B51" : "#25343F66" }}>
                          {flyerEngagements}
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Drops by Location section */}
        <Box>
          <Typography
            variant="overline"
            sx={{ color: "#25343F99", letterSpacing: "0.1em", mb: 1, display: "block" }}
          >
            Drops by Location
          </Typography>
          <Paper
            elevation={0}
            sx={{ border: "1px solid #EAEFEF", borderRadius: 2, overflow: "hidden" }}
          >
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
              <Box component="thead">
                <Box component="tr">
                  {["QR", "Location", "Design", "Engagements"].map((h) => (
                    <Box component="th" key={h} sx={{ ...headerCellStyle, textAlign: "left" }}>
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {allDropRows.length === 0 ? (
                  <Box component="tr">
                    <Box component="td" colSpan={3} sx={{ ...cellStyle, textAlign: "center", color: "#25343F66", py: 4 }}>
                      No drops yet
                    </Box>
                  </Box>
                ) : (
                  allDropRows.map((row, idx) => (
                    <Box
                      component="tr"
                      key={row.dropId}
                      sx={{
                        bgcolor: idx === 0 && row.engagements > 0 ? "#EAEFEF55" : "transparent",
                        borderTop: idx > 0 ? "1px solid #EAEFEF" : "none",
                      }}
                    >
                      <Box component="td" sx={{ ...cellStyle, py: 1, width: 52 }}>
                        {row.qrCode ? (
                          <a href={row.qrCode} download={`qr-${row.dropId}.png`} title="Download QR code">
                            <Image
                              src={row.qrCode}
                              alt="QR code"
                              width={36}
                              height={36}
                              unoptimized
                              style={{ border: "1px solid #EAEFEF", display: "block" }}
                            />
                          </a>
                        ) : (
                          <Box sx={{ width: 36, height: 36, border: "1px solid #EAEFEF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#25343F44" }}>
                            —
                          </Box>
                        )}
                      </Box>
                      <Box component="td" sx={{ ...cellStyle, fontWeight: 500 }}>
                        {row.location}
                      </Box>
                      <Box component="td" sx={{ ...cellStyle, color: "#25343F99" }}>
                        {row.design}
                      </Box>
                      <Box component="td" sx={{ ...cellStyle, fontFamily: "monospace", fontWeight: 600, color: row.engagements > 0 ? "#FF9B51" : "#25343F66" }}>
                        {row.engagements}
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Recent Engagements section */}
        <Box>
          <Typography
            variant="overline"
            sx={{ color: "#25343F99", letterSpacing: "0.1em", mb: 1, display: "block" }}
          >
            Recent Engagements
          </Typography>
          <Paper
            elevation={0}
            sx={{ border: "1px solid #EAEFEF", borderRadius: 2, overflow: "hidden" }}
          >
            {recentEngagements.length === 0 ? (
              <Box sx={{ ...cellStyle, textAlign: "center", color: "#25343F66", py: 4 }}>
                No engagements yet
              </Box>
            ) : (
              <List disablePadding>
                {recentEngagements.map((eng, idx) => (
                  <Box key={eng.id}>
                    {idx > 0 && <Divider sx={{ borderColor: "#EAEFEF" }} />}
                    <ListItem sx={{ px: 2, py: 1.25 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                            <Typography
                              variant="body2"
                              sx={{ fontFamily: "monospace", color: "#25343F", fontWeight: 500, minWidth: 160 }}
                            >
                              {new Date(eng.scannedAt).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#25343F", fontWeight: 500 }}>
                              {eng.drop.location.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#25343F99" }}>
                              {eng.drop.flyer.design.name}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
