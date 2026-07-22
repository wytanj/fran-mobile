import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { earnActions } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EarnPoints'>;

export function EarnPointsScreen({ navigation }: Props) {
  const { user, completeSocial } = useUser();

  return (
    <Screen edges={['top']}>
      <Header title="Ways to earn" onBack={() => navigation.goBack()} />
      <Text style={styles.intro}>Complete actions below to grow your points balance.</Text>
      <View style={styles.grid}>
        {earnActions.map((a) => {
          const done = a.oneTime && !!user.earnActionsCompleted[a.id];
          return (
            <Pressable
              key={a.id}
              disabled={done}
              style={[styles.cell, done && styles.cellDone]}
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
              <Ionicons
                name={a.icon as any}
                size={28}
                color={done ? colors.disabled : colors.brown}
              />
              <Text style={[styles.title, done && styles.done]}>{a.title}</Text>
              <Text style={[styles.pts, done && styles.done]}>
                {done ? 'Completed' : `+${a.points} pts`}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  cell: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    minHeight: 130,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  cellDone: { opacity: 0.55, backgroundColor: colors.cream },
  title: { ...typography.bodyBold, color: colors.ink },
  pts: { ...typography.captionBold, color: colors.brown },
  done: { color: colors.muted },
});
