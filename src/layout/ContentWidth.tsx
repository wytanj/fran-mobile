import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useLayout } from './useLayout';

/**
 * Centers children and caps width on medium/expanded (foldable inner, tablet) displays.
 * Full-bleed backgrounds should sit outside this wrapper.
 */
export function ContentWidth({
  children,
  style,
  flex = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Pass false for nested blocks that should not grow to fill height */
  flex?: boolean;
}) {
  const { contentMaxWidth } = useLayout();

  return (
    <View
      style={[
        styles.base,
        flex && styles.flex,
        contentMaxWidth != null ? { maxWidth: contentMaxWidth } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    alignSelf: 'center',
  },
  flex: {
    flex: 1,
  },
});
