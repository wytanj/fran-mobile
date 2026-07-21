import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { spacing } from '../theme';

/**
 * Foldable / multi-window breakpoints.
 * Oppo Find N3: ~cover phone width when folded; ~7.8" nearly-square inner panel when open.
 * Window dimensions update on fold, unfold, and multi-window resize.
 */
export type LayoutSize = 'compact' | 'medium' | 'expanded';

export const breakpoints = {
  /** Large phone / small tablet / cover landscape */
  medium: 600,
  /** Book-style inner display (Find N3 open) and tablets */
  expanded: 840,
} as const;

/** Readable content cap so UI doesn't stretch edge-to-edge on wide panels */
const MAX_CONTENT: Record<LayoutSize, number | undefined> = {
  compact: undefined,
  medium: 720,
  expanded: 1040,
};

export function useLayout() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const size: LayoutSize =
      width >= breakpoints.expanded
        ? 'expanded'
        : width >= breakpoints.medium
          ? 'medium'
          : 'compact';

    const isLandscape = width > height;
    const isWide = size !== 'compact';
    const isExpanded = size === 'expanded';
    /** Cover-phone vs open book — useful for QR / member card density */
    const isCompact = size === 'compact';

    const contentMaxWidth = MAX_CONTENT[size];
    const pageWidth = contentMaxWidth ? Math.min(width, contentMaxWidth) : width;

    const gutter =
      size === 'expanded' ? spacing.xxl : size === 'medium' ? spacing.xl : spacing.lg;

    /** Promo carousel card width (inside page + horizontal padding) */
    const bannerWidth = Math.max(pageWidth - gutter * 2, 280);
    const bannerHeight = Math.min(bannerWidth * (isWide ? 0.55 : 1.15), isWide ? 280 : 360);

    /** Voucher grid columns */
    const voucherColumns = isExpanded ? 4 : isWide ? 3 : 2;

    /** Generic multi-column lists (bundles, etc.) */
    const listColumns = isExpanded ? 2 : 1;

    /** Earn-action tile width fraction of row */
    const earnColumns = isExpanded ? 5 : isWide ? 4 : 3;

    return {
      width,
      height,
      size,
      isLandscape,
      isWide,
      isExpanded,
      isCompact,
      contentMaxWidth,
      pageWidth,
      gutter,
      bannerWidth,
      bannerHeight,
      voucherColumns,
      listColumns,
      earnColumns,
      /** Side-by-side panels (points + check-in, member QR) when space allows */
      useSplitPanels: isWide || (isLandscape && width >= 520),
    };
  }, [width, height]);
}
