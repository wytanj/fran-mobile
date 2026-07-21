import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { categoryLabels } from '../../data/quizQuestions';
import type { BeautyCategory, RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BeautyProfile'>;

const cats: BeautyCategory[] = ['skin', 'makeup', 'hair', 'lifestyle'];

export function BeautyProfileScreen({ navigation }: Props) {
  const { user } = useUser();
  const completed = cats.filter((c) => user.beautyProfiles[c]).length;

  return (
    <Screen edges={['top']}>
      <Header title="Beauty profile" onBack={() => navigation.goBack()} />
      <Text style={styles.intro}>
        Hi {user.name} — complete each category for better product guidance and +15 points each.
      </Text>
      <Text style={styles.progress}>
        {completed}/{cats.length} completed
      </Text>
      <View style={styles.list}>
        {cats.map((cat) => {
          const done = !!user.beautyProfiles[cat];
          return (
            <Pressable
              key={cat}
              style={styles.row}
              onPress={() =>
                done
                  ? navigation.navigate('BeautyResults', { category: cat })
                  : navigation.navigate('Quiz', { category: cat })
              }
            >
              <View style={styles.left}>
                <Text style={styles.name}>{categoryLabels[cat]}</Text>
                <Badge
                  label={done ? 'Completed' : 'Not completed'}
                  tone={done ? 'success' : 'muted'}
                />
              </View>
              {done ? (
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              ) : (
                <Text style={styles.quizCta}>Take the quiz ›</Text>
              )}
            </Pressable>
          );
        })}
      </View>
      <View style={styles.soon}>
        <Text style={styles.soonTitle}>My recommendations</Text>
        <Text style={styles.soonSub}>Coming soon</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.md },
  progress: { ...typography.captionBold, color: colors.brown, marginBottom: spacing.lg },
  list: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: { gap: spacing.sm },
  name: { ...typography.bodyBold, color: colors.ink },
  quizCta: { ...typography.captionBold, color: colors.brown },
  soon: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.cream,
  },
  soonTitle: { ...typography.bodyBold, color: colors.inkSoft },
  soonSub: { ...typography.caption, color: colors.muted, marginTop: 4 },
});
