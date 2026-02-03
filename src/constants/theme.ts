import { Platform } from "react-native";

export const theme = {
  colors: {
    // Core Palette
    background: "#F8F2E8", // --color-logo-offwhite
    surface: "#FFFFFF", // --post-bg

    // Brand
    logoRed: "#70161e",
    logoGreen: "#4d5e19",
    logoBlue: "#043f63",

    // Transparent variants (mapped from your rgba values)
    logoGreenLight: "rgba(77, 94, 25, 0.1)",
    logoRedLight: "rgba(112, 22, 30, 0.1)",

    // Text & Gray
    text: "#222222",
    textSecondary: "#464646", // --color-gray-custom
    border: "#e2e8f0", // --color-border-subtle

    // Status
    success: "#28a745",
    successBg: "rgba(40, 167, 69, 0.1)",
    danger: "#dc3545",
    dangerBg: "rgba(220, 53, 69, 0.1)",
  },

  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 6, // --radius-button
    md: 8, // --radius-modal
    lg: 16,
    full: 9999,
  },

  // React Native shadows are complex (iOS uses opacity/radius, Android uses elevation)
  // This helper standardizes them.
  shadows: {
    default: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    modal: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
      },
      android: {
        elevation: 10,
      },
    }),
  },
};
