import { Text } from '../../components/ThemedText';
import { ShopHeader } from '../../components/ShopHeader';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { FranIcon } from '../../components/FranIcon';
import { PressableScale } from '../../components/ui';
import { besties, bundles, products } from '../../data/catalog';
import { useLayout } from '../../layout/useLayout';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

export function GrwmScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { gutter } = useLayout();
  const [query, setQuery] = useState('');
  const featured = bundles.filter((b) => b.featured);
  const friends = products.slice(0, 3);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return featured;
    return bundles.filter(
      (b) =>
        b.title.toLowerCase().includes(q) || b.creator.toLowerCase().includes(q),
    );
  }, [featured, query]);

  return (
    <View style={styles.root}>
      <ShopHeader />
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.giant }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
          <Text style={styles.h}>Get Ready With Me</Text>
          <Text style={styles.sub}>Bundles our Besties actually wear</Text>
          <View style={styles.search}>
            <FranIcon name="search" size={18} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search bundles or Besties"
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
            />
          </View>
        </View>

        {(query ? filtered : featured).map((b) => (
          <PressableScale
            key={b.id}
            onPress={() => {
              const first = b.productIds[0];
              if (first) navigation.navigate('Pdp', { productId: first });
            }}
            style={[styles.hero, { marginHorizontal: gutter }, shadow.sm]}
          >
            <Image source={b.image} style={styles.heroImg} />
            <View style={styles.heroMeta}>
              <View style={styles.creatorRow}>
                <Image source={b.creatorImage} style={styles.creator} />
                <Text style={styles.creatorName}>{b.creator}</Text>
              </View>
              <Text style={styles.heroTitle}>{b.title}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>${b.price.toFixed(2)}</Text>
                {b.compareAt ? (
                  <Text style={styles.compare}>${b.compareAt.toFixed(2)}</Text>
                ) : null}
              </View>
            </View>
          </PressableScale>
        ))}

        <View style={{ paddingHorizontal: gutter, marginTop: spacing.xl }}>
          <Text style={styles.section}>Besties</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: gutter, gap: spacing.lg, paddingVertical: spacing.md }}
        >
          {besties.map((b) => (
            <View key={b.id} style={styles.bestie}>
              <View style={styles.ring}>
                <Image source={b.image} style={styles.avatar} />
              </View>
              <Text style={styles.handle} numberOfLines={1}>
                {b.handle}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: gutter, marginTop: spacing.md }}>
          <Text style={styles.section}>What your friends buy</Text>
        </View>
        <View style={{ paddingHorizontal: gutter, marginTop: spacing.md, gap: spacing.md }}>
          {friends.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => navigation.navigate('Pdp', { productId: p.id })}
              style={[styles.friendRow, shadow.xs]}
            >
              <Image source={p.image} style={styles.friendImg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.friendBrand}>{p.brand}</Text>
                <Text style={styles.friendName}>{p.name}</Text>
              </View>
              <Text style={styles.price}>${p.price.toFixed(2)}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: spacing.sm },
  backText: { ...typography.captionBold, color: colors.brown },
  h: { ...typography.h1 },
  sub: { ...typography.caption, marginTop: 4, marginBottom: spacing.lg },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.xl,
  },
  searchInput: { ...typography.body, flex: 1, paddingVertical: 0 },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginTop: spacing.lg,
  },
  heroImg: { width: '100%', height: 220, resizeMode: 'cover', backgroundColor: colors.surfaceSunken },
  heroMeta: { padding: spacing.lg, gap: 4 },
  creatorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  creator: { width: 22, height: 22, borderRadius: 11 },
  creatorName: { ...typography.caption },
  heroTitle: { ...typography.h3 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  price: { ...typography.title, color: colors.brown },
  compare: { ...typography.caption, textDecorationLine: 'line-through' },
  section: { ...typography.h3 },
  bestie: { alignItems: 'center', width: 72, gap: 8 },
  ring: { padding: 2, borderRadius: 999, borderWidth: 2, borderColor: colors.yellow },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  handle: { ...typography.micro, textAlign: 'center', width: 72 },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  friendImg: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.surfaceSunken },
  friendBrand: { ...typography.micro },
  friendName: { ...typography.title },
});
