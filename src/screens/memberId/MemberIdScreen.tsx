import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FranLogo } from '../../components/FranLogo';
import { Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { ContentWidth } from '../../layout/ContentWidth';
import { useLayout } from '../../layout/useLayout';
import type { MainTabParamList } from '../../types';
import { colors, fonts, radius, shadow, spacing, typography } from '../../theme';

/** Simple visual QR placeholder for prototype (no native QR lib required). */
function QrPlaceholder({ value, size }: { value: string; size: number }) {
  const cells = 11;
  const bits: boolean[] = [];
  for (let i = 0; i < cells * cells; i++) {
    const c = value.charCodeAt(i % value.length) + i * 7;
    bits.push(c % 3 !== 0);
  }
  const isFinder = (r: number, c: number) => {
    const inCorner = (rr: number, cc: number) =>
      r >= rr && r < rr + 3 && c >= cc && c < cc + 3;
    return inCorner(0, 0) || inCorner(0, cells - 3) || inCorner(cells - 3, 0);
  };

  return (
    <View style={[styles.qrBox, { width: size, height: size }]}>
      {Array.from({ length: cells }).map((_, r) => (
        <View key={r} style={styles.qrRow}>
          {Array.from({ length: cells }).map((__, c) => {
            const on = isFinder(r, c) || bits[r * cells + c];
            return (
              <View
                key={c}
                style={[styles.qrCell, { backgroundColor: on ? colors.brown : colors.white }]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

export function MemberIdScreen() {
  const { user, availableVoucherCount } = useUser();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { gutter, useSplitPanels, isExpanded } = useLayout();
  const qrSize = isExpanded ? 240 : 200;

  return (
    <Screen padded={false} edges={['top', 'bottom']} constrain={false} style={styles.wrap}>
      <View style={styles.headerBleed}>
        <ContentWidth flex={false} style={{ paddingHorizontal: gutter }}>
          <View style={styles.headerInner}>
            <FranLogo height={32} />
            <Text style={styles.subtitle}>Present at checkout to earn points</Text>
          </View>
        </ContentWidth>
      </View>

      <ContentWidth flex={false} style={{ paddingHorizontal: gutter }}>
        <View style={[styles.card, shadow.lg, useSplitPanels && styles.cardSplit]}>
          <View style={[styles.cardMain, useSplitPanels && styles.cardMainSplit]}>
            <View style={styles.idRow}>
              <View>
                <Text style={styles.idLabel}>Your Member ID</Text>
                <Text style={styles.idValue}>{user.memberId}</Text>
              </View>
              <Pressable onPress={() => {}} style={styles.copyBtn} hitSlop={8}>
                <Ionicons name="copy-outline" size={18} color={colors.brown} />
                <Text style={styles.copyText}>Copy</Text>
              </Pressable>
            </View>

            {!useSplitPanels ? (
              <View style={styles.qrWrap}>
                <QrPlaceholder value={user.memberId} size={qrSize} />
              </View>
            ) : null}

            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.tier}>
              Tier {user.tier} · {user.points} points
            </Text>
          </View>

          {useSplitPanels ? (
            <View style={styles.qrWrap}>
              <QrPlaceholder value={user.memberId} size={qrSize} />
            </View>
          ) : null}
        </View>

        <Pressable
          style={[styles.vouchersLink, shadow.sm]}
          onPress={() => navigation.navigate('Vouchers')}
        >
          <View style={styles.vLeft}>
            <Ionicons name="ticket-outline" size={22} color={colors.brown} />
            <Text style={styles.vTitle}>Use vouchers</Text>
          </View>
          <View style={styles.vRight}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{availableVoucherCount}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </View>
        </Pressable>
      </ContentWidth>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.cream },
  headerBleed: {
    backgroundColor: colors.yellow,
    paddingTop: spacing.lg,
    paddingBottom: spacing.huge,
  },
  headerInner: {},
  subtitle: {
    ...typography.body,
    color: colors.brownSoft,
    marginTop: spacing.sm,
  },
  card: {
    marginTop: -spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  cardSplit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xxl,
  },
  cardMain: {
    width: '100%',
    alignItems: 'center',
  },
  cardMainSplit: {
    flex: 1,
    alignItems: 'flex-start',
  },
  idRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  idLabel: { ...typography.caption, color: colors.muted },
  idValue: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: 1,
  },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  copyText: { ...typography.captionBold, color: colors.brown },
  qrWrap: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrBox: {
    justifyContent: 'space-between',
  },
  qrRow: { flexDirection: 'row', justifyContent: 'space-between', flex: 1 },
  qrCell: { flex: 1, margin: 1, borderRadius: 1 },
  name: { ...typography.h3, color: colors.ink, marginTop: spacing.lg },
  tier: { ...typography.caption, color: colors.muted, marginTop: 2 },
  vouchersLink: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  vLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  vTitle: { ...typography.bodyBold, color: colors.ink },
  vRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.brown,
  },
});
