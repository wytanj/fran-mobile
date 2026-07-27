import { Text, TextInput } from './ThemedText';
import { FranIcon, type FranIconName } from './FranIcon';
import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ContentWidth } from '../layout/ContentWidth';
import { useLayout } from '../layout/useLayout';
import { colors, fonts, press, radius, shadow, spacing, tint, typography } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Tap target that springs slightly under the finger. Animating the Pressable
 * itself (rather than a wrapper View) keeps flex layouts intact.
 */
export function PressableScale({
  children,
  onPress,
  disabled,
  style,
  scaleTo = press.scale,
  hitSlop,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  hitSlop?: number;
  accessibilityLabel?: string;
}) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const spring = (toValue: number) =>
    Animated.spring(scale, { toValue, useNativeDriver: true, ...press.spring }).start();

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || !onPress}
      onPressIn={() => spring(scaleTo)}
      onPressOut={() => spring(1)}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedPressable>
  );
}

export function Screen({
  children,
  style,
  padded = true,
  edges = ['top'],
  /** Cap and center content on foldable / tablet widths (default on) */
  constrain = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  edges?: ('top' | 'bottom')[];
  constrain?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { gutter } = useLayout();
  const padH = padded ? gutter : 0;
  const safePads = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
  };

  // Outer keeps full-bleed background; inner gets layout styles (justifyContent, etc.)
  // so foldable width caps and onboarding vertical spacing both work.
  if (!constrain) {
    return (
      <View style={[styles.screen, safePads, style]}>
        <View style={[{ flex: 1 }, padded ? { paddingHorizontal: padH } : null]}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, safePads, style]}>
      <ContentWidth style={[padded ? { paddingHorizontal: padH } : null, style]}>
        {children}
      </ContentWidth>
    </View>
  );
}

export function Header({
  title,
  subtitle,
  onBack,
  right,
  large,
  /** Hairline under the bar — for screens that scroll content beneath it */
  divider,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  large?: boolean;
  divider?: boolean;
}) {
  return (
    <View
      style={[
        styles.header,
        large && { marginBottom: spacing.md },
        divider && styles.headerDivider,
      ]}
    >
      <View style={styles.headerSide}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          >
            <FranIcon name="chevronLeft" size={22} color={colors.ink} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.headerCenter}>
        <Text style={[styles.headerTitle, large && typography.h2]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.headerSide, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'tonal' | 'ghost' | 'danger';

const BUTTON_HEIGHT = { sm: 40, md: 52, lg: 56 } as const;
const BUTTON_TEXT = { sm: 15, md: 17, lg: 18 } as const;

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  style,
  icon,
  /** Icon after the label instead of before — for "continue" style actions */
  iconAfter,
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: FranIconName;
  iconAfter?: boolean;
}) {
  const isDisabled = disabled || loading;
  const fg = isDisabled
    ? colors.muted
    : variant === 'danger'
      ? colors.white
      : colors.brown;

  const iconEl = icon ? (
    <FranIcon
      name={icon}
      size={size === 'sm' ? 16 : 18}
      color={fg}
      style={iconAfter ? { marginLeft: 8 } : { marginRight: 8 }}
    />
  ) : null;

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={title}
      style={[
        styles.btn,
        { height: BUTTON_HEIGHT[size] },
        variant === 'primary' && styles.btnPrimary,
        variant === 'secondary' && styles.btnSecondary,
        variant === 'tonal' && styles.btnTonal,
        variant === 'ghost' && styles.btnGhost,
        variant === 'danger' && styles.btnDanger,
        variant === 'primary' && !isDisabled && styles.btnPrimaryGlow,
        isDisabled && styles.btnDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.btnRow}>
          {iconAfter ? null : iconEl}
          <Text
            style={[styles.btnText, { fontSize: BUTTON_TEXT[size], color: fg }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {iconAfter ? iconEl : null}
        </View>
      )}
    </PressableScale>
  );
}

export function Input({
  label,
  error,
  hint,
  containerStyle,
  ...props
}: TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={[{ marginBottom: spacing.lg }, containerStyle]}>
      {label ? (
        <Text style={[styles.inputLabel, focused && { color: colors.brown }]}>{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.brownMuted}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={[
          styles.input,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
          props.style,
        ]}
      />
      {error ? (
        <View style={styles.inputErrorRow}>
          <FranIcon name="alert" size={13} color={colors.danger} />
          <Text style={styles.inputErrorText}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.inputHint}>{hint}</Text>
      ) : null}
    </View>
  );
}

type CardTone = 'surface' | 'cream' | 'sunken' | 'yellow' | 'blue' | 'peach';

