import { Text } from '../../components/ThemedText';
import { ProductCard } from '../../components/ProductCard';
import { ShopHeader } from '../../components/ShopHeader';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { FranIcon } from '../../components/FranIcon';
import { bundles, catalogFilters, productsForCategory } from '../../data/catalog';
import { useLayout } from '../../layout/useLayout';
import type { CatalogCategory, RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

export function CatalogScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { gutter, pageWidth, isWide } = useLayout();
  const [filter, setFilter] = useState<CatalogCategory>('all');
  const items = useMemo(() => productsForCategory(filter), [filter]);
  const cols = isWide ? 3 : 2;
  const gap = spacing.md;
  const cardW = Math.floor((pageWidth - gutter * 2 - gap * (cols - 1)) / cols);

  return (
    <View style={styles.root}>
      <ShopHeader />
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.giant }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: gutter, paddingTop: spacing.xl }}>
          {navigation.canGoBack() ? (
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.back}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <FranIcon name="chevronLeft" size={20} color={colors.brown} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          ) : null}
          <Text style={styles.h}>Catalog</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {catalogFilters.map((f) => {
              const on = filter === f.id;
              return (
                <Pressable
                  key={f.id}
                  onPress={() => setFilter(f.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  style={[styles.chip, on && styles.chipOn]}
                >
                  {on ? <FranIcon name="check" size={12} color={colors.brown} /> : null}
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{f.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {filter === 'bundles' ? (
          <View style={[styles.grid, { paddingHorizontal: gutter, gap }]}>
            {bundles.map((b) => (
              <Pressable
                key={b.id}
                onPress={() => {
                  const first = b.productIds[0];
                  if (first) navigation.navigate('Pdp', { productId: first });
                }}
                style={[styles.bundle, { width: cardW }, shadow.sm]}
              >
                <Image source={b.image} style={styles.bundleImg} />
                <Text style={styles.bundleTitle} numberOfLines={2}>
                  {b.title}
                </Text>
                <Text style={styles.price}>${b.price.toFixed(2)}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={[styles.grid, { paddingHorizontal: gutter, gap }]}>
            {items.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                width={cardW}
                onPress={() => navigation.navigate('Pdp', { productId: p.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: spacing.sm },
  backText: { ...typography.captionBold, color: colors.brown },
  h: { ...typography.h1, marginBottom: spacing.md },
  chips: { gap: spacing.sm, paddingBottom: spacing.lg },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  chipOn: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellow,
  },
  chipText: { ...typography.captionBold, color: colors.inkSoft },
  chipTextOn: { color: colors.brown },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  bundle: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 4,
  },
  bundleImg: { width: '100%', aspectRatio: 1, resizeMode: 'cover' },
  bundleTitle: { ...typography.captionBold, paddingHorizontal: spacing.sm, marginTop: spacing.sm },
  price: {
    ...typography.title,
    color: colors.brown,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
    marginTop: 4,
  },
});
