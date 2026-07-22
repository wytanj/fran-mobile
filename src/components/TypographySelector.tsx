import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  fontFamilies,
  typographyVariants,
  useTypography,
} from '../context/TypographyContext';
import { colors, radius, shadow, spacing } from '../theme';

export function TypographySelector() {
  const { variant, setVariant } = useTypography();

  return (
    <View style={[styles.shell, shadow.md]}>
      <Text style={styles.label}>TYPE</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {typographyVariants.map((option) => {
          const selected = option.id === variant;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityLabel={`Typography ${option.id}: ${option.name}. ${option.description}`}
              accessibilityState={{ selected }}
              onPress={() => setVariant(option.id)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {option.id}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  label: {
    color: colors.muted,
    fontFamily: fontFamilies.symbolSemibold,
    fontSize: 9,
    letterSpacing: 0.8,
    marginHorizontal: spacing.sm,
  },
  row: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 3,
  },
  option: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  optionSelected: {
    backgroundColor: colors.yellow,
  },
  optionText: {
    color: colors.muted,
    fontFamily: fontFamilies.symbolSemibold,
    fontSize: 12,
  },
  optionTextSelected: {
    color: colors.brown,
  },
});
