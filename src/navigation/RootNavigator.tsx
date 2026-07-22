import { Text } from '../components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { resolveFontFamily, useTypography } from '../context/TypographyContext';
import { useUser } from '../context/UserContext';
import { AccountScreen } from '../screens/account/AccountScreen';
import { FaqScreen } from '../screens/account/FaqScreen';
import { FeedbackScreen } from '../screens/account/FeedbackScreen';
import { MyDetailsScreen } from '../screens/account/MyDetailsScreen';
import { OrderDetailScreen } from '../screens/account/OrderDetailScreen';
import { PrivacyScreen } from '../screens/account/PrivacyScreen';
import { PurchaseHistoryScreen } from '../screens/account/PurchaseHistoryScreen';
import { StoreLocatorScreen } from '../screens/account/StoreLocatorScreen';
import { DiscoverScreen } from '../screens/discover/DiscoverScreen';
import { ExpiringPointsScreen } from '../screens/discover/ExpiringPointsScreen';
import { PromoDetailScreen } from '../screens/discover/PromoDetailScreen';
import { TransactionsScreen } from '../screens/discover/TransactionsScreen';
import { MemberIdScreen } from '../screens/memberId/MemberIdScreen';
import { NameScreen } from '../screens/onboarding/NameScreen';
import { OptionalDetailsScreen } from '../screens/onboarding/OptionalDetailsScreen';
import { OtpScreen } from '../screens/onboarding/OtpScreen';
import { PhoneScreen } from '../screens/onboarding/PhoneScreen';
import { TermsScreen } from '../screens/onboarding/TermsScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { BeautyProfileScreen } from '../screens/profile/BeautyProfileScreen';
import { BeautyResultsScreen } from '../screens/profile/BeautyResultsScreen';
import { BirthdayModalScreen } from '../screens/profile/BirthdayModalScreen';
import { EarnPointsScreen } from '../screens/profile/EarnPointsScreen';
import { MembershipTiersScreen } from '../screens/profile/MembershipTiersScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { QuizScreen } from '../screens/profile/QuizScreen';
import { VoucherDetailScreen } from '../screens/vouchers/VoucherDetailScreen';
import { VouchersScreen } from '../screens/vouchers/VouchersScreen';
import { colors, fonts } from '../theme';
import type {
  MainTabParamList,
  OnboardingStackParamList,
  RootStackParamList,
} from '../types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
    primary: colors.brown,
  },
};

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="Phone" component={PhoneScreen} />
      <OnboardingStack.Screen name="Otp" component={OtpScreen} />
      <OnboardingStack.Screen name="Name" component={NameScreen} />
      <OnboardingStack.Screen name="OptionalDetails" component={OptionalDetailsScreen} />
      <OnboardingStack.Screen name="Terms" component={TermsScreen} />
    </OnboardingStack.Navigator>
  );
}

function MainTabs() {
  const { variant } = useTypography();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brown,
        tabBarInactiveTintColor: colors.tabInactive,
        // Full-width bar stays thumb-friendly on open foldables (edge reach)
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: StyleSheet.flatten([
          styles.tabLabel,
          { fontFamily: resolveFontFamily(variant, fonts.bodySemi) },
        ]),
        // Foldables / tablets default to label-beside-icon; keep phone layout
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MemberId"
        component={MemberIdScreen}
        options={{
          tabBarLabel: 'Member ID',
          tabBarLabelPosition: 'below-icon',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.centerTab, focused && styles.centerTabOn]}>
              <Text style={styles.centerTabText}>ID</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Vouchers"
        component={VouchersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isAuthed, isReady } = useUser();

  if (!isReady) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.yellow} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthed ? (
          <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <>
            <RootStack.Screen name="Main" component={MainTabs} />
            <RootStack.Screen
              name="PromoDetail"
              component={PromoDetailScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <RootStack.Screen name="Transactions" component={TransactionsScreen} />
            <RootStack.Screen name="ExpiringPoints" component={ExpiringPointsScreen} />
            <RootStack.Screen name="MembershipTiers" component={MembershipTiersScreen} />
            <RootStack.Screen name="EarnPoints" component={EarnPointsScreen} />
            <RootStack.Screen name="BeautyProfile" component={BeautyProfileScreen} />
            <RootStack.Screen name="Quiz" component={QuizScreen} />
            <RootStack.Screen name="BeautyResults" component={BeautyResultsScreen} />
            <RootStack.Screen name="VoucherDetail" component={VoucherDetailScreen} />
            <RootStack.Screen name="MyDetails" component={MyDetailsScreen} />
            <RootStack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
            <RootStack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <RootStack.Screen name="Privacy" component={PrivacyScreen} />
            <RootStack.Screen name="StoreLocator" component={StoreLocatorScreen} />
            <RootStack.Screen name="Faq" component={FaqScreen} />
            <RootStack.Screen name="Feedback" component={FeedbackScreen} />
            <RootStack.Screen
              name="BirthdayModal"
              component={BirthdayModalScreen}
              options={{ presentation: 'modal' }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  tabBar: {
    height: 64,
    paddingTop: 6,
    paddingBottom: 8,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
  },
  centerTab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  centerTabOn: {
    backgroundColor: colors.yellowDeep,
  },
  centerTabText: {
    color: colors.brown,
    fontFamily: fonts.displayExtra,
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
