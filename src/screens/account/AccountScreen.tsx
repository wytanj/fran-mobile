import { Text } from '../../components/ThemedText';
import { type FranIconName } from '../../components/FranIcon';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Divider, ListRow, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { useLayout } from '../../layout/useLayout';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

/** Account destinations — all param-less, so they can be driven from data */
type MenuRoute = 'MyDetails' | 'PurchaseHistory' | 'StoreLocator' | 'Faq' | 'Feedback' | 'Privacy';

const MENU: {
  title: string;
  subtitle: string;
  icon: FranIconName;
  route: MenuRoute;
  tone?: 'yellow' | 'blue' | 'peach';
}[] = [
  {
    title: 'My details',
    subtitle: 'Name, contact and birthday',
    icon: 'person',
    route: 'MyDetails',
  },
  {
    title: 'Purchase history',
    subtitle: 'Past orders and receipts',
    icon: 'receipt',
    route: 'PurchaseHistory',
    tone: 'blue',
  },
  {
    title: 'Store locator',
    subtitle: 'Find a Fran near you',
    icon: 'pin',
    route: 'StoreLocator',
    tone: 'peach',
  },
  { title: 'FAQ', subtitle: 'Points, tiers and vouchers', icon: 'help', route: 'Faq' },
  {
    title: 'My feedback',
    subtitle: 'Tell us how we are doing',
    icon: 'chat',
    route: 'Feedback',
    tone: 'blue',
  },
  {
    title: 'Privacy',
    subtitle: 'Data and account controls',
    icon: 'shield',
    route: 'Privacy',
    tone: 'peach',
  },
];

export function AccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, signOut } = useUser();
  const { gutter } = useLayout();

  return (
    <Screen padded={false} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: gutter }}>
          <Text style={styles.eyebrow}>Settings</Text>
          <Text style={styles.title}>Account</Text>

          <View style={[styles.hero, shadow.sm]}>
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name.slice(0, 1).toUpperCase()}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.meta}>{user.phone}</Text>
              <View style={styles.idChip}>
                <Text style={styles.idChipText}>ID {user.memberId}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.group, shadow.sm]}>
            {MENU.map((item, i) => (
              <React.Fragment key={item.title}>
                {i > 0 ? <Divider inset /> : null}
                <ListRow
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  iconTone={item.tone ?? 'yellow'}
                  onPress={() => navigation.navigate(item.route)}
                />
              </React.Fragment>
            ))}
          </View>

          <View style={[styles.group, shadow.sm]}>
            <ListRow
              title="Terms of use"
              icon="document"
              iconTone="cream"
              onPress={() =>
                Alert.alert('Terms of use', 'Full write-up will link to the Fran website.')
              }
            />
            <Divider inset />
            <ListRow
              title="Log out"
              icon="logout"
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
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.huge },
  eyebrow: { ...typography.eyebrow, marginTop: spacing.md },
  title: { ...typography.h1, marginTop: 4, marginBottom: spacing.xl },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginBottom: spacing.lg,
  },
  avatarRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.h2, color: colors.brown },
  name: { ...typography.h3 },
  meta: { ...typography.caption, marginTop: 2 },
  idChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSunken,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  idChipText: { ...typography.micro, color: colors.inkSoft, letterSpacing: 0.5 },
  group: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  version: {
    ...typography.micro,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
