import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { promoBanners } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, fonts, radius, shadow, spacing, tint, typography } from '../../theme';
import { onFill } from '../../theme/contrast';

type Props = NativeStackScreenProps<RootStackParamList, 'PromoDetail'>;

export function PromoDetailScreen({ navigation, route }: Props) {
  const promo = promoBanners.find((p) => p.id === route.params.promoId) ?? promoBanners[0];
  const { claimPromoVoucher } = useUser();
  const [claimed, setClaimed] = useState(false);
  const on = onFill(promo.gradient[1]);

  const onCta = async () => {
    if (promo.ctaType === 'claim' || promo.claimable) {
      const v = await claimPromoVoucher(promo.id);
      if (v) {
        setClaimed(true);
        Alert.alert('Voucher claimed', 'Added to your Available vouchers.');
      }
      return;
    }
    Alert.alert('Coming soon', 'In-store shopping and deep links will live here.');
  };

  return (
    <Screen padded={false} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg }}>
        <Header title="Promotion" onBack={() => navigation.goBack()} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={promo.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, shadow.md]}
        >
          <View style={styles.heroBloom} pointerEvents="none" />
          {promo.badge ? (
            <View style={[styles.heroBadge, { backgroundColor: on.chipBg }]}>
              <Text style={[styles.heroBadgeText, { color: on.chipFg }]}>{promo.badge}</Text>
            </View>
          ) : null}
          <View style={{ flex: 1 }} />
          <Text style={[styles.heroTitle, { color: on.primary }]}>{promo.title}</Text>
          <Text style={[styles.heroSub, { color: on.secondary }]}>{promo.subtitle}</Text>
        </LinearGradient>
        <View style={styles.body}>
          <Text style={styles.section}>About</Text>
          <Text style={styles.copy}>{promo.body}</Text>
          <Text style={styles.section}>Terms & conditions</Text>
          {promo.terms.map((t, i) => (
            <View key={i} style={styles.termRow}>
              <View style={styles.termDot} />
              <Text style={styles.term}>{t}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      {promo.ctaLabel ? (
        <View style={styles.footer}>
          <Button
            title={claimed ? 'Claimed' : promo.ctaLabel}
            onPress={onCta}
            disabled={claimed}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 130 },
  hero: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    minHeight: 210,
    overflow: 'hidden',
  },
  heroBloom: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: tint.lightVeil,
    opacity: 0.32,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  heroBadgeText: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  heroTitle: { ...typography.h1 },
  heroSub: { ...typography.body, marginTop: spacing.sm, maxWidth: 340 },
  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  section: {
    ...typography.h3,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  copy: { ...typography.body, color: colors.inkSoft },
  termRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  termDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.yellowDeep,
    marginTop: 7,
  },
  term: { ...typography.caption, flex: 1, lineHeight: 20 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
});
