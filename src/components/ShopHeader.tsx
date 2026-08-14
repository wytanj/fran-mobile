import { Text } from './ThemedText';
import { FranIcon } from './FranIcon';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { clubTiers } from '../data/catalog';
import { useLayout } from '../layout/useLayout';
import type { RootStackParamList } from '../types';
import { colors, radius, spacing, typography } from '../theme';
import { FranLogo } from './FranLogo';

/** Ready canvas header: logo left, login or points, search + bell. */
export function ShopHeader() {
  const insets = useSafeAreaInsets();
  const { gutter } = useLayout();
  const { isAuthed, user } = useUser();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const club = clubTiers.find((t) => t.tier === user.tier) ?? clubTiers[0];

  const goAuth = () => navigation.navigate('Onboarding');

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8, paddingHorizontal: gutter }]}>
      <FranLogo height={20} variant="brown" />
      <View style={styles.actions}>
        {isAuthed ? (
          <Pressable
            onPress={() => navigation.navigate('Transactions')}
            accessibilityRole="button"
            accessibilityLabel={`${user.points} points`}
            style={({ pressed }) => [styles.pointsChip, pressed && styles.pressed]}
          >
            <Text style={styles.pointsText} numberOfLines={1}>
              {club.name} · {user.points.toLocaleString()} pts
            </Text>
            <FranIcon name="chevronRight" size={12} color={colors.brown} />
          </Pressable>
        ) : (
          <Pressable
            onPress={goAuth}
            accessibilityRole="button"
            accessibilityLabel="Log in"
            style={({ pressed }) => [styles.login, pressed && styles.pressed]}
          >
            <Text style={styles.loginText}>Log in</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => navigation.navigate('Catalog')}
          accessibilityRole="button"
          accessibilityLabel="Search catalog"
          hitSlop={8}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        >
          <FranIcon name="search" size={22} color={colors.brown} />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Notifications')}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          hitSlop={8}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        >
          <FranIcon name="alert" size={20} color={colors.brown} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.background,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  login: {
    backgroundColor: colors.yellow,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  loginText: { ...typography.captionBold, color: colors.brown },
  pointsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.yellowSoft,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: 180,
  },
  pointsText: { ...typography.micro, color: colors.brown },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.65 },
});
