import { TabGlyph, type TabGlyphName } from '../components/TabGlyph';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { resolveFontFamily, useTypography } from '../context/TypographyContext';
import { useUser } from '../context/UserContext';
import { AccountScreen } from '../screens/account/AccountScreen';
import { FaqScreen } from '../screens/account/FaqScreen';
import { NotificationsScreen } from '../screens/account/NotificationsScreen';
import { FeedbackScreen } from '../screens/account/FeedbackScreen';
import { MyDetailsScreen } from '../screens/account/MyDetailsScreen';
import { OrderDetailScreen } from '../screens/account/OrderDetailScreen';
import { PrivacyScreen } from '../screens/account/PrivacyScreen';
import { PurchaseHistoryScreen } from '../screens/account/PurchaseHistoryScreen';
import { StoreLocatorScreen } from '../screens/account/StoreLocatorScreen';
import { CatalogScreen } from '../screens/catalog/CatalogScreen';
import { WishlistScreen } from '../screens/catalog/WishlistScreen';
import { DiscoverScreen } from '../screens/discover/DiscoverScreen';
import { ExpiringPointsScreen } from '../screens/discover/ExpiringPointsScreen';
import { PromoDetailScreen } from '../screens/discover/PromoDetailScreen';
import { TransactionsScreen } from '../screens/discover/TransactionsScreen';
import { GrwmScreen } from '../screens/grwm/GrwmScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { RewardsScreen } from '../screens/rewards/RewardsScreen';
import { MemberIdScreen } from '../screens/memberId/MemberIdScreen';
import { PdpScreen } from '../screens/pdp/PdpScreen';
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
import { colors, fonts, shadow } from '../theme';
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

/**
 * Figma footer: Discover · You · Scan · Rewards · Account.
 * Glyphs are the exported Figma assets; the bar is a floating cream pill.
 */
function TabIcon({ name, color }: { name: TabGlyphName; color: string }) {
  return (
    <View style={styles.tabIcon}>
      <TabGlyph name={name} size={24} color={color} />
    </View>
  );
}

function MainTabs() {
  const { variant } = useTypography();
  const { isAuthed } = useUser();
  const insets = useSafeAreaInsets();
  const lift = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brown,
        tabBarInactiveTintColor: colors.brown,
        tabBarStyle: [styles.tabBar, { marginBottom: lift }],
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: StyleSheet.flatten([
          styles.tabLabel,
          { fontFamily: resolveFontFamily(variant, fonts.bodySemi) },
        ]),
        tabBarLabelPosition: 'below-icon',
        tabBarHideOnKeyboard: true,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tab.Screen
        name="Discover"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon name="discover" color={color} />,
        }}
      />
      <Tab.Screen
        name="You"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon name="you" color={color} />,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={MemberIdScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (isAuthed) return;
            e.preventDefault();
            navigation.getParent()?.navigate('Onboarding');
          },
        })}
        options={{
          tabBarLabel: () => null,
          tabBarAccessibilityLabel: 'Scan and earn',
          tabBarItemStyle: [styles.tabItem, styles.centerTabItem],
          tabBarIcon: () => (
            <View style={styles.centerTab}>
              <TabGlyph name="scan" size={24} color={colors.brown} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon name="rewards" color={color} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon name="account" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isReady } = useUser();

  if (!isReady) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.brown} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Main" component={MainTabs} />
        <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
        <RootStack.Screen name="Grwm" component={GrwmScreen} />
        <RootStack.Screen name="MemberId" component={MemberIdScreen} />
        <RootStack.Screen name="Vouchers" component={VouchersScreen} />
        <RootStack.Screen name="Catalog" component={CatalogScreen} />
        <RootStack.Screen name="CheckIn" component={DiscoverScreen} />
        <RootStack.Screen name="Wishlist" component={WishlistScreen} />
        <RootStack.Screen name="Pdp" component={PdpScreen} />
        <RootStack.Screen name="Notifications" component={NotificationsScreen} />
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
    marginHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 6,
    borderTopWidth: 0,
    borderRadius: 12,
    backgroundColor: colors.surface,
    ...shadow.md,
  },
  tabItem: {
    paddingTop: 0,
  },
  centerTabItem: {
    flex: 0.72,
  },
  tabLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    letterSpacing: 0.12,
    marginTop: 2,
  },
  tabIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: 6 }],
  },
});
