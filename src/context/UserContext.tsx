import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { CHECK_IN_POINTS, defaultUser, vouchers as seedVouchers } from '../data/mock';
import type {
  BeautyCategory,
  BeautyProfileResult,
  Gender,
  User,
  Voucher,
} from '../types';

const STORAGE_KEY = '@fran/user';
const VOUCHERS_KEY = '@fran/vouchers';
const AUTH_KEY = '@fran/authed';

type UserContextValue = {
  user: User;
  isAuthed: boolean;
  isReady: boolean;
  vouchers: Voucher[];
  signIn: (phone: string) => Promise<void>;
  completeSignup: (partial: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (partial: Partial<User>) => Promise<void>;
  checkIn: () => Promise<{ awarded: number; freezeAwarded: boolean } | null>;
  completeBeautyQuiz: (
    category: BeautyCategory,
    answers: Record<string, string | string[]>,
  ) => Promise<number>;
  setBirthday: (isoDate: string) => Promise<number>;
  completeSocial: (id: 'instagram' | 'tiktok') => Promise<number>;
  claimPromoVoucher: (promoId: string) => Promise<Voucher | null>;
  redeemVoucher: (voucherId: string) => Promise<boolean>;
  availableVoucherCount: number;
};

const UserContext = createContext<UserContextValue | null>(null);

function todayIndexMon0(): number {
  // JS: 0=Sun … 6=Sat → Mon=0 … Sun=6
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);
  const [vouchers, setVouchers] = useState<Voucher[]>(seedVouchers);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [u, v, a] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(VOUCHERS_KEY),
          AsyncStorage.getItem(AUTH_KEY),
        ]);
        if (u) setUser(JSON.parse(u));
        if (v) setVouchers(JSON.parse(v));
        if (a === '1') setIsAuthed(true);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const persistUser = useCallback(async (next: User) => {
    setUser(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const persistVouchers = useCallback(async (next: Voucher[]) => {
    setVouchers(next);
    await AsyncStorage.setItem(VOUCHERS_KEY, JSON.stringify(next));
  }, []);

  const signIn = useCallback(
    async (phone: string) => {
      const next = { ...user, phone };
      await persistUser(next);
      setIsAuthed(true);
      await AsyncStorage.setItem(AUTH_KEY, '1');
    },
    [persistUser, user],
  );

  const completeSignup = useCallback(
    async (partial: Partial<User>) => {
      const next: User = {
        ...user,
        ...partial,
        termsAccepted: true,
      };
      await persistUser(next);
      setIsAuthed(true);
      await AsyncStorage.setItem(AUTH_KEY, '1');
    },
    [persistUser, user],
  );

  const signOut = useCallback(async () => {
    setIsAuthed(false);
    await AsyncStorage.setItem(AUTH_KEY, '0');
  }, []);

  const updateUser = useCallback(
    async (partial: Partial<User>) => {
      await persistUser({ ...user, ...partial });
    },
    [persistUser, user],
  );

  const checkIn = useCallback(async () => {
    if (user.checkedInToday) return null;
    const idx = todayIndexMon0();
    const days = [...user.checkedInDays];
    days[idx] = true;
    let streak = user.streakCount + 1;
    let freezes = user.streakFreezes;
    let freezeAwarded = false;
    if (streak > 0 && streak % 7 === 0 && freezes < 2) {
      freezes += 1;
      freezeAwarded = true;
    }
    await persistUser({
      ...user,
      checkedInToday: true,
      checkedInDays: days,
      streakCount: streak,
      streakFreezes: freezes,
      points: user.points + CHECK_IN_POINTS,
    });
    return { awarded: CHECK_IN_POINTS, freezeAwarded };
  }, [persistUser, user]);

  const completeBeautyQuiz = useCallback(
    async (category: BeautyCategory, answers: Record<string, string | string[]>) => {
      if (user.beautyProfiles[category]) return 0;
      const result: BeautyProfileResult = {
        category,
        answers,
        completedAt: new Date().toISOString(),
      };
      const points = 15;
      await persistUser({
        ...user,
        points: user.points + points,
        beautyProfiles: { ...user.beautyProfiles, [category]: result },
        earnActionsCompleted: {
          ...user.earnActionsCompleted,
          [category]: true,
        },
      });
      return points;
    },
    [persistUser, user],
  );

  const setBirthday = useCallback(
    async (isoDate: string) => {
      if (user.birthday) return 0;
      const points = 10;
      await persistUser({
        ...user,
        birthday: isoDate,
        points: user.points + points,
        earnActionsCompleted: {
          ...user.earnActionsCompleted,
          birthday: true,
        },
      });
      return points;
    },
    [persistUser, user],
  );

  const completeSocial = useCallback(
    async (id: 'instagram' | 'tiktok') => {
      if (user.earnActionsCompleted[id]) return 0;
      const points = 15;
      await persistUser({
        ...user,
        points: user.points + points,
        earnActionsCompleted: {
          ...user.earnActionsCompleted,
          [id]: true,
        },
      });
      return points;
    },
    [persistUser, user],
  );

  const claimPromoVoucher = useCallback(
    async (promoId: string) => {
      if (promoId !== 'promo_2') return null;
      const existing = vouchers.find((v) => v.id === 'v_claim_2x');
      if (existing) return existing;
      const voucher: Voucher = {
        id: 'v_claim_2x',
        title: '2× Points Bonus',
        description: 'Claimed from promo — one transaction',
        valueLabel: '2×',
        status: 'available',
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        terms: [
          'Bonus applies to one transaction after claiming.',
          'Voucher expires 7 days after claim.',
        ],
        color: '#5BBFE0',
      };
      await persistVouchers([voucher, ...vouchers]);
      return voucher;
    },
    [persistVouchers, vouchers],
  );

  const redeemVoucher = useCallback(
    async (voucherId: string) => {
      const v = vouchers.find((x) => x.id === voucherId);
      if (!v || v.status !== 'to_redeem') return false;
      if (v.pointsCost && user.points < v.pointsCost) return false;
      const nextUser = {
        ...user,
        points: user.points - (v.pointsCost ?? 0),
      };
      const nextVouchers = vouchers.map((x) =>
        x.id === voucherId
          ? {
              ...x,
              status: 'available' as const,
              expiresAt: new Date(Date.now() + 30 * 86400000)
                .toISOString()
                .slice(0, 10),
            }
          : x,
      );
      await persistUser(nextUser);
      await persistVouchers(nextVouchers);
      return true;
    },
    [persistUser, persistVouchers, user, vouchers],
  );

  const availableVoucherCount = useMemo(
    () => vouchers.filter((v) => v.status === 'available').length,
    [vouchers],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthed,
      isReady,
      vouchers,
      signIn,
      completeSignup,
      signOut,
      updateUser,
      checkIn,
      completeBeautyQuiz,
      setBirthday,
      completeSocial,
      claimPromoVoucher,
      redeemVoucher,
      availableVoucherCount,
    }),
    [
      user,
      isAuthed,
      isReady,
      vouchers,
      signIn,
      completeSignup,
      signOut,
      updateUser,
      checkIn,
      completeBeautyQuiz,
      setBirthday,
      completeSocial,
      claimPromoVoucher,
      redeemVoucher,
      availableVoucherCount,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}

export function formatGender(g: Gender): string {
  if (!g) return 'Not set';
  const map: Record<Exclude<Gender, null>, string> = {
    male: 'Male',
    female: 'Female',
  };
  return map[g] ?? 'Not set';
}
