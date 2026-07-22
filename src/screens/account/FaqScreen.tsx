import { Text, TextInput } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { LayoutAnimation, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Header, Screen } from '../../components/ui';
import { faqs } from '../../data/mock';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

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
      <Pressable key={id} onPress={() => toggle(id)} style={styles.item}>
        <View style={styles.itemHead}>
          <Text style={styles.q}>{question}</Text>
          <Ionicons name={open ? 'remove' : 'add'} size={20} color={colors.ink} />
        </View>
        {open ? <Text style={styles.a}>{answer}</Text> : null}
      </Pressable>
    );
  };

  return (
    <Screen edges={['top']}>
      <Header title="FAQ" onBack={() => navigation.goBack()} />
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search FAQs"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.huge }}>
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
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: spacing.lg,
    height: 48,
    marginBottom: spacing.lg,
  },
  searchInput: { flex: 1, ...typography.body, color: colors.ink },
  section: { ...typography.captionBold, color: colors.muted, marginBottom: spacing.sm, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  item: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemHead: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  q: { ...typography.bodyBold, color: colors.ink, flex: 1 },
  a: { ...typography.body, color: colors.inkSoft, marginTop: spacing.md },
});
