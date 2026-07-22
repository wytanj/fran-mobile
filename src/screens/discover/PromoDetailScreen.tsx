import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { promoBanners } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PromoDetail'>;

export function PromoDetailScreen({ navigation, route }: Props) {
  const promo = promoBanners.find((p) => p.id === route.params.promoId) ?? promoBanners[0];
  const { claimPromoVoucher } = useUser();
  const [claimed, setClaimed] = useState(false);

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
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={promo.gradient} style={styles.hero}>
          <Text style={styles.heroTitle}>{promo.title}</Text>
          <Text style={styles.heroSub}>{promo.subtitle}</Text>
        </LinearGradient>
        <View style={styles.body}>
          <Text style={styles.section}>About</Text>
          <Text style={styles.copy}>{promo.body}</Text>
          <Text style={styles.section}>Terms & conditions</Text>
          {promo.terms.map((t, i) => (
            <Text key={i} style={styles.term}>
              • {t}
            </Text>
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
  scroll: { paddingBottom: 120 },
  hero: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    minHeight: 180,
    justifyContent: 'flex-end',
  },
  heroTitle: { ...typography.h1, color: colors.brown },
  heroSub: { ...typography.body, color: colors.brownSoft, marginTop: spacing.sm },
  body: { padding: spacing.lg },
  section: { ...typography.h3, color: colors.ink, marginTop: spacing.lg, marginBottom: spacing.sm },
  copy: { ...typography.body, color: colors.inkSoft },
  term: { ...typography.caption, color: colors.muted, marginBottom: spacing.xs, lineHeight: 20 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
