import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const fontFamilies = {
  platformMedium: 'FranPlatformMedium',
  platformBold: 'FranPlatformBold',
  symbolBook: 'FranSymbolBook',
  symbolMedium: 'FranSymbolMedium',
  symbolSemibold: 'FranSymbolSemibold',
  symbolBold: 'FranSymbolBold',
} as const;

export type FontFamily = (typeof fontFamilies)[keyof typeof fontFamilies];
export type TypographyVariant = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const typographyVariants: ReadonlyArray<{
  id: TypographyVariant;
  name: string;
  description: string;
}> = [
  { id: 1, name: 'Balanced', description: 'Platform display, Symbol body' },
  { id: 2, name: 'Reverse', description: 'Symbol display, Platform body' },
  { id: 3, name: 'Platform', description: 'Platform throughout' },
  { id: 4, name: 'Symbol', description: 'Symbol throughout' },
  { id: 5, name: 'Editorial', description: 'Platform hero, medium Symbol body' },
  { id: 6, name: 'Punchy', description: 'Symbol hero, bold Platform body' },
  { id: 7, name: 'Soft', description: 'Symbol semibold display and book body' },
  { id: 8, name: 'Hybrid', description: 'Platform medium display, Symbol semibold body' },
];

const variantMaps: Record<TypographyVariant, Record<FontFamily, FontFamily>> = {
  1: {
    FranPlatformMedium: fontFamilies.platformMedium,
    FranPlatformBold: fontFamilies.platformBold,
    FranSymbolBook: fontFamilies.symbolBook,
    FranSymbolMedium: fontFamilies.symbolMedium,
    FranSymbolSemibold: fontFamilies.symbolSemibold,
    FranSymbolBold: fontFamilies.symbolBold,
  },
  2: {
    FranPlatformMedium: fontFamilies.symbolSemibold,
    FranPlatformBold: fontFamilies.symbolBold,
    FranSymbolBook: fontFamilies.platformMedium,
    FranSymbolMedium: fontFamilies.platformMedium,
    FranSymbolSemibold: fontFamilies.platformBold,
    FranSymbolBold: fontFamilies.platformBold,
  },
  3: {
    FranPlatformMedium: fontFamilies.platformMedium,
    FranPlatformBold: fontFamilies.platformBold,
    FranSymbolBook: fontFamilies.platformMedium,
    FranSymbolMedium: fontFamilies.platformMedium,
    FranSymbolSemibold: fontFamilies.platformBold,
    FranSymbolBold: fontFamilies.platformBold,
  },
  4: {
    FranPlatformMedium: fontFamilies.symbolSemibold,
    FranPlatformBold: fontFamilies.symbolBold,
    FranSymbolBook: fontFamilies.symbolBook,
    FranSymbolMedium: fontFamilies.symbolMedium,
    FranSymbolSemibold: fontFamilies.symbolSemibold,
    FranSymbolBold: fontFamilies.symbolBold,
  },
  5: {
    FranPlatformMedium: fontFamilies.symbolSemibold,
    FranPlatformBold: fontFamilies.platformBold,
    FranSymbolBook: fontFamilies.symbolMedium,
    FranSymbolMedium: fontFamilies.symbolSemibold,
    FranSymbolSemibold: fontFamilies.symbolSemibold,
    FranSymbolBold: fontFamilies.symbolBold,
  },
  6: {
    FranPlatformMedium: fontFamilies.platformBold,
    FranPlatformBold: fontFamilies.symbolBold,
    FranSymbolBook: fontFamilies.platformBold,
    FranSymbolMedium: fontFamilies.platformBold,
    FranSymbolSemibold: fontFamilies.platformBold,
    FranSymbolBold: fontFamilies.platformBold,
  },
  7: {
    FranPlatformMedium: fontFamilies.symbolSemibold,
    FranPlatformBold: fontFamilies.symbolSemibold,
    FranSymbolBook: fontFamilies.symbolBook,
    FranSymbolMedium: fontFamilies.symbolMedium,
    FranSymbolSemibold: fontFamilies.symbolSemibold,
    FranSymbolBold: fontFamilies.symbolBold,
  },
  8: {
    FranPlatformMedium: fontFamilies.platformMedium,
    FranPlatformBold: fontFamilies.platformMedium,
    FranSymbolBook: fontFamilies.symbolSemibold,
    FranSymbolMedium: fontFamilies.platformMedium,
    FranSymbolSemibold: fontFamilies.symbolSemibold,
    FranSymbolBold: fontFamilies.platformBold,
  },
};

const STORAGE_KEY = '@fran/typography-variant';

type TypographyContextValue = {
  variant: TypographyVariant;
  setVariant: (variant: TypographyVariant) => void;
};

const TypographyContext = createContext<TypographyContextValue | null>(null);

export function resolveFontFamily(
  variant: TypographyVariant,
  family: string | undefined,
): string | undefined {
  if (!family || !(family in variantMaps[variant])) return family;
  return variantMaps[variant][family as FontFamily];
}

export function TypographyProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariantState] = useState<TypographyVariant>(1);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      const parsed = Number(saved);
      if (parsed >= 1 && parsed <= 8) setVariantState(parsed as TypographyVariant);
    });
  }, []);

  const setVariant = useCallback((next: TypographyVariant) => {
    setVariantState(next);
    void AsyncStorage.setItem(STORAGE_KEY, String(next));
  }, []);

  const value = useMemo(() => ({ variant, setVariant }), [setVariant, variant]);
  return <TypographyContext.Provider value={value}>{children}</TypographyContext.Provider>;
}

export function useTypography() {
  const context = useContext(TypographyContext);
  if (!context) throw new Error('useTypography must be used within TypographyProvider');
  return context;
}
