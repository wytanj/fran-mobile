import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Button, Header, Input, Screen } from '../../components/ui';
import type { OnboardingStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';
import { formatBirthdayInput } from '../../utils/formatBirthdayInput';
import { signupDraft } from './NameScreen';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OptionalDetails'>;

export function OptionalDetailsScreen({ navigation }: Props) {
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');

  const goNext = (skip: boolean) => {
    if (!skip) {
      signupDraft.birthday = birthday.trim() || null;
      signupDraft.email = email.trim() || null;
    } else {
      signupDraft.birthday = null;
      signupDraft.email = null;
    }
    navigation.navigate('Terms');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <Header title="Almost there" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconWell}>
            <FranIcon name="gift" size={22} color={colors.brown} />
          </View>
          <Text style={styles.title}>Optional details</Text>
          <Text style={styles.sub}>
            Skip for now if you like. Birthday unlocks +10 profile points later; email helps with
            receipts.
          </Text>
          <Input
            label="Birthday (optional)"
            placeholder="YYYY-MM-DD"
            value={birthday}
            onChangeText={(text) => setBirthday(formatBirthdayInput(text))}
            keyboardType="number-pad"
            maxLength={10}
            hint="Worth +10 points — and it can only be set once."
          />
          <Input
            label="Email (optional)"
            placeholder="you@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <Button
          title="Continue"
          onPress={() => goNext(false)}
          icon="arrowRight"
          iconAfter
        />
        <Pressable
          onPress={() => goNext(true)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.skip, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
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
  skip: { alignItems: 'center', paddingVertical: spacing.lg, marginBottom: spacing.sm },
  skipText: { ...typography.bodyBold, color: colors.brown },
});
