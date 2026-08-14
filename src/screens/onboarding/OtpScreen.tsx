import { Text, TextInput } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Header, Screen } from '../../components/ui';
import {
  DEMO_OTP_CODE,
  OTP_LENGTH,
  OTP_RESEND_SECONDS,
  TWILIO_AUTH_ENABLED,
} from '../../config/auth';
import { useUser } from '../../context/UserContext';
import { sendOtp, verifyOtp } from '../../services/auth';
import type { OnboardingStackParamList } from '../../types';
import { colors, fonts, radius, spacing, typography } from '../../theme';
import { signupDraft } from './NameScreen';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Otp'>;

const emptyOtp = () => Array.from({ length: OTP_LENGTH }, () => '');

export function OtpScreen({ navigation, route }: Props) {
  const { mode, phone, phoneE164 } = route.params;
  const { signIn } = useUser();
  const [otp, setOtp] = useState(emptyOtp);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(OTP_RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(React.ElementRef<typeof TextInput> | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const code = otp.join('');

  const onChangeDigit = (index: number, value: string) => {
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

  const completeAuth = async () => {
    if (mode === 'login') {
      await signIn(phoneE164);
      navigation.getParent()?.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] }),
      );
    } else {
      signupDraft.phone = phoneE164;
      navigation.navigate('Name');
    }
  };

  const verify = async () => {
    if (code.length < OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code`);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await verifyOtp({
        phoneE164,
        code,
        mode,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      await completeAuth();
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (seconds > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      const result = await sendOtp({ phoneE164, mode, channel: 'sms' });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOtp(emptyOtp());
      setSeconds(OTP_RESEND_SECONDS);
      inputs.current[0]?.focus();
    } finally {
      setResending(false);
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
          <View style={styles.lockWell}>
            <FranIcon name="chat" size={22} color={colors.brown} />
          </View>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.sub}>
            {TWILIO_AUTH_ENABLED ? 'Code sent to ' : 'Demo verify for '}
            <Text style={styles.phone}>{phone}</Text>
          </Text>
          <View style={styles.hintChip}>
            <Text style={styles.hint}>
              {TWILIO_AUTH_ENABLED
                ? `SMS · Singapore · ${OTP_LENGTH}-digit code`
                : `Demo mode — enter ${DEMO_OTP_CODE}`}
            </Text>
          </View>

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
          {error ? (
            <View style={styles.errorRow}>
              <FranIcon name="alert" size={14} color={colors.danger} />
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            disabled={seconds > 0 || resending}
            onPress={onResend}
            accessibilityRole="button"
            style={({ pressed }) => [styles.resend, pressed && { opacity: 0.6 }]}
          >
            <Text
              style={[
                styles.resendText,
                (seconds > 0 || resending) && { color: colors.brownMuted },
              ]}
            >
              {resending
                ? 'Sending…'
                : seconds > 0
                  ? `Resend code in ${seconds}s`
                  : 'Resend code'}
            </Text>
          </Pressable>
        </View>
        <Button
          title="Verify"
          onPress={verify}
          loading={loading}
          style={{ marginBottom: spacing.lg }}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: spacing.lg },
  lockWell: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...typography.h1 },
  sub: { ...typography.body, color: colors.inkSoft, marginTop: spacing.sm },
  phone: { fontFamily: fonts.bodySemi, color: colors.ink },
  hintChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSunken,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    marginTop: spacing.md,
    marginBottom: spacing.xxxl,
  },
  hint: { ...typography.micro, color: colors.inkSoft },
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
    height: 62,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontFamily: fonts.displayExtra,
    fontSize: 26,
    color: colors.ink,
    paddingHorizontal: 0,
  },
  otpFilled: {
    borderColor: colors.yellowDeep,
    backgroundColor: colors.yellowSoft,
  },
  otpError: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: spacing.md,
  },
  error: { ...typography.caption, color: colors.danger },
  resend: { marginTop: spacing.xl, alignSelf: 'center' },
  resendText: { ...typography.bodyBold, color: colors.brown },
});
