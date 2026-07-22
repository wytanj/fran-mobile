import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, LayoutAnimation, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VoucherDetail'>;

export function VoucherDetailScreen({ navigation, route }: Props) {
  const { vouchers, user, redeemVoucher } = useUser();
  const voucher = vouchers.find((v) => v.id === route.params.voucherId);
  const [termsOpen, setTermsOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!voucher) {
    return (
      <Screen edges={['top']}>
        <Header title="Voucher" onBack={() => navigation.goBack()} />
        <Text style={styles.missing}>Voucher not found.</Text>
      </Screen>
    );
  }

  const past = voucher.status === 'used' || voucher.status === 'expired';

  const onPrimary = async () => {
    if (voucher.status === 'to_redeem') {
      if (voucher.pointsCost && user.points < voucher.pointsCost) {
        Alert.alert('Not enough points', `You need ${voucher.pointsCost} points.`);
        return;
      }
      setLoading(true);
      try {
        const ok = await redeemVoucher(voucher.id);
        if (ok) {
          Alert.alert('Redeemed', 'Voucher is now in Available. Use it at checkout.');
          navigation.goBack();
        }
      } finally {
        setLoading(false);
      }
      return;
    }
    if (voucher.status === 'available') {
      setShowQr(true);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <Header title="Voucher" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={[styles.hero, { backgroundColor: past ? colors.disabled : voucher.color }]}>
          <Text style={styles.value}>{voucher.valueLabel}</Text>
          <Text style={styles.heroTitle}>{voucher.title}</Text>
          <Text style={styles.heroSub}>{voucher.description}</Text>
        </View>

        {voucher.expiresAt ? (
          <Text style={styles.expiry}>
            {past
              ? voucher.status === 'used'
                ? `Used on ${voucher.usedAt ?? voucher.expiresAt}`
                : `Expired on ${voucher.expiresAt}`
              : `Expires ${voucher.expiresAt}`}
          </Text>
        ) : null}

        {showQr && voucher.status === 'available' ? (
          <View style={styles.qrCard}>
            <Ionicons name="qr-code" size={120} color={colors.ink} />
            <Text style={styles.qrHint}>Show this code at checkout</Text>
            <Text style={styles.qrId}>{user.memberId}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setTermsOpen((v) => !v);
          }}
          style={styles.termsHeader}
        >
          <Text style={styles.termsTitle}>Terms & conditions</Text>
          <Ionicons name={termsOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.ink} />
        </Pressable>
        {termsOpen
          ? voucher.terms.map((t, i) => (
              <Text key={i} style={styles.term}>
                • {t}
              </Text>
            ))
          : null}
      </ScrollView>

      {!past ? (
        <Button
          title={
            voucher.status === 'to_redeem'
              ? `Redeem${voucher.pointsCost ? ` with ${voucher.pointsCost} pts` : ' now'}`
              : showQr
                ? 'Ready to scan'
                : 'Use now'
          }
          onPress={onPrimary}
          loading={loading}
          disabled={showQr}
          style={{ marginBottom: spacing.lg }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: { ...typography.body, color: colors.muted },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
  },
  value: { ...typography.hero, color: colors.brown },
  heroTitle: { ...typography.h2, color: colors.brown, marginTop: spacing.sm },
  heroSub: { ...typography.body, color: colors.brownSoft, marginTop: spacing.xs },
  expiry: { ...typography.captionBold, color: colors.muted, marginBottom: spacing.lg },
  qrCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
  },
  qrHint: { ...typography.caption, color: colors.muted, marginTop: spacing.md },
  qrId: { ...typography.bodyBold, color: colors.ink, marginTop: spacing.xs, letterSpacing: 1 },
  termsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  termsTitle: { ...typography.h3, color: colors.ink },
  term: { ...typography.caption, color: colors.muted, marginBottom: spacing.xs, lineHeight: 20 },
});
