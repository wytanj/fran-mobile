import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header, Perforation, Screen } from '../../components/ui';
import { orders } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.card, shadow.sm]}>
          <View style={styles.head}>
            <View style={styles.stamp}>
              <Ionicons name="checkmark" size={17} color={colors.brown} />
            </View>
            <Text style={styles.thanks}>Thank you for shopping at Fran</Text>
            <Text style={styles.meta}>
              {order.date} · {order.store}
            </Text>
            <Text style={styles.orderNo}>{order.orderNo}</Text>
          </View>

          <Perforation notchColor={colors.background} />

          <View style={styles.lines}>
            {order.items.map((item, i) => (
              <View key={i} style={styles.line}>
                <Text style={styles.itemName}>
                  {item.name}
                  {item.qty > 1 ? ` ×${item.qty}` : ''}
                </Text>
                <Text style={[styles.itemPrice, item.price < 0 && { color: colors.success }]}>
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
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  head: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl },
  stamp: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  thanks: { ...typography.h3, textAlign: 'center' },
  meta: { ...typography.caption, marginTop: spacing.xs },
  orderNo: { ...typography.micro, marginTop: 2, letterSpacing: 0.8 },
  lines: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  divider: { height: 1, backgroundColor: colors.borderSoft, marginVertical: spacing.md },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemName: { ...typography.body, flex: 1, paddingRight: spacing.md },
  itemPrice: { ...typography.bodyBold, color: colors.inkSoft },
  totalLabel: { ...typography.title },
  totalValue: { ...typography.h2, color: colors.brown },
});
