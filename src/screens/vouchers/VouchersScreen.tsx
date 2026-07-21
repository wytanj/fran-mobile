import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { EmptyState, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import type { RootStackParamList, Voucher } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

type TabKey = 'available' | 'to_redeem' | 'past';

const TABS: { key: TabKey; label: string }[] = [
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

  const data = useMemo(() => vouchers.filter((v) => matchesTab(v, tab)), [vouchers, tab]);

  return (
    <Screen padded={false} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Vouchers</Text>
        <View style={styles.pointsPill}>
          <Text style={styles.pointsText}>{user.points} pts</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setTab(t.key)}
            style={[styles.tab, tab === t.key && styles.tabOn]}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextOn]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="ticket-outline"
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
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tile, past && styles.tilePast, shadow.sm]}
    >
      <View style={[styles.valueBox, { backgroundColor: past ? colors.disabled : voucher.color }]}>
        <Text style={styles.value}>{voucher.valueLabel}</Text>
      </View>
      <Text style={[styles.tileTitle, past && styles.pastText]} numberOfLines={2}>
        {voucher.title}
      </Text>
      <Text style={styles.tileSub} numberOfLines={1}>
        {voucher.description}
      </Text>
      {voucher.pointsCost != null && voucher.status === 'to_redeem' ? (
        <Text style={styles.cost}>{voucher.pointsCost} pts</Text>
      ) : null}
      {past ? (
        <View style={styles.pastTag}>
          <Text style={styles.pastTagText}>
            {voucher.status === 'used' ? 'Used' : 'Expired'}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { ...typography.h1, color: colors.ink },
  pointsPill: {
    backgroundColor: colors.yellowSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  pointsText: { ...typography.captionBold, color: colors.brown },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.peachSoft,
    borderRadius: radius.full,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  tabOn: { backgroundColor: colors.surface, ...shadow.sm },
  tabText: { ...typography.captionBold, color: colors.muted },
  tabTextOn: { color: colors.brown },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.huge },
  row: { gap: spacing.md, marginBottom: spacing.md },
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 160,
  },
  tilePast: { opacity: 0.55 },
  valueBox: {
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  value: { ...typography.h1, color: colors.brown },
  tileTitle: { ...typography.captionBold, color: colors.ink },
  tileSub: { ...typography.micro, color: colors.muted, marginTop: 2 },
  cost: { ...typography.captionBold, color: colors.brown, marginTop: spacing.sm },
  pastText: { color: colors.muted },
  pastTag: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.cream,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  pastTagText: { ...typography.micro, color: colors.muted },
});
