import { Text } from '../../components/ThemedText';
import { FranIcon, type FranIconName } from '../../components/FranIcon';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FranLogo } from '../../components/FranLogo';
import { PressableScale } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { earnActions, tiers } from '../../data/mock';
import { useLayout } from '../../layout/useLayout';
import type { EarnAction, MainTabParamList, RootStackParamList, Voucher } from '../../types';
import { colors, fonts, radius, spacing, typography } from '../../theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Rewards'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const STATUS: Record<1 | 2 | 3, string> = {
  1: 'HOOKED',
  2: 'LOCKED IN',
  3: 'ALL IN',
};

const EARN_COPY: Record<
  string,
  { title: string; sub: (pts: number) => string; cta: string; well: string }
> = {
  checkin: {
    title: 'Daily check in',
    sub: () => 'Check in to earn points',
    cta: 'Check in',
    well: colors.yellowSoft,
  },
  birthday: {
    title: "Drop your b'day",
    sub: (pts) => `+${pts} points`,
    cta: 'Add now',
    well: colors.blueSoft,
  },
  skin: {
    title: 'Get your skin profile',
    sub: (pts) => `+${pts} points`,
    cta: 'Take the quiz',
    well: colors.peachSoft,
  },
  makeup: {
    title: 'Get your makeup profile',
    sub: (pts) => `+${pts} points`,
    cta: 'Take the quiz',
    well: colors.yellowSoft,
  },
  hair: {
    title: 'Get your hair profile',
    sub: (pts) => `+${pts} points`,
    cta: 'Take the quiz',
    well: colors.blueSoft,
  },
  lifestyle: {
    title: 'Get your lifestyle profile',
    sub: (pts) => `+${pts} points`,
    cta: 'Take the quiz',
    well: colors.peachSoft,
  },
  instagram: {
    title: 'Follow us on IG',
    sub: (pts) => `+${pts} points`,
    cta: 'Go',
    well: colors.yellowSoft,
  },
  tiktok: {
    title: 'Follow us on TikTok',
    sub: (pts) => `+${pts} points`,
    cta: 'Go',
    well: colors.peachSoft,
  },
};

const EARN_ORDER = [
  'checkin',
  'birthday',
  'skin',
  'makeup',
  'hair',
  'lifestyle',
  'instagram',
  'tiktok',
];

const UNLOCKS: { icon: FranIconName; title: string; body: string }[] = [
  { icon: 'gem', title: 'Earning perks', body: '$1 = 1.00 points' },
  {
    icon: 'gift',
    title: 'Birthday double points',
    body: '2x rewards on a single transaction on your birthday month',
  },
  {
    icon: 'clock',
    title: 'Time bonuses',
    body: 'Member exclusive promotions from time to time',
  },
];

function Wordmark() {
  return (
    <View style={styles.wordmark}>
      <FranLogo height={28} variant="yellow" />
      <Text style={styles.benefits}>with benefits</Text>
    </View>
  );
}

