import { createTheme, alpha } from "@mui/material/styles"

// ---------------------------------------------------------------------------
// Design tokens
//
// One confident accent (indigo) on a light neutral base. Every colour used in
// the app should come from here rather than being hard-coded in a component,
// so a rebrand is a change to this file alone.
// ---------------------------------------------------------------------------

export const tokens = {
    accent: "#4F46E5",
    accentLight: "#6366F1",
    accentDark: "#4338CA",
    accentSoft: "#EEF2FF",

    ink: "#0F172A",
    body: "#475569",
    muted: "#64748B",
    line: "#E2E8F0",
    lineStrong: "#CBD5E1",
    surface: "#FFFFFF",
    canvas: "#F7F8FB",

    success: "#15803D",
    successSoft: "#DCFCE7",
    danger: "#DC2626",
    dangerSoft: "#FEE2E2",
    warning: "#B45309",
    warningSoft: "#FEF3C7",

    // Dark surfaces, used by the conference screens which stay dark by design.
    dark: "#101014",
    darkRaised: "#1B1B21",
    darkRaised2: "#26262E",
    darkLine: "#33333D",
}

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 }

export const shadow = {
    xs: "0 1px 2px rgba(15, 23, 42, 0.06)",
    sm: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
    md: "0 4px 12px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)",
    lg: "0 12px 32px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(15, 23, 42, 0.06)",
    xl: "0 24px 64px rgba(15, 23, 42, 0.18)",
}

export const layout = {
    navHeight: 64,
    sidebarWidth: 264,
}

