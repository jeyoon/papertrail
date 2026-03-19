"use client";

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode } from "react";

// ─── Shared typography (same across all palettes) ───────────────────────────
const typography = {
  fontFamily: "'Barlow', sans-serif",
  h1: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
  h2: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
  h3: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
  h4: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
  h5: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
  h6: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
  overline: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 700,
    letterSpacing: "0.12em",
  },
};

export const warmTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1a2730", light: "#25343F", contrastText: "#EAEFEF" },
    secondary: { main: "#FF9B51", contrastText: "#1a2730" },
    background: { default: "#f7fafa", paper: "#EAEFEF" },
    text: { primary: "#25343F", secondary: "#4e6a7a" },
    divider: "#a8b8c4",
    error: { main: "#e05c3a" },
  },
  typography,
  shape: { borderRadius: 2 },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: "#1a2730", color: "#EAEFEF", borderRight: "none" },
      },
    },
    MuiCard: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          "&:hover": { backgroundColor: "rgba(234,239,239,0.08)" },
          "&.Mui-selected": {
            backgroundColor: "rgba(255,155,81,0.2)",
            "&:hover": { backgroundColor: "rgba(255,155,81,0.28)" },
          },
        },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: "#344d5c" } } },
  },
});

// Keep exports for any future palette work
export const cobaltTheme = warmTheme;
export const fuchsiaTheme = warmTheme;

export function MuiProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={warmTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
