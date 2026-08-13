import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { EmptyState, Header, Perforation, PressableScale, Screen, Segmented } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { ContentWidth } from '../../layout/ContentWidth';
import { useLayout } from '../../layout/useLayout';
import type { RootStackParamList, Voucher } from '../../types';
import { colors, press, radius, shadow, spacing, typography } from '../../theme';
import { onFill } from '../../theme/contrast';

type TabKey = 'available' | 'to_redeem' | 'past';

const TABS: ReadonlyArray<{ key: TabKey; label: string }> = [
  { key: 'available', label: 'Available' },
  { key: 'to_redeem', label: 'To redeem' },
  { key: 'past', label: 'Past' },
];

function matchesTab(v: Voucher, tab: TabKey) {
  if (tab === 'available') return v.status === 'available';
  if (tab === 'to_redeem') return v.status === 'to_redeem';
  return v.status === 'used' || v.status === 'expired';
}

export function VouchersScreen() {
  const { user, vouchers } = useUser();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tab, setTab] = useState<TabKey>('available');
  const { gutter, voucherColumns } = useLayout();

  const data = useMemo(() => vouchers.filter((v) => matchesTab(v, tab)), [vouchers, tab]);

  return (
    <Screen padded={false} edges={['top']}>
      <Header title="Vouchers" onBack={() => navigation.goBack()} />
      <ContentWidth style={{ paddingHorizontal: gutter }}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>Your wallet</Text>
            <Text style={styles.title}>Vouchers</Text>
          </View>
          <View style={styles.pointsPill}>
            <FranIcon name="gem" size={12} color={colors.brown} />
            <Text style={styles.pointsText}>{user.points} pts</Text>
          </View>
        </View>

        <Segmented items={TABS} value={tab} onChange={setTab} style={styles.tabs} />

        <FlatList
          key={`vouchers-${voucherColumns}`}
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={voucherColumns}
          columnWrapperStyle={voucherColumns > 1 ? styles.row : undefined}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="ticket"
              title="No vouchers here"
              subtitle={
                tab === 'to_redeem'
                  ? 'Redeem points for vouchers when you have enough.'
                  : tab === 'past'
                    ? 'Used and expired vouchers will show up here.'
                    : 'Claim promos or redeem points to fill your wallet.'
              }
            />
          }
          renderItem={({ item }) => (
            <VoucherTile
              voucher={item}
              past={tab === 'past'}
              onPress={() => navigation.navigate('VoucherDetail', { voucherId: item.id })}
            />
          )}
        />
      </ContentWidth>
    </Screen>
  );
}

function VoucherTile({
  voucher,
  past,
  onPress,
}: {
  voucher: Voucher;
  past: boolean;
  onPress: () => void;
}) {
  const fill = past ? colors.disabled : voucher.color;
  const on = onFill(fill);

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={press.scaleLarge}
      accessibilityLabel={`${voucher.title}, ${voucher.description}`}
      style={[styles.tile, past && styles.tilePast, shadow.sm]}
    >
      <View style={[styles.valueBox, { backgroundColor: fill }]}>
        <Text style={[styles.value, { color: on.primary }]} numberOfLines={1}>
          {voucher.valueLabel}
        </Text>
        {voucher.minSpend ? (
          <Text style={[styles.valueMeta, { color: on.secondary }]}>Min ${voucher.minSpend}</Text>
        ) : null}
      </View>

      <Perforation notchColor={colors.background} />

      <View style={styles.tileBody}>
        <Text style={[styles.tileTitle, past && styles.pastText]} numberOfLines={2}>
          {voucher.title}
        </Text>
        <Text style={styles.tileSub} numberOfLines={2}>
          {voucher.description}
        </Text>
        <View style={styles.tileFooter}>
          {past ? (
            <Text style={styles.pastTagText}>
              {voucher.status === 'used' ? 'Used' : 'Expired'}
            </Text>
          ) : voucher.pointsCost != null && voucher.status === 'to_redeem' ? (
            <View style={styles.costPill}>
              <FranIcon name="gem" size={10} color={colors.brown} />
              <Text style={styles.cost}>{voucher.pointsCost} pts</Text>
            </View>
          ) : voucher.expiresAt ? (
            <Text style={styles.expiry}>Until {voucher.expiresAt}</Text>
          ) : null}
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  eyebrow: { ...typography.eyebrow },
  title: { ...typography.h1, marginTop: 4 },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.yellowSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    marginBottom: 4,
  },
  pointsText: { ...typography.captionBold, color: colors.brown },
  tabs: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  list: { paddingBottom: spacing.huge },
  row: { gap: spacing.md, marginBottom: spacing.md },
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingBottom: spacing.md,
  },
  tilePast: { opacity: 0.6 },
  valueBox: {
    height: 76,
    borderTopLeftRadius: radius.lg - 1,
    borderTopRightRadius: radius.lg - 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  value: { ...typography.h1 },
  valueMeta: { ...typography.micro, letterSpacing: 0.4 },
  tileBody: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  tileTitle: { ...typography.captionBold, lineHeight: 18 },
  tileSub: { ...typography.micro, marginTop: 3 },
  tileFooter: { marginTop: spacing.sm, minHeight: 20, justifyContent: 'center' },
  costPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
    backgroundColor: colors.yellowSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  cost: { ...typography.micro, color: colors.brown },
  expiry: { ...typography.micro, color: colors.brownMuted },
  pastText: { color: colors.brownMuted },
  pastTagText: { ...typography.micro, color: colors.brownMuted, letterSpacing: 0.6 },
});
