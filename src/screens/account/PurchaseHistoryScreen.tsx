import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { EmptyState, Header, IconTile, PressableScale, Screen } from '../../components/ui';
import { orders } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseHistory'>;

export function PurchaseHistoryScreen({ navigation }: Props) {
  return (
    <Screen edges={['top']}>
      <Header title="Purchase history" onBack={() => navigation.goBack()} />
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.huge }}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="No purchases yet"
            subtitle="Receipts appear here after checkout."
          />
        }
        renderItem={({ item }) => (
          <PressableScale
            style={[styles.row, shadow.sm]}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
            accessibilityLabel={`Order ${item.orderNo}, $${item.total.toFixed(2)}`}
          >
            <IconTile icon="receipt-outline" tone="peach" size={40} />
            <View style={{ flex: 1 }}>
              <Text style={styles.orderNo}>{item.store}</Text>
              <Text style={styles.meta}>
                {item.date} · {item.orderNo}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.total}>${item.total.toFixed(2)}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
          </PressableScale>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginBottom: spacing.md,
  },
  orderNo: { ...typography.title },
  meta: { ...typography.micro, marginTop: 2 },
  total: { ...typography.h3, color: colors.brown },
  status: { ...typography.micro, color: colors.success, marginTop: 2, textTransform: 'capitalize' },
});
