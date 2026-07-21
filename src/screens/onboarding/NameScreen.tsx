import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button, Header, Input, Screen } from '../../components/ui';
import type { OnboardingStackParamList } from '../../types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Name'>;

/** Shared draft across onboarding screens (prototype, no form lib) */
export const signupDraft: {
  name: string;
  birthday: string | null;
  email: string | null;
  phone: string;
} = {
  name: '',
  birthday: null,
  email: null,
  phone: '',
};

export function NameScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const goNext = () => {
    if (name.trim().length < 2) {
      setError('Please enter your name');
      return;
    }
    setError('');
    signupDraft.name = name.trim();
    navigation.navigate('OptionalDetails');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <Header title="About you" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>What should we call you?</Text>
          <Text style={styles.sub}>Your name helps personalize rewards and in-app greetings.</Text>
          <Input
            label="Name"
            placeholder="Your name"
            autoFocus
            value={name}
            onChangeText={setName}
            error={error}
            autoCapitalize="words"
          />
        </View>
        <Button title="Continue" onPress={goNext} style={{ marginBottom: spacing.lg }} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: spacing.lg },
  title: { ...typography.h1, color: colors.ink, marginBottom: spacing.sm },
  sub: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.xxl },
});