export function RewardsScreen() {
  const navigation = useNavigation<Nav>();
  const { isAuthed, user, vouchers, checkIn, completeSocial } = useUser();
  const { gutter } = useLayout();
  const insets = useSafeAreaInsets();
  const [benefitsOpen, setBenefitsOpen] = useState(false);

  const nextTier = tiers.find((t) => t.tier === Math.min(3, (user.tier + 1) as 1 | 2 | 3));
  const currentTier = tiers.find((t) => t.tier === user.tier) ?? tiers[0];
  const goal = nextTier && nextTier.tier !== user.tier ? nextTier.spendRequired : currentTier.spendRequired;
  const progress = Math.min(1, user.yearlySpend / Math.max(goal, 1));
  const remainingSpend = Math.max(0, goal - user.yearlySpend);
  const resetLabel = user.tierExpiresAt
    ? new Date(user.tierExpiresAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '31 Dec 2026';

  const benefitsCount = useMemo(() => {
    const quizzes = Object.values(user.beautyProfiles).filter(Boolean).length;
    const extras = Object.values(user.earnActionsCompleted).filter(Boolean).length;
    return quizzes + extras;
  }, [user.beautyProfiles, user.earnActionsCompleted]);

  const previewVouchers = vouchers.filter((v) => v.status === 'available').slice(0, 2);

  const orderedEarn = useMemo(() => {
    const byId = new Map(earnActions.map((a) => [a.id, a]));
    return EARN_ORDER.map((id) => byId.get(id)).filter((a): a is EarnAction => !!a);
  }, []);

  const openOnboarding = (mode: 'signup' | 'login') => {
    navigation.navigate('Onboarding', { screen: 'Phone', params: { mode } });
  };

  const runEarn = async (action: EarnAction) => {
    if (!isAuthed) {
      openOnboarding('signup');
      return;
    }
    if (action.kind === 'social') {
      const url = action.id === 'instagram' ? 'https://instagram.com' : 'https://tiktok.com';
      Linking.openURL(url).catch(() => {});
      const pts = await completeSocial(action.id as 'instagram' | 'tiktok');
      if (pts) Alert.alert('Nice!', `+${pts} points added`);
      return;
    }
    if (action.kind === 'beauty' && action.category) {
      const done = !!user.beautyProfiles[action.category];
      if (done) navigation.navigate('BeautyResults', { category: action.category });
      else navigation.navigate('Quiz', { category: action.category });
      return;
    }
    if (action.kind === 'birthday') {
      navigation.navigate('BirthdayModal');
      return;
    }
    if (action.kind === 'checkin') {
      const result = await checkIn();
      if (!result) {
        Alert.alert('Already checked in', "You're all set for today. Come back tomorrow!");
        return;
      }
      Alert.alert(
        'Checked in!',
        `+${result.awarded} point${result.freezeAwarded ? '\nStreak freeze earned!' : ''}`,
      );
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: gutter,
          paddingTop: insets.top + spacing.sm,
          paddingBottom: spacing.giant,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Wordmark />

        {isAuthed ? (
          <>
            <PressableScale
              onPress={() => navigation.navigate('MembershipTiers')}
              style={styles.pointsCard}
              accessibilityLabel={`${user.points} points, ${STATUS[user.tier]}`}
            >
              <View style={styles.pointsTop}>
                <Text style={styles.status}>Status: {STATUS[user.tier]}</Text>
                <FranIcon name="chevronRight" size={16} color={colors.brown} />
              </View>
              <Text style={styles.pointsValue}>
                {user.points.toLocaleString()} pts
              </Text>
              <View style={styles.track}>
                <View style={[styles.trackFill, { width: `${Math.max(8, progress * 100)}%` }]} />
                <View style={[styles.trackDot, { left: `${Math.min(92, Math.max(4, progress * 100))}%` }]}>
                  <FranIcon name="checkCircle" size={16} color={colors.yellow} />
                </View>
              </View>
              <View style={styles.tierRow}>
                {tiers.map((t) => (
                  <Text key={t.tier} style={styles.tierLabel}>
                    {t.name}
                  </Text>
                ))}
              </View>
              <Text style={styles.tierHint}>
                {user.tier < 3
                  ? `Spend $${remainingSpend} more by ${resetLabel} to get on ${nextTier?.name ?? 'the next tier'}`
                  : `You're on ${currentTier.name}. Enjoy the perks.`}
              </Text>
              <Text style={styles.tierHint}>Tier resets {resetLabel}</Text>
              <Pressable
                onPress={() => setBenefitsOpen((v) => !v)}
                style={styles.benefitsToggle}
                accessibilityRole="button"
              >
                <Text style={styles.benefitsToggleText}>
                  {benefitsCount} benefit{benefitsCount === 1 ? '' : 's'} unlocked
                </Text>
                <FranIcon
                  name={benefitsOpen ? 'chevronUp' : 'chevronDown'}
                  size={16}
                  color={colors.brown}
                />
              </Pressable>
              {benefitsOpen ? (
                <View style={styles.benefitsList}>
                  {UNLOCKS.map((u) => (
                    <Text key={u.title} style={styles.benefitLine}>
                      {u.title} — {u.body}
                    </Text>
                  ))}
                </View>
              ) : null}
            </PressableScale>

            {user.pointsExpiringSoon > 0 && user.tier === 1 ? (
              <PressableScale
                onPress={() => navigation.navigate('ExpiringPoints')}
                style={styles.expireCard}
                accessibilityLabel={`${user.pointsExpiringSoon} points expiring soon`}
              >
                <View style={styles.expireIcon}>
                  <FranIcon name="clock" size={18} color={colors.brown} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.expireTitle}>
                    {user.pointsExpiringSoon} points expire on 30 Sep
                  </Text>
                  <Text style={styles.expireSub}>No panic. Just a heads-up.</Text>
                </View>
                <FranIcon name="chevronRight" size={16} color={colors.brown} />
              </PressableScale>
            ) : null}

            <View>
              <Text style={styles.eyebrow}>Use them, don’t lose them</Text>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Vouchers</Text>
                <Pressable onPress={() => navigation.navigate('Vouchers')} accessibilityRole="button">
                  <Text style={styles.seeAll}>See all</Text>
                </Pressable>
              </View>
            </View>

            {previewVouchers.map((v, i) => (
              <CouponCard
                key={v.id}
                voucher={v}
                tagged={i === 0}
                onPress={() => navigation.navigate('VoucherDetail', { voucherId: v.id })}
              />
            ))}

            <View>
              <Text style={styles.eyebrow}>Points don’t earn themselves</Text>
              <Text style={styles.sectionTitle}>Get more points</Text>
            </View>
            <View style={styles.earnGrid}>
              {orderedEarn.map((action) => {
                const copy = EARN_COPY[action.id];
                const done =
                  (action.oneTime && !!user.earnActionsCompleted[action.id]) ||
                  (action.kind === 'beauty' &&
                    !!action.category &&
                    !!user.beautyProfiles[action.category]) ||
                  (action.kind === 'checkin' && user.checkedInToday);
                return (
                  <PressableScale
                    key={action.id}
                    onPress={() => runEarn(action)}
                    disabled={done && action.kind !== 'beauty'}
                    style={[styles.earnCell, done && styles.earnCellDone]}
                    accessibilityLabel={copy?.title ?? action.title}
                  >
                    <View style={[styles.earnWell, { backgroundColor: copy?.well ?? colors.yellowSoft }]}>
                      <FranIcon name={action.icon as FranIconName} size={18} color={colors.brown} />
                    </View>
                    <Text style={styles.earnTitle}>{copy?.title ?? action.title}</Text>
                    <Text style={styles.earnSub}>
                      {done && action.kind !== 'beauty'
                        ? 'Done'
                        : copy?.sub(action.points) ?? `+${action.points} points`}
                    </Text>
                    <View style={styles.earnCta}>
                      <Text style={styles.earnCtaText}>
                        {done && action.kind === 'beauty'
                          ? 'View'
                          : done
                            ? 'Done'
                            : (copy?.cta ?? 'Go')}
                      </Text>
                      {!done ? <FranIcon name="arrowRight" size={12} color={colors.brown} /> : null}
                    </View>
                  </PressableScale>
                );
              })}
            </View>
          </>
        ) : (
          <>
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>{`WHAT’S THE POINT\nIF YOU’RE NOT HAVING\nFRAN`}</Text>
              <Pressable
                onPress={() => openOnboarding('signup')}
                style={styles.heroCta}
                accessibilityRole="button"
              >
                <Text style={styles.heroCtaText}>Sign up and start your rewards</Text>
              </Pressable>
            </View>

            <View>
              <Text style={styles.eyebrow}>Better with Fran</Text>
              <Text style={styles.sectionTitle}>What you’ll unlock</Text>
            </View>
            <View style={styles.unlockList}>
              {UNLOCKS.map((u) => (
                <View key={u.title} style={styles.unlockRow}>
                  <View style={styles.unlockIcon}>
                    <FranIcon name={u.icon} size={18} color={colors.brown} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.unlockTitle}>{u.title}</Text>
                    <Text style={styles.unlockBody}>{u.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function CouponCard({
  voucher,
  tagged,
  onPress,
}: {
  voucher: Voucher;
  tagged: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress} style={styles.coupon} accessibilityLabel={voucher.title}>
      {tagged ? (
        <View style={styles.couponTag}>
          <Text style={styles.couponTagText}>Expiring soon</Text>
        </View>
      ) : null}
      <View style={styles.couponInner}>
        <View style={styles.couponValue}>
          <Text style={styles.couponAmount}>{voucher.valueLabel}</Text>
          <Text style={styles.couponOff}>OFF</Text>
        </View>
        <View style={styles.couponPerf}>
          {Array.from({ length: 10 }).map((_, i) => (
            <View key={i} style={styles.couponDot} />
          ))}
        </View>
        <View style={styles.couponCopy}>
          <Text style={styles.couponTitle}>{voucher.title}</Text>
          <Text style={styles.couponMeta}>
            {voucher.expiresAt ? `Valid until ${voucher.expiresAt}` : voucher.description}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  benefits: {
    ...typography.h2,
    color: colors.blue,
    marginBottom: 1,
  },
  pointsCard: {
    borderWidth: 1,
    borderColor: colors.brownSoft,
    borderRadius: radius.sm,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    gap: 6,
  },
  pointsTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  status: { ...typography.caption },
  pointsValue: { ...typography.h1, fontSize: 32, lineHeight: 36 },
  track: {
    height: 11,
    borderRadius: 8,
    backgroundColor: colors.surfaceSunken,
    marginTop: spacing.sm,
    overflow: 'visible',
    justifyContent: 'center',
  },
  trackFill: {
    height: 11,
    borderRadius: 8,
    backgroundColor: colors.brownSoft,
  },
  trackDot: {
    position: 'absolute',
    top: -4,
    marginLeft: -8,
  },
  tierRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  tierLabel: { ...typography.micro },
  tierHint: { ...typography.micro, color: colors.inkSoft },
  benefitsToggle: {
    marginTop: spacing.sm,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.sm,
    padding: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  benefitsToggleText: { ...typography.micro, color: colors.ink },
  benefitsList: { gap: 4, paddingHorizontal: spacing.xs },
  benefitLine: { ...typography.micro },
  expireCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  expireIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expireTitle: { ...typography.captionBold, color: colors.ink },
  expireSub: { ...typography.micro },
  eyebrow: {
    ...typography.eyebrow,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...typography.h2 },
  seeAll: { ...typography.captionBold, color: colors.brown },
  coupon: {
    backgroundColor: colors.yellow,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  couponInner: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 104,
  },
  couponValue: {
    width: 88,
    paddingLeft: spacing.lg,
    paddingVertical: spacing.md,
  },
  couponAmount: {
    fontFamily: fonts.bodySemi,
    fontSize: 26,
    lineHeight: 32,
    color: colors.brown,
  },
  couponOff: { ...typography.body, color: colors.brown },
  couponPerf: {
    width: 8,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
    paddingVertical: 10,
  },
  couponDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.brownSoft,
  },
  couponCopy: { flex: 1, paddingRight: spacing.lg, paddingVertical: spacing.md },
  couponTitle: { ...typography.captionBold, textTransform: 'uppercase', color: colors.brown },
  couponMeta: { ...typography.micro, color: colors.brownSoft, marginTop: 4 },
  couponTag: {
    position: 'absolute',
    top: 8,
    right: 10,
    zIndex: 1,
    backgroundColor: colors.blueSoft,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  couponTagText: { ...typography.micro, color: colors.brown },
  earnGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  earnCell: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.brown,
    borderRadius: radius.sm,
    padding: spacing.md,
    minHeight: 168,
    gap: 6,
  },
  earnCellDone: { opacity: 0.7 },
  earnWell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnTitle: { ...typography.captionBold },
  earnSub: { ...typography.micro, flex: 1 },
  earnCta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  earnCtaText: { ...typography.captionBold },
  hero: {
    backgroundColor: colors.blue,
    borderRadius: radius.sm,
    padding: spacing.xl,
    gap: spacing.xxl,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.yellow,
    textTransform: 'uppercase',
    fontSize: 28,
    lineHeight: 32,
  },
  heroCta: {
    backgroundColor: colors.yellow,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  heroCtaText: { ...typography.captionBold, color: colors.brown },
  unlockList: { gap: spacing.md },
  unlockRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  unlockIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockTitle: { ...typography.captionBold },
  unlockBody: { ...typography.micro },
});
