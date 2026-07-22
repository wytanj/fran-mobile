import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Switch, StyleSheet, View } from 'react-native';
import { Button, Header, ListRow, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import type { RootStackParamList } from '../../types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Privacy'>;

export function PrivacyScreen({ navigation }: Props) {
  const { signOut } = useUser();
  const [push, setPush] = useState(true);
  const [promo, setPromo] = useState(true);

  return (
    <Screen edges={['top']}>
      <Header title="Privacy & security" onBack={() => navigation.goBack()} />
      <Text style={styles.section}>Notifications</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Push notifications</Text>
        <Switch value={push} onValueChange={setPush} trackColor={{ true: colors.primary }} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Promo & offers</Text>
        <Switch value={promo} onValueChange={setPromo} trackColor={{ true: colors.primary }} />
      </View>
      <ListRow
        title="Privacy policy"
        onPress={() => Alert.alert('Privacy policy', 'Full policy will open on the Fran website.')}
      />
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
  section: { ...typography.captionBold, color: colors.muted, marginBottom: spacing.sm, marginTop: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { ...typography.body, color: colors.ink },
});
