import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, LayoutAnimation, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Badge, Button, Header, Perforation, Screen } from '../../components/ui';
import { QrMark } from '../../components/QrMark';
import { useUser } from '../../context/UserContext';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, tint, typography } from '../../theme';
import { onFill } from '../../theme/contrast';

type Props = NativeStackScreenProps<RootStackParamList, 'VoucherDetail'>;

export function VoucherDetailScreen({ navigation, route }: Props) {
  const { vouchers, user, redeemVoucher } = useUser();
  const voucher = vouchers.find((v) => v.id === route.params.voucherId);
  const [showQr, setShowQr] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!voucher) {
    return (
      <Screen edges={['top']}>
        <Header title="Voucher details" onBack={() => navigation.goBack()} />
        <Text style={styles.missing}>Voucher not found.</Text>
      </Screen>
    );
  }

  const past = voucher.status === 'used' || voucher.status === 'expired';
  const fill = past ? colors.disabled : voucher.color;
  const on = onFill(fill);

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
      <Header title="Voucher details" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Ticket — coloured stub, tear line, then the details */}
        <View style={[styles.ticket, shadow.md]}>
          <View style={[styles.stub, { backgroundColor: fill }]}>
            <View style={styles.stubBloom} pointerEvents="none" />
            <Text style={[styles.value, { color: on.primary }]}>{voucher.valueLabel}</Text>
            <Text style={[styles.heroTitle, { color: on.primary }]}>{voucher.title}</Text>
            <Text style={[styles.heroSub, { color: on.secondary }]}>{voucher.description}</Text>
          </View>

          <Perforation notchColor={colors.background} />

          <View style={styles.ticketBody}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>
                {past ? (voucher.status === 'used' ? 'Used on' : 'Expired on') : 'Valid until'}
              </Text>
              <Text style={styles.metaValue}>
                {past ? (voucher.usedAt ?? voucher.expiresAt ?? '—') : (voucher.expiresAt ?? 'No expiry')}
              </Text>
            </View>
            {voucher.minSpend ? (
              <View style={[styles.metaRow, styles.metaBorder]}>
                <Text style={styles.metaLabel}>Minimum spend</Text>
                <Text style={styles.metaValue}>${voucher.minSpend}</Text>
              </View>
            ) : null}
            {voucher.pointsCost != null ? (
              <View style={[styles.metaRow, styles.metaBorder]}>
                <Text style={styles.metaLabel}>Cost</Text>
                <Text style={styles.metaValue}>{voucher.pointsCost} pts</Text>
              </View>
            ) : null}
            <View style={[styles.metaRow, styles.metaBorder]}>
              <Text style={styles.metaLabel}>Status</Text>
              <Badge
                label={
                  voucher.status === 'available'
                    ? 'Ready to use'
                    : voucher.status === 'to_redeem'
                      ? 'Redeemable'
                      : voucher.status === 'used'
                        ? 'Used'
                        : 'Expired'
                }
                tone={
                  voucher.status === 'available'
                    ? 'success'
                    : voucher.status === 'to_redeem'
                      ? 'primary'
                      : 'muted'
                }
              />
            </View>
          </View>
        </View>

        <View style={[styles.qrCard, shadow.sm]}>
          <Text style={styles.qrHint}>Scan at checkout</Text>
          <View style={styles.qrWrap}>
            <QrMark value={`${user.memberId}-${voucher.id}`} size={180} />
            {voucher.status === 'used' ? (
              <View style={styles.stamp} pointerEvents="none">
                <Text style={styles.stampText}>REDEEMED</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.qrId}>* {voucher.id.toUpperCase()} *</Text>
        </View>

        <Text style={styles.termsTitle}>Terms & Conditions</Text>
        <View style={styles.terms}>
          {voucher.terms.length ? (
            voucher.terms.map((t, i) => (
              <View key={i} style={styles.termRow}>
                <Text style={styles.term}>• {t}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.term}>No additional terms.</Text>
          )}
        </View>
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
          icon={showQr ? 'checkCircle' : undefined}
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
  ticket: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginBottom: spacing.lg,
  },
  stub: {
    borderTopLeftRadius: radius.xl - 1,
    borderTopRightRadius: radius.xl - 1,
    padding: spacing.xxl,
    overflow: 'hidden',
  },
  stubBloom: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: tint.lightVeil,
    opacity: 0.3,
  },
  value: { ...typography.display },
  heroTitle: { ...typography.h2, marginTop: spacing.sm },
  heroSub: { ...typography.body, marginTop: 2 },
  ticketBody: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  metaBorder: { borderTopWidth: 1, borderTopColor: colors.borderSoft },
  metaLabel: { ...typography.caption },
  metaValue: { ...typography.captionBold },
  qrCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
  },
  qrFrame: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.yellow,
  },
  qrHint: { ...typography.eyebrow, marginBottom: spacing.md },
  qrWrap: { alignItems: 'center', justifyContent: 'center' },
  stamp: {
    position: 'absolute',
    transform: [{ rotate: '-18deg' }],
    borderWidth: 3,
    borderColor: colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stampText: { ...typography.h3, color: colors.danger, letterSpacing: 1 },
  qrId: { ...typography.bodyBold, marginTop: spacing.md, letterSpacing: 1.5 },
  termsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  termsTitle: { ...typography.h3 },
  chevronWell: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  terms: { paddingBottom: spacing.md, gap: spacing.sm },
  termRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  termDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.yellowDeep,
    marginTop: 7,
  },
  term: { ...typography.caption, flex: 1, lineHeight: 20 },
});
