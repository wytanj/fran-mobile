import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FranLogo } from '../../components/FranLogo';
import { Header, PressableScale, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { ContentWidth } from '../../layout/ContentWidth';
import { useLayout } from '../../layout/useLayout';
import type { RootStackParamList } from '../../types';
import { colors, fonts, radius, shadow, spacing, tint, typography } from '../../theme';

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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { gutter, useSplitPanels, isExpanded } = useLayout();
  const qrSize = isExpanded ? 240 : 200;

  return (
    <Screen padded={false} edges={['top', 'bottom']} constrain={false} style={styles.wrap}>
      <Header title="Member ID" onBack={() => navigation.goBack()} />
      <LinearGradient
        colors={[colors.yellow, colors.yellowDeep]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBleed}
      >
        {/* Two soft arcs echo the wordmark's roundness without adding new colour */}
        <View style={styles.arcLarge} pointerEvents="none" />
        <View style={styles.arcSmall} pointerEvents="none" />
        <ContentWidth flex={false} style={{ paddingHorizontal: gutter }}>
          <View style={styles.headerInner}>
            <FranLogo height={30} variant="brown" />
            <Text style={styles.subtitle}>Present at checkout to earn points</Text>
          </View>
        </ContentWidth>
      </LinearGradient>

      <ContentWidth flex={false} style={{ paddingHorizontal: gutter }}>
        <View style={[styles.card, shadow.lg, useSplitPanels && styles.cardSplit]}>
          <View style={[styles.cardMain, useSplitPanels && styles.cardMainSplit]}>
            <View style={styles.idRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.idLabel}>Member ID</Text>
                <Text style={styles.idValue}>{user.memberId}</Text>
              </View>
              <Pressable
                onPress={() => {}}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Copy member ID"
                style={({ pressed }) => [styles.copyBtn, pressed && { opacity: 0.6 }]}
              >
                <FranIcon name="copy" size={15} color={colors.brown} />
                <Text style={styles.copyText}>Copy</Text>
              </Pressable>
            </View>

            {!useSplitPanels ? (
              <View style={styles.qrWrap}>
                <QrPlaceholder value={user.memberId} size={qrSize} />
              </View>
            ) : null}

            <View style={useSplitPanels ? styles.identityLeft : styles.identity}>
              <Text style={styles.name}>{user.name}</Text>
              <View style={styles.tierRow}>
                <View style={styles.tierChip}>
                  <Text style={styles.tierChipText}>Tier {user.tier}</Text>
                </View>
                <Text style={styles.tier}>{user.points} points</Text>
              </View>
            </View>
          </View>

          {useSplitPanels ? (
            <View style={styles.qrWrap}>
              <QrPlaceholder value={user.memberId} size={qrSize} />
            </View>
          ) : null}
        </View>

        <PressableScale
          style={[styles.vouchersLink, shadow.sm]}
          onPress={() => navigation.navigate('Vouchers')}
          accessibilityLabel={`Use vouchers, ${availableVoucherCount} available`}
        >
          <View style={styles.vIcon}>
            <FranIcon name="ticket" size={19} color={colors.brown} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.vTitle}>Use vouchers</Text>
            <Text style={styles.vSub}>
              {availableVoucherCount} ready to apply at checkout
            </Text>
          </View>
          <FranIcon name="chevronRight" size={17} color={colors.borderStrong} />
        </PressableScale>

        <View style={styles.tipRow}>
          <FranIcon name="info" size={14} color={colors.brownMuted} />
          <Text style={styles.tip}>Screen brightness helps the scanner read your code.</Text>
        </View>
      </ContentWidth>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.cream },
  headerBleed: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.giant,
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
    overflow: 'hidden',
  },
  arcLarge: {
    position: 'absolute',
    top: -120,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: tint.lightVeil,
    opacity: 0.3,
  },
  arcSmall: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.brown,
    opacity: 0.05,
  },
  headerInner: {},
  subtitle: {
    ...typography.body,
    color: colors.brownSoft,
    marginTop: spacing.sm,
  },
  card: {
    marginTop: -spacing.xxxl,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
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
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  idLabel: { ...typography.eyebrow },
  idValue: {
    fontFamily: fonts.display,
    fontSize: 21,
    lineHeight: 26,
    color: colors.ink,
    letterSpacing: 1.6,
    marginTop: 2,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.yellowSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
  },
  copyText: { ...typography.captionBold, color: colors.brown },
  qrWrap: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.yellow,
  },
  qrBox: {
    justifyContent: 'space-between',
  },
  qrRow: { flexDirection: 'row', justifyContent: 'space-between', flex: 1 },
  qrCell: { flex: 1, margin: 1, borderRadius: 1 },
  identity: { alignItems: 'center', marginTop: spacing.lg },
  identityLeft: { alignItems: 'flex-start', marginTop: spacing.lg },
  name: { ...typography.h2 },
  tierRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  tierChip: {
    backgroundColor: colors.peachSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  tierChipText: { ...typography.micro, color: colors.brown, letterSpacing: 0.5 },
  tier: { ...typography.caption },
  vouchersLink: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  vIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vTitle: { ...typography.title },
  vSub: { ...typography.caption, marginTop: 1 },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: spacing.xl,
  },
  tip: { ...typography.micro },
});
