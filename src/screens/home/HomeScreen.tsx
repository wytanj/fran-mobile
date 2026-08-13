import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { ProductCard } from '../../components/ProductCard';
import { ShopHeader } from '../../components/ShopHeader';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PressableScale, ProgressBar } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { besties, bundles, clubTiers, products } from '../../data/catalog';
import { useLayout } from '../../layout/useLayout';
import type { MainTabParamList, RootStackParamList } from '../../types';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;
import { colors, radius, shadow, spacing, typography } from '../../theme';

export function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const { user } = useUser();
  const { gutter, pageWidth } = useLayout();
  const club = clubTiers.find((t) => t.tier === user.tier) ?? clubTiers[0];
  const progress = club.ptsNeeded > 0 ? Math.min(1, user.points / club.ptsNeeded) : 1;
  const cardW = Math.min(240, pageWidth * 0.62);
  const productW = Math.min(168, (pageWidth - gutter * 2 - 12) / 2);

  return (
    <View style={styles.root}>
      <ShopHeader />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: spacing.giant }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: gutter }}>
          <PressableScale
            onPress={() => navigation.navigate('MembershipTiers')}
            accessibilityLabel="Beauty Club progress"
            style={[styles.club, shadow.sm]}
          >
            <LinearGradient
              colors={[colors.surface, colors.cream]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.clubInner}
            >
              <Text style={styles.clubEyebrow}>Beauty Club</Text>
              <View style={styles.clubRow}>
                <Text style={styles.clubTier}>Tier: {club.name}</Text>
                {club.next ? (
                  <Text style={styles.clubPts}>
                    {user.points} / {club.ptsNeeded} pts to {club.next}
                  </Text>
                ) : (
                  <Text style={styles.clubPts}>Top tier</Text>
                )}
              </View>
              <View style={styles.clubBar}>
                <View style={{ flex: 1 }}>
                  <ProgressBar value={progress} height={10} />
                </View>
                <FranIcon name="gift" size={20} color={colors.brown} />
              </View>
              <Text style={styles.clubFoot}>
                {user.tierExpiresAt ? `Resets ${user.tierExpiresAt}` : 'Resets in 365 days'}
              </Text>
            </LinearGradient>
          </PressableScale>
        </View>

        <View style={styles.bestiesHead}>
          <View style={{ flex: 1, paddingHorizontal: gutter }}>
            <View style={styles.bestiesTitleRow}>
              <Text style={styles.sectionTitle}>Discover LISE Besties</Text>
              <View style={styles.offPill}>
                <Text style={styles.offText}>Up to 10% off</Text>
              </View>
            </View>
            <Text style={styles.sectionSub}>Shop bundles curated by our beloved creators</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: gutter, gap: spacing.xl }}
        >
          {besties.map((b) => (
            <Pressable
              key={b.id}
              onPress={() => navigation.navigate('Grwm')}
              accessibilityRole="button"
              accessibilityLabel={b.handle}
              style={styles.bestie}
            >
              <View style={styles.ring}>
                <Image source={b.image} style={styles.avatar} />
              </View>
              <Text style={styles.handle} numberOfLines={1}>
                {b.handle}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={[styles.sectionHead, { paddingHorizontal: gutter }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>GRWM Bundles</Text>
            <Text style={styles.sectionSub}>Hand-picked bundles by LISE Besties</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('Grwm')}>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: gutter, gap: spacing.md }}
        >
          {bundles.map((b) => (
            <PressableScale
              key={b.id}
              onPress={() => {
                const first = b.productIds[0];
                if (first) navigation.navigate('Pdp', { productId: first });
              }}
              style={[styles.bundle, { width: cardW }, shadow.sm]}
            >
              <Image source={b.image} style={styles.bundleImg} />
              <View style={styles.bundleMeta}>
                <View style={styles.creatorRow}>
                  <Image source={b.creatorImage} style={styles.creatorDot} />
                  <Text style={styles.creator}>{b.creator}</Text>
                </View>
                <Text style={styles.bundleTitle}>{b.title}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>${b.price.toFixed(2)}</Text>
                  {b.compareAt ? (
                    <Text style={styles.compare}>${b.compareAt.toFixed(2)}</Text>
                  ) : null}
                </View>
              </View>
            </PressableScale>
          ))}
        </ScrollView>

        <View style={[styles.sectionHead, { paddingHorizontal: gutter }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Just landed</Text>
            <Text style={styles.sectionSub}>New from the catalog</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('Catalog')}>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: gutter, gap: spacing.md }}
        >
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              width={productW}
              onPress={() => navigation.navigate('Pdp', { productId: p.id })}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingTop: spacing.xl, gap: spacing.xxl },
  club: { borderRadius: radius.lg, overflow: 'hidden' },
  clubInner: { padding: spacing.lg, gap: spacing.sm },
  clubEyebrow: { ...typography.eyebrow },
  clubRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  clubTier: { ...typography.captionBold, textTransform: 'uppercase', letterSpacing: 0.6 },
  clubPts: { ...typography.captionBold, color: colors.inkSoft },
  clubBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  clubFoot: { ...typography.micro },
  bestiesHead: { marginBottom: -spacing.lg },
  bestiesTitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  sectionTitle: { ...typography.h3 },
  sectionSub: { ...typography.caption, marginTop: 2 },
  offPill: {
    borderWidth: 1,
    borderColor: colors.yellowDeep,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  offText: { ...typography.micro, color: colors.brown, textTransform: 'uppercase', letterSpacing: 0.5 },
  bestie: { alignItems: 'center', width: 72, gap: 8 },
  ring: {
    padding: 2,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.yellow,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.yellowSoft },
  handle: { ...typography.micro, textAlign: 'center', width: 72 },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md, marginBottom: -spacing.md },
  viewAll: { ...typography.captionBold, color: colors.brown },
  bundle: { backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden' },
  bundleImg: { width: '100%', height: 140, resizeMode: 'cover', backgroundColor: colors.surfaceSunken },
  bundleMeta: { padding: spacing.md, gap: 4 },
  creatorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  creatorDot: { width: 18, height: 18, borderRadius: 9 },
  creator: { ...typography.micro },
  bundleTitle: { ...typography.title },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  price: { ...typography.captionBold, color: colors.brown },
  compare: { ...typography.micro, textDecorationLine: 'line-through' },
});
