import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, UIManager, View } from 'react-native';
import { Badge, Card, Screen, SectionTitle } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { earnActions, tiers } from '../../data/mock';
import { categoryLabels } from '../../data/quizQuestions';
import { useLayout } from '../../layout/useLayout';
import type { BeautyCategory, RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, availableVoucherCount } = useUser();
  const { gutter, earnColumns } = useLayout();
  const [earnOpen, setEarnOpen] = useState(true);
  const tierInfo = tiers.find((t) => t.tier === user.tier)!;
  const nextTier = tiers.find((t) => t.tier === ((user.tier + 1) as 1 | 2 | 3));
  const spendToNext = nextTier ? Math.max(0, nextTier.spendRequired - user.yearlySpend) : 0;
  const progress =
    nextTier && nextTier.spendRequired > 0
      ? Math.min(1, user.yearlySpend / nextTier.spendRequired)
      : 1;

  const beautyCats: BeautyCategory[] = ['skin', 'makeup', 'hair', 'lifestyle'];
  const earnTileWidth = `${Math.floor(100 / earnColumns) - 1}%` as `${number}%`;

  return (
    <Screen padded={false} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.pad, { paddingHorizontal: gutter }]}>
          <Text style={styles.pageTitle}>Profile</Text>

          {/* Tier card */}
          <Pressable onPress={() => navigation.navigate('MembershipTiers')}>
            <View style={[styles.tierCard, { backgroundColor: tierInfo.bgColor }, shadow.md]}>
              <View style={styles.tierTop}>
                <View>
                  <Text style={[styles.tierName, { color: tierInfo.color }]}>{tierInfo.name}</Text>
                  <Text style={styles.viewBenefits}>View my benefits ›</Text>
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
                            <Ionicons name="checkmark" size={12} color={colors.brown} />
                          ) : (
                            <Text style={styles.nodeNum}>{t.tier}</Text>
                          )}
                        </View>
                        <Text style={[styles.nodeLabel, active && { color: colors.ink }]}>
                          {t.name}
                        </Text>
                      </View>
                      {i < tiers.length - 1 ? (
                        <View
                          style={[
                            styles.trackLine,
                            user.tier > t.tier && { backgroundColor: colors.yellow },
                          ]}
                        />
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </View>

              {nextTier ? (
                <View style={styles.spendBarWrap}>
                  <View style={styles.spendBarBg}>
                    <View style={[styles.spendBarFill, { width: `${progress * 100}%` }]} />
                  </View>
                  <Text style={styles.spendHint}>
                    ${spendToNext} more to unlock {nextTier.name}
                  </Text>
                </View>
              ) : (
                <Text style={styles.spendHint}>You're at the top tier — enjoy the perks!</Text>
              )}
            </View>
          </Pressable>

          {/* Points + vouchers */}
          <View style={styles.statsRow}>
            <Pressable
              style={[styles.statCard, shadow.sm]}
              onPress={() => navigation.navigate('Transactions')}
            >
              <Text style={styles.statLabel}>Points</Text>
              <Text style={styles.statValue}>{user.points}</Text>
              {user.pointsExpiringSoon > 0 && user.tier === 1 ? (
                <Pressable onPress={() => navigation.navigate('ExpiringPoints')}>
                  <Text style={styles.statWarn}>{user.pointsExpiringSoon} expiring soon</Text>
                </Pressable>
              ) : (
                <Text style={styles.statMuted}>Tap for history</Text>
              )}
            </Pressable>
            <Pressable
              style={[styles.statCard, shadow.sm]}
              onPress={() => navigation.getParent()?.navigate('Vouchers' as never)}
            >
              <Text style={styles.statLabel}>Vouchers</Text>
              <Text style={styles.statValue}>{availableVoucherCount}</Text>
              <Text style={styles.statMuted}>Available to use</Text>
            </Pressable>
          </View>

          {/* More ways to earn — collapsible */}
          <Pressable
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setEarnOpen((v) => !v);
            }}
            style={styles.collapseHeader}
          >
            <Text style={styles.sectionH}>More ways to earn points</Text>
            <Ionicons
              name={earnOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.ink}
            />
          </Pressable>
          {earnOpen ? (
            <View style={styles.earnGrid}>
              {earnActions.map((a) => {
                const done = a.oneTime && !!user.earnActionsCompleted[a.id];
                return (
                  <Pressable
                    key={a.id}
                    disabled={done}
                    onPress={() => {
                      if (a.kind === 'checkin') {
                        // switch tab — navigate parent
                        navigation.getParent()?.navigate('Discover' as never);
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
                    style={[
                      styles.earnItem,
                      { width: earnTileWidth },
                      done && styles.earnItemDone,
                    ]}
                  >
                    <Ionicons
                      name={a.icon as any}
                      size={22}
                      color={done ? colors.disabled : colors.brown}
                    />
                    <Text style={[styles.earnTitle, done && styles.earnDoneText]} numberOfLines={2}>
                      {a.title}
                    </Text>
                    <Text style={[styles.earnPts, done && styles.earnDoneText]}>
                      {done ? 'Done' : `+${a.points}`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          <SectionTitle
            title="My beauty profile"
            actionLabel="See all"
            onAction={() => navigation.navigate('BeautyProfile')}
          />
          <Card>
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
                  style={[styles.beautyRow, i < beautyCats.length - 1 && styles.beautyBorder]}
                >
                  <Text style={styles.beautyName}>{categoryLabels[cat]}</Text>
                  <View style={styles.beautyRight}>
                    <Badge label={done ? 'Completed' : 'Not completed'} tone={done ? 'success' : 'muted'} />
                    <Ionicons name="chevron-forward" size={16} color={colors.muted} />
                  </View>
                </Pressable>
              );
            })}
          </Card>

          <Card style={{ marginTop: spacing.lg, opacity: 0.7 }}>
            <Text style={styles.comingSoonTitle}>My recommendations</Text>
            <Text style={styles.comingSoonSub}>Coming soon — personalized picks from your beauty profile.</Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.huge },
  pad: {},
  pageTitle: { ...typography.h1, color: colors.ink, marginBottom: spacing.lg, marginTop: spacing.sm },
  tierCard: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  tierTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  tierName: { ...typography.h2 },
  viewBenefits: { ...typography.captionBold, color: colors.inkSoft, marginTop: 4 },
  expires: { ...typography.caption, color: colors.muted, marginTop: 2 },
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
    marginBottom: spacing.lg,
  },
  trackNode: { alignItems: 'center', width: 64 },
  node: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeNum: { ...typography.micro, color: colors.muted },
  nodeLabel: { ...typography.micro, color: colors.muted, marginTop: 4 },
  trackLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.borderStrong,
    marginTop: 13,
  },
  spendBarWrap: { gap: spacing.sm },
  spendBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  spendBarFill: {
    height: '100%',
    backgroundColor: colors.yellow,
    borderRadius: 4,
  },
  spendHint: { ...typography.caption, color: colors.inkSoft },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: { ...typography.caption, color: colors.muted },
  statValue: { ...typography.h1, color: colors.brown, marginTop: 2 },
  statWarn: { ...typography.captionBold, color: colors.warning, marginTop: 4 },
  statMuted: { ...typography.caption, color: colors.muted, marginTop: 4 },
  collapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionH: { ...typography.h3, color: colors.ink },
  earnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  earnItem: {
    aspectRatio: 0.95,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  earnItemDone: {
    backgroundColor: colors.cream,
    opacity: 0.65,
  },
  earnTitle: {
    ...typography.micro,
    color: colors.ink,
    textAlign: 'center',
  },
  earnPts: { ...typography.captionBold, color: colors.brown },
  earnDoneText: { color: colors.muted },
  beautyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  beautyBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  beautyName: { ...typography.bodyBold, color: colors.ink },
  beautyRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  comingSoonTitle: { ...typography.bodyBold, color: colors.inkSoft },
  comingSoonSub: { ...typography.caption, color: colors.muted, marginTop: 4 },
});
