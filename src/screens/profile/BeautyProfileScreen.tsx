import { Text } from '../../components/ThemedText';
import { FranIcon, type FranIconName } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Badge, Header, IconTile, ProgressBar, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { categoryLabels } from '../../data/quizQuestions';
import type { BeautyCategory, RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, tint, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BeautyProfile'>;

const cats: BeautyCategory[] = ['skin', 'makeup', 'hair', 'lifestyle'];

const CAT_ICONS: Record<BeautyCategory, FranIconName> = {
  skin: 'droplet',
  makeup: 'lipstick',
  hair: 'comb',
  lifestyle: 'leaf',
};

export function BeautyProfileScreen({ navigation }: Props) {
  const { user } = useUser();
  const completed = cats.filter((c) => user.beautyProfiles[c]).length;

  return (
    <Screen edges={['top']}>
      <Header title="Beauty profile" onBack={() => navigation.goBack()} />
      <Text style={styles.intro}>
        Hi {user.name} — complete each category for better product guidance and +15 points each.
      </Text>
      <View style={styles.progressBlock}>
        <ProgressBar value={completed / cats.length} height={8} />
        <Text style={styles.progress}>
          {completed} of {cats.length} completed
        </Text>
      </View>
      <View style={[styles.list, shadow.sm]}>
        {cats.map((cat, i) => {
          const done = !!user.beautyProfiles[cat];
          return (
            <Pressable
              key={cat}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.row,
                i < cats.length - 1 && styles.rowBorder,
                pressed && { backgroundColor: tint.inkFaint },
              ]}
              onPress={() =>
                done
                  ? navigation.navigate('BeautyResults', { category: cat })
                  : navigation.navigate('Quiz', { category: cat })
              }
            >
              <IconTile icon={CAT_ICONS[cat]} tone={done ? 'blue' : 'yellow'} size={40} />
              <View style={styles.left}>
                <Text style={styles.name}>{categoryLabels[cat]}</Text>
                <Badge label={done ? 'Completed' : '+15 pts'} tone={done ? 'success' : 'primary'} />
              </View>
              {done ? (
                <FranIcon name="chevronRight" size={17} color={colors.borderStrong} />
              ) : (
                <Text style={styles.quizCta}>Start ›</Text>
              )}
            </Pressable>
          );
        })}
      </View>
      <View style={styles.soon}>
        <View style={styles.soonRow}>
          <FranIcon name="glow" size={17} color={colors.brownMuted} />
          <Text style={styles.soonTitle}>My recommendations</Text>
        </View>
        <Text style={styles.soonSub}>
          Once your profile is complete we'll surface picks matched to it.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.lg },
  progressBlock: { gap: spacing.sm, marginBottom: spacing.xl },
  progress: { ...typography.eyebrow },
  list: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  left: { flex: 1, gap: spacing.sm, alignItems: 'flex-start' },
  name: { ...typography.title },
  quizCta: { ...typography.captionBold, color: colors.brown },
  soon: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceSunken,
  },
  soonRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  soonTitle: { ...typography.title, color: colors.inkSoft },
  soonSub: { ...typography.caption, marginTop: spacing.xs },
});
