import { Text } from '../../components/ThemedText';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { FranLogo } from '../../components/FranLogo';
import { Badge, Button, Card, Screen, SectionTitle } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { bundleBanners, promoBanners, WEEK_LABELS } from '../../data/mock';
import { ContentWidth } from '../../layout/ContentWidth';
import { useLayout } from '../../layout/useLayout';
import type { RootStackParamList } from '../../types';
import { colors, fonts, radius, shadow, spacing, typography } from '../../theme';

export function DiscoverScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, checkIn } = useUser();
  const { gutter, bannerWidth, bannerHeight, listColumns, useSplitPanels } = useLayout();
  const [page, setPage] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / bannerWidth);
    setPage(i);
  };

  const onCheckIn = async () => {
    const result = await checkIn();
    if (!result) {
      Alert.alert('Already checked in', "You're all set for today. Come back tomorrow!");
      return;
    }
    Alert.alert(
      'Checked in!',
      `+${result.awarded} point${result.freezeAwarded ? '\nStreak freeze earned!' : ''}`,
    );
  };

  return (
    <Screen padded={false} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ContentWidth flex={false} style={{ paddingHorizontal: gutter }}>
          <View style={styles.topBar}>
            <FranLogo height={28} />
            <Text style={styles.hello}>Hello, {user.name}</Text>
          </View>
        </ContentWidth>

        {/* Promo slideshow — width follows fold/unfold */}
        <ContentWidth flex={false}>
          <FlatList
            key={`banner-${bannerWidth}`}
            ref={listRef}
            data={promoBanners}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: gutter }}
            snapToInterval={bannerWidth}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigation.navigate('PromoDetail', { promoId: item.id })}
                style={{ width: bannerWidth }}
              >
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.banner, { height: bannerHeight }]}
                >
                  {item.badge ? (
                    <View style={styles.bannerBadge}>
                      <Text style={styles.bannerBadgeText}>{item.badge}</Text>
                    </View>
                  ) : null}
                  <View style={{ flex: 1 }} />
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerSub}>{item.subtitle}</Text>
                  {item.ctaLabel ? (
                    <View style={styles.bannerCta}>
                      <Text style={styles.bannerCtaText}>{item.ctaLabel}</Text>
                    </View>
                  ) : null}
                </LinearGradient>
              </Pressable>
            )}
          />
          <View style={styles.dots}>
            {promoBanners.map((_, i) => (
              <View key={i} style={[styles.dot, i === page && styles.dotOn]} />
            ))}
          </View>
        </ContentWidth>

        <ContentWidth flex={false} style={{ paddingHorizontal: gutter }}>
          <View style={useSplitPanels ? styles.splitRow : undefined}>
            <Card style={[styles.pointsCard, useSplitPanels && styles.splitHalf]}>
              <Pressable
                onPress={() => navigation.navigate('Transactions')}
                style={styles.pointsRow}
              >
                <View>
                  <Text style={styles.pointsLabel}>Your points</Text>
                  <Text style={styles.pointsValue}>{user.points}</Text>
                  {user.pointsExpiringSoon > 0 && user.tier === 1 ? (
                    <Pressable onPress={() => navigation.navigate('ExpiringPoints')}>
                      <Text style={styles.expiring}>
                        {user.pointsExpiringSoon} points expiring soon ›
                      </Text>
                    </Pressable>
                  ) : (
                    <Text style={styles.expiringMuted}>
                      {user.tier >= 2 ? 'Points never expire on your tier' : 'Tap for history'}
                    </Text>
                  )}
                </View>
                <View style={styles.pointsIcon}>
                  <Ionicons name="diamond-outline" size={28} color={colors.brown} />
                </View>
              </Pressable>
            </Card>

            <Card style={[styles.checkInCard, useSplitPanels && styles.splitHalf]}>
              <View style={styles.streakHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.streakTitle}>
                    {user.streakCount}-day win streak 🔥
                  </Text>
                  <Text style={styles.streakSub}>
                    {user.checkedInToday ? "You're on fire today!" : 'Check in to keep it going'}
                  </Text>
                </View>
                <View style={styles.freezeRow}>
                  {[0, 1].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.freeze,
                        i < user.streakFreezes ? styles.freezeOn : styles.freezeOff,
                      ]}
                    >
                      <Ionicons
                        name="snow-outline"
                        size={14}
                        color={i < user.streakFreezes ? colors.info : colors.muted}
                      />
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.weekRow}>
                {WEEK_LABELS.map((label, i) => {
                  const done = user.checkedInDays[i];
                  return (
                    <View key={`${label}-${i}`} style={styles.dayCol}>
                      <Text style={styles.dayLabel}>{label}</Text>
                      <View style={[styles.dayDot, done && styles.dayDotOn]}>
                        {done ? (
                          <Ionicons name="checkmark" size={14} color={colors.brown} />
                        ) : null}
                      </View>
                    </View>
                  );
                })}
              </View>

              <Text style={styles.freezeHint}>
                Streak freezes {user.streakFreezes}/2 · earn one every 7 consecutive days
              </Text>

              <Button
                title={user.checkedInToday ? 'Checked in today' : 'Check in for +1 point'}
                onPress={onCheckIn}
                disabled={user.checkedInToday}
                icon="flame"
                style={{ marginTop: spacing.md }}
              />
            </Card>
          </View>

          <SectionTitle title="Member exclusive bundles" />
          <View style={listColumns > 1 ? styles.bundleGrid : undefined}>
            {bundleBanners.map((b) => (
              <Pressable
                key={b.id}
                onPress={() => navigation.navigate('PromoDetail', { promoId: 'promo_1' })}
                style={[
                  styles.bundle,
                  { borderLeftColor: b.color },
                  shadow.sm,
                  listColumns > 1 && styles.bundleHalf,
                ]}
              >
                {b.badge ? <Badge label={b.badge} /> : null}
                <Text style={styles.bundleTitle}>{b.title}</Text>
                <Text style={styles.bundleSub}>{b.subtitle}</Text>
              </Pressable>
            ))}
          </View>
        </ContentWidth>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.huge },
  topBar: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  hello: { ...typography.h2, color: colors.ink, marginTop: spacing.sm },
  banner: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginRight: 0,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brown,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  bannerBadgeText: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
    letterSpacing: 0.5,
    color: colors.yellow,
    textTransform: 'uppercase',
  },
  bannerTitle: {
    ...typography.h1,
    color: colors.brown,
    marginBottom: spacing.sm,
  },
  bannerSub: {
    ...typography.body,
    color: colors.brownSoft,
    marginBottom: spacing.lg,
  },
  bannerCta: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brown,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  bannerCtaText: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.yellow,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
  },
  dotOn: {
    width: 18,
    backgroundColor: colors.yellow,
  },
  splitRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'stretch',
  },
  splitHalf: {
    flex: 1,
    marginTop: spacing.md,
  },
  pointsCard: { marginTop: spacing.md },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLabel: { ...typography.caption, color: colors.muted },
  pointsValue: { ...typography.hero, color: colors.brown, marginTop: 2 },
  expiring: { ...typography.captionBold, color: colors.warning, marginTop: spacing.xs },
  expiringMuted: { ...typography.caption, color: colors.muted, marginTop: spacing.xs },
  pointsIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInCard: { marginTop: spacing.md },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  streakTitle: { ...typography.h3, color: colors.streak },
  streakSub: { ...typography.caption, color: colors.muted, marginTop: 2 },
  freezeRow: { flexDirection: 'row', gap: 6 },
  freeze: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  freezeOn: {
    backgroundColor: '#E8F2F8',
    borderColor: colors.info,
  },
  freezeOff: {
    backgroundColor: colors.cream,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: { alignItems: 'center', gap: 6 },
  dayLabel: { ...typography.micro, color: colors.muted },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotOn: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellowDeep,
  },
  freezeHint: {
    ...typography.caption,
    color: colors.muted,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  bundleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  bundle: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bundleHalf: {
    flexGrow: 1,
    flexBasis: '46%',
    marginBottom: 0,
  },
  bundleTitle: { ...typography.bodyBold, color: colors.ink, marginTop: spacing.sm },
  bundleSub: { ...typography.caption, color: colors.muted, marginTop: 2 },
});
