import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import {
  Badge,
  Button,
  Card,
  Dots,
  IconTile,
  PressableScale,
  Header,
  ProgressBar,
  Screen,
  SectionTitle,
} from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { bundleBanners, promoBanners, WEEK_LABELS } from '../../data/mock';
import { ContentWidth } from '../../layout/ContentWidth';
import { useLayout } from '../../layout/useLayout';
import type { RootStackParamList } from '../../types';
import { colors, fonts, press, radius, shadow, spacing, tint, typography } from '../../theme';
import { onFill } from '../../theme/contrast';

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

  // Freezes are earned every 7 consecutive days — show how close the next one is
  const freezeProgress = (user.streakCount % 7) / 7;
  const daysToFreeze = 7 - (user.streakCount % 7);

  return (
    <Screen padded={false} edges={['top']}>
      <Header title="Check-in" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ContentWidth flex={false} style={{ paddingHorizontal: gutter }}>
          <View style={styles.topBar}>
            <View style={styles.topBarRow}>
              <FranLogo height={26} variant="brown" />
              <Pressable
                style={styles.pointsPill}
                onPress={() => navigation.navigate('Transactions')}
                accessibilityRole="button"
                accessibilityLabel={`${user.points} points`}
              >
                <FranIcon name="gem" size={12} color={colors.brown} />
                <Text style={styles.pointsPillText}>{user.points}</Text>
              </Pressable>
            </View>
            <Text style={styles.helloEyebrow}>Welcome back</Text>
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
            renderItem={({ item }) => {
              // Copy sits over the gradient's end colour, so key contrast off that
              const on = onFill(item.gradient[1]);
              return (
                <PressableScale
                  onPress={() => navigation.navigate('PromoDetail', { promoId: item.id })}
                  scaleTo={press.scaleLarge}
                  style={{ width: bannerWidth }}
                  accessibilityLabel={item.title}
                >
                  <LinearGradient
                    colors={item.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.banner, shadow.md, { height: bannerHeight }]}
                  >
                    {/* Soft light bloom gives the flat gradient some dimension */}
                    <View style={styles.bannerBloom} pointerEvents="none" />
                    <View style={styles.bannerContent}>
                      {item.badge ? (
                        <View style={[styles.bannerBadge, { backgroundColor: on.chipBg }]}>
                          <Text style={[styles.bannerBadgeText, { color: on.chipFg }]}>
                            {item.badge}
                          </Text>
                        </View>
                      ) : null}
                      <View style={{ flex: 1 }} />
                      <Text style={[styles.bannerTitle, { color: on.primary }]}>{item.title}</Text>
                      <Text style={[styles.bannerSub, { color: on.secondary }]}>
                        {item.subtitle}
                      </Text>
                      {item.ctaLabel ? (
                        <View style={[styles.bannerCta, { backgroundColor: on.chipBg }]}>
                          <Text style={[styles.bannerCtaText, { color: on.chipFg }]}>
                            {item.ctaLabel}
                          </Text>
                          <FranIcon name="arrowRight" size={13} color={on.chipFg} />
                        </View>
                      ) : null}
                    </View>
                  </LinearGradient>
                </PressableScale>
              );
            }}
          />
          <Dots count={promoBanners.length} index={page} style={styles.dots} />
        </ContentWidth>

        <ContentWidth flex={false} style={{ paddingHorizontal: gutter }}>
          <View style={useSplitPanels ? styles.splitRow : undefined}>
            <Card
              style={[styles.pointsCard, useSplitPanels && styles.splitHalf]}
              onPress={() => navigation.navigate('Transactions')}
            >
              <View style={styles.pointsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pointsLabel}>Your points</Text>
                  <Text style={styles.pointsValue}>{user.points}</Text>
                </View>
                <IconTile icon="gem" size={52} iconSize={26} />
              </View>

              <View style={styles.pointsFooter}>
                {user.pointsExpiringSoon > 0 && user.tier === 1 ? (
                  <Pressable
                    onPress={() => navigation.navigate('ExpiringPoints')}
                    style={styles.expiringChip}
                    accessibilityRole="button"
                  >
                    <FranIcon name="clock" size={12} color={colors.warning} />
                    <Text style={styles.expiring}>
                      {user.pointsExpiringSoon} expiring soon
                    </Text>
                    <FranIcon name="chevronRight" size={12} color={colors.warning} />
                  </Pressable>
                ) : (
                  <Text style={styles.expiringMuted}>
                    {user.tier >= 2 ? 'Points never expire on your tier' : 'Tap for history'}
                  </Text>
                )}
              </View>
            </Card>

            <Card style={[styles.checkInCard, useSplitPanels && styles.splitHalf]}>
              <View style={styles.streakHeader}>
                <View style={styles.streakFlame}>
                  <FranIcon name="flame" size={20} color={colors.streak} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.streakTitle}>{user.streakCount}-day win streak</Text>
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
                      <FranIcon
                        name="snowflake"
                        size={13}
                        color={i < user.streakFreezes ? colors.info : colors.borderStrong}
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
                      <Text style={[styles.dayLabel, done && styles.dayLabelOn]}>{label}</Text>
                      <View style={[styles.dayDot, done && styles.dayDotOn]}>
                        {done ? (
                          <FranIcon name="check" size={15} color={colors.brown} />
                        ) : null}
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.freezeMeter}>
                <ProgressBar value={freezeProgress} height={6} />
                <Text style={styles.freezeHint}>
                  {user.streakFreezes}/2 freezes · {daysToFreeze} more day
                  {daysToFreeze === 1 ? '' : 's'} to earn one
                </Text>
              </View>

              <Button
                title={user.checkedInToday ? 'Checked in today' : 'Check in for +1 point'}
                onPress={onCheckIn}
                disabled={user.checkedInToday}
                icon={user.checkedInToday ? 'checkCircle' : 'flame'}
                style={{ marginTop: spacing.lg }}
              />
            </Card>
          </View>

          <SectionTitle
            eyebrow="For members"
            title="Exclusive bundles"
            subtitle="Save more when you build a full routine"
          />
          <View style={listColumns > 1 ? styles.bundleGrid : undefined}>
            {bundleBanners.map((b) => (
              <PressableScale
                key={b.id}
                onPress={() => navigation.navigate('PromoDetail', { promoId: 'promo_1' })}
                style={[styles.bundle, shadow.sm, listColumns > 1 && styles.bundleHalf]}
                accessibilityLabel={b.title}
              >
                <View style={[styles.bundleSwatch, { backgroundColor: b.color }]}>
                  <FranIcon name="tag" size={17} color={colors.brown} />
                </View>
                <View style={{ flex: 1 }}>
                  {b.badge ? <Badge label={b.badge} /> : null}
                  <Text style={styles.bundleTitle}>{b.title}</Text>
                  <Text style={styles.bundleSub}>{b.subtitle}</Text>
                </View>
                <FranIcon name="chevronRight" size={17} color={colors.borderStrong} />
              </PressableScale>
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
    paddingBottom: spacing.lg,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.yellowSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  pointsPillText: {
    ...typography.captionBold,
    color: colors.brown,
  },
  helloEyebrow: { ...typography.eyebrow, marginTop: spacing.lg },
  hello: { ...typography.h1, marginTop: 4 },
  banner: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    padding: spacing.xxl,
  },
  bannerBloom: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: tint.lightVeil,
    opacity: 0.35,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brown,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  bannerBadgeText: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.9,
    color: colors.yellow,
    textTransform: 'uppercase',
  },
  bannerTitle: {
    ...typography.h1,
    color: colors.brown,
    marginBottom: spacing.xs,
    maxWidth: 300,
  },
  bannerSub: {
    ...typography.body,
    color: colors.brownSoft,
    marginBottom: spacing.lg,
    maxWidth: 320,
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.brown,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 1,
    borderRadius: radius.full,
  },
  bannerCtaText: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.yellow,
  },
  dots: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
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
  pointsLabel: { ...typography.eyebrow },
  pointsValue: { ...typography.numeral, color: colors.brown, marginTop: 4 },
  pointsFooter: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  expiringChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.warningSoft,
    paddingLeft: spacing.sm,
    paddingRight: 6,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  expiring: { ...typography.captionBold, color: colors.warning },
  expiringMuted: { ...typography.caption },
  checkInCard: { marginTop: spacing.md },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  streakFlame: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#FDEDE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTitle: { ...typography.title },
  streakSub: { ...typography.caption, marginTop: 1 },
  freezeRow: { flexDirection: 'row', gap: 5 },
  freeze: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  freezeOn: {
    backgroundColor: colors.blueSoft,
    borderColor: colors.info,
  },
  freezeOff: {
    backgroundColor: colors.surfaceSunken,
    borderColor: colors.borderSoft,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: { alignItems: 'center', gap: 7 },
  dayLabel: { ...typography.micro, letterSpacing: 0.6 },
  dayLabelOn: { color: colors.brown },
  dayDot: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSunken,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotOn: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellowDeep,
  },
  freezeMeter: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  freezeHint: {
    ...typography.micro,
    textAlign: 'center',
  },
  bundleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  bundle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  bundleHalf: {
    flexGrow: 1,
    flexBasis: '46%',
    marginBottom: 0,
  },
  bundleSwatch: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bundleTitle: { ...typography.title, marginTop: spacing.xs },
  bundleSub: { ...typography.caption, marginTop: 1 },
});
