import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Header, ProgressBar, Screen } from '../../components/ui';
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
      <ProgressBar value={progress} height={6} style={styles.progress} />
      <View style={styles.stepRow}>
        <Text style={styles.step}>
          Question {step + 1} of {questions.length}
        </Text>
        {q.type === 'multi' && q.maxSelect ? (
          <Text style={styles.step}>Pick up to {q.maxSelect}</Text>
        ) : null}
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.question}>{q.question}</Text>
        {q.type === 'multi' ? (
          <View style={styles.chips}>
            {q.options.map((opt) => {
              const on = isSelected(opt.id);
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => toggleMulti(opt.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  style={({ pressed }) => [
                    styles.chip,
                    on && styles.chipOn,
                    pressed && !on && { backgroundColor: colors.surfaceSunken },
                  ]}
                >
                  {on ? (
                    <FranIcon name="check" size={13} color={colors.brown} />
                  ) : null}
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{opt.label}</Text>
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
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  style={({ pressed }) => [
                    styles.option,
                    on && styles.optionOn,
                    pressed && !on && { backgroundColor: colors.surfaceSunken },
                  ]}
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
  progress: { marginBottom: spacing.md },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  step: { ...typography.eyebrow },
  question: { ...typography.h2, marginBottom: spacing.xl, maxWidth: 460 },
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
    marginTop: 1,
  },
  radioOn: { borderColor: colors.yellowDeep, backgroundColor: colors.white },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.yellowDeep,
  },
  optLabel: { ...typography.title },
  optHint: { ...typography.caption, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipOn: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellowDeep,
  },
  chipText: { ...typography.captionBold },
  chipTextOn: { color: colors.brown },
});
