import type {
  BundleBanner,
  EarnAction,
  ExpiringPointsRow,
  FaqItem,
  Order,
  PointTransaction,
  PromoBanner,
  TierInfo,
  User,
  Voucher,
} from '../types';

export const defaultUser: User = {
  id: 'u_demo',
  memberId: 'FRAN48291036',
  name: 'Fern',
  phone: '+65 9123 4567',
  email: null,
  birthday: null,
  gender: null,
  country: 'Singapore',
  tier: 1,
  tierExpiresAt: '2027-07-21',
  points: 420,
  pointsExpiringSoon: 48,
  yearlySpend: 186,
  streakCount: 2,
  streakFreezes: 0,
  // Week starting Monday for progress UI — map as M T W T F S S
  checkedInDays: [true, true, false, false, false, false, false],
  checkedInToday: false,
  beautyProfiles: {
    skin: null,
    makeup: null,
    hair: null,
    lifestyle: null,
  },
  earnActionsCompleted: {},
  termsAccepted: false,
};

export const tiers: TierInfo[] = [
  {
    tier: 1,
    name: 'Tier 1',
    spendRequired: 0,
    pointsPerDollar: 1,
    pointsExpire: true,
    birthdayTransactions: 1,
    perks: [
      'Earn points — $1 = 1 point',
      'Points expire after 12 months',
      '2x points on birthday month (1 transaction)',
      'Member-exclusive discounts',
    ],
    color: '#A67C52',
    bgColor: '#F7EFE6',
  },
  {
    tier: 2,
    name: 'Tier 2',
    spendRequired: 500,
    pointsPerDollar: 1.25,
    pointsExpire: false,
    birthdayTransactions: 1,
    perks: [
      'Earn points — $1 = 1.25 points',
      'Points never expire',
      '2x points on birthday month (1 transaction)',
      'Member-exclusive discounts, gifts, events & access',
    ],
    color: '#7A8B9A',
    bgColor: '#EEF2F5',
  },
  {
    tier: 3,
    name: 'Tier 3',
    spendRequired: 1250,
    pointsPerDollar: 1.5,
    pointsExpire: false,
    birthdayTransactions: 2,
    perks: [
      'Earn points — $1 = 1.5 points',
      'Points never expire',
      '2x points on birthday month (2 transactions)',
      'Member-exclusive discounts, gifts, events & access',
    ],
    color: '#8B6B3A',
    bgColor: '#F7F0E2',
  },
];

export const promoBanners: PromoBanner[] = [
  {
    id: 'promo_1',
    title: 'Summer Beauty Savings',
    subtitle: 'Up to extra 20% off at checkout for members',
    ctaLabel: 'Shop now',
    ctaType: 'shop',
    badge: 'LIMITED',
    gradient: ['#FFE14D', '#F0C820'],
    body: 'Glow through summer with exclusive member savings across skincare, makeup, and haircare. Stack with member points for double the delight.',
    terms: [
      'Valid in-store and selected online channels until 31 Aug 2026.',
      'Discount may vary by brand and category.',
      'Cannot be combined with other storewide promotions unless stated.',
    ],
  },
  {
    id: 'promo_2',
    title: '2× Points Weekend',
    subtitle: 'Double points on all purchases this weekend',
    ctaLabel: 'Claim now',
    ctaType: 'claim',
    badge: 'MEMBER',
    gradient: ['#5BBFE0', '#3A2415'],
    body: 'Activate your 2× points bonus voucher and earn double on every dollar spent this weekend. Perfect time to restock your routine.',
    claimable: true,
    terms: [
      'Bonus applies to one transaction after claiming.',
      'Voucher expires 7 days after claim.',
      'Excludes gift cards and already-discounted clearance.',
    ],
  },
  {
    id: 'promo_3',
    title: 'Glow Back to School',
    subtitle: 'Routine guides + student-friendly picks',
    ctaLabel: 'Explore',
    ctaType: 'info',
    gradient: ['#F2D2AE', '#C4A070'],
    body: 'Find picks that fit your vibe, budget, and schedule — curated routines for busy mornings and late study nights.',
    terms: ['Informational guide. Product availability may vary by store.'],
  },
];

export const bundleBanners: BundleBanner[] = [
  {
    id: 'b1',
    title: 'Member Exclusive Bundles',
    subtitle: 'Save more when you build a full routine',
    badge: 'EXCLUSIVE',
    color: '#FFE14D',
  },
  {
    id: 'b2',
    title: 'Skincare Heroes',
    subtitle: 'Ceramides, PDRN, Vitamin C & more',
    badge: 'TRENDING',
    color: '#5BBFE0',
  },
  {
    id: 'b3',
    title: 'Birthday Month Treats',
    subtitle: 'Double points + surprise gifts in-store',
    badge: 'BIRTHDAY',
    color: '#C4A070',
  },
];

