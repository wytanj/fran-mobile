import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { stores } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StoreLocator'>;

export function StoreLocatorScreen({ navigation }: Props) {
  return (
    <Screen edges={['top']}>
      <Header title="Store locator" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.huge }}>
        {stores.map((s) => (
          <View key={s.id} style={styles.card}>
            <LinearGradient
              colors={[colors.yellow, colors.blue]}
              style={styles.image}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="storefront-outline" size={36} color={colors.brown} />
              <Text style={styles.imageLabel}>{s.name}</Text>
            </LinearGradient>
            <Text style={styles.name}>{s.name}</Text>
            <Text style={styles.address}>{s.address}</Text>
            <Text style={styles.meta}>{s.hours}</Text>
            <Text style={styles.meta}>{s.phone}</Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  image: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  imageLabel: { ...typography.captionBold, color: colors.brown },
  name: { ...typography.h3, color: colors.ink, paddingHorizontal: spacing.lg, marginTop: spacing.md },
  address: {
    ...typography.body,
    color: colors.inkSoft,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
  },
  meta: {
    ...typography.caption,
    color: colors.muted,
    paddingHorizontal: spacing.lg,
    marginTop: 4,
    marginBottom: 2,
  },
});
