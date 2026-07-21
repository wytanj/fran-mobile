import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button, Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import type { OnboardingStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';
import { signupDraft } from './NameScreen';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Otp'>;

const RESEND_SECONDS = 30;

export function OtpScreen({ navigation, route }: Props) {
  const { mode, phone } = route.params;
  const { signIn } = useUser();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const code = otp.join('');

  const onChangeDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  };

  const onKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verify = async () => {
    if (code.length < 6) {
      setError('Enter the 6-digit code');
      return;
    }
    // Prototype: any 6-digit code is accepted (demo tip shows 123456)
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(phone);
      } else {
        signupDraft.phone = phone;
        navigation.navigate('Name');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <Header title="Verify" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.sub}>
            Code sent to <Text style={styles.phone}>{phone}</Text>
          </Text>
          <Text style={styles.hint}>Demo tip: use 123456</Text>

          <View style={styles.otpRow}>
            {otp.map((d, i) => (
              <TextInput
                key={i}
                ref={(r) => {
                  inputs.current[i] = r;
                }}
                style={[styles.otpBox, d ? styles.otpFilled : null, error ? styles.otpError : null]}
                keyboardType="number-pad"
                maxLength={1}
                value={d}
                onChangeText={(v) => onChangeDigit(i, v)}
                onKeyPress={({ nativeEvent }) => onKeyPress(i, nativeEvent.key)}
                selectTextOnFocus
              />
            ))}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            disabled={seconds > 0}
            onPress={() => {
              setSeconds(RESEND_SECONDS);
              setOtp(['', '', '', '', '', '']);
              setError('');
            }}
            style={styles.resend}
          >
            <Text style={[styles.resendText, seconds > 0 && { color: colors.muted }]}>
              {seconds > 0 ? `Resend code in ${seconds}s` : 'Resend code'}
            </Text>
          </Pressable>
        </View>
        <Button title="Verify" onPress={verify} loading={loading} style={{ marginBottom: spacing.lg }} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: spacing.lg },
  title: { ...typography.h1, color: colors.ink },
  sub: { ...typography.body, color: colors.inkSoft, marginTop: spacing.sm },
  phone: { fontWeight: '600', color: colors.ink },
  hint: { ...typography.caption, color: colors.muted, marginTop: spacing.sm, marginBottom: spacing.xxl },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
  },
  otpFilled: { borderColor: colors.yellowDeep, backgroundColor: colors.yellowSoft },
  otpError: { borderColor: colors.danger },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.sm },
  resend: { marginTop: spacing.xl, alignSelf: 'center' },
  resendText: { ...typography.bodyBold, color: colors.brown },
});
