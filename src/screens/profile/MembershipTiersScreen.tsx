import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { tiers } from '../../data/mock';
import type { RootStackParamList, TierInfo } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

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
      <View style={styles.dots}>
        {tiers.map((t, i) => (
          <View key={t.tier} style={[styles.dot, i === index && styles.dotOn]} />
        ))}
      </View>
    </Screen>
  );
}

function TierSlide({ tier, isCurrent }: { tier: TierInfo; isCurrent: boolean }) {
  return (
    <View style={[styles.card, { width: CARD_W - spacing.sm, backgroundColor: tier.bgColor }]}>
      <View style={styles.top}>
        {isCurrent ? (
          <View style={styles.myTier}>
            <Text style={styles.myTierText}>MY TIER</Text>
          </View>
        ) : (
          <View style={{ height: 22 }} />
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
        <Text style={styles.metaLabel}>Earn rate</Text>
        <Text style={styles.metaValue}>$1 = {tier.pointsPerDollar} pts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginRight: spacing.sm,
    minHeight: 420,
    borderWidth: 1,
    borderColor: colors.border,
  },
  top: { marginBottom: spacing.xl },
  myTier: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  myTierText: { ...typography.micro, color: colors.white },
  name: { ...typography.hero },
  spend: { ...typography.body, color: colors.inkSoft, marginTop: spacing.sm },
  perks: { gap: spacing.md, flex: 1 },
  perkRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  perkText: { ...typography.body, color: colors.ink, flex: 1 },
  meta: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: { ...typography.caption, color: colors.muted },
  metaValue: { ...typography.bodyBold, color: colors.ink },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.xl,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.borderStrong },
  dotOn: { width: 18, backgroundColor: colors.yellow },
});
