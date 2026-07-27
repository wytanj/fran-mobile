/**
 * Fran brand tokens — from brandworld.pdf
 * Palette: yellow · pale yellow · sky blue · cream · peach · tan · brown
 * Type: Marr Sans Condensed (display) → Barlow Condensed
 *       Symbol (body) → DM Sans
 *
 * Palette hexes and font families are fixed by the brand. Everything else here
 * (scale, elevation, radii, tints) is tuned for feel.
 */

import type { TextStyle, ViewStyle } from 'react-native';

export const fonts = {
  /** Platform — bold retail display */
  display: 'FranPlatformBold',
  displayExtra: 'FranPlatformBold',
  displayMedium: 'FranPlatformMedium',
  /** Symbol — friendly geometric body */
  body: 'FranSymbolBook',
  bodyMedium: 'FranSymbolMedium',
  bodySemi: 'FranSymbolSemibold',
  bodyBold: 'FranSymbolBold',
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
  /** Hairline — barely there, for grouped rows and card edges */
  borderSoft: '#F4EDDF',
  border: '#EDE4D4',
  borderStrong: '#D9CDB8',
  surface: '#FFFFFF',
  /** Recessed wells inside white cards */
  surfaceSunken: '#FBF7EE',
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

/**
 * Transparent washes derived from the palette. Layering these instead of
 * introducing new solid greys is what keeps surfaces feeling warm.
 */
export const tint = {
  /** Pressed-state wash on light surfaces */
  inkFaint: 'rgba(58, 36, 21, 0.04)',
  inkWash: 'rgba(58, 36, 21, 0.07)',
  inkPress: 'rgba(58, 36, 21, 0.11)',
  /** Dividers on coloured cards, where a solid border would read as a seam */
  inkLine: 'rgba(58, 36, 21, 0.10)',
  inkTrack: 'rgba(58, 36, 21, 0.09)',
  yellowWash: 'rgba(255, 225, 77, 0.28)',
  blueWash: 'rgba(91, 191, 224, 0.16)',
  /** Highlights on top of yellow / brown fills */
  lightVeil: 'rgba(255, 255, 255, 0.55)',
  lightLine: 'rgba(255, 255, 255, 0.28)',
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
  giant: 56,
};

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  full: 999,
};

export const typography = {
  /** Editorial page opener */
  display: {
    fontFamily: fonts.displayExtra,
    fontSize: 40,
    lineHeight: 42,
    letterSpacing: -0.8,
    color: colors.ink,
  },
  hero: {
    fontFamily: fonts.displayExtra,
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: -0.6,
    color: colors.ink,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  h2: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 27,
    letterSpacing: -0.25,
    color: colors.ink,
  },
  h3: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    lineHeight: 23,
    letterSpacing: -0.1,
    color: colors.ink,
  },
  /** Card / row heading in body type — pairs with caption underneath */
  title: {
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.1,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    color: colors.ink,
  },
  bodyBold: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    lineHeight: 23,
    color: colors.ink,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },
  captionBold: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    lineHeight: 19,
    color: colors.ink,
  },
  micro: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.3,
    color: colors.muted,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    color: colors.inkSoft,
  },
  /** All-caps kicker above a section or inside a coloured card */
  eyebrow: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  /** Big standalone figures — points balances, voucher values */
  numeral: {
    fontFamily: fonts.displayExtra,
    fontSize: 38,
    lineHeight: 40,
    letterSpacing: -1,
    color: colors.ink,
  },
  button: {
    fontFamily: fonts.displayMedium,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
} satisfies Record<string, TextStyle>;

/**
 * Warm, wide-blur elevation. Shadows are brown rather than black so cards
 * settle onto cream instead of punching a grey hole in it.
 */
export const shadow = {
  xs: {
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  md: {
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 20,
    elevation: 5,
  },
  lg: {
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.13,
    shadowRadius: 34,
    elevation: 10,
  },
  /** Yellow bloom under primary CTAs */
  glow: {
    shadowColor: colors.yellowDeep,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 14,
    elevation: 4,
  },
} satisfies Record<string, ViewStyle>;

/** Shared press feel — one spring config so every tap reads the same */
export const press = {
  scale: 0.975,
  /** Deeper squeeze for large tap targets (banners, hero cards) */
  scaleLarge: 0.99,
  spring: { speed: 40, bounciness: 0 },
};
