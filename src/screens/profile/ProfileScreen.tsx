import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import {
  Badge,
  Card,
  ListRow,
  PressableScale,
  ProgressBar,
  Screen,
  SectionTitle,
} from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { earnActions, tiers } from '../../data/mock';
import { categoryLabels } from '../../data/quizQuestions';
import { useLayout } from '../../layout/useLayout';
import type { BeautyCategory, RootStackParamList } from '../../types';
import { colors, press, radius, shadow, spacing, tint, typography } from '../../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, availableVoucherCount, signOut } = useUser();
  const { gutter, earnTileWidth, earnGap } = useLayout();
  const [earnOpen, setEarnOpen] = useState(true);
  const tierInfo = tiers.find((t) => t.tier === user.tier)!;
  const nextTier = tiers.find((t) => t.tier === ((user.tier + 1) as 1 | 2 | 3));
  const spendToNext = nextTier ? Math.max(0, nextTier.spendRequired - user.yearlySpend) : 0;
  const progress =
    nextTier && nextTier.spendRequired > 0
      ? Math.min(1, user.yearlySpend / nextTier.spendRequired)
      : 1;

  const beautyCats: BeautyCategory[] = ['skin', 'makeup', 'hair', 'lifestyle'];
  const beautyDone = beautyCats.filter((c) => !!user.beautyProfiles[c]).length;

  return (
    <Screen padded={false} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: gutter }}>
          <Text style={styles.pageEyebrow}>Membership</Text>
          <Text style={styles.pageTitle}>Profile</Text>

          {/* Tier card */}
          <PressableScale
            onPress={() => navigation.navigate('MembershipTiers')}
            scaleTo={press.scaleLarge}
            accessibilityLabel={`${tierInfo.name}, view benefits`}
            style={[styles.tierCard, { backgroundColor: tierInfo.bgColor }, shadow.md]}
          >
            <View style={[styles.tierBloom, { backgroundColor: tierInfo.color }]} />
            <View style={styles.tierTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tierEyebrow}>Your tier</Text>
                <Text style={[styles.tierName, { color: tierInfo.color }]}>{tierInfo.name}</Text>
                <View style={styles.benefitsRow}>
                  <Text style={styles.viewBenefits}>View my benefits</Text>
                  <FranIcon name="chevronRight" size={13} color={colors.inkSoft} />
                </View>
                {user.tierExpiresAt ? (
                  <Text style={styles.expires}>Expires on {user.tierExpiresAt}</Text>
                ) : null}
              </View>
              <View style={[styles.tierBadge, { backgroundColor: tierInfo.color }]}>
                <Text style={styles.tierBadgeText}>T{user.tier}</Text>
              </View>
            </View>

            {/* Progress tracker Tier 1–3 */}
            <View style={styles.track}>
              {tiers.map((t, i) => {
                const active = user.tier >= t.tier;
                return (
                  <React.Fragment key={t.tier}>
                    <View style={styles.trackNode}>
                      <View
                        style={[
                          styles.node,
                          active && { backgroundColor: t.color, borderColor: t.color },
                        ]}
                      >
                        {active ? (
                          <FranIcon name="check" size={13} color={colors.brown} />
                        ) : (
                          <Text style={styles.nodeNum}>{t.tier}</Text>
                        )}
                      </View>
                      <Text style={[styles.nodeLabel, active && styles.nodeLabelOn]}>{t.name}</Text>
                    </View>
                    {i < tiers.length - 1 ? (
                      <View
                        style={[
                          styles.trackLine,
                          user.tier > t.tier && { backgroundColor: colors.yellowDeep },
                        ]}
                      />
                    ) : null}
                  </React.Fragment>
                );
              })}
            </View>

            {nextTier ? (
              <View style={styles.spendBarWrap}>
                <ProgressBar value={progress} height={8} />
                <View style={styles.spendRow}>
                  <Text style={styles.spendHint}>
                    ${spendToNext} more to unlock {nextTier.name}
                  </Text>
                  <Text style={styles.spendNow}>${user.yearlySpend}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.spendHint}>You're at the top tier — enjoy the perks!</Text>
            )}
          </PressableScale>

          {/* Points + vouchers */}
          <View style={styles.statsRow}>
            <PressableScale
              style={[styles.statCard, shadow.sm]}
              onPress={() => navigation.navigate('Transactions')}
              accessibilityLabel={`${user.points} points, view history`}
            >
              <View style={styles.statHead}>
                <Text style={styles.statLabel}>Points</Text>
                <FranIcon name="gem" size={13} color={colors.yellowDeep} />
              </View>
              <Text style={styles.statValue}>{user.points}</Text>
              {user.pointsExpiringSoon > 0 && user.tier === 1 ? (
                <Pressable
                  onPress={() => navigation.navigate('ExpiringPoints')}
                  style={styles.statWarnChip}
                >
                  <Text style={styles.statWarn}>{user.pointsExpiringSoon} expiring</Text>
                </Pressable>
              ) : (
                <Text style={styles.statMuted}>Tap for history</Text>
              )}
            </PressableScale>
            <PressableScale
              style={[styles.statCard, shadow.sm]}
              onPress={() => navigation.navigate('Vouchers')}
              accessibilityLabel={`${availableVoucherCount} vouchers available`}
            >
              <View style={styles.statHead}>
                <Text style={styles.statLabel}>Vouchers</Text>
                <FranIcon name="ticket" size={13} color={colors.blue} />
              </View>
              <Text style={styles.statValue}>{availableVoucherCount}</Text>
              <Text style={styles.statMuted}>Available to use</Text>
            </PressableScale>
          </View>

          {/* More ways to earn — collapsible */}
          <Pressable
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setEarnOpen((v) => !v);
            }}
            accessibilityRole="button"
            accessibilityState={{ expanded: earnOpen }}
            style={styles.collapseHeader}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionEyebrow}>Quick wins</Text>
              <Text style={styles.sectionH}>More ways to earn points</Text>
            </View>
            <View style={styles.chevronWell}>
              <FranIcon
                name={earnOpen ? 'chevronUp' : 'chevronDown'}
                size={17}
                color={colors.brown}
              />
            </View>
          </Pressable>
          {earnOpen ? (
            <View style={[styles.earnGrid, { gap: earnGap }]}>
              {earnActions.map((a) => {
                const done = a.oneTime && !!user.earnActionsCompleted[a.id];
                return (
                  <PressableScale
                    key={a.id}
                    disabled={done}
                    accessibilityLabel={`${a.title}, ${done ? 'done' : `plus ${a.points} points`}`}
                    onPress={() => {
                      if (a.kind === 'checkin') {
                        // switch tab — navigate parent
                        navigation.navigate('Discover');
                        return;
                      }
                      if (a.kind === 'birthday') {
                        navigation.navigate('BirthdayModal');
                        return;
                      }
                      if (a.kind === 'beauty' && a.category) {
                        navigation.navigate('Quiz', { category: a.category });
                        return;
                      }
                      if (a.kind === 'social') {
                        navigation.navigate('EarnPoints');
                      }
                    }}
                    style={[styles.earnItem, { width: earnTileWidth }, done && styles.earnItemDone]}
                  >
                    <View style={[styles.earnIcon, done && styles.earnIconDone]}>
                      <FranIcon
                        name={a.icon as any}
                        size={19}
                        color={done ? colors.brownMuted : colors.brown}
                      />
                    </View>
                    <Text style={[styles.earnTitle, done && styles.earnDoneText]} numberOfLines={2}>
                      {a.title}
                    </Text>
                    {done ? (
                      <View style={styles.earnDonePill}>
                        <FranIcon name="check" size={11} color={colors.success} />
                        <Text style={styles.earnDoneLabel}>Done</Text>
                      </View>
                    ) : (
                      <Text style={styles.earnPts}>+{a.points}</Text>
                    )}
                  </PressableScale>
                );
              })}
            </View>
          ) : null}

          <SectionTitle
            eyebrow={`${beautyDone} of ${beautyCats.length} complete`}
            title="My beauty profile"
            actionLabel="See all"
            onAction={() => navigation.navigate('BeautyProfile')}
          />
          <Card padded={false} style={styles.beautyCard}>
            {beautyCats.map((cat, i) => {
              const done = !!user.beautyProfiles[cat];
              return (
                <Pressable
                  key={cat}
                  onPress={() =>
                    done
                      ? navigation.navigate('BeautyResults', { category: cat })
                      : navigation.navigate('Quiz', { category: cat })
                  }
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.beautyRow,
                    i < beautyCats.length - 1 && styles.beautyBorder,
                    pressed && { backgroundColor: tint.inkFaint },
                  ]}
                >
                  <View style={[styles.beautyDot, done && styles.beautyDotOn]} />
                  <Text style={styles.beautyName}>{categoryLabels[cat]}</Text>
                  <View style={styles.beautyRight}>
                    <Badge
                      label={done ? 'Completed' : '+15 pts'}
                      tone={done ? 'success' : 'primary'}
                    />
                    <FranIcon name="chevronRight" size={15} color={colors.borderStrong} />
                  </View>
                </Pressable>
              );
            })}
          </Card>

          <SectionTitle title="Wallet & rewards" />
          <Card padded={false} style={styles.beautyCard}>
            <ListRow
              icon="ticket"
              title="Vouchers"
              subtitle="Wallet and redemptions"
              onPress={() => navigation.navigate('Vouchers')}
            />
            <ListRow
              icon="flame"
              title="Daily check-in"
              subtitle="Streaks and points"
              onPress={() => navigation.navigate('Discover')}
            />
          </Card>

          <SectionTitle title="Account" />
          <Card padded={false} style={styles.beautyCard}>
            <ListRow
              icon="person"
              title="My details"
              subtitle="Name, contact and birthday"
              onPress={() => navigation.navigate('MyDetails')}
            />
            <ListRow
              icon="receipt"
              title="Purchase history"
              onPress={() => navigation.navigate('PurchaseHistory')}
            />
            <ListRow
              icon="pin"
              title="Store locator"
              onPress={() => navigation.navigate('StoreLocator')}
            />
            <ListRow icon="help" title="FAQ" onPress={() => navigation.navigate('Faq')} />
            <ListRow
              icon="chat"
              title="My feedback"
              onPress={() => navigation.navigate('Feedback')}
            />
            <ListRow
              icon="shield"
              title="Privacy"
              onPress={() => navigation.navigate('Privacy')}
            />
            <ListRow
              icon="logout"
              title="Log out"
              danger
              onPress={() =>
                Alert.alert('Log out', 'Sign out of this device?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Log out', style: 'destructive', onPress: () => void signOut() },
                ])
              }
            />
          </Card>

          <Card tone="sunken" elevation="none" style={styles.comingSoon}>
            <View style={styles.comingSoonRow}>
              <FranIcon name="glow" size={18} color={colors.brownMuted} />
              <Text style={styles.comingSoonTitle}>My recommendations</Text>
              <Badge label="Soon" tone="muted" />
            </View>
            <Text style={styles.comingSoonSub}>
              Personalized picks from your beauty profile, coming shortly.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.huge },
  pageEyebrow: { ...typography.eyebrow, marginTop: spacing.md },
  pageTitle: { ...typography.h1, marginTop: 4, marginBottom: spacing.xl },
  tierCard: {
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  tierBloom: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.14,
  },
  tierTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  tierEyebrow: { ...typography.eyebrow, color: colors.brownMuted },
  tierName: { ...typography.h1, marginTop: 3 },
  benefitsRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  viewBenefits: { ...typography.captionBold, color: colors.inkSoft },
  expires: { ...typography.micro, marginTop: 3 },
  tierBadge: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierBadgeText: { ...typography.bodyBold, color: colors.brown },
  track: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  trackNode: { alignItems: 'center', width: 64 },
  node: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: tint.inkLine,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeNum: { ...typography.micro, color: colors.brownMuted },
  nodeLabel: { ...typography.micro, marginTop: 5 },
  nodeLabelOn: { color: colors.ink },
  trackLine: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: tint.inkLine,
    marginTop: 13,
  },
  spendBarWrap: { gap: spacing.sm },
  spendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  spendHint: { ...typography.caption, color: colors.inkSoft, flex: 1 },
  spendNow: { ...typography.captionBold, color: colors.brown },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  statHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statLabel: { ...typography.eyebrow },
  statValue: { ...typography.hero, color: colors.brown, marginTop: 4 },
  statWarnChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warningSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  statWarn: { ...typography.micro, color: colors.warning },
  statMuted: { ...typography.micro, marginTop: spacing.sm },
  collapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  sectionEyebrow: { ...typography.eyebrow, marginBottom: 3 },
  sectionH: { ...typography.h3 },
  chevronWell: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  earnItem: {
    // minHeight rather than aspectRatio — a fixed ratio clips the icon + two
    // lines of label once tiles get narrow at 4 or 5 columns.
    minHeight: 118,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  earnItemDone: {
    backgroundColor: colors.surfaceSunken,
    borderColor: 'transparent',
  },
  earnIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnIconDone: { backgroundColor: colors.border },
  earnTitle: {
    ...typography.micro,
    color: colors.ink,
    textAlign: 'center',
  },
  earnPts: { ...typography.captionBold, color: colors.brown },
  earnDoneText: { color: colors.brownMuted },
  earnDonePill: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  earnDoneLabel: { ...typography.micro, color: colors.success },
  beautyCard: { overflow: 'hidden' },
  beautyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  beautyBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  beautyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  beautyDotOn: { backgroundColor: colors.success },
  beautyName: { ...typography.title, flex: 1 },
  beautyRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  comingSoon: { marginTop: spacing.lg },
  comingSoonRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  comingSoonTitle: { ...typography.title, color: colors.inkSoft, flex: 1 },
  comingSoonSub: { ...typography.caption, marginTop: spacing.sm },
});
