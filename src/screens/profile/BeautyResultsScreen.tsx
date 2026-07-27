import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { buildResultsCopy, categoryLabels } from '../../data/quizQuestions';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

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
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.huge }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>Your result</Text>
        <Text style={styles.title}>{copy.title}</Text>
        <View style={[styles.card, shadow.sm]}>
          {copy.rows.map((r, i) => (
            <View key={r.label} style={[styles.row, i < copy.rows.length - 1 && styles.rowBorder]}>
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
                <View style={styles.tipIcon}>
                  <FranIcon name="bulb" size={15} color={colors.brown} />
                </View>
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
  eyebrow: { ...typography.eyebrow },
  title: { ...typography.h1, marginTop: 4, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  row: { paddingVertical: spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  label: { ...typography.eyebrow },
  value: { ...typography.title, marginTop: 3, textTransform: 'capitalize' },
  section: { ...typography.h3, marginTop: spacing.xxl, marginBottom: spacing.md },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.blueSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  tipIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: { ...typography.body, color: colors.inkSoft, flex: 1 },
});
