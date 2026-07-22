import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { buildResultsCopy, categoryLabels } from '../../data/quizQuestions';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BeautyResults'>;

export function BeautyResultsScreen({ navigation, route }: Props) {
  const { category } = route.params;
  const { user } = useUser();
  const profile = user.beautyProfiles[category];
  const copy = profile
    ? buildResultsCopy(category, profile.answers)
    : { title: 'No results yet', rows: [], tips: [] };

  return (
    <Screen edges={['top']}>
      <Header
        title={categoryLabels[category]}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.huge }}>
        <Text style={styles.title}>{copy.title}</Text>
        <View style={styles.card}>
          {copy.rows.map((r) => (
            <View key={r.label} style={styles.row}>
              <Text style={styles.label}>{r.label}</Text>
              <Text style={styles.value}>{r.value}</Text>
            </View>
          ))}
        </View>
        {copy.tips.length ? (
          <>
            <Text style={styles.section}>Tips for you</Text>
            {copy.tips.map((t) => (
              <View key={t} style={styles.tip}>
                <Text style={styles.tipText}>{t}</Text>
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.ink, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { ...typography.caption, color: colors.muted },
  value: { ...typography.bodyBold, color: colors.ink, marginTop: 2, textTransform: 'capitalize' },
  section: { ...typography.h3, color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.md },
  tip: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  tipText: { ...typography.body, color: colors.inkSoft },
});
