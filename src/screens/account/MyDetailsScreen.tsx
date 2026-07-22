import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Button, Header, Input, Screen } from '../../components/ui';
import { formatGender, useUser } from '../../context/UserContext';
import type { Gender, RootStackParamList } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MyDetails'>;

const GENDERS: { value: Exclude<Gender, null>; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export function MyDetailsScreen({ navigation }: Props) {
  const { user, updateUser } = useUser();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email ?? '');
  const [genderOpen, setGenderOpen] = useState(false);

  const save = async () => {
    await updateUser({
      name: name.trim() || user.name,
      email: email.trim() || null,
    });
    Alert.alert('Saved', 'Your details were updated.');
  };

  return (
    <Screen edges={['top']}>
      <Header title="My details" onBack={() => navigation.goBack()} />
      <Input label="Name *" value={name} onChangeText={setName} />
      <Input label="Phone number *" value={user.phone} editable={false} />
      <Pressable style={styles.field} onPress={() => setGenderOpen(true)}>
        <Text style={styles.fieldLabel}>Gender</Text>
        <Text style={styles.fieldValue}>{formatGender(user.gender)}</Text>
      </Pressable>
      <Pressable
        style={styles.field}
        onPress={() => {
          if (user.birthday) {
            Alert.alert('Birthday locked', 'Birthday cannot be changed once selected.');
          } else {
            navigation.navigate('BirthdayModal');
          }
        }}
      >
        <Text style={styles.fieldLabel}>Birthday</Text>
        <Text style={[styles.fieldValue, !user.birthday && { color: colors.brown }]}>
          {user.birthday ?? 'Add birthday'}
        </Text>
        {user.birthday ? (
          <Text style={styles.lock}>Once selected, unmodifiable</Text>
        ) : null}
      </Pressable>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Fill in"
      />
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Country of registration</Text>
        <Text style={styles.fieldValue}>{user.country}</Text>
      </View>
      <Button title="Save changes" onPress={save} style={{ marginTop: spacing.lg }} />

      <Modal visible={genderOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setGenderOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Gender</Text>
            {GENDERS.map((g) => (
              <Pressable
                key={g.value}
                style={styles.sheetRow}
                onPress={async () => {
                  await updateUser({ gender: g.value });
                  setGenderOpen(false);
                }}
              >
                <Text style={styles.sheetText}>{g.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.lg,
  },
  fieldLabel: { ...typography.captionBold, color: colors.inkSoft, marginBottom: 4 },
  fieldValue: { ...typography.body, color: colors.ink },
  lock: { ...typography.micro, color: colors.danger, marginTop: 4 },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.huge,
  },
  sheetTitle: { ...typography.h3, color: colors.ink, marginBottom: spacing.md },
  sheetRow: { paddingVertical: spacing.md },
  sheetText: { ...typography.body, color: colors.ink },
});
