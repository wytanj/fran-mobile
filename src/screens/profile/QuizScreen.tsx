import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Header, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { categoryLabels, quizQuestions } from '../../data/quizQuestions';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export function QuizScreen({ navigation, route }: Props) {
  const { category } = route.params;
  const questions = quizQuestions[category];
  const { user, completeBeautyQuiz } = useUser();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);

  const q = questions[step];
  const progress = (step + 1) / questions.length;

  const selected = answers[q.id];
  const canNext = useMemo(() => {
    if (!selected) return false;
    if (Array.isArray(selected)) return selected.length > 0;
    return true;
  }, [selected]);

  const selectSingle = (id: string) => {
    setAnswers((a) => ({ ...a, [q.id]: id }));
  };

  const toggleMulti = (id: string) => {
    const max = q.maxSelect;
    setAnswers((a) => {
      const curr = Array.isArray(a[q.id]) ? [...(a[q.id] as string[])] : [];
      const idx = curr.indexOf(id);
      if (idx >= 0) curr.splice(idx, 1);
      else {
        if (max && curr.length >= max) return a;
        curr.push(id);
      }
      return { ...a, [q.id]: curr };
    });
  };

  const onNext = async () => {
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    if (user.beautyProfiles[category]) {
      navigation.replace('BeautyResults', { category });
      return;
    }
    setLoading(true);
    try {
      const pts = await completeBeautyQuiz(category, answers);
      Alert.alert('Profile saved', `+${pts} points earned`);
      navigation.replace('BeautyResults', { category });
    } finally {
      setLoading(false);
    }
  };

  const onBackQ = () => {
    if (step === 0) navigation.goBack();
    else setStep((s) => s - 1);
  };

  const isSelected = (id: string) => {
    if (Array.isArray(selected)) return selected.includes(id);
    return selected === id;
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <Header
        title={`${categoryLabels[category]} quiz`}
        onBack={onBackQ}
      />
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.step}>
        Question {step + 1} of {questions.length}
      </Text>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Text style={styles.question}>{q.question}</Text>
        {q.type === 'multi' ? (
          <View style={styles.chips}>
            {q.options.map((opt) => {
              const on = isSelected(opt.id);
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => toggleMulti(opt.id)}
                  style={[styles.chip, on && styles.chipOn]}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>
                    {on ? '✓ ' : ''}
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={styles.list}>
            {q.options.map((opt) => {
              const on = isSelected(opt.id);
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => selectSingle(opt.id)}
                  style={[styles.option, on && styles.optionOn]}
                >
                  <View style={[styles.radio, on && styles.radioOn]}>
                    {on ? <View style={styles.radioDot} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optLabel, on && { color: colors.brown }]}>
                      {opt.label}
                    </Text>
                    {opt.hint ? <Text style={styles.optHint}>{opt.hint}</Text> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
      <Button
        title={step === questions.length - 1 ? 'Finish' : 'Next'}
        onPress={onNext}
        disabled={!canNext}
        loading={loading}
        style={{ marginBottom: spacing.lg }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressBg: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: { height: '100%', backgroundColor: colors.yellow },
  step: { ...typography.caption, color: colors.muted, marginBottom: spacing.md },
  question: { ...typography.h2, color: colors.ink, marginBottom: spacing.xl },
  list: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionOn: {
    borderColor: colors.yellowDeep,
    backgroundColor: colors.yellowSoft,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOn: { borderColor: colors.yellowDeep },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.yellowDeep,
  },
  optLabel: { ...typography.bodyBold, color: colors.ink },
  optHint: { ...typography.caption, color: colors.muted, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  chipOn: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellowDeep,
  },
  chipText: { ...typography.captionBold, color: colors.ink },
  chipTextOn: { color: colors.brown },
});
