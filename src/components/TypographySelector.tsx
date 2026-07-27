import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fontFamilies, typographyVariants, useTypography } from '../context/TypographyContext';
import { colors, radius, shadow, spacing } from '../theme';

export function TypographySelector() {
  const { variant, setVariant } = useTypography();
  const active = typographyVariants.find((v) => v.id === variant);

  return (
    <View style={styles.dock}>
      <View style={[styles.shell, shadow.md]}>
        <View style={styles.icon}>
          <Ionicons name="text" size={13} color={colors.brown} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {typographyVariants.map((option) => {
            const selected = option.id === variant;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                accessibilityLabel={`Typography ${option.id}: ${option.name}. ${option.description}`}
                accessibilityState={{ selected }}
                onPress={() => setVariant(option.id)}
                style={({ pressed }) => [
                  styles.option,
                  selected && styles.optionSelected,
                  pressed && !selected && styles.optionPressed,
                ]}
              >
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                  {option.id}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Text style={styles.name} numberOfLines={1}>
          {active?.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingBottom: spacing.xs,
  },
  shell: {
    minHeight: 44,
    maxWidth: 460,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surfaceSunken,
    paddingHorizontal: 5,
    paddingVertical: 4,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  row: {
    flexGrow: 1,
    alignItems: 'center',
    gap: 2,
  },
  option: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  optionSelected: {
    backgroundColor: colors.yellow,
  },
  optionPressed: {
    backgroundColor: colors.border,
  },
  optionText: {
    color: colors.brownMuted,
    fontFamily: fontFamilies.symbolSemibold,
    fontSize: 12,
  },
  optionTextSelected: {
    color: colors.brown,
  },
  name: {
    color: colors.inkSoft,
    fontFamily: fontFamilies.symbolSemibold,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginHorizontal: spacing.sm,
    minWidth: 54,
    textAlign: 'right',
  },
});
