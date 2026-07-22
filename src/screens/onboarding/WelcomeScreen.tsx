import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FranLogo } from '../../components/FranLogo';
import { Button, Screen } from '../../components/ui';
import type { OnboardingStackParamList } from '../../types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <Screen edges={['top', 'bottom']} style={styles.wrap}>
      <View style={styles.hero}>
        <View style={styles.logoWrap}>
          <FranLogo height={56} />
        </View>
        <Text style={styles.tagline}>Your new favourite{'\n'}four-letter word.</Text>
        <Text style={styles.body}>
          Earn points in-store, unlock member exclusives, and build a beauty profile that actually
          helps you shop. No fluff — just Fran.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button title="Sign up" onPress={() => navigation.navigate('Phone', { mode: 'signup' })} />
        <Button
          title="Log in"
          variant="secondary"
          onPress={() => navigation.navigate('Phone', { mode: 'login' })}
          style={{ marginTop: spacing.md }}
        />
        <Text style={styles.footnote}>Mobile number + OTP. No password needed.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
    backgroundColor: colors.cream,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  logoWrap: {
    marginBottom: spacing.xxl,
  },
  tagline: {
    ...typography.h1,
    color: colors.brown,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  body: {
    ...typography.body,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: spacing.lg,
    maxWidth: 420,
  },
  actions: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  footnote: {
    ...typography.caption,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
