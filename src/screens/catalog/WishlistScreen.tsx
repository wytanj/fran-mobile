import { Text } from '../../components/ThemedText';
import { ProductCard } from '../../components/ProductCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { EmptyState, Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { productById } from '../../data/catalog';
import { useLayout } from '../../layout/useLayout';
import type { RootStackParamList } from '../../types';
import { spacing } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Wishlist'>;

export function WishlistScreen({ navigation }: Props) {
  const { wishlist } = useUser();
  const { gutter, pageWidth, isWide } = useLayout();
  const items = wishlist.map(productById).filter(Boolean);
  const cols = isWide ? 3 : 2;
  const gap = spacing.md;
  const cardW = Math.floor((pageWidth - gutter * 2 - gap * (cols - 1)) / cols);

  return (
    <Screen padded={false} edges={['top']}>
      <Header title="Wishlist" onBack={() => navigation.goBack()} />
      {items.length === 0 ? (
        <EmptyState
          icon="heart"
          title="Nothing saved yet"
          subtitle="Tap the heart on a product to keep it here."
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: gutter, paddingBottom: spacing.giant }}>
          <View style={[styles.grid, { gap }]}>
            {items.map((p) =>
              p ? (
                <ProductCard
                  key={p.id}
                  product={p}
                  width={cardW}
                  onPress={() => navigation.navigate('Pdp', { productId: p.id })}
                />
              ) : null,
            )}
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
});
