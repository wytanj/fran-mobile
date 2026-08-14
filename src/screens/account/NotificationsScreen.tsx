import { Text } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Header, Screen } from '../../components/ui';
import type { RootStackParamList } from '../../types';
import { spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export function NotificationsScreen({ navigation }: Props) {
  return (
    <Screen>
      <Header title="Notifications" onBack={() => navigation.goBack()} />
      <Text style={{ ...typography.body, marginTop: spacing.md }}>
        Purchase updates, new launches, and promotions will land here.
      </Text>
    </Screen>
  );
}
