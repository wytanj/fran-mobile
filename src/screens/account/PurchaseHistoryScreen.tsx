import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { EmptyState, Header, Screen } from '../../components/ui';
import { orders } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseHistory'>;

export function PurchaseHistoryScreen({ navigation }: Props) {
  return (
    <Screen edges={['top']}>
      <Header title="Purchase history" onBack={() => navigation.goBack()} />
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        ListEmptyComponent={
          <EmptyState icon="receipt-outline" title="No purchases yet" subtitle="Receipts appear here after checkout." />
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.orderNo}>{item.orderNo}</Text>
              <Text style={styles.meta}>
                {item.date} · {item.store}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.total}>${item.total.toFixed(2)}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  orderNo: { ...typography.bodyBold, color: colors.ink },
  meta: { ...typography.caption, color: colors.muted, marginTop: 2 },
  total: { ...typography.bodyBold, color: colors.ink },
  status: { ...typography.caption, color: colors.success, marginTop: 2, textTransform: 'capitalize' },
});
