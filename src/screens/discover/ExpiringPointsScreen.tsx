import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { expiringPoints } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ExpiringPoints'>;

export function ExpiringPointsScreen({ navigation }: Props) {
  return (
    <Screen edges={['top']}>
      <Header title="Expiring points" onBack={() => navigation.goBack()} />
      <Text style={styles.intro}>
        Points expire after 12 months on Tier 1. On Tier 2 and 3, points never expire while you
        remain in those tiers.
      </Text>
      <View style={styles.table}>
        <View style={[styles.row, styles.head]}>
          <Text style={[styles.cell, styles.headText, { flex: 1 }]}>Quarter</Text>
          <Text style={[styles.cell, styles.headText, { width: 90, textAlign: 'right' }]}>
            Points
          </Text>
          <Text style={[styles.cell, styles.headText, { width: 100, textAlign: 'right' }]}>
            Expiry
          </Text>
        </View>
        {expiringPoints.map((r) => (
          <View key={r.quarterLabel} style={styles.row}>
            <Text style={[styles.cell, { flex: 1 }]}>{r.quarterLabel}</Text>
            <Text
              style={[
                styles.cell,
                styles.points,
                { width: 90, textAlign: 'right' },
                r.points > 0 && { color: colors.warning },
              ]}
            >
              {r.points}
            </Text>
            <Text style={[styles.cell, { width: 100, textAlign: 'right', color: colors.muted }]}>
              {r.expiryDate}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.xl },
  table: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  head: { backgroundColor: colors.cream },
  cell: { ...typography.body, color: colors.ink },
  headText: { ...typography.captionBold, color: colors.inkSoft },
  points: { ...typography.bodyBold },
});
