import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Header, Input, Screen } from '../../components/ui';
import { TWILIO_AUTH_ENABLED } from '../../config/auth';
import { parseSingaporeMobile, sendOtp } from '../../services/auth';
import type { OnboardingStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

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
          <View style={styles.iconWell}>
            <Ionicons name="call-outline" size={22} color={colors.brown} />
          </View>
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
            hint={
              TWILIO_AUTH_ENABLED
                ? undefined
                : 'SMS not live yet — next screen accepts demo code 1234.'
            }
          />
        </View>
        <Button
          title="Send OTP"
          onPress={onContinue}
          loading={loading}
          iconAfter
          icon="arrow-forward"
          style={styles.cta}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: spacing.lg },
  iconWell: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...typography.h1, marginBottom: spacing.sm },
  sub: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.xxl },
  cta: { marginBottom: spacing.lg },
});
