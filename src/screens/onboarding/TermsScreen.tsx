import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import type { OnboardingStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';
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
          style={[styles.checkRow, accepted && styles.checkRowOn]}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxOn]}>
            {accepted ? <Ionicons name="checkmark" size={16} color={colors.brown} /> : null}
          </View>
          <Text style={styles.checkText}>
            I accept the <Text style={styles.link}>Terms of Use</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
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
  title: { ...typography.h1, color: colors.ink, marginBottom: spacing.sm },
  sub: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.xxl },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  checkRowOn: {
    borderColor: colors.yellowDeep,
    backgroundColor: colors.yellowSoft,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxOn: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellowDeep,
  },
  checkText: { ...typography.body, color: colors.ink, flex: 1 },
  link: { color: colors.brown, fontWeight: '600' },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.sm },
});
