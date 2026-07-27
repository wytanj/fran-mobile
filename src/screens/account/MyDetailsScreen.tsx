import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Header, Input, Screen } from '../../components/ui';
import { formatGender, useUser } from '../../context/UserContext';
import type { Gender, RootStackParamList } from '../../types';
import { colors, fonts, radius, shadow, spacing, typography } from '../../theme';

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.huge }}
        keyboardShouldPersistTaps="handled"
      >
        <Input label="Name *" value={name} onChangeText={setName} />

        <View style={styles.readonlyWrap}>
          <Text style={styles.fieldLabel}>Phone number *</Text>
          <View style={[styles.field, styles.fieldLocked]}>
            <Text style={styles.fieldValue}>{user.phone}</Text>
            <FranIcon name="lock" size={14} color={colors.brownMuted} />
          </View>
        </View>

        <View style={styles.readonlyWrap}>
          <Text style={styles.fieldLabel}>Gender</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setGenderOpen(true)}
            style={({ pressed }) => [styles.field, pressed && { backgroundColor: colors.cream }]}
          >
            <Text style={[styles.fieldValue, !user.gender && styles.fieldPlaceholder]}>
              {formatGender(user.gender)}
            </Text>
            <FranIcon name="chevronDown" size={16} color={colors.brownMuted} />
          </Pressable>
        </View>

        <View style={styles.readonlyWrap}>
          <Text style={styles.fieldLabel}>Birthday</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (user.birthday) {
                Alert.alert('Birthday locked', 'Birthday cannot be changed once selected.');
              } else {
                navigation.navigate('BirthdayModal');
              }
            }}
            style={({ pressed }) => [
              styles.field,
              user.birthday && styles.fieldLocked,
              pressed && !user.birthday && { backgroundColor: colors.cream },
            ]}
          >
            <Text
              style={[
                styles.fieldValue,
                !user.birthday && { color: colors.brown, fontFamily: fonts.bodySemi },
              ]}
            >
              {user.birthday ?? 'Add birthday for +10 points'}
            </Text>
            <FranIcon
              name={user.birthday ? 'lock' : 'chevronRight'}
              size={user.birthday ? 14 : 16}
              color={user.birthday ? colors.brownMuted : colors.brown}
            />
          </Pressable>
          {user.birthday ? (
            <Text style={styles.lock}>Once selected, this cannot be modified.</Text>
          ) : null}
        </View>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@email.com"
        />

        <View style={styles.readonlyWrap}>
          <Text style={styles.fieldLabel}>Country of registration</Text>
          <View style={[styles.field, styles.fieldLocked]}>
            <Text style={styles.fieldValue}>{user.country}</Text>
          </View>
        </View>

        <Button title="Save changes" onPress={save} style={{ marginTop: spacing.md }} />
      </ScrollView>

      <Modal visible={genderOpen} transparent animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => setGenderOpen(false)}
          accessibilityLabel="Close"
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Gender</Text>
            {GENDERS.map((g) => {
              const on = user.gender === g.value;
              return (
                <Pressable
                  key={g.value}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  style={({ pressed }) => [
                    styles.sheetRow,
                    on && styles.sheetRowOn,
                    pressed && !on && { backgroundColor: colors.surfaceSunken },
                  ]}
                  onPress={async () => {
                    await updateUser({ gender: g.value });
                    setGenderOpen(false);
                  }}
                >
                  <Text style={[styles.sheetText, on && { color: colors.brown }]}>{g.label}</Text>
                  {on ? (
                    <FranIcon name="checkCircle" size={19} color={colors.brown} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  readonlyWrap: { marginBottom: spacing.lg },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    height: 54,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  fieldLocked: {
    backgroundColor: colors.surfaceSunken,
    borderColor: 'transparent',
  },
  fieldLabel: { ...typography.label, marginBottom: spacing.sm },
  fieldValue: { ...typography.body, fontSize: 16, flex: 1 },
  fieldPlaceholder: { color: colors.brownMuted },
  lock: { ...typography.micro, marginTop: spacing.xs },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.xl,
    paddingBottom: spacing.huge,
    ...shadow.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  sheetTitle: { ...typography.h3, marginBottom: spacing.md },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  sheetRowOn: { backgroundColor: colors.yellowSoft },
  sheetText: { ...typography.title, color: colors.inkSoft },
});
