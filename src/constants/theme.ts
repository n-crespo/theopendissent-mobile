import { Platform } from "react-native";

export const theme = {
  colors: {
    // --- Core Palette ---
    background: "#F8F2E8", // Main App Background (Off-white)
    backgroundGrouped: "#F2F2F7", // iOS Standard Grouped Background (Light Gray)
    surface: "#FFFFFF", // Cards, Modals, Input backgrounds

    // --- Brand Colors ---
    logoRed: "#70161e",
    logoGreen: "#4d5e19",
    logoBlue: "#043f63",

    // --- Semantic Text ---
    text: "#0F172A", // Slate-900 (Primary)
    textSecondary: "#64748B", // Slate-500 (Secondary/Meta)
    textTertiary: "#94A3B8", // Slate-400 (Placeholder/Icon)

    // --- Borders & Lines ---
    border: "#E2E8F0", // Slate-200 (Card Borders)
    borderSubtle: "#F1F5F9", // Slate-100 (Dividers)
    iosGray: "#8E8E93",

    // --- Tailwind Slate Scale (Frequently used in your UI) ---
    slate50: "#F8FAFC",
    slate100: "#F1F5F9",
    slate200: "#E2E8F0",
    slate300: "#CBD5E1",
    slate400: "#94A3B8",
    slate500: "#64748B",
    slate600: "#475569",
    slate700: "#334155",
    slate800: "#1E293B",
    slate900: "#0F172A",

    // --- Status & Feedback ---
    success: "#28a745",
    successBg: "#DCFCE7", // Green-100
    danger: "#dc3545",
    dangerBg: "#FEF2F2", // Red-50

    // --- Interaction States ---
    pressed: "rgba(0, 0, 0, 0.05)", // Universal press highlight
    overlay: "rgba(0, 0, 0, 0.4)", // Modal backdrop
  },

  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    xs: 4,
    sm: 6,
    md: 8, // Standard Radius
    lg: 12, // Card Radius
    xl: 16,
    full: 9999,
  },

  // Consistent Shadows
  shadows: {
    // Subtle card shadow
    sm: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
    }),
    // Floating button / Modal shadow
    md: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 5 },
    }),
  },
};
