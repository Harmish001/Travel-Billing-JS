/**
 * SAI Travel Theme Configuration
 * Custom color palette for the travel and finance application
 */

export const themeColors = {
  // Primary (Main Brand) - Teal for trust + freshness
  primary: "#009688",

  // Secondary - Sunset Orange for travel warmth and energy
  secondary: "#FF7043",

  // Accent 1 - Amber for highlights, buttons, optimism
  accent1: "#FFC107",

  // Accent 2 - Light Cyan for airy, travel freedom
  accent2: "#26C6DA",

  // Neutral Dark - Charcoal for text, finance seriousness
  neutralDark: "#263238",

  // Neutral Light - Soft Gray for backgrounds, balance
  neutralLight: "#F5F5F5",

  // Additional semantic colors
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  white: "#FFFFFF",
} as const;

// Ant Design theme configuration
export const antdTheme = {
  token: {
    // Primary colors
    colorPrimary: themeColors.primary,
    colorSuccess: themeColors.success,
    colorWarning: themeColors.warning,
    colorError: themeColors.error,

    // Background colors
    colorBgContainer: themeColors.white,
    colorBgLayout: themeColors.neutralLight,
    colorBgElevated: themeColors.white,

    // Text colors
    colorText: themeColors.neutralDark,
    colorTextSecondary: "#546E7A", // Lighter version of neutralDark
    colorTextTertiary: "#78909C",

    // Border and divider
    colorBorder: "#E0E0E0",
    colorSplit: "#F0F0F0",

    // Component specific
    borderRadius: 12,
    borderRadiusLG: 12,
    borderRadiusSM: 8,
    borderRadiusXS: 4,

    // Spacing
    // padding: 16,
    // margin: 16,

    // Font
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,

    // Shadows
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    boxShadowSecondary: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  components: {
    // Layout component customization
    Layout: {
      siderBg: themeColors.white,
      triggerBg: themeColors.primary,
      triggerColor: themeColors.white,
      headerBg: themeColors.white,
      headerPadding: "0 16px",
      bodyBg: themeColors.neutralLight,
    },

    // Menu component customization
    Menu: {
      itemBg: "transparent",
      itemSelectedBg: `${themeColors.primary}10`, // 10% opacity
      itemSelectedColor: themeColors.primary,
      itemHoverBg: `${themeColors.primary}08`, // 8% opacity
      itemHoverColor: themeColors.primary,
      iconSize: 18,
      itemMarginBlock: 4,
      itemBorderRadius: 12,
    },

    // Button component customization
    Button: {
      primaryColor: themeColors.white,
      primaryBg: themeColors.primary,
      colorPrimaryHover: "#00897B", // Darker shade of primary
      colorPrimaryActive: "#00695C", // Even darker shade

      defaultColor: themeColors.neutralDark,
      defaultBg: themeColors.white,
      defaultBorderColor: themeColors.primary,

      // Secondary button using accent colors
      colorWarning: themeColors.white,
      colorWarningBg: themeColors.secondary,
      borderRadius: 16,
      borderRadiusLG: 16,
      borderRadiusSM: 16,
      borderRadiusXS: 16
    },

    // Card component customization
    Card: {
      colorBgContainer: themeColors.white,
      colorBorderSecondary: "#E8F5E8", // Light version of primary
    },

    // Typography customization
    Typography: {
      titleMarginBottom: 16,
      titleMarginTop: 0,
    },
    Input: {
      paddingBlock: 6
    },
    Select: {
      controlHeight: 36
    }
  },
};

// CSS variables for use in custom styles
export const cssVariables = {
  "--color-primary": themeColors.primary,
  "--color-secondary": themeColors.secondary,
  "--color-accent-1": themeColors.accent1,
  "--color-accent-2": themeColors.accent2,
  "--color-neutral-dark": themeColors.neutralDark,
  "--color-neutral-light": themeColors.neutralLight,
  "--color-success": themeColors.success,
  "--color-warning": themeColors.warning,
  "--color-error": themeColors.error,
  "--color-white": themeColors.white,
} as const;

export default antdTheme;