export const vouchers: Voucher[] = [
  {
    id: 'v1',
    title: '$5 OFF Storewide',
    description: 'Min. spend $40',
    valueLabel: '$5',
    status: 'available',
    expiresAt: '2026-08-21',
    terms: [
      'Valid for 1 month from issue date.',
      'Min. spend $40 before discount.',
      'One voucher per transaction.',
    ],
    minSpend: 40,
    color: '#FFE14D',
  },
  {
    id: 'v2',
    title: '2× Points Bonus',
    description: 'One transaction this weekend',
    valueLabel: '2×',
    status: 'available',
    expiresAt: '2026-07-28',
    terms: ['Apply at checkout via Member ID.', 'Single use.'],
    color: '#5BBFE0',
  },
  {
    id: 'v3',
    title: '$3 OFF Skincare',
    description: 'Min. spend $25 on skincare',
    valueLabel: '$3',
    pointsCost: 250,
    status: 'to_redeem',
    expiresAt: null,
    terms: ['Redeem with points. Voucher valid 30 days after redemption.'],
    minSpend: 25,
    color: '#C4A070',
  },
  {
    id: 'v4',
    title: 'Free Deluxe Sample',
    description: 'Any deluxe sample with $60 spend',
    valueLabel: 'FREE',
    pointsCost: 500,
    status: 'to_redeem',
    expiresAt: null,
    terms: ['Subject to sample availability.'],
    minSpend: 60,
    color: '#F2D2AE',
  },
  {
    id: 'v5',
    title: '$3 OFF Storewide',
    description: 'Used on 08 Jul 2026',
    valueLabel: '$3',
    status: 'used',
    expiresAt: '2026-07-08',
    usedAt: '2026-07-08',
    terms: [],
    minSpend: 25,
    color: '#D9CDB8',
  },
  {
    id: 'v6',
    title: '$3 OFF Makeup',
    description: 'Expired on 30 Sep 2025',
    valueLabel: '$3',
    status: 'expired',
    expiresAt: '2025-09-30',
    terms: [],
    minSpend: 20,
    color: '#D9CDB8',
  },
];

export const pointTransactions: PointTransaction[] = [
  {
    id: 't1',
    type: 'earned',
    amount: 42,
    description: 'Purchase — Fran Orchard',
    date: '2026-07-18',
  },
  {
    id: 't2',
    type: 'earned',
    amount: 10,
    description: 'Daily check-in',
    date: '2026-07-17',
  },
  {
    id: 't3',
    type: 'used',
    amount: -250,
    description: 'Redeemed $3 OFF voucher',
    date: '2026-07-10',
  },
  {
    id: 't4',
    type: 'earned',
    amount: 88,
    description: 'Purchase — Fran Jewel',
    date: '2026-06-28',
  },
  {
    id: 't5',
    type: 'expired',
    amount: -30,
    description: 'Points expired',
    date: '2026-06-01',
  },
  {
    id: 't6',
    type: 'earned',
    amount: 120,
    description: 'Purchase — Fran Vivocity',
    date: '2026-05-14',
  },
];

export const expiringPoints: ExpiringPointsRow[] = [
  { points: 48, expiryDate: '2026-09-30', quarterLabel: 'Q3 2026' },
  { points: 0, expiryDate: '2026-12-31', quarterLabel: 'Q4 2026' },
  { points: 110, expiryDate: '2027-03-31', quarterLabel: 'Q1 2027' },
  { points: 0, expiryDate: '2027-06-30', quarterLabel: 'Q2 2027' },
];

export const earnActions: EarnAction[] = [
  {
    id: 'skin',
    title: 'Skin profile',
    points: 15,
    icon: 'water-outline',
    oneTime: true,
    kind: 'beauty',
    category: 'skin',
  },
  {
    id: 'makeup',
    title: 'Makeup profile',
    points: 15,
    icon: 'color-palette-outline',
    oneTime: true,
    kind: 'beauty',
    category: 'makeup',
  },
  {
    id: 'hair',
    title: 'Hair profile',
    points: 15,
    icon: 'cut-outline',
    oneTime: true,
    kind: 'beauty',
    category: 'hair',
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle profile',
    points: 15,
    icon: 'leaf-outline',
    oneTime: true,
    kind: 'beauty',
    category: 'lifestyle',
  },
  {
    id: 'birthday',
    title: 'Tell us your birthday',
    points: 10,
    icon: 'gift-outline',
    oneTime: true,
    kind: 'birthday',
  },
  {
    id: 'instagram',
    title: 'Follow Instagram',
    points: 15,
    icon: 'logo-instagram',
    oneTime: true,
    kind: 'social',
  },
  {
    id: 'tiktok',
    title: 'Follow TikTok',
    points: 15,
    icon: 'logo-tiktok',
    oneTime: true,
    kind: 'social',
  },
  {
    id: 'checkin',
    title: 'Daily check-in',
    points: 1,
    icon: 'flame-outline',
    oneTime: false,
    kind: 'checkin',
  },
];

