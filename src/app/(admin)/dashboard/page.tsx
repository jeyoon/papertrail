import { prisma } from "@/lib/prisma";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    locationCount,
    eventCount,
    designCount,
    flyerCount,
    dropCount,
    engagementCount,
    visitCount,
    recentEngagements,
    topLocations,
  ] = await Promise.all([
    prisma.location.count(),
    prisma.event.count(),
    prisma.design.count(),
    prisma.flyer.count(),
    prisma.drop.count(),
    prisma.engagement.count(),
    prisma.visit.count(),
    prisma.engagement.findMany({
      take: 8,
      orderBy: { scannedAt: "desc" },
      include: {
        drop: {
          include: {
            location: true,
            flyer: { include: { event: true, design: true } },
          },
        },
      },
    }),
    prisma.drop.findMany({
      include: {
        location: true,
        _count: { select: { engagements: true } },
      },
      orderBy: { engagements: { _count: "desc" } },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Engagements", value: engagementCount, accent: true },
    { label: "Drops", value: dropCount },
    { label: "Locations", value: locationCount },
    { label: "Events", value: eventCount },
    { label: "Designs", value: designCount },
    { label: "Visits", value: visitCount },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ px: 4, pt: 4, pb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <Box>
            <Typography
              variant="h4"
              sx={{ textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1 }}
            >
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Campaign overview
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mt: 2, borderColor: "text.primary", borderBottomWidth: 2 }} />
      </Box>

      <Box sx={{ px: 4, pb: 4 }}>
        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {stats.map((s) => (
            <Grid key={s.label} size={{ xs: 6, sm: 4, md: 2 }}>
              <Card
                elevation={0}
                sx={{
                  bgcolor: s.accent ? "primary.main" : "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: s.accent ? "primary.contrastText" : "text.primary",
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {s.value}
                  </Typography>
                  <Typography
                    variant="overline"
                    sx={{
                      color: s.accent ? "rgba(245,240,230,0.55)" : "text.secondary",
                      fontSize: "0.6rem",
                    }}
                  >
                    {s.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Two-column panels */}
        <Grid container spacing={3}>
          {/* Recent Engagements */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.65rem", display: "block", mb: 1 }}>
              Recent Engagements
            </Typography>
            <Paper
              elevation={0}
              sx={{ border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
            >
              {recentEngagements.length === 0 ? (
                <Box sx={{ px: 2, py: 4, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No engagements yet
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {recentEngagements.map((e, i) => (
                    <Box key={e.id}>
                      {i > 0 && <Divider />}
                      <ListItem sx={{ px: 2, py: 1 }}>
                        <ListItemText
                          primary={e.drop.flyer.event.name}
                          secondary={`${e.drop.location.name} · ${e.drop.flyer.design.name}`}
                          slotProps={{
                            primary: { sx: { fontSize: "0.875rem", fontWeight: 500 } },
                            secondary: { sx: { fontSize: "0.75rem" } },
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontFamily: "'JetBrains Mono', monospace", ml: 2, flexShrink: 0 }}
                        >
                          {new Date(e.scannedAt).toLocaleDateString()}
                        </Typography>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Top Locations */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.65rem", display: "block", mb: 1 }}>
              Top Locations by Engagement
            </Typography>
            <Paper
              elevation={0}
              sx={{ border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
            >
              {topLocations.length === 0 ? (
                <Box sx={{ px: 2, py: 4, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No data yet
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {topLocations.map((p, i) => (
                    <Box key={p.id}>
                      {i > 0 && <Divider />}
                      <ListItem sx={{ px: 2, py: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            color: i === 0 ? "secondary.main" : "text.secondary",
                            width: 24,
                            textAlign: "right",
                            mr: 2,
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </Typography>
                        <ListItemText
                          primary={p.location.name}
                          secondary={p.location.address}
                          slotProps={{
                            primary: { sx: { fontSize: "0.875rem", fontWeight: 500 } },
                            secondary: { sx: { fontSize: "0.75rem" } },
                          }}
                        />
                        <Chip
                          label={p._count.engagements}
                          size="small"
                          sx={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            bgcolor: i === 0 ? "secondary.main" : "background.default",
                            color: i === 0 ? "secondary.contrastText" : "text.primary",
                            border: "1px solid",
                            borderColor: i === 0 ? "secondary.main" : "divider",
                            height: 26,
                          }}
                        />
                      </ListItem>
                    </Box>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
