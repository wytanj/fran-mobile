import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { stores } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StoreLocator'>;

export function StoreLocatorScreen({ navigation }: Props) {
  return (
    <Screen edges={['top']}>
      <Header title="Store locator" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.huge }}
        showsVerticalScrollIndicator={false}
      >
        {stores.map((s) => (
          <View key={s.id} style={[styles.card, shadow.sm]}>
            <LinearGradient
              colors={[colors.yellowSoft, colors.blueSoft]}
              style={styles.image}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.imageIcon}>
                <FranIcon name="store" size={26} color={colors.brown} />
              </View>
            </LinearGradient>
            <View style={styles.body}>
              <Text style={styles.name}>{s.name}</Text>
              <Text style={styles.address}>{s.address}</Text>
              <View style={styles.metaRow}>
                <FranIcon name="clock" size={13} color={colors.brownMuted} />
                <Text style={styles.meta}>{s.hours}</Text>
              </View>
              <View style={styles.metaRow}>
                <FranIcon name="phone" size={13} color={colors.brownMuted} />
                <Text style={styles.meta}>{s.phone}</Text>
              </View>
            </View>
          </View>
        ))}
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
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  image: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    width: 54,
    height: 54,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: spacing.lg },
  name: { ...typography.h3 },
  address: {
    ...typography.body,
    color: colors.inkSoft,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  meta: { ...typography.caption },
});