export const orders: Order[] = [
  {
    id: 'o1',
    orderNo: 'FR-20260718-0142',
    date: '2026-07-18',
    total: 86.5,
    status: 'completed',
    store: 'Fran Orchard',
    items: [
      { name: 'Hydra Glow Serum 30ml', qty: 1, price: 48 },
      { name: 'Soft Matte Lip Tint — Rose', qty: 1, price: 22 },
      { name: 'Cotton Pads (80s)', qty: 1, price: 8.5 },
      { name: 'Member discount', qty: 1, price: -8 },
      { name: 'GST', qty: 1, price: 5.0 },
    ],
  },
  {
    id: 'o2',
    orderNo: 'FR-20260628-0891',
    date: '2026-06-28',
    total: 124.0,
    status: 'completed',
    store: 'Fran Jewel',
    items: [
      { name: 'Ceramide Cream 50ml', qty: 1, price: 62 },
      { name: 'SPF 50 PA++++ Fluid', qty: 1, price: 42 },
      { name: 'Gift wrapping', qty: 1, price: 5 },
      { name: 'GST', qty: 1, price: 15 },
    ],
  },
  {
    id: 'o3',
    orderNo: 'FR-20260514-0330',
    date: '2026-05-14',
    total: 68.9,
    status: 'completed',
    store: 'Fran Vivocity',
    items: [
      { name: 'Hair Oil Repair 100ml', qty: 1, price: 38 },
      { name: 'Scalp Scrub', qty: 1, price: 26 },
      { name: 'GST', qty: 1, price: 4.9 },
    ],
  },
];

export const faqs: FaqItem[] = [
  {
    id: 'f1',
    question: 'How do I earn points?',
    answer:
      'Scan your Member ID at checkout. Tier 1 earns $1 = 1 point, Tier 2 earns 1.25 points, and Tier 3 earns 1.5 points. You can also earn points via daily check-in and completing your beauty profile.',
    top: true,
  },
  {
    id: 'f2',
    question: 'Do my points expire?',
    answer:
      'On Tier 1, points expire 12 months after they are earned. On Tier 2 and Tier 3, points never expire while you remain in those tiers.',
    top: true,
  },
  {
    id: 'f3',
    question: 'How do membership tiers work?',
    answer:
      'Tier 1 is open to all members. Spend $500/year to unlock Tier 2, or $1,250/year for Tier 3. Your yearly spend window resets based on your membership anniversary.',
    top: true,
  },
  {
    id: 'f4',
    question: 'How does daily check-in work?',
    answer:
      'Open the Discover tab and tap Check in each day. Keep a weekly streak for rewards. Hit 7 consecutive days to earn a streak freeze (max 2 freezes).',
    top: true,
  },
  {
    id: 'f5',
    question: 'How do I redeem vouchers?',
    answer:
      'Go to Vouchers → To redeem, pick a voucher, then Use now / Redeem now. Show the QR code at checkout. Redeemed vouchers move to Available until used.',
    top: true,
  },
  {
    id: 'f6',
    question: 'Can I change my birthday later?',
    answer:
      'Birthday can only be set once. Add it during sign-up or later from Profile → More ways to earn for +10 points. After that it is locked.',
    top: true,
  },
  {
    id: 'f7',
    question: 'What is my Member ID used for?',
    answer:
      'Present the QR on the Member ID tab at checkout so staff can clock your points and apply vouchers.',
    top: true,
  },
  {
    id: 'f8',
    question: 'How do beauty profile quizzes work?',
    answer:
      'Complete Skin, Makeup, Hair, and Lifestyle quizzes from Profile. Each one-time quiz awards +15 points and unlocks better recommendations (coming soon).',
    top: true,
  },
  {
    id: 'f9',
    question: 'Where are Fran stores located?',
    answer:
      'Find addresses and photos under Account → Store locator. More locations will be added as we expand.',
    top: true,
  },
  {
    id: 'f10',
    question: 'How do I delete my account?',
    answer:
      'Account → Privacy & security → Delete account. This permanently removes your profile, points, and vouchers.',
    top: true,
  },
  {
    id: 'f11',
    question: 'Is there a password?',
    answer:
      'No. Fran uses mobile number + OTP for a light, simple login — no password to manage.',
  },
  {
    id: 'f12',
    question: 'How do birthday 2× points work?',
    answer:
      'During your birthday month you get 2× points. Tier 1 & 2: one transaction. Tier 3: two transactions.',
  },
];

export const stores = [
  {
    id: 's1',
    name: 'Fran Orchard',
    address: '391 Orchard Road, #B1-12 Ngee Ann City, Singapore 238872',
    hours: 'Daily 10:00 – 22:00',
    phone: '+65 6235 0101',
  },
  {
    id: 's2',
    name: 'Fran Jewel',
    address: '10 Tampines Central 1, #02-18 Jewel Changi, Singapore 529536',
    hours: 'Daily 10:00 – 22:00',
    phone: '+65 6789 2200',
  },
  {
    id: 's3',
    name: 'Fran Vivocity',
    address: '1 HarbourFront Walk, #01-88 VivoCity, Singapore 098585',
    hours: 'Daily 10:00 – 22:00',
    phone: '+65 6376 8811',
  },
];

export const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export const CHECK_IN_POINTS = 1;
