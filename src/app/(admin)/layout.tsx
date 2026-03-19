"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { warmTheme } from "@/lib/mui-theme";

const DRAWER_WIDTH = 208;

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { divider: true },
  { href: "/locations", label: "Locations" },
  { href: "/events", label: "Events" },
  { href: "/designs", label: "Designs" },
  { divider: true },
  { href: "/flyers", label: "Flyers" },
  { href: "/drops", label: "Drops" },
  { href: "/print-orders", label: "Print Orders" },
  { divider: true },
  { href: "/visits", label: "Visits" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ThemeProvider theme={warmTheme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
          }}
        >
          {/* Wordmark */}
          <Box sx={{ px: 2.5, pt: 3.5, pb: 2.5, borderBottom: "1px solid #25343F" }}>
            <Typography
              variant="h5"
              sx={{ color: "#EAEFEF", letterSpacing: "0.05em", lineHeight: 1, textTransform: "uppercase" }}
            >
              Papertrail
            </Typography>
          </Box>

          {/* Nav */}
          <List sx={{ flex: 1, px: 1, py: 1.5 }} disablePadding>
            {NAV.map((item, i) =>
              "divider" in item ? (
                <Divider key={i} sx={{ my: 1, borderColor: "#25343F" }} />
              ) : (
                <ListItem key={item.href} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href!}
                    selected={pathname === item.href || pathname.startsWith(item.href + "/")}
                    sx={{ px: 1.5, py: 1 }}
                  >
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: pathname === item.href ? "#EAEFEF" : "rgba(234,239,239,0.55)",
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>

          {/* Footer */}
          <Box sx={{ px: 2.5, py: 1.5, borderTop: "1px solid #25343F" }}>
            <Typography
              sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(234,239,239,0.3)" }}
            >
              v0.1.0
            </Typography>
          </Box>
        </Drawer>

        {/* Main */}
        <Box component="main" sx={{ flex: 1, minWidth: 0, bgcolor: "background.default" }}>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
