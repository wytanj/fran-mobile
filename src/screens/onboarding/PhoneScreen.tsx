import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button, Header, Input, Screen } from '../../components/ui';
import type { OnboardingStackParamList } from '../../types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Phone'>;

export function PhoneScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const onContinue = () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 8) {
      setError('Enter a valid mobile number');
      return;
    }
    setError('');
    const formatted = phone.startsWith('+') ? phone : `+65 ${phone}`;
    navigation.navigate('Otp', { mode, phone: formatted });
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
            We'll send a one-time code. Your number is your login — no password.
          </Text>
          <Input
            label="Mobile number"
            placeholder="+65 9XXX XXXX"
            keyboardType="phone-pad"
            autoFocus
            value={phone}
            onChangeText={setPhone}
            error={error}
          />
        </View>
        <Button title="Send OTP" onPress={onContinue} style={styles.cta} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: spacing.lg },
  title: { ...typography.h1, color: colors.ink, marginBottom: spacing.sm },
  sub: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.xxl },
  cta: { marginBottom: spacing.lg },
});
