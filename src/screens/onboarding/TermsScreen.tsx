import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import type { OnboardingStackParamList } from '../../types';
import { colors, fonts, radius, spacing, typography } from '../../theme';
import { signupDraft } from './NameScreen';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Terms'>;

export function TermsScreen({ navigation }: Props) {
  const { completeSignup } = useUser();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onCreate = async () => {
    if (!accepted) {
      setError('Please accept the Terms of Use and Privacy Policy');
      return;
    }
    setLoading(true);
    try {
      await completeSignup({
        name: signupDraft.name || 'Member',
        phone: signupDraft.phone || undefined,
        birthday: signupDraft.birthday,
        email: signupDraft.email,
        points: signupDraft.birthday ? 10 : 0,
        earnActionsCompleted: signupDraft.birthday ? { birthday: true } : {},
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <Header title="Terms" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>One last step</Text>
        <Text style={styles.sub}>
          Create your Fran account to start earning points at checkout and unlocking member-only
          promos.
        </Text>

        <Pressable
          onPress={() => {
            setAccepted((v) => !v);
            setError('');
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}
          style={({ pressed }) => [
            styles.checkRow,
            accepted && styles.checkRowOn,
            pressed && !accepted && { backgroundColor: colors.surfaceSunken },
          ]}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxOn]}>
            {accepted ? <Ionicons name="checkmark" size={15} color={colors.brown} /> : null}
          </View>
          <Text style={styles.checkText}>
            I accept the <Text style={styles.link}>Terms of Use</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </Pressable>
        {error ? (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color={colors.danger} />
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}
      </View>
      <Button
        title="Create account"
        onPress={onCreate}
        loading={loading}
        disabled={!accepted}
        style={{ marginBottom: spacing.lg }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: spacing.lg },
  title: { ...typography.h1, marginBottom: spacing.sm },
  sub: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.xxl },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  checkRowOn: {
    borderColor: colors.yellowDeep,
    backgroundColor: colors.yellowSoft,
  },
  checkbox: {
    width: 23,
    height: 23,
    borderRadius: radius.xs,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxOn: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellowDeep,
  },
  checkText: { ...typography.body, flex: 1 },
  link: { fontFamily: fonts.bodySemi, color: colors.brown },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.md },
  error: { ...typography.caption, color: colors.danger },
});