const CARD_TONES: Record<CardTone, { bg: string; border: string }> = {
  surface: { bg: colors.surface, border: colors.borderSoft },
  cream: { bg: colors.cream, border: colors.border },
  sunken: { bg: colors.surfaceSunken, border: 'transparent' },
  yellow: { bg: colors.yellowSoft, border: 'transparent' },
  blue: { bg: colors.blueSoft, border: 'transparent' },
  peach: { bg: colors.peachSoft, border: 'transparent' },
};

export function Card({
  children,
  style,
  onPress,
  tone = 'surface',
  /** 'sm' floats on cream, 'none' for tinted cards that should sit flat */
  elevation = 'sm',
  padded = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  tone?: CardTone;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padded?: boolean;
}) {
  const t = CARD_TONES[tone];
  const base: StyleProp<ViewStyle> = [
    styles.card,
    { backgroundColor: t.bg, borderColor: t.border },
    padded ? null : { padding: 0 },
    elevation !== 'none' && tone === 'surface' ? shadow[elevation] : null,
    style,
  ];

  if (onPress) {
    return (
      <PressableScale onPress={onPress} style={base} scaleTo={press.scaleLarge}>
        {children}
      </PressableScale>
    );
  }
  return <View style={base}>{children}</View>;
}

export function SectionTitle({
  title,
  eyebrow,
  subtitle,
  actionLabel,
  onAction,
  style,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.sectionTitleRow, style]}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.sectionEyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          hitSlop={8}
          accessibilityRole="button"
          style={({ pressed }) => [styles.sectionActionBtn, pressed && { opacity: 0.55 }]}
        >
          <Text style={styles.sectionAction}>{actionLabel}</Text>
          <FranIcon name="chevronRight" size={13} color={colors.brownSoft} />
        </Pressable>
      ) : null}
    </View>
  );
}

type BadgeTone = 'primary' | 'muted' | 'success' | 'warning' | 'danger' | 'accent' | 'ink';

const BADGE_TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  primary: { bg: colors.yellowSoft, fg: colors.brown },
  muted: { bg: colors.peachSoft, fg: colors.inkSoft },
  success: { bg: colors.successSoft, fg: colors.success },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  accent: { bg: colors.blueSoft, fg: colors.brown },
  ink: { bg: colors.brown, fg: colors.yellow },
};

export function Badge({
  label,
  tone = 'primary',
  icon,
  style,
}: {
  label: string;
  tone?: BadgeTone;
  icon?: FranIconName;
  style?: StyleProp<ViewStyle>;
}) {
  const { bg, fg } = BADGE_TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {icon ? <FranIcon name={icon} size={11} color={fg} style={{ marginRight: 4 }} /> : null}
      <Text style={[styles.badgeText, { color: fg }]}>{label}</Text>
    </View>
  );
}

/** Soft rounded well behind an icon — the recurring accent shape across the app */
export function IconTile({
  icon,
  tone = 'yellow',
  size = 40,
  iconSize,
  style,
}: {
  icon: FranIconName;
  tone?: 'yellow' | 'blue' | 'peach' | 'cream' | 'brown' | 'danger';
  size?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const map = {
    yellow: { bg: colors.yellowSoft, fg: colors.brown },
    blue: { bg: colors.blueSoft, fg: colors.brown },
    peach: { bg: colors.peachSoft, fg: colors.brown },
    cream: { bg: colors.surfaceSunken, fg: colors.inkSoft },
    brown: { bg: colors.brown, fg: colors.yellow },
    danger: { bg: colors.dangerSoft, fg: colors.danger },
  }[tone];

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size * 0.34,
          backgroundColor: map.bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <FranIcon name={icon} size={iconSize ?? Math.round(size * 0.52)} color={map.fg} />
    </View>
  );
}

export function ProgressBar({
  value,
  tone = 'primary',
  height = 8,
  onDark,
  style,
}: {
  /** 0–1 */
  value: number;
  tone?: 'primary' | 'accent' | 'success';
  height?: number;
  /** Use a light track when sitting on a coloured card */
  onDark?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const fill =
    tone === 'accent' ? colors.blue : tone === 'success' ? colors.success : colors.yellow;
  const clamped = Math.max(0, Math.min(1, value));

  return (
    <View
      style={[
        {
          height,
          borderRadius: height / 2,
          backgroundColor: onDark ? tint.lightLine : tint.inkTrack,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: fill,
        }}
      />
    </View>
  );
}

export function Segmented<T extends string>({
  items,
  value,
  onChange,
  style,
}: {
  items: ReadonlyArray<{ key: T; label: string }>;
  value: T;
  onChange: (key: T) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.segmented, style]}>
      {items.map((item) => {
        const active = item.key === value;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.segment,
              active && styles.segmentOn,
              pressed && !active && { backgroundColor: tint.inkFaint },
            ]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextOn]} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Carousel page indicator — active dot stretches into a capsule */
export function Dots({
  count,
  index,
  style,
}: {
  count: number;
  index: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.dots, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i === index && styles.dotOn]} />
      ))}
    </View>
  );
}

