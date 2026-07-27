import { Text } from '../../components/ThemedText';
import { FranIcon, type FranIconName } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FranLogo } from '../../components/FranLogo';
import { Button, Screen } from '../../components/ui';
import type { OnboardingStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

const HIGHLIGHTS: { icon: FranIconName; label: string }[] = [
  { icon: 'gem', label: 'Earn points in-store' },
  { icon: 'ticket', label: 'Member-only vouchers' },
  { icon: 'glow', label: 'A beauty profile that helps' },
];

export function WelcomeScreen({ navigation }: Props) {
  return (
    <Screen edges={['top', 'bottom']} style={styles.wrap}>
      <View style={styles.hero}>
        <View style={styles.logoWrap}>
          {/* Yellow halo lets the wordmark sit on cream without washing out */}
          <View style={styles.halo} />
          <FranLogo height={54} variant="brown" />
        </View>
        <Text style={styles.tagline}>Your new favourite{'\n'}four-letter word.</Text>
        <Text style={styles.body}>
          Earn points in-store, unlock member exclusives, and build a beauty profile that actually
          helps you shop. No fluff — just Fran.
        </Text>

        <View style={styles.highlights}>
          {HIGHLIGHTS.map((h) => (
            <View key={h.label} style={styles.highlightRow}>
              <View style={styles.highlightIcon}>
                <FranIcon name={h.icon} size={15} color={colors.brown} />
              </View>
              <Text style={styles.highlightText}>{h.label}</Text>
            </View>
          ))}
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.yellowSoft,
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
  highlights: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  highlightIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: { ...typography.bodyBold, color: colors.inkSoft },
  actions: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  footnote: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
