/**
 * Fran brand tokens — from brandworld.pdf
 * Palette: yellow · pale yellow · sky blue · cream · peach · tan · brown
 * Type: Marr Sans Condensed (display) → Barlow Condensed
 *       Symbol (body) → DM Sans
 */

export const fonts = {
  /** Marr Sans Condensed stand-in — bold condensed display */
  display: 'BarlowCondensed_700Bold',
  displayExtra: 'BarlowCondensed_800ExtraBold',
  displayMedium: 'BarlowCondensed_600SemiBold',
  /** Symbol stand-in — friendly geometric body */
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemi: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
};

export const colors = {
  // Core brand palette
  yellow: '#FFE14D',
  yellowSoft: '#FFF4A8',
  yellowDeep: '#F0C820',
  blue: '#5BBFE0',
  blueSoft: '#D6F1F9',
  cream: '#FFFEF5',
  peach: '#F2D2AE',
  peachSoft: '#FAE8D4',
  tan: '#C4A070',
  brown: '#3A2415',
  brownSoft: '#5C4030',
  brownMuted: '#8B7355',

  // Semantic aliases used across the app
  primary: '#FFE14D',
  primaryDark: '#F0C820',
  primaryLight: '#FFF4A8',
  accent: '#5BBFE0',
  accentSoft: '#D6F1F9',

  // Neutrals mapped to brand cream/brown
  ink: '#3A2415',
  inkSoft: '#5C4030',
  muted: '#8B7355',
  border: '#EDE4D4',
  borderStrong: '#D9CDB8',
  surface: '#FFFFFF',
  background: '#FFFEF5',

  // Semantic
  success: '#2D8A5E',
  successSoft: '#E6F5EE',
  warning: '#C47A1A',
  warningSoft: '#FFF4E5',
  danger: '#C43A3A',
  dangerSoft: '#FDECEC',
  info: '#5BBFE0',

  // Tiers — warm brand-aligned
  tier1: '#C4A070',
  tier1Bg: '#FAE8D4',
  tier2: '#5BBFE0',
  tier2Bg: '#D6F1F9',
  tier3: '#F0C820',
  tier3Bg: '#FFF4A8',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(58, 36, 21, 0.45)',
  streak: '#E85D2A',
  points: '#3A2415',
  disabled: '#D9CDB8',
  tabInactive: '#8B7355',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const typography = {
  hero: {
    fontFamily: fonts.displayExtra,
    fontSize: 36,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: -0.3,
    color: colors.ink,
  },
  h2: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  h3: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
  bodyBold: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
  captionBold: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    lineHeight: 18,
    color: colors.ink,
  },
  micro: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.4,
    color: colors.muted,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.inkSoft,
  },
};

export const shadow = {
  sm: {
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
};
