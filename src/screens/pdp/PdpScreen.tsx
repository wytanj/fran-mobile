import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { productById, reviewsFor } from '../../data/catalog';
import { useLayout } from '../../layout/useLayout';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Pdp'>;

export function PdpScreen({ navigation, route }: Props) {
  const { productId } = route.params;
  const product = productById(productId);
  const { wishlist, toggleWishlist } = useUser();
  const { gutter } = useLayout();
  const [more, setMore] = useState(false);
  const reviews = reviewsFor(productId);

  if (!product) {
    return (
      <Screen>
        <Header title="Product" onBack={() => navigation.goBack()} />
        <Text style={typography.body}>This product is no longer listed.</Text>
      </Screen>
    );
  }

  const saved = wishlist.includes(product.id);
  const desc = more ? product.description : product.description.slice(0, 140);

  return (
    <Screen padded={false} edges={['top']}>
      <Header
        title={product.brand}
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            onPress={() => toggleWishlist(product.id)}
            accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            hitSlop={8}
          >
            <FranIcon name="heart" size={22} color={saved ? colors.danger : colors.brown} />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.giant }}
        showsVerticalScrollIndicator={false}
      >
        <Image source={product.image} style={styles.hero} />
        <View style={{ paddingHorizontal: gutter, paddingTop: spacing.xl }}>
          <View style={styles.ctaRow}>
            <Button title="Add to bag" onPress={() => {}} style={{ flex: 1 }} />
            <Button
              title={saved ? 'Saved' : 'Save'}
              variant="secondary"
              onPress={() => toggleWishlist(product.id)}
              style={{ flex: 1 }}
            />
          </View>

          <View style={styles.info}>
            <View style={{ flex: 1 }}>
              <Text style={styles.brand}>{product.brand}</Text>
              <Text style={styles.name}>{product.name}</Text>
            </View>
            <View style={styles.priceCol}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {product.compareAt ? (
                <Text style={styles.compare}>${product.compareAt.toFixed(2)}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.ratingRow}>
            <FranIcon name="star" size={14} color={colors.yellowDeep} />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>{product.reviewCount} reviews</Text>
          </View>

          {reviews.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reviewSlider}
            >
              {reviews.map((r) => (
                <View key={r.id} style={[styles.reviewCard, shadow.xs]}>
                  <Text style={styles.reviewAuthor}>{r.author}</Text>
                  <Text style={styles.reviewStars}>{'★'.repeat(r.rating)}</Text>
                  <Text style={styles.reviewText}>{r.text}</Text>
                </View>
              ))}
            </ScrollView>
          ) : null}

          <Text style={styles.blockTitle}>Description</Text>
          <Text style={styles.body}>
            {desc}
            {!more && product.description.length > 140 ? '…' : ''}
          </Text>
          {product.description.length > 140 ? (
            <Pressable onPress={() => setMore((v) => !v)}>
              <Text style={styles.readMore}>{more ? 'Show less' : 'Read more'}</Text>
            </Pressable>
          ) : null}

          <Text style={styles.blockTitle}>Key ingredients</Text>
          <View style={styles.ingGrid}>
            {product.ingredients.map((ing) => (
              <View key={ing} style={styles.ingItem}>
                <View style={styles.ingDot} />
                <Text style={styles.ingText}>{ing}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.blockTitle}>Customer reviews</Text>
          <Text style={styles.bigRating}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>{product.reviewCount} verified reviews</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceSunken,
    resizeMode: 'cover',
  },
  ctaRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  info: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  brand: { ...typography.caption },
  name: { ...typography.h2, marginTop: 2 },
  priceCol: { alignItems: 'flex-end' },
  price: { ...typography.h2, color: colors.brown },
  compare: { ...typography.caption, textDecorationLine: 'line-through' },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  rating: { ...typography.captionBold },
  reviewCount: { ...typography.caption },
  reviewSlider: { gap: spacing.md, paddingBottom: spacing.lg },
  reviewCard: {
    width: 260,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    gap: 4,
  },
  reviewAuthor: { ...typography.captionBold },
  reviewStars: { color: colors.yellowDeep, letterSpacing: 2 },
  reviewText: { ...typography.caption },
  blockTitle: { ...typography.h3, marginTop: spacing.xl, marginBottom: spacing.sm },
  body: { ...typography.body },
  readMore: { ...typography.captionBold, color: colors.brown, marginTop: spacing.sm },
  ingGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  ingItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  ingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.yellowDeep,
  },
  ingText: { ...typography.body },
  bigRating: { ...typography.display, color: colors.brown },
});
