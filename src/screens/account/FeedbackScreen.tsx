import { Text, TextInput } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Header, Screen } from '../../components/ui';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Feedback'>;

const RATINGS: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Very satisfied', icon: 'happy-outline' },
  { label: 'Satisfied', icon: 'thumbs-up-outline' },
  { label: 'Neutral', icon: 'remove-circle-outline' },
  { label: 'Dissatisfied', icon: 'thumbs-down-outline' },
  { label: 'Very dissatisfied', icon: 'sad-outline' },
];

export function FeedbackScreen({ navigation }: Props) {
  const [rating, setRating] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  return (
    <Screen edges={['top']}>
      <Header title="My feedback" onBack={() => navigation.goBack()} />
      <Text style={styles.intro}>
        Thank you for shopping at Fran. Help us improve your in-store and app experience — your
        responses are reviewed by our retail ops team.
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Overall satisfaction</Text>
        <View style={styles.ratings}>
          {RATINGS.map((r) => {
            const on = rating === r.label;
            return (
              <Pressable
                key={r.label}
                onPress={() => setRating(r.label)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                style={({ pressed }) => [
                  styles.rateRow,
                  on && styles.rateRowOn,
                  pressed && !on && { backgroundColor: colors.surfaceSunken },
                ]}
              >
                <Ionicons
                  name={r.icon}
                  size={20}
                  color={on ? colors.brown : colors.brownMuted}
                />
                <Text style={[styles.rateText, on && styles.rateTextOn]}>{r.label}</Text>
                {on ? <Ionicons name="checkmark-circle" size={19} color={colors.brown} /> : null}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Comments (optional)</Text>
        <TextInput
          style={styles.area}
          multiline
          placeholder="Share feedback about your visit or the app"
          placeholderTextColor={colors.brownMuted}
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
        />
      </ScrollView>
      <Button
        title="Submit feedback"
        onPress={() => {
          if (!rating) {
            Alert.alert('Select a rating', 'Please choose your overall satisfaction.');
            return;
          }
          Alert.alert('Thank you', 'Your feedback has been recorded.');
          navigation.goBack();
        }}
        style={{ marginTop: spacing.md, marginBottom: spacing.lg }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.xl },
  label: { ...typography.eyebrow, marginBottom: spacing.sm },
  ratings: { gap: spacing.sm, marginBottom: spacing.xl },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  rateRowOn: {
    borderColor: colors.yellowDeep,
    backgroundColor: colors.yellowSoft,
  },
  rateText: { ...typography.title, flex: 1, color: colors.inkSoft },
  rateTextOn: { color: colors.brown },
  area: {
    minHeight: 130,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    ...typography.body,
  },
});
