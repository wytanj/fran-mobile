import { Text } from '../../components/ThemedText';
import { FranIcon } from '../../components/FranIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Header, Input, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import type { RootStackParamList } from '../../types';
import { colors, radius, shadow, spacing, typography } from '../../theme';
import { formatBirthdayInput } from '../../utils/formatBirthdayInput';

type Props = NativeStackScreenProps<RootStackParamList, 'BirthdayModal'>;

export function BirthdayModalScreen({ navigation }: Props) {
  const { user, setBirthday } = useUser();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  if (user.birthday) {
    return (
      <Screen edges={['top']}>
        <Header title="Birthday" onBack={() => navigation.goBack()} />
        <View style={styles.lockedCard}>
          <View style={styles.iconWell}>
            <FranIcon name="gift" size={22} color={colors.brown} />
          </View>
          <Text style={styles.lockedValue}>{user.birthday}</Text>
          <Text style={styles.lockedNote}>
            Your birthday is locked in and can no longer be changed.
          </Text>
        </View>
      </Screen>
    );
  }

  const onSave = async () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      Alert.alert('Invalid date', 'Use format YYYY-MM-DD');
      return;
    }
    setLoading(true);
    try {
      const pts = await setBirthday(value);
      Alert.alert('Thanks!', `Birthday saved. +${pts} points`);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={['top']}>
      <Header title="Your birthday" onBack={() => navigation.goBack()} />
      <View style={styles.iconWell}>
        <FranIcon name="gift" size={22} color={colors.brown} />
      </View>
      <Text style={styles.body}>
        Add your birthday once for +10 points and birthday-month 2× points. This cannot be changed
        later.
      </Text>
      <Input
        label="Birthday"
        placeholder="YYYY-MM-DD"
        value={value}
        onChangeText={(text) => setValue(formatBirthdayInput(text))}
        keyboardType="number-pad"
        maxLength={10}
        hint="Format: YYYY-MM-DD"
      />
      <Button title="Save birthday" onPress={onSave} loading={loading} icon="gift" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconWell: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  body: {
    ...typography.body,
    color: colors.inkSoft,
    marginBottom: spacing.xl,
  },
  lockedCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.xxl,
    marginTop: spacing.lg,
    ...shadow.sm,
  },
  lockedValue: { ...typography.h2, marginTop: spacing.sm },
  lockedNote: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 280,
  },
});
