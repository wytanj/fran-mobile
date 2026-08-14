import { Text, TextInput } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Button, Screen } from '../../components/ui';
import { TWILIO_AUTH_ENABLED } from '../../config/auth';
import { parseSingaporeMobile, sendOtp } from '../../services/auth';
import type { OnboardingStackParamList } from '../../types';
import { colors, fonts, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Phone'>;

const SEASON_DOTS = [colors.tan, colors.peach, colors.blue, colors.yellowDeep, colors.brown];

export function PhoneScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const parsed = parseSingaporeMobile(phone);
  const canContinue = parsed.ok;

  const onContinue = async () => {
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }

    setError('');
    setLoading(true);
    try {
      const result = await sendOtp({
        phoneE164: parsed.e164,
        mode,
        channel: 'sms',
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      navigation.navigate('Otp', {
        mode,
        phone: parsed.display,
        phoneE164: parsed.e164,
      });
    } finally {
      setLoading(false);
    }
  };

  const flipMode = () => {
    navigation.setParams({ mode: mode === 'login' ? 'signup' : 'login' });
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.nav}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <FranIcon name="chevronLeft" size={22} color={colors.brown} />
          </Pressable>
          <Text style={styles.navTitle}>{mode === 'signup' ? 'Sign up' : 'Log in'}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.season}>
            <Text style={styles.seasonKicker}>Which are you?</Text>
            <View style={styles.dots}>
              {SEASON_DOTS.map((c) => (
                <View key={c} style={[styles.dot, { backgroundColor: c }]} />
              ))}
            </View>
            <Text style={styles.seasonTitle}>Your colour season is waiting</Text>
            <Text style={styles.seasonBody}>
              Find your skin type, colour matches and products made for you — not just anyone.
            </Text>
          </View>

          <View style={[styles.phoneField, error ? styles.phoneFieldError : null]}>
            <Text style={styles.cc}>+65</Text>
            <FranIcon name="chevronDown" size={14} color={colors.brown} />
            <TextInput
              style={styles.phoneInput}
              placeholder="Mobile no."
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              autoFocus
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                if (error) setError('');
              }}
              accessibilityLabel="Mobile number"
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {!TWILIO_AUTH_ENABLED ? (
            <Text style={styles.hint}>SMS not live yet — next screen accepts demo code 1234.</Text>
          ) : null}

          <Button
            title="Continue"
            onPress={onContinue}
            loading={loading}
            disabled={!canContinue}
            style={styles.cta}
          />

          <Pressable onPress={flipMode} style={styles.switchRow} accessibilityRole="button">
            <Text style={styles.switchMuted}>
              {mode === 'login' ? 'Don’t have an account?' : 'Already have an account?'}
            </Text>
            <Text style={styles.switchAction}>{mode === 'login' ? 'Sign up' : 'Log in'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  navTitle: { ...typography.h2, color: colors.brown },
  content: { flex: 1, gap: spacing.lg },
  season: {
    backgroundColor: colors.blue,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  seasonKicker: {
    ...typography.micro,
    color: colors.brownSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dots: { flexDirection: 'row', gap: 10, marginVertical: spacing.sm },
  dot: { width: 28, height: 28, borderRadius: 14 },
  seasonTitle: {
    ...typography.title,
    fontFamily: fonts.bodyBold,
    alignSelf: 'stretch',
    color: colors.ink,
  },
  seasonBody: { ...typography.caption, alignSelf: 'stretch', color: colors.inkSoft },
  phoneField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    height: 56,
  },
  phoneFieldError: { borderColor: colors.danger },
  cc: { ...typography.body, color: colors.ink },
  phoneInput: {
    flex: 1,
    ...typography.body,
    paddingVertical: 0,
    marginLeft: spacing.sm,
  },
  error: { ...typography.caption, color: colors.danger, marginTop: -spacing.sm },
  hint: { ...typography.micro },
  cta: { marginTop: spacing.xs },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  switchMuted: { ...typography.body, color: colors.muted },
  switchAction: { ...typography.bodyBold, color: colors.brown },
});
