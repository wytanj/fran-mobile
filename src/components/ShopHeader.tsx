import { Text } from './ThemedText';
import { FranIcon } from './FranIcon';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { useLayout } from '../layout/useLayout';
import type { RootStackParamList } from '../types';
import { colors, radius, spacing, typography } from '../theme';
import { FranLogo } from './FranLogo';

export function ShopHeader() {
  const insets = useSafeAreaInsets();
  const { gutter } = useLayout();
  const { wishlist } = useUser();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const count = wishlist.length;

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8, paddingHorizontal: gutter }]}>
      <Pressable
        onPress={() => navigation.navigate('MemberId')}
        accessibilityRole="button"
        accessibilityLabel="Member ID"
        hitSlop={8}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
      >
        <FranIcon name="qr" size={22} color={colors.brown} />
      </Pressable>
      <FranLogo height={22} variant="brown" />
      <Pressable
        onPress={() => navigation.navigate('Wishlist')}
        accessibilityRole="button"
        accessibilityLabel={`Wishlist, ${count} saved`}
        hitSlop={8}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
      >
        <FranIcon name="heart" size={20} color={colors.brown} />
        {count > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count > 99 ? '99+' : String(count)}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.yellow,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.65 },
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    ...typography.micro,
    color: colors.white,
    fontSize: 8,
    lineHeight: 10,
    letterSpacing: 0,
  },
});
