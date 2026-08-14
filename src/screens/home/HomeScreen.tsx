import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { ProductCard } from '../../components/ProductCard';
import { ShopHeader } from '../../components/ShopHeader';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, PressableScale } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { bundles, catalogFilters, products } from '../../data/catalog';
import { buildResultsCopy } from '../../data/quizQuestions';
import { useLayout } from '../../layout/useLayout';
import type { CatalogCategory, MainTabParamList, RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Discover'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const { isAuthed, user } = useUser();
  const { gutter, pageWidth } = useLayout();
  const [filter, setFilter] = useState<CatalogCategory>('all');
  const productW = Math.min(168, (pageWidth - gutter * 2 - 12) / 2);
  const dropW = Math.min(300, pageWidth - gutter * 2 - 24);

  const skin = user.beautyProfiles.skin;
  const skinCopy = skin ? buildResultsCopy('skin', skin.answers) : null;
  const makeup = user.beautyProfiles.makeup;
  const makeupCopy = makeup ? buildResultsCopy('makeup', makeup.answers) : null;

  const filtered =
    filter === 'all' || filter === 'bundles'
      ? products
      : products.filter((p) => p.category === filter);

  const startAnalysis = () => {
    if (!isAuthed) {
      navigation.navigate('Onboarding');
      return;
    }
    navigation.navigate('Quiz', { category: 'skin' });
  };

  return (
    <View style={styles.root}>
      <ShopHeader />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: spacing.giant }]}
        showsVerticalScrollIndicator={false}
      >
        {isAuthed ? (
          <View style={{ paddingHorizontal: gutter }}>
            <Text style={styles.hello}>Hey {user.name.split(' ')[0]}</Text>
          </View>
        ) : null}

        {isAuthed && skinCopy ? (
          <View style={{ paddingHorizontal: gutter, gap: spacing.md }}>
            <Text style={styles.eyebrow}>Your skin profile</Text>
            <Text style={styles.skinTitle}>{skinCopy.title}</Text>
            <Text style={styles.skinHint}>{skinCopy.rows[0]?.value ?? 'Balanced'}</Text>
            <View style={styles.focusRow}>
              {['Oil control', 'Lightweight hydration', 'Pore refining'].map((label) => (
                <View key={label} style={styles.focusItem}>
                  <View style={styles.focusIcon}>
                    <FranIcon name="droplet" size={18} color={colors.brown} />
                  </View>
                  <Text style={styles.focusLabel}>{label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.why}>
              <Text style={styles.whyTitle}>Why analysis matters?</Text>
              <Text style={styles.whyBody}>We match products to your skin + makeup vibe.</Text>
              {skinCopy.tips.slice(0, 2).map((t) => (
                <View key={t} style={styles.whyRow}>
                  <FranIcon name="check" size={14} color={colors.brown} />
                  <Text style={styles.whyTip}>{t}</Text>
                </View>
              ))}
            </View>
            {makeupCopy ? (
              <View>
                <Text style={styles.eyebrow}>Your makeup vibe</Text>
                <Text style={styles.sectionTitle}>{makeupCopy.title}</Text>
                <Text style={styles.sectionSub}>{makeupCopy.rows[0]?.value}</Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={{ paddingHorizontal: gutter }}>
            <Text style={styles.eyebrow}>Find your skin type</Text>
            <View style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>Your skin has a type. Let’s find it.</Text>
              <Text style={styles.ctaBody}>
                Discover what actually suits you — products, shades, ingredients, all matched to your
                skin.
              </Text>
              <Button title="Start my analysis" onPress={startAnalysis} icon="glow" />
              <Text style={styles.ctaMeta}>takes 2 mins · earns +15 pts</Text>
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: gutter }}>
          <Text style={styles.eyebrow}>{isAuthed && skinCopy ? 'Made for you' : 'Trending now'}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {catalogFilters
              .filter((f) => f.id !== 'bundles')
              .map((f) => {
                const on = filter === f.id;
                return (
                  <Pressable
                    key={f.id}
                    onPress={() => setFilter(f.id)}
                    style={[styles.chip, on && styles.chipOn]}
                  >
                    {on ? <FranIcon name="check" size={12} color={colors.brown} /> : null}
                    <Text style={[styles.chipText, on && styles.chipTextOn]}>{f.label}</Text>
                  </Pressable>
                );
              })}
          </ScrollView>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: gutter, gap: spacing.md }}
        >
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              width={productW}
              onPress={() => navigation.navigate('Pdp', { productId: p.id })}
            />
          ))}
        </ScrollView>
        <Pressable onPress={() => navigation.navigate('Catalog')} style={{ alignSelf: 'center' }}>
          <Text style={styles.seeMore}>See more</Text>
        </Pressable>

        <View style={[styles.sectionHead, { paddingHorizontal: gutter }]}>
          <Text style={styles.eyebrow}>This week’s drop</Text>
          <Pressable onPress={() => navigation.navigate('Grwm')}>
            <Text style={styles.seeMore}>See more</Text>
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
              style={[styles.drop, { width: dropW }, shadow.sm]}
            >
              <Image source={b.creatorImage} style={styles.dropAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.dropHandle}>@{b.creator.replace(/\s+/g, '').toLowerCase()}</Text>
                <Text style={styles.dropTitle}>{b.title}</Text>
                <Text style={styles.dropSub}>Hand-picked by LISE Besties</Text>
              </View>
              <Image source={b.image} style={styles.dropThumbs} />
            </PressableScale>
          ))}
        </ScrollView>

        <View style={[styles.promoRow, { paddingHorizontal: gutter }]}>
          <PressableScale
            onPress={() => navigation.navigate('Catalog')}
            style={[styles.promo, styles.promoDark]}
          >
            <Text style={styles.promoKicker}>Today’s offer</Text>
            <Text style={styles.promoDarkTitle}>Up to 20% off</Text>
            <Text style={styles.promoDarkBody}>On selected makeup products</Text>
          </PressableScale>
          <PressableScale
            onPress={() => navigation.navigate('Catalog')}
            style={[styles.promo, styles.promoLight]}
          >
            <Text style={styles.promoKicker}>New arrivals</Text>
            <Text style={styles.promoLightTitle}>Check out what just landed</Text>
          </PressableScale>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingTop: spacing.md, gap: spacing.xl },
  hello: { ...typography.h2 },
  eyebrow: { ...typography.eyebrow, marginBottom: spacing.sm },
  skinTitle: { ...typography.h1, textTransform: 'uppercase' },
  skinHint: { ...typography.caption, marginTop: -spacing.sm },
  focusRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  focusItem: { flex: 1, alignItems: 'center', gap: 6 },
  focusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.peachSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusLabel: { ...typography.micro, textAlign: 'center' },
  why: {
    backgroundColor: colors.blueSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 6,
  },
  whyTitle: { ...typography.captionBold },
  whyBody: { ...typography.caption },
  whyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  whyTip: { ...typography.micro, flex: 1, color: colors.ink },
  ctaCard: {
    backgroundColor: colors.blue,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  ctaTitle: { ...typography.h3, color: colors.brown },
  ctaBody: { ...typography.caption, color: colors.brownSoft },
  ctaMeta: { ...typography.micro, textAlign: 'center', color: colors.brownSoft },
  sectionTitle: { ...typography.h3 },
  sectionSub: { ...typography.caption, marginTop: 2 },
  chips: { gap: spacing.sm, paddingBottom: spacing.sm },
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
  chipOn: { backgroundColor: colors.yellow, borderColor: colors.yellow },
  chipText: { ...typography.captionBold, color: colors.inkSoft },
  chipTextOn: { color: colors.brown },
  seeMore: { ...typography.captionBold, color: colors.brown },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  drop: {
    backgroundColor: colors.peachSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dropAvatar: { width: 44, height: 44, borderRadius: 22 },
  dropHandle: { ...typography.micro },
  dropTitle: { ...typography.title },
  dropSub: { ...typography.micro },
  dropThumbs: { width: 56, height: 56, borderRadius: radius.sm },
  promoRow: { flexDirection: 'row', gap: spacing.md },
  promo: { flex: 1, borderRadius: radius.md, padding: spacing.md, minHeight: 120, justifyContent: 'flex-end' },
  promoDark: { backgroundColor: colors.brown },
  promoLight: { backgroundColor: colors.peach },
  promoKicker: { ...typography.micro, color: colors.cream },
  promoDarkTitle: { ...typography.h3, color: colors.yellow, marginTop: 4 },
  promoDarkBody: { ...typography.micro, color: colors.cream, marginTop: 2 },
  promoLightTitle: { ...typography.title, color: colors.brown, marginTop: 4 },
});
