import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { pointTransactions } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Transactions'>;

export function TransactionsScreen({ navigation }: Props) {
  const { user } = useUser();

  return (
    <Screen edges={['top']}>
      <Header title="Point transactions" onBack={() => navigation.goBack()} />
      <View style={[styles.summary, shadow.sm]}>
        <Text style={styles.label}>Points available</Text>
        <Text style={styles.points}>{user.points}</Text>
        {user.tier === 1 && user.pointsExpiringSoon > 0 ? (
          <View style={styles.expiringChip}>
            <FranIcon name="clock" size={12} color={colors.warning} />
            <Text style={styles.expiring}>
              {user.pointsExpiringSoon} expiring by Q3 2026
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.listLabel}>Activity</Text>
      <FlatList
        data={pointTransactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
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
              ? colors.brownMuted
              : positive
                ? colors.success
                : colors.warning;
          return (
            <View style={styles.row}>
              <View style={[styles.icon, { backgroundColor: color + '18' }]}>
                <FranIcon name={icon as any} size={20} color={color} />
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
    borderRadius: radius.xl,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
  },
  points: { ...typography.numeral, color: colors.brown, marginTop: 2 },
  label: { ...typography.eyebrow },
  expiringChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.warningSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    marginTop: spacing.md,
  },
  expiring: { ...typography.captionBold, color: colors.warning },
  listLabel: { ...typography.eyebrow, marginBottom: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: { ...typography.title },
  date: { ...typography.micro, marginTop: 2 },
  amount: { ...typography.h3 },
});
