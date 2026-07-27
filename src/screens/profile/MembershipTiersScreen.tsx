import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { Dots, Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { tiers } from '../../data/mock';
import type { RootStackParamList, TierInfo } from '../../types';
import { colors, radius, shadow, spacing, tint, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MembershipTiers'>;

const { width } = Dimensions.get('window');
const CARD_W = width - spacing.lg * 2;

export function MembershipTiersScreen({ navigation }: Props) {
  const { user } = useUser();
  const [index, setIndex] = useState(user.tier - 1);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / CARD_W));
  };

  return (
    <Screen padded={false} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg }}>
        <Header title="Membership tiers" onBack={() => navigation.goBack()} />
      </View>
      <FlatList
        data={tiers}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(t) => String(t.tier)}
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
        snapToInterval={CARD_W}
        decelerationRate="fast"
        initialScrollIndex={user.tier - 1}
        getItemLayout={(_, i) => ({ length: CARD_W, offset: CARD_W * i, index: i })}
        renderItem={({ item }) => <TierSlide tier={item} isCurrent={item.tier === user.tier} />}
      />
      <Dots count={tiers.length} index={index} style={styles.dots} />
    </Screen>
  );
}

function TierSlide({ tier, isCurrent }: { tier: TierInfo; isCurrent: boolean }) {
  return (
    <View
      style={[
        styles.card,
        { width: CARD_W - spacing.sm, backgroundColor: tier.bgColor },
        isCurrent && { borderColor: tier.color, borderWidth: 2 },
        shadow.sm,
      ]}
    >
      <View style={[styles.bloom, { backgroundColor: tier.color }]} pointerEvents="none" />
      <View style={styles.top}>
        {isCurrent ? (
          <View style={styles.myTier}>
            <Ionicons name="star" size={9} color={colors.yellow} />
            <Text style={styles.myTierText}>My tier</Text>
          </View>
        ) : (
          <View style={{ height: 23 }} />
        )}
        <Text style={[styles.name, { color: tier.color }]}>{tier.name}</Text>
        <Text style={styles.spend}>
          {tier.spendRequired === 0
            ? 'Open to all members'
            : `Spend $${tier.spendRequired}/year to qualify`}
        </Text>
      </View>
      <View style={styles.perks}>
        {tier.perks.map((p) => (
          <View key={p} style={styles.perkRow}>
            <Ionicons name="checkmark-circle" size={18} color={tier.color} />
            <Text style={styles.perkText}>{p}</Text>
          </View>
        ))}
      </View>
      <View style={styles.meta}>
        <View>
          <Text style={styles.metaLabel}>Earn rate</Text>
          <Text style={styles.metaValue}>$1 = {tier.pointsPerDollar} pts</Text>
        </View>
        <View style={styles.metaRight}>
          <Text style={styles.metaLabel}>Points</Text>
          <Text style={styles.metaValue}>{tier.pointsExpire ? '12-month expiry' : 'Never expire'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    marginRight: spacing.sm,
    minHeight: 430,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
  },
  bloom: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.13,
  },
  top: { marginBottom: spacing.xl },
  myTier: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.brown,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  myTierText: {
    ...typography.micro,
    color: colors.yellow,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  name: { ...typography.hero },
  spend: { ...typography.body, color: colors.inkSoft, marginTop: spacing.sm },
  perks: { gap: spacing.md, flex: 1 },
  perkRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  perkText: { ...typography.body, color: colors.ink, flex: 1 },
  meta: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tint.inkLine,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  metaRight: { alignItems: 'flex-end' },
  metaLabel: { ...typography.eyebrow, color: colors.brownMuted },
  metaValue: { ...typography.captionBold, marginTop: 3 },
  dots: {
    paddingVertical: spacing.xl,
  },
});
