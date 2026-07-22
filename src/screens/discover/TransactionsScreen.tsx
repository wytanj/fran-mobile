import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { pointTransactions } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Transactions'>;

export function TransactionsScreen({ navigation }: Props) {
  const { user } = useUser();

  return (
    <Screen edges={['top']}>
      <Header title="Point transactions" onBack={() => navigation.goBack()} />
      <View style={styles.summary}>
        <Text style={styles.points}>{user.points}</Text>
        <Text style={styles.label}>points available</Text>
        {user.tier === 1 && user.pointsExpiringSoon > 0 ? (
          <Text style={styles.expiring}>
            {user.pointsExpiringSoon} points expiring by Q3 2026
          </Text>
        ) : null}
      </View>
      <FlatList
        data={pointTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: spacing.huge }}
        renderItem={({ item }) => {
          const positive = item.amount > 0;
          const icon =
            item.type === 'expired'
              ? 'time-outline'
              : positive
                ? 'arrow-up-circle'
                : 'arrow-down-circle';
          const color =
            item.type === 'expired'
              ? colors.muted
              : positive
                ? colors.success
                : colors.danger;
          return (
            <View style={styles.row}>
              <View style={[styles.icon, { backgroundColor: color + '18' }]}>
                <Ionicons name={icon as any} size={20} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <Text style={[styles.amount, { color }]}>
                {positive ? '+' : ''}
                {item.amount}
              </Text>
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  points: { ...typography.hero, color: colors.brown },
  label: { ...typography.caption, color: colors.muted },
  expiring: { ...typography.captionBold, color: colors.warning, marginTop: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: { ...typography.bodyBold, color: colors.ink },
  date: { ...typography.caption, color: colors.muted, marginTop: 2 },
  amount: { ...typography.bodyBold },
});
