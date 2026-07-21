import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button, Header, Input, Screen } from '../../components/ui';
import { TWILIO_AUTH_ENABLED } from '../../config/auth';
import { parseSingaporeMobile, sendOtp } from '../../services/auth';
import type { OnboardingStackParamList } from '../../types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Phone'>;

export function PhoneScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onContinue = async () => {
    const parsed = parseSingaporeMobile(phone);
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

  return (
    <Screen edges={['top', 'bottom']}>
      <Header
        title={mode === 'signup' ? 'Sign up' : 'Log in'}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>What's your mobile number?</Text>
          <Text style={styles.sub}>
            We'll send a one-time SMS code to a Singapore mobile. Your number is your login — no
            password.
          </Text>
          <Input
            label="Mobile number (Singapore)"
            placeholder="+65 9XXX XXXX"
            keyboardType="phone-pad"
            autoFocus
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              if (error) setError('');
            }}
            error={error}
          />
          {!TWILIO_AUTH_ENABLED ? (
            <Text style={styles.demoNote}>
              SMS not live yet — next screen accepts demo code 1234.
            </Text>
          ) : null}
        </View>
        <Button
          title="Send OTP"
          onPress={onContinue}
          loading={loading}
          style={styles.cta}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: spacing.lg },
  title: { ...typography.h1, color: colors.ink, marginBottom: spacing.sm },
  sub: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.xxl },
  demoNote: {
    ...typography.caption,
    color: colors.muted,
    marginTop: -spacing.md,
  },
  cta: { marginBottom: spacing.lg },
});
