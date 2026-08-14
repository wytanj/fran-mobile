import { Text } from '../../components/ThemedText';
import { FranIcon, type FranIconName } from '../../components/FranIcon';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FranLogo } from '../../components/FranLogo';
import { ListRow } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { buildResultsCopy, categoryLabels } from '../../data/quizQuestions';
import { useLayout } from '../../layout/useLayout';
import type { BeautyCategory, RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

const QUIZ_PTS = 25;

const CARDS: {
  category: BeautyCategory;
  icon: FranIconName;
  blurb: string;
}[] = [
  { category: 'skin', icon: 'droplet', blurb: 'Discover your skin profile' },
  { category: 'makeup', icon: 'lipstick', blurb: 'Build your perfect makeup bag' },
  { category: 'hair', icon: 'comb', blurb: 'Find your hair type and ideal routine' },
  { category: 'lifestyle', icon: 'leaf', blurb: 'Align beauty with your lifestyle' },
];

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isAuthed, user } = useUser();
  const { gutter } = useLayout();
  const insets = useSafeAreaInsets();
  const [recTab, setRecTab] = useState<BeautyCategory>('skin');
  const recDone = isAuthed && !!user.beautyProfiles[recTab];
  const recCopy =
    recDone && user.beautyProfiles[recTab]
      ? buildResultsCopy(recTab, user.beautyProfiles[recTab]!.answers)
      : null;

  const openQuiz = (category: BeautyCategory) => {
    if (!isAuthed) {
      navigation.navigate('Onboarding');
      return;
    }
    const done = !!user.beautyProfiles[category];
    if (done) navigation.navigate('BeautyResults', { category });
    else navigation.navigate('Quiz', { category });
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: gutter,
          paddingTop: insets.top,
          paddingBottom: spacing.giant,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wordmark}>
          <FranLogo height={28} variant="yellow" />
          <Text style={styles.about}>about you</Text>
        </View>

        {isAuthed ? (
          <View style={styles.intro}>
            <Text style={styles.hi}>Hi {user.name}</Text>
            <Text style={styles.lede}>The only holy grail is you.</Text>
            <Text style={styles.lede}>
              Take the quizzes below to find out what really works for you.
            </Text>
          </View>
        ) : (
          <View style={styles.guestBanner}>
            <Text style={styles.guestTitle}>Allergic to one-size-fits-all</Text>
            <Pressable
              onPress={() => navigation.navigate('Onboarding')}
              style={styles.guestCta}
              accessibilityRole="button"
            >
              <Text style={styles.guestCtaText}>Sign up to get personalised recommendations</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.grid}>
          {CARDS.map((c) => {
            const done = isAuthed && !!user.beautyProfiles[c.category];
            return (
              <Pressable
                key={c.category}
                onPress={() => openQuiz(c.category)}
                style={styles.card}
                accessibilityRole="button"
                accessibilityLabel={categoryLabels[c.category]}
              >
                <View style={styles.cardIcon}>
                  <FranIcon name={c.icon} size={20} color={colors.yellow} />
                </View>
                <View style={styles.cardHead}>
                  <Text style={styles.cardTitle}>{categoryLabels[c.category]}</Text>
                  <Text style={styles.cardPts}>{done ? 'Done' : `+${QUIZ_PTS} points`}</Text>
                </View>
                <Text style={styles.cardBlurb}>{c.blurb}</Text>
              </Pressable>
            );
          })}
        </View>

        {isAuthed ? (
          <View style={styles.recs}>
            <Text style={styles.recsTitle}>Your recommendations</Text>
            <View style={styles.recTabs}>
              {(Object.keys(categoryLabels) as BeautyCategory[]).map((cat) => {
                const on = recTab === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setRecTab(cat)}
                    style={[styles.recTab, on && styles.recTabOn]}
                  >
                    <Text style={[styles.recTabText, on && styles.recTabTextOn]}>
                      {categoryLabels[cat]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.recBody}>
              {recCopy ? (
                <>
                  <Text style={styles.unlock}>{recCopy.title}</Text>
                  {recCopy.tips.slice(0, 2).map((t) => (
                    <Text key={t} style={styles.recTip}>
                      {t}
                    </Text>
                  ))}
                </>
              ) : (
                <>
                  <Text style={styles.unlock}>
                    Unlock your {categoryLabels[recTab].toLowerCase()} recommendations now
                  </Text>
                  <Pressable
                    onPress={() => openQuiz(recTab)}
                    style={styles.quizBtn}
                    accessibilityRole="button"
                  >
                    <Text style={styles.quizBtnText}>Take the quiz +{QUIZ_PTS} points</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        ) : null}

        {isAuthed ? (
          <View style={{ marginTop: spacing.xl }}>
            <ListRow
              icon="gem"
              title="Rewards"
              subtitle="Points, vouchers, ways to earn"
              onPress={() => navigation.navigate('Main', { screen: 'Rewards' })}
            />
            <ListRow
              icon="person"
              title="Account"
              subtitle="Details, orders, privacy"
              onPress={() => navigation.navigate('MyDetails')}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  about: { ...typography.h1, color: colors.blue, marginBottom: 2 },
  intro: { marginBottom: spacing.lg, gap: 2 },
  hi: { ...typography.h2, marginBottom: 4 },
  lede: { ...typography.caption },
  guestBanner: {
    backgroundColor: colors.blue,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  guestTitle: {
    ...typography.h2,
    color: colors.yellow,
    textTransform: 'uppercase',
  },
  guestCta: {
    backgroundColor: colors.yellow,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  guestCtaText: { ...typography.captionBold, color: colors.brown },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.brown,
    borderRadius: radius.sm,
    padding: spacing.md,
    minHeight: 142,
    gap: spacing.md,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brownSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { ...typography.captionBold },
  cardPts: { ...typography.micro },
  cardBlurb: { ...typography.micro },
  recs: { gap: spacing.sm },
  recsTitle: { ...typography.h2, color: colors.inkSoft },
  recTabs: { flexDirection: 'row' },
  recTab: { paddingHorizontal: 12, paddingVertical: 12 },
  recTabOn: { borderBottomWidth: 2, borderBottomColor: colors.brown },
  recTabText: { ...typography.caption },
  recTabTextOn: { ...typography.captionBold },
  recBody: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.lg,
    gap: spacing.md,
  },
  unlock: { ...typography.captionBold },
  recTip: { ...typography.caption },
  quizBtn: {
    backgroundColor: colors.blue,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  quizBtnText: { ...typography.captionBold, color: colors.brown },
});
