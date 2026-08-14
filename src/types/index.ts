export type MembershipTier = 1 | 2 | 3;

export type Gender = 'male' | 'female' | null;

export type BeautyCategory = 'skin' | 'makeup' | 'hair' | 'lifestyle';

export type VoucherStatus = 'available' | 'to_redeem' | 'used' | 'expired';

export type PointTxnType = 'earned' | 'used' | 'expired';

export interface User {
  id: string;
  memberId: string;
  name: string;
  phone: string;
  email: string | null;
  birthday: string | null; // ISO date
  gender: Gender;
  country: string;
  tier: MembershipTier;
  tierExpiresAt: string | null;
  points: number;
  pointsExpiringSoon: number;
  yearlySpend: number;
  streakCount: number;
  streakFreezes: number; // 0–2
  checkedInDays: boolean[]; // Sun–Sat, current week
  checkedInToday: boolean;
  beautyProfiles: Record<BeautyCategory, BeautyProfileResult | null>;
  earnActionsCompleted: Record<string, boolean>;
  termsAccepted: boolean;
}

export interface BeautyProfileResult {
  category: BeautyCategory;
  answers: Record<string, string | string[]>;
  completedAt: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaType?: 'claim' | 'shop' | 'info';
  badge?: string;
  gradient: [string, string];
  terms: string[];
  body: string;
  claimable?: boolean;
}

export interface BundleBanner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  color: string;
}

export type CatalogCategory = 'all' | 'skincare' | 'makeup' | 'hair' | 'bundles';

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: Exclude<CatalogCategory, 'all' | 'bundles'>;
  price: number;
  compareAt?: number;
  rating: number;
  reviewCount: number;
  image: number;
  description: string;
  ingredients: string[];
  tags?: string[];
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  text: string;
}

export interface Bestie {
  id: string;
  handle: string;
  image: number;
}

export interface GrwmBundle {
  id: string;
  title: string;
  creator: string;
  creatorImage: number;
  price: number;
  compareAt?: number;
  image: number;
  productIds: string[];
  featured?: boolean;
}

export interface Voucher {
  id: string;
  title: string;
  description: string;
  valueLabel: string;
  pointsCost?: number;
  status: VoucherStatus;
  expiresAt: string | null;
  usedAt?: string | null;
  terms: string[];
  minSpend?: number;
  color: string;
}

export interface PointTransaction {
  id: string;
  type: PointTxnType;
  amount: number;
  description: string;
  date: string;
}

export interface ExpiringPointsRow {
  points: number;
  expiryDate: string;
  quarterLabel: string;
}

export interface Order {
  id: string;
  orderNo: string;
  date: string;
  total: number;
  status: 'completed' | 'processing' | 'cancelled';
  items: OrderItem[];
  store?: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  top?: boolean;
}

export interface EarnAction {
  id: string;
  title: string;
  points: number;
  icon: string;
  oneTime: boolean;
  route?: string;
  kind: 'beauty' | 'birthday' | 'social' | 'checkin';
  category?: BeautyCategory;
}

export interface TierInfo {
  tier: MembershipTier;
  name: string;
  spendRequired: number;
  pointsPerDollar: number;
  pointsExpire: boolean;
  birthdayTransactions: number;
  perks: string[];
  color: string;
  bgColor: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multi';
  maxSelect?: number;
  options: { id: string; label: string; hint?: string }[];
}

export type MainTabParamList = {
  Discover: undefined;
  You: undefined;
  Scan: undefined;
  Rewards: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Onboarding:
    | import('@react-navigation/native').NavigatorScreenParams<OnboardingStackParamList>
    | undefined;
  Main: import('@react-navigation/native').NavigatorScreenParams<MainTabParamList> | undefined;
  Grwm: undefined;
  PromoDetail: { promoId: string };
  Transactions: undefined;
  ExpiringPoints: undefined;
  MembershipTiers: undefined;
  EarnPoints: undefined;
  BeautyProfile: undefined;
  Quiz: { category: BeautyCategory };
  BeautyResults: { category: BeautyCategory };
  VoucherDetail: { voucherId: string };
  MyDetails: undefined;
  PurchaseHistory: undefined;
  OrderDetail: { orderId: string };
  Privacy: undefined;
  StoreLocator: undefined;
  Faq: undefined;
  Feedback: undefined;
  BirthdayModal: undefined;
  MemberId: undefined;
  Vouchers: undefined;
  Catalog: undefined;
  CheckIn: undefined;
  Wishlist: undefined;
  Pdp: { productId: string };
  Notifications: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Phone: { mode: 'signup' | 'login' };
  Otp: {
    mode: 'signup' | 'login';
    /** Display string e.g. +65 9123 4567 */
    phone: string;
    /** E.164 for Twilio / auth API e.g. +6591234567 */
    phoneE164: string;
  };
  Name: undefined;
  OptionalDetails: undefined;
  Terms: undefined;
};
