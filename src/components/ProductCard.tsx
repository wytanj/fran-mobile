import { Text } from './ThemedText';
import { FranIcon } from './FranIcon';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { Product } from '../types';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { PressableScale } from './ui';
import { useUser } from '../context/UserContext';

export function ProductCard({
  product,
  width,
  onPress,
}: {
  product: Product;
  width: number;
  onPress: () => void;
}) {
  const { wishlist, toggleWishlist } = useUser();
  const saved = wishlist.includes(product.id);
  const tag = product.tags?.[0];

  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={product.name}
      style={[styles.card, { width }, shadow.sm]}
    >
      <View style={styles.imageWrap}>
        <Image source={product.image} style={styles.image} />
        {tag ? (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{tag.toUpperCase()}</Text>
          </View>
        ) : null}
        <PressableScale
          onPress={() => toggleWishlist(product.id)}
          accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          style={styles.heart}
        >
          <FranIcon name="heart" size={16} color={saved ? colors.danger : colors.brown} />
        </PressableScale>
      </View>
      <Text style={styles.brand} numberOfLines={1}>
        {product.brand}
      </Text>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        {product.compareAt ? (
          <Text style={styles.compare}>${product.compareAt.toFixed(2)}</Text>
        ) : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: colors.surfaceSunken,
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  tag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.yellow,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { ...typography.micro, color: colors.brown, letterSpacing: 0.6 },
  heart: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { ...typography.micro, marginTop: spacing.sm, paddingHorizontal: spacing.sm },
  name: { ...typography.captionBold, paddingHorizontal: spacing.sm, marginTop: 2 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
    marginTop: 4,
  },
  price: { ...typography.title, color: colors.brown },
  compare: {
    ...typography.caption,
    textDecorationLine: 'line-through',
  },
});
