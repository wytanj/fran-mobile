import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { orders } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

export function OrderDetailScreen({ navigation, route }: Props) {
  const order = orders.find((o) => o.id === route.params.orderId);

  if (!order) {
    return (
      <Screen edges={['top']}>
        <Header title="Receipt" onBack={() => navigation.goBack()} />
        <Text>Order not found.</Text>
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <Header title="Receipt" onBack={() => navigation.goBack()} />
      <View style={styles.card}>
        <Text style={styles.thanks}>Thank you for shopping at Fran</Text>
        <Text style={styles.meta}>Order {order.orderNo}</Text>
        <Text style={styles.meta}>
          {order.date} · {order.store}
        </Text>
        <View style={styles.divider} />
        {order.items.map((item, i) => (
          <View key={i} style={styles.line}>
            <Text style={styles.itemName}>
              {item.name}
              {item.qty > 1 ? ` ×${item.qty}` : ''}
            </Text>
            <Text style={styles.itemPrice}>
              {item.price < 0 ? '-' : ''}${Math.abs(item.price).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.line}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  thanks: { ...typography.h3, color: colors.ink, marginBottom: spacing.sm },
  meta: { ...typography.caption, color: colors.muted },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  line: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  itemName: { ...typography.body, color: colors.ink, flex: 1, paddingRight: spacing.md },
  itemPrice: { ...typography.body, color: colors.inkSoft },
  totalLabel: { ...typography.bodyBold, color: colors.ink },
  totalValue: { ...typography.h3, color: colors.brown },
});
