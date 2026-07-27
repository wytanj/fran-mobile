import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Switch, StyleSheet, View } from 'react-native';
import { Button, Divider, Header, IconTile, ListRow, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Privacy'>;

export function PrivacyScreen({ navigation }: Props) {
  const { signOut } = useUser();
  const [push, setPush] = useState(true);
  const [promo, setPromo] = useState(true);

  return (
    <Screen edges={['top']}>
      <Header title="Privacy & security" onBack={() => navigation.goBack()} />
      <Text style={styles.section}>Notifications</Text>
      <View style={[styles.group, shadow.sm]}>
        <View style={styles.row}>
          <IconTile icon="notifications-outline" size={38} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Push notifications</Text>
            <Text style={styles.sub}>Points, streaks and voucher reminders</Text>
          </View>
          <Switch
            value={push}
            onValueChange={setPush}
            trackColor={{ true: colors.yellow, false: colors.border }}
            thumbColor={colors.white}
          />
        </View>
        <Divider inset />
        <View style={styles.row}>
          <IconTile icon="pricetags-outline" size={38} iconSize={18} tone="peach" />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Promo & offers</Text>
            <Text style={styles.sub}>Member-exclusive drops and events</Text>
          </View>
          <Switch
            value={promo}
            onValueChange={setPromo}
            trackColor={{ true: colors.yellow, false: colors.border }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      <Text style={styles.section}>Your data</Text>
      <View style={[styles.group, shadow.sm]}>
        <ListRow
          title="Privacy policy"
          subtitle="How we store and use your data"
          icon="shield-checkmark-outline"
          iconTone="blue"
          onPress={() => Alert.alert('Privacy policy', 'Full policy will open on the Fran website.')}
        />
      </View>
      <View style={{ flex: 1 }} />
      <Button
        title="Delete account"
        variant="danger"
        onPress={() =>
          Alert.alert(
            'Delete account?',
            'This permanently removes your profile, points, and vouchers.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => signOut(),
              },
            ],
          )
        }
        style={{ marginBottom: spacing.lg }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.eyebrow, marginBottom: spacing.sm, marginTop: spacing.lg },
  group: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 62,
  },
  label: { ...typography.title },
  sub: { ...typography.caption, marginTop: 1 },
});
