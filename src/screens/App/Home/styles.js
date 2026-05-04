import { StyleSheet, Platform } from 'react-native';

const COLORS = {
  primary: '#007AFF',
  primaryVariant: '#0A6ED1',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceVariant: '#F2F2F7',
  textPrimary: '#1D1D1F',
  textSecondary: '#6E6E73',
  textTertiary: '#86868B',
  border: '#E5E5EA',
  error: '#FF453A',
  success: '#32D74B',
};

const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxlxl: 40,
};

const TYPOGRAPHY = {
  sizes: {
    h1: 34,
    h2: 28,
    h3: 22,
    bodyLarge: 17,
    bodyMedium: 15,
    bodySmall: 13,
    caption: 12,
    label: 14,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

const SHADOWS = {
  xs: Platform.select({
    ios: {
      shadowColor: COLORS.textTertiary,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
  }),
  sm: Platform.select({
    ios: {
      shadowColor: COLORS.textTertiary,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3,
    },
    android: {
      elevation: 2,
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: COLORS.textTertiary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: COLORS.textTertiary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 6,
    },
    android: {
      elevation: 8,
    },
  }),
};

const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  // Tipografia
  h1: {
    fontSize: TYPOGRAPHY.sizes.h1,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
    lineHeight: 41,
  },
  h2: {
    fontSize: TYPOGRAPHY.sizes.h2,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.textPrimary,
    lineHeight: 34,
  },
  h3: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  bodyLarge: {
    fontSize: TYPOGRAPHY.sizes.bodyLarge,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: TYPOGRAPHY.sizes.bodyMedium,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  caption: {
    fontSize: TYPOGRAPHY.sizes.caption,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },

  // Componentes
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: SPACING.xl,
    marginVertical: SPACING.md,
    marginHorizontal: SPACING.lg,
    ...SHADOWS.sm,
  },
  cardElevated: {
    ...SHADOWS.md,
  },

  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.sizes.bodyLarge,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  buttonSecondary: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 10,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonSecondaryText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.sizes.bodyLarge,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },

  inputContainer: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 10,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    minHeight: 44,
  },
  input: {
    fontSize: TYPOGRAPHY.sizes.bodyLarge,
    color: COLORS.textPrimary,
    flex: 1,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },

  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xxs,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.sizes.caption,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarImageLarge: {
    borderRadius: 36,
  },
});

export default styles;
export { COLORS, SPACING, TYPOGRAPHY, SHADOWS };