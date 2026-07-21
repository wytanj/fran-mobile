import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Divider, ListRow, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { useLayout } from '../../layout/useLayout';
import type { RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

export function AccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, signOut } = useUser();
  const { gutter } = useLayout();

  return (
    <Screen padded={false} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.pad, { paddingHorizontal: gutter }]}>
          <Text style={styles.title}>Account</Text>
          <View style={styles.hero}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.slice(0, 1).toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.meta}>{user.phone}</Text>
              <Text style={styles.meta}>Member ID {user.memberId}</Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          {[
            { title: 'My details', icon: 'person-outline' as const, route: 'MyDetails' as const },
            {
              title: 'Purchase history',
              icon: 'receipt-outline' as const,
              route: 'PurchaseHistory' as const,
            },
            {
              title: 'Store locator',
              icon: 'location-outline' as const,
              route: 'StoreLocator' as const,
            },
            { title: 'FAQ', icon: 'help-circle-outline' as const, route: 'Faq' as const },
            {
              title: 'My feedback',
              icon: 'chatbubble-ellipses-outline' as const,
              route: 'Feedback' as const,
            },
            {
              title: 'Privacy',
              icon: 'shield-checkmark-outline' as const,
              route: 'Privacy' as const,
            },
          ].map((item) => (
            <ListRow
              key={item.title}
              title={item.title}
              icon={item.icon}
              onPress={() => navigation.navigate(item.route)}
            />
          ))}
        </View>

        <View style={styles.listBlock}>
          <ListRow
            title="Terms of use"
            icon="document-text-outline"
            onPress={() =>
              Alert.alert('Terms of use', 'Full write-up will link to the Fran website.')
            }
          />
          <Divider />
          <ListRow
            title="Log out"
            icon="log-out-outline"
            danger
            onPress={() =>
              Alert.alert('Log out', 'Sign out of Fran?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log out', style: 'destructive', onPress: () => signOut() },
              ])
            }
          />
        </View>
        <Text style={styles.version}>Fran · v1.0.0 prototype</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.huge },
  pad: {},
  title: { ...typography.h1, color: colors.ink, marginTop: spacing.sm, marginBottom: spacing.lg },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.h2, color: colors.brown },
  name: { ...typography.h3, color: colors.ink },
  meta: { ...typography.caption, color: colors.muted, marginTop: 2 },
  grid: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  listBlock: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  version: {
    ...typography.caption,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