const fontStack = [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
].join(",")

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: tokens.accent,
            light: tokens.accentLight,
            dark: tokens.accentDark,
            contrastText: "#FFFFFF",
        },
        secondary: { main: tokens.ink, contrastText: "#FFFFFF" },
        success: { main: tokens.success },
        error: { main: tokens.danger },
        warning: { main: tokens.warning },
        background: { default: tokens.canvas, paper: tokens.surface },
        text: { primary: tokens.ink, secondary: tokens.muted },
        divider: tokens.line,
    },

    shape: { borderRadius: radius.md },

    typography: {
        fontFamily: fontStack,
        h1: { fontSize: "clamp(2.25rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em" },
        h2: { fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)", fontWeight: 750, lineHeight: 1.15, letterSpacing: "-0.02em" },
        h3: { fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.015em" },
        h4: { fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.01em" },
        h5: { fontSize: "1.0625rem", fontWeight: 650, lineHeight: 1.4 },
        h6: { fontSize: "0.9375rem", fontWeight: 650, lineHeight: 1.4 },
        subtitle1: { fontSize: "1rem", fontWeight: 500, lineHeight: 1.6 },
        subtitle2: { fontSize: "0.8125rem", fontWeight: 600, lineHeight: 1.5, letterSpacing: "0.02em" },
        body1: { fontSize: "0.9375rem", lineHeight: 1.65 },
        body2: { fontSize: "0.875rem", lineHeight: 1.6 },
        caption: { fontSize: "0.75rem", lineHeight: 1.5 },
        overline: { fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", lineHeight: 1.5 },
        button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "*, *::before, *::after": { boxSizing: "border-box" },
                html: { WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" },
                body: {
                    backgroundColor: tokens.canvas,
                    color: tokens.ink,
                    margin: 0,
                },
                "#root": { minHeight: "100vh" },
                a: { color: "inherit" },
                "::selection": { background: alpha(tokens.accent, 0.18) },
                // Slim, unobtrusive scrollbars that match the neutral palette.
                "*::-webkit-scrollbar": { width: 10, height: 10 },
                "*::-webkit-scrollbar-track": { background: "transparent" },
                "*::-webkit-scrollbar-thumb": {
                    background: tokens.lineStrong,
                    borderRadius: 999,
                    border: "3px solid transparent",
                    backgroundClip: "content-box",
                },
                "*::-webkit-scrollbar-thumb:hover": { background: tokens.muted, backgroundClip: "content-box" },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: "none" },
                outlined: { borderColor: tokens.line },
            },
        },

        MuiCard: {
            defaultProps: { elevation: 0, variant: "outlined" },
            styleOverrides: {
                root: { borderRadius: radius.lg, borderColor: tokens.line },
            },
        },

        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: radius.sm, paddingInline: 16, whiteSpace: "nowrap" },
                sizeSmall: { paddingInline: 12, paddingBlock: 5, fontSize: "0.8125rem" },
                sizeLarge: { paddingInline: 24, paddingBlock: 11, fontSize: "0.9375rem" },
                containedPrimary: {
                    boxShadow: shadow.xs,
                    "&:hover": { backgroundColor: tokens.accentDark, boxShadow: shadow.sm },
                },
                outlined: { borderColor: tokens.lineStrong, "&:hover": { borderColor: tokens.accent, backgroundColor: tokens.accentSoft } },
                text: { "&:hover": { backgroundColor: alpha(tokens.ink, 0.04) } },
            },
        },

        MuiIconButton: {
            styleOverrides: { root: { borderRadius: radius.sm } },
        },

        MuiTextField: {
            defaultProps: { size: "small", fullWidth: true },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: radius.sm,
                    backgroundColor: tokens.surface,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: tokens.lineStrong },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: tokens.muted },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderWidth: 1.5, borderColor: tokens.accent },
                },
                input: { fontSize: "0.9375rem" },
            },
        },

        MuiInputLabel: {
            styleOverrides: { root: { fontSize: "0.9375rem" } },
        },

        MuiFormLabel: {
            styleOverrides: {
                root: { fontSize: "0.8125rem", fontWeight: 600, color: tokens.body },
            },
        },

        MuiTable: {
            defaultProps: { size: "small" },
        },

        MuiTableCell: {
            styleOverrides: {
                root: { borderColor: tokens.line, fontSize: "0.875rem", paddingBlock: 12 },
                head: {
                    fontWeight: 650,
                    fontSize: "0.75rem",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: tokens.muted,
                    backgroundColor: "#FBFCFE",
                    whiteSpace: "nowrap",
                },
            },
        },

        MuiTableRow: {
            styleOverrides: {
                root: { "&:last-child td": { borderBottom: 0 } },
            },
        },

        MuiDialog: {
            styleOverrides: {
                paper: { borderRadius: radius.lg, boxShadow: shadow.xl },
            },
        },

        MuiDialogTitle: {
            styleOverrides: {
                root: { fontSize: "1.125rem", fontWeight: 700, paddingBlock: 20 },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 600, borderRadius: radius.sm },
                sizeSmall: { height: 22, fontSize: "0.75rem" },
            },
        },

        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: tokens.ink,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    borderRadius: radius.sm,
                    paddingBlock: 6,
                    paddingInline: 10,
                },
                arrow: { color: tokens.ink },
            },
        },

        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: radius.md,
                    border: `1px solid ${tokens.line}`,
                    boxShadow: shadow.lg,
                    marginTop: 6,
                },
                list: { padding: 6 },
            },
        },

        MuiMenuItem: {
            styleOverrides: {
                root: { borderRadius: radius.sm, fontSize: "0.875rem", paddingBlock: 8 },
            },
        },

        MuiListItemButton: {
            styleOverrides: { root: { borderRadius: radius.sm } },
        },

        MuiAlert: {
            styleOverrides: { root: { borderRadius: radius.md, fontSize: "0.875rem", alignItems: "center" } },
        },

        MuiLinearProgress: {
            styleOverrides: {
                root: { borderRadius: 999, height: 6, backgroundColor: tokens.line },
                bar: { borderRadius: 999 },
            },
        },

        MuiDivider: {
            styleOverrides: { root: { borderColor: tokens.line } },
        },
    },
})

export default theme
