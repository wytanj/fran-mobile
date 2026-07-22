import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Header, Input, Screen } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import type { RootStackParamList } from '../../types';
import { colors, spacing, typography } from '../../theme';
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
        <Text style={styles.body}>
          Your birthday is set to {user.birthday} and can no longer be changed.
        </Text>
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
      />
      <Button title="Save birthday" onPress={onSave} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.body,
    color: colors.inkSoft,
    marginBottom: spacing.xl,
  },
});
