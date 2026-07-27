import { Text } from '../../components/ThemedText';
import { FranIcon, type FranIconName } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Header, IconTile, PressableScale, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { earnActions } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EarnPoints'>;

export function EarnPointsScreen({ navigation }: Props) {
  const { user, completeSocial } = useUser();

  return (
    <Screen edges={['top']}>
      <Header title="Ways to earn" onBack={() => navigation.goBack()} />
      <Text style={styles.intro}>Complete actions below to grow your points balance.</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {earnActions.map((a) => {
          const done = a.oneTime && !!user.earnActionsCompleted[a.id];
          return (
            <PressableScale
              key={a.id}
              disabled={done}
              accessibilityLabel={`${a.title}, ${done ? 'completed' : `plus ${a.points} points`}`}
              style={[styles.cell, done ? styles.cellDone : shadow.sm]}
              onPress={async () => {
                if (a.kind === 'social') {
                  const url =
                    a.id === 'instagram'
                      ? 'https://instagram.com'
                      : 'https://tiktok.com';
                  Linking.openURL(url).catch(() => {});
                  const pts = await completeSocial(a.id as 'instagram' | 'tiktok');
                  if (pts) Alert.alert('Nice!', `+${pts} points added`);
                  return;
                }
                if (a.kind === 'beauty' && a.category) {
                  navigation.navigate('Quiz', { category: a.category });
                  return;
                }
                if (a.kind === 'birthday') {
                  navigation.navigate('BirthdayModal');
                  return;
                }
                if (a.kind === 'checkin') {
                  navigation.getParent()?.navigate('Discover' as never);
                }
              }}
            >
              <IconTile
                icon={a.icon as FranIconName}
                tone={done ? 'cream' : 'yellow'}
                size={42}
              />
              <Text style={[styles.title, done && styles.done]}>{a.title}</Text>
              {done ? (
                <View style={styles.doneRow}>
                  <FranIcon name="checkCircle" size={13} color={colors.success} />
                  <Text style={styles.doneText}>Completed</Text>
                </View>
              ) : (
                <Text style={styles.pts}>+{a.points} pts</Text>
              )}
            </PressableScale>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.xl },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingBottom: spacing.huge,
  },
  cell: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.lg,
    minHeight: 138,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  cellDone: { backgroundColor: colors.surfaceSunken, borderColor: 'transparent' },
  title: { ...typography.title },
  pts: { ...typography.captionBold, color: colors.brown },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  doneText: { ...typography.micro, color: colors.success },
  done: { color: colors.brownMuted },
});
