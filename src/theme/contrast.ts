import { colors } from './index';

/**
 * The brand palette runs from #FFE14D to #3A2415, so cards and gradients can
 * land on either side of legible. These helpers pick the text treatment for a
 * given fill instead of hard-coding brown everywhere.
 */

/** Relative luminance (WCAG) of a #rgb / #rrggbb fill — 0 black, 1 white. */
export function luminance(hex: string): number {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const channel = (i: number) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

export function isDarkFill(hex: string): boolean {
  return luminance(hex) < 0.22;
}

export type OnFill = {
  /** Headline / primary text */
  primary: string;
  /** Supporting copy */
  secondary: string;
  /** Solid chip or CTA sitting on the fill */
  chipBg: string;
  chipFg: string;
  /** Hairline divider on the fill */
  line: string;
};

export function onFill(hex: string): OnFill {
  return isDarkFill(hex)
    ? {
        primary: colors.cream,
        secondary: 'rgba(255, 254, 245, 0.76)',
        chipBg: colors.yellow,
        chipFg: colors.brown,
        line: 'rgba(255, 254, 245, 0.22)',
      }
    : {
        primary: colors.brown,
        secondary: colors.brownSoft,
        chipBg: colors.brown,
        chipFg: colors.yellow,
        line: 'rgba(58, 36, 21, 0.12)',
      };
}