/**
 * Ticket tear line — notches bitten out of both edges with a dotted rule
 * between. Dots rather than a dashed border, which Android renders unevenly.
 */
export function Perforation({
  notchColor = colors.background,
  dotColor = colors.borderStrong,
  notchSize = 16,
}: {
  /** Should match whatever sits behind the ticket */
  notchColor?: string;
  dotColor?: string;
  notchSize?: number;
}) {
  return (
    <View style={[styles.perfRow, { height: notchSize }]}>
      <View
        style={{
          width: notchSize,
          height: notchSize,
          borderRadius: notchSize / 2,
          marginLeft: -notchSize / 2,
          backgroundColor: notchColor,
        }}
      />
      <View style={styles.perfDots}>
        {Array.from({ length: 60 }).map((_, i) => (
          <View key={i} style={[styles.perfDot, { backgroundColor: dotColor }]} />
        ))}
      </View>
      <View
        style={{
          width: notchSize,
          height: notchSize,
          borderRadius: notchSize / 2,
          marginRight: -notchSize / 2,
          backgroundColor: notchColor,
        }}
      />
    </View>
  );
}

export function ListRow({
  title,
  subtitle,
  icon,
  iconTone = 'yellow',
  onPress,
  right,
  danger,
  style,
}: {
  title: string;
  subtitle?: string;
  icon?: FranIconName;
  iconTone?: 'yellow' | 'blue' | 'peach' | 'cream';
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [
        styles.listRow,
        pressed && onPress && { backgroundColor: tint.inkFaint },
        style,
      ]}
    >
      {icon ? <IconTile icon={icon} tone={danger ? 'danger' : iconTone} size={38} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={[styles.listTitle, danger && { color: colors.danger }]}>{title}</Text>
        {subtitle ? <Text style={styles.listSub}>{subtitle}</Text> : null}
      </View>
      {right}
      {onPress && !right ? (
        <FranIcon name="chevronRight" size={17} color={colors.borderStrong} />
      ) : null}
    </Pressable>
  );
}

export function EmptyState({
  icon = 'document',
  title,
  subtitle,
}: {
  icon?: FranIconName;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <FranIcon name={icon} size={32} color={colors.brownMuted} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySub}>{subtitle}</Text> : null}
    </View>
  );
}

export function Divider({ inset }: { inset?: boolean }) {
  return <View style={[styles.divider, inset && { marginLeft: spacing.lg + 38 + spacing.md }]} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    marginBottom: spacing.sm,
  },
  headerDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    marginBottom: spacing.md,
  },
  headerSide: {
    width: 44,
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    textAlign: 'center',
  },
  headerSubtitle: {
    ...typography.micro,
    marginTop: 1,
  },
  iconBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: tint.inkFaint,
  },
  iconBtnPressed: {
    backgroundColor: tint.inkPress,
  },
  btn: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  btnPrimary: {
    backgroundColor: colors.yellow,
  },
  btnPrimaryGlow: shadow.glow,
  btnSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.brown,
  },
  btnTonal: {
    backgroundColor: colors.yellowSoft,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnDanger: {
    backgroundColor: colors.danger,
  },
  btnDisabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    ...typography.button,
  },
  inputLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  input: {
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
  },
  inputFocused: {
    borderColor: colors.yellowDeep,
    backgroundColor: colors.cream,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.surface,
  },
  inputErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  inputErrorText: {
    ...typography.caption,
    color: colors.danger,
  },
  inputHint: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
    marginTop: spacing.xxl,
  },
  sectionEyebrow: {
    ...typography.eyebrow,
    marginBottom: 3,
  },
  sectionTitle: {
    ...typography.h3,
  },
  sectionSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  sectionActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionAction: {
    ...typography.captionBold,
    color: colors.brownSoft,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  segmentOn: {
    backgroundColor: colors.surface,
    ...shadow.xs,
  },
  segmentText: {
    ...typography.captionBold,
    color: colors.brownMuted,
  },
  segmentTextOn: {
    color: colors.brown,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
  },
  dotOn: {
    width: 20,
    backgroundColor: colors.yellowDeep,
  },
  perfRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perfDots: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
    marginHorizontal: 6,
  },
  perfDot: {
    width: 4,
    height: 2,
    borderRadius: 1,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    minHeight: 62,
  },
  listTitle: {
    ...typography.title,
  },
  listSub: {
    ...typography.caption,
    marginTop: 1,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    ...typography.title,
    color: colors.inkSoft,
  },
  emptySub: {
    ...typography.caption,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
    maxWidth: 320,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
  },
});
