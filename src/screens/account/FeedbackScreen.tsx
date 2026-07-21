import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Header, Screen } from '../../components/ui';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Feedback'>;

const RATINGS = ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'];

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
      <Text style={styles.label}>Overall satisfaction</Text>
      <View style={styles.ratings}>
        {RATINGS.map((r) => (
          <Button
            key={r}
            title={r}
            variant={rating === r ? 'primary' : 'secondary'}
            onPress={() => setRating(r)}
            style={styles.rateBtn}
          />
        ))}
      </View>
      <Text style={styles.label}>Comments (optional)</Text>
      <TextInput
        style={styles.area}
        multiline
        placeholder="Share feedback about your visit or the app"
        placeholderTextColor={colors.muted}
        value={comment}
        onChangeText={setComment}
        textAlignVertical="top"
      />
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
        style={{ marginTop: spacing.lg }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { ...typography.body, color: colors.inkSoft, marginBottom: spacing.xl },
  label: { ...typography.captionBold, color: colors.inkSoft, marginBottom: spacing.sm },
  ratings: { gap: spacing.sm, marginBottom: spacing.xl },
  rateBtn: { height: 44 },
  area: {
    minHeight: 120,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    ...typography.body,
    color: colors.ink,
  },
});
