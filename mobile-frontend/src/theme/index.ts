const theme = {
  COLORS: {
    WHITE: "#FFFFFF",
    GREEN_700: "#00875F",
    GREEN_500: "#00B37E",
    RED: "#F75A68",
    RED_DARK: "#AA2834",
    GRAY_700: "#121214",
    GRAY_600: "#202024",
    GRAY_500: "#29292E",
    GRAY_400: "#323238",
    GRAY_300: "#7C7C8A",
    GRAY_200: "#C4C4CC",
    GRAY_100: "#E1E1E6",
    GRAY_BORDER_INPUT_TEXT: "#666262",
    WHITE_ICON_BOTTOM_NAV: "#DAD9D5",
  },
  FONT_FAMILY: {
    REGULAR: "Roboto_400Regular",
    BOLD: "Roboto_700Bold",
  },
  FONT_SIZE: {
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 24,
  },
  // Modern semantic tokens used by screens
  colors: {
    primary: "#2196F3",
    secondary: "#03DAC6",
    background: "#f0f4f8",
    text: "#1a1a2e",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    error: "#dc2626",
    success: "#4CAF50",
    warning: "#f59e0b",
    info: "#2196F3",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSizes: {
      small: 12,
      medium: 16,
      large: 20,
      xlarge: 24,
      xxlarge: 32,
    },
    fontWeights: {
      regular: "400" as const,
      medium: "500" as const,
      bold: "700" as const,
    },
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
  },
};

export default theme;
