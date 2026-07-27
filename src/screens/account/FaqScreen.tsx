import { Text, TextInput } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { LayoutAnimation, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { faqs } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, tint, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Faq'>;

export function FaqScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
    );
  }, [query]);

  const top = filtered.filter((f) => f.top);
  const rest = filtered.filter((f) => !f.top);

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((cur) => (cur === id ? null : id));
  };

  const renderItem = (id: string, question: string, answer: string) => {
    const open = openId === id;
    return (
      <Pressable
        key={id}
        onPress={() => toggle(id)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={({ pressed }) => [
          styles.item,
          open && styles.itemOpen,
          pressed && { backgroundColor: tint.inkFaint },
        ]}
      >
        <View style={styles.itemHead}>
          <Text style={styles.q}>{question}</Text>
          <View style={[styles.plus, open && styles.plusOpen]}>
            <FranIcon name={open ? 'minus' : 'plus'} size={16} color={colors.brown} />
          </View>
        </View>
        {open ? <Text style={styles.a}>{answer}</Text> : null}
      </Pressable>
    );
  };

  return (
    <Screen edges={['top']}>
      <Header title="FAQ" onBack={() => navigation.goBack()} />
      <View style={styles.search}>
        <FranIcon name="search" size={17} color={colors.brownMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search FAQs"
          placeholderTextColor={colors.brownMuted}
          value={query}
          onChangeText={setQuery}
        />
        {query ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityLabel="Clear search">
            <FranIcon name="closeCircle" size={17} color={colors.borderStrong} />
          </Pressable>
        ) : null}
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.huge }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.section}>Top questions</Text>
        <View style={styles.card}>{top.map((f) => renderItem(f.id, f.question, f.answer))}</View>
        {rest.length ? (
          <>
            <Text style={styles.section}>More</Text>
            <View style={styles.card}>{rest.map((f) => renderItem(f.id, f.question, f.answer))}</View>
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    height: 50,
    marginBottom: spacing.lg,
  },
  searchInput: { flex: 1, ...typography.body },
  section: { ...typography.eyebrow, marginBottom: spacing.sm, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  item: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  itemOpen: { backgroundColor: colors.cream },
  itemHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  plus: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusOpen: { backgroundColor: colors.yellowSoft },
  q: { ...typography.title, flex: 1 },
  a: { ...typography.body, color: colors.inkSoft, marginTop: spacing.md },
});
