import { Text } from '../../components/ThemedText';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FranLogo } from '../../components/FranLogo';
import { QrMark } from '../../components/QrMark';
import { useUser } from '../../context/UserContext';
import { useLayout } from '../../layout/useLayout';
import type { RootStackParamList, Voucher } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

function Coupon({
  voucher,
  onPress,
}: {
  voucher: Voucher;
  onPress: () => void;
}) {
  const expiring =
    voucher.expiresAt &&
    new Date(voucher.expiresAt).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 21;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={voucher.title}
      style={({ pressed }) => [styles.coupon, pressed && { opacity: 0.85 }]}
    >
      {expiring ? (
        <View style={styles.expTag}>
          <Text style={styles.expTagText}>Expiring soon</Text>
        </View>
      ) : null}
      <View style={styles.couponLeft}>
        <Text style={styles.couponValue}>{voucher.valueLabel}</Text>
        <Text style={styles.couponOff}>OFF</Text>
      </View>
      <View style={styles.couponDash} />
      <View style={styles.couponRight}>
        <Text style={styles.couponTitle} numberOfLines={3}>
          {voucher.title.toUpperCase()}
        </Text>
        <Text style={styles.couponUntil}>
          {voucher.expiresAt ? `Valid until ${voucher.expiresAt}` : 'No expiry'}
        </Text>
      </View>
    </Pressable>
  );
}

export function MemberIdScreen() {
  const { user, vouchers } = useUser();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { gutter } = useLayout();
  const insets = useSafeAreaInsets();
  const toUse = vouchers.filter((v) => v.status === 'available' || v.status === 'to_redeem');

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.giant }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}>
          <View style={[styles.heroTitles, { paddingHorizontal: gutter }]}>
            <FranLogo height={28} variant="brown" />
            <Text style={styles.heroKicker}>Scan & earn</Text>
          </View>
          <View style={[styles.qrCard, { marginHorizontal: gutter }]}>
            <QrMark value={user.memberId} size={240} />
            <View style={styles.idPill}>
              <Text style={styles.idPillText}>MEMBER ID: {user.memberId}</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: gutter, paddingTop: spacing.xl }}>
          <Text style={styles.section}>Vouchers</Text>
          <View style={styles.tab}>
            <Text style={styles.tabLabel}>To use</Text>
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{toUse.length}</Text>
            </View>
          </View>
          <View style={styles.list}>
            {toUse.map((v) => (
              <Coupon
                key={v.id}
                voucher={v}
                onPress={() => navigation.navigate('VoucherDetail', { voucherId: v.id })}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.yellow,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  heroTitles: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    paddingTop: spacing.md,
  },
  heroKicker: { ...typography.h1, color: colors.inkSoft, marginBottom: 2 },
  qrCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    ...shadow.md,
  },
  idPill: {
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
  },
  idPillText: { ...typography.micro, letterSpacing: 0.4 },
  section: { ...typography.h2, marginBottom: spacing.sm },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: colors.brown,
    paddingBottom: 10,
    paddingHorizontal: 4,
    marginBottom: spacing.lg,
  },
  tabLabel: { ...typography.captionBold },
  tabBadge: {
    backgroundColor: colors.yellow,
    borderRadius: radius.full,
    minWidth: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  tabBadgeText: { ...typography.micro, color: colors.brown },
  list: { gap: spacing.md },
  coupon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.yellow,
    borderRadius: radius.md,
    minHeight: 104,
    overflow: 'visible',
  },
  expTag: {
    position: 'absolute',
    top: -8,
    right: 10,
    backgroundColor: colors.blue,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  expTagText: { ...typography.micro, color: colors.white },
  couponLeft: { width: 96, paddingLeft: spacing.lg, paddingVertical: spacing.md },
  couponValue: { ...typography.h1 },
  couponOff: { ...typography.title },
  couponDash: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 10,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.brownSoft,
  },
  couponRight: { flex: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: 4 },
  couponTitle: { ...typography.title },
  couponUntil: { ...typography.micro },
});
