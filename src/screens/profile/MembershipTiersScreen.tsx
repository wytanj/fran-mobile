import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { tiers } from '../../data/mock';
import type { RootStackParamList, TierInfo } from '../../types';
import { colors, radius, spacing, tint, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MembershipTiers'>;

/**
 * Membership tier detail — Figma Rewards row (~45:3491 / 45:3583 / 45:3684).
 * CoS note: TODO cited 45:3439 (points txn sibling); tier phones are the Tiers titled frames.
 * Paint with Fran tokens only (no Figma hex rematch).
 */
export function MembershipTiersScreen({ navigation }: Props) {
  const { user } = useUser();
  const [selected, setSelected] = useState(user.tier);
  const tier = useMemo(
    () => tiers.find((t) => t.tier === selected) ?? tiers[0],
    [selected],
  );
  const isCurrent = tier.tier === user.tier;
  const spendMarkers = [0, 500, 1250];
  const maxSpend = spendMarkers[spendMarkers.length - 1];
  const progress = Math.min(1, user.yearlySpend / maxSpend);
  const remaining = Math.max(0, tier.spendRequired - user.yearlySpend);

  return (
    <Screen edges={['top', 'bottom']}>
      <Header title="Tiers" onBack={() => navigation.goBack()} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.statusCard, { backgroundColor: tier.bgColor }]}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{tier.name}</Text>
          </View>
          <Text style={styles.statusEyebrow}>
            {isCurrent ? 'Your Current Status' : 'Next Status'}
          </Text>
          {!isCurrent && tier.spendRequired > 0 ? (
            <Text style={styles.statusHint}>
              Spend ${remaining} more to unlock {tier.name}
            </Text>
          ) : null}

          <View style={styles.track}>
            <View style={[styles.trackFill, { width: `${Math.max(4, progress * 100)}%` }]} />
          </View>
          <View style={styles.markers}>
            {spendMarkers.map((m) => (
              <Text key={m} style={styles.marker}>
                ${m}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.perks}>
          {tier.perks.map((p) => (
            <View key={p.title} style={styles.perkRow}>
              <FranIcon name="checkCircle" size={22} color={colors.brown} />
              <View style={{ flex: 1 }}>
                <Text style={styles.perkTitle}>{p.title}</Text>
                {p.body ? <Text style={styles.perkBody}>{p.body}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.carousel}>
        {tiers.map((t) => (
          <TierChip
            key={t.tier}
            tier={t}
            selected={t.tier === selected}
            onPress={() => setSelected(t.tier)}
          />
        ))}
      </View>
    </Screen>
  );
}

function TierChip({
  tier,
  selected,
  onPress,
}: {
  tier: TierInfo;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        { backgroundColor: tier.bgColor },
        selected && styles.chipSelected,
      ]}
    >
      {selected ? (
        <View style={styles.chipArrow}>
          <FranIcon name="chevronUp" size={14} color={colors.brown} />
        </View>
      ) : (
        <View style={{ height: 18 }} />
      )}
      <Text style={styles.chipLabel}>{tier.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  statusCard: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.brown,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  statusBadgeText: {
    ...typography.captionBold,
    color: colors.brown,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statusEyebrow: {
    ...typography.h2,
    color: colors.brown,
    marginTop: spacing.xs,
  },
  statusHint: {
    ...typography.micro,
    color: colors.brownSoft,
  },
  track: {
    height: 10,
    borderRadius: 8,
    backgroundColor: tint.inkTrack,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  trackFill: {
    height: 10,
    borderRadius: 8,
    backgroundColor: colors.brown,
  },
  markers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  marker: {
    ...typography.micro,
    color: colors.brownSoft,
  },
  perks: {
    gap: spacing.lg,
  },
  perkRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  perkTitle: {
    ...typography.captionBold,
    color: colors.ink,
  },
  perkBody: {
    ...typography.micro,
    color: colors.inkSoft,
    marginTop: 2,
  },
  carousel: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  chip: {
    flex: 1,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.brown,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    minHeight: 72,
    justifyContent: 'flex-end',
  },
  chipSelected: {
    borderWidth: 2,
  },
  chipArrow: {
    marginBottom: 4,
  },
  chipLabel: {
    ...typography.captionBold,
    color: colors.brown,
    textAlign: 'center',
  },
});
