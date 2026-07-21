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

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;
const emptyOtp = () => Array.from({ length: OTP_LENGTH }, () => '');

export function OtpScreen({ navigation, route }: Props) {
  const { mode, phone } = route.params;
  const { signIn } = useUser();
  const [otp, setOtp] = useState(emptyOtp);
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
    // Support paste of full code into any box
    const digits = value.replace(/\D/g, '');
    if (digits.length > 1) {
      const next = emptyOtp();
      for (let i = 0; i < OTP_LENGTH; i++) {
        next[i] = digits[i] ?? '';
      }
      setOtp(next);
      setError('');
      const focusAt = Math.min(digits.length, OTP_LENGTH) - 1;
      inputs.current[Math.max(0, focusAt)]?.focus();
      return;
    }

    const digit = digits.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');
    if (digit && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const onKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verify = async () => {
    if (code.length < OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code`);
      return;
    }
    // Prototype: any 4-digit code is accepted (demo tip shows 1234)
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
          <Text style={styles.hint}>Demo tip: use 1234</Text>

          <View style={styles.otpRow}>
            {otp.map((d, i) => (
              <TextInput
                key={i}
                ref={(r) => {
                  inputs.current[i] = r;
                }}
                style={[styles.otpBox, d ? styles.otpFilled : null, error ? styles.otpError : null]}
                keyboardType="number-pad"
                maxLength={i === 0 ? OTP_LENGTH : 1}
                value={d}
                onChangeText={(v) => onChangeDigit(i, v)}
                onKeyPress={({ nativeEvent }) => onKeyPress(i, nativeEvent.key)}
                selectTextOnFocus
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
              />
            ))}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            disabled={seconds > 0}
            onPress={() => {
              setSeconds(RESEND_SECONDS);
              setOtp(emptyOtp());
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
  hint: {
    ...typography.caption,
    color: colors.muted,
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 320,
  },
  otpBox: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 48,
    maxWidth: 64,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
    paddingHorizontal: 0,
  },
  otpFilled: { borderColor: colors.yellowDeep, backgroundColor: colors.yellowSoft },
  otpError: { borderColor: colors.danger },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.sm },
  resend: { marginTop: spacing.xl, alignSelf: 'center' },
  resendText: { ...typography.bodyBold, color: colors.brown },
});
