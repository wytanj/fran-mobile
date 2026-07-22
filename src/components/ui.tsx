import { Text, TextInput } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
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
import { colors, fonts, radius, shadow, spacing, typography } from '../theme';

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
  onBack,
  right,
  large,
}: {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  large?: boolean;
}) {
  return (
    <View style={[styles.header, large && { marginBottom: spacing.md }]}>
      <View style={styles.headerSide}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </Pressable>
        ) : null}
      </View>
      <Text style={[styles.headerTitle, large && typography.h2]} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.headerSide, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  icon,
}: {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const isDisabled = disabled || loading;
  const iconColor =
    variant === 'primary'
      ? colors.brown
      : variant === 'danger'
        ? colors.white
        : colors.brown;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        variant === 'primary' && styles.btnPrimary,
        variant === 'secondary' && styles.btnSecondary,
        variant === 'ghost' && styles.btnGhost,
        variant === 'danger' && styles.btnDanger,
        isDisabled && styles.btnDisabled,
        pressed && !isDisabled && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <View style={styles.btnRow}>
          {icon ? (
            <Ionicons name={icon} size={18} color={iconColor} style={{ marginRight: 8 }} />
          ) : null}
          <Text
            style={[
              styles.btnText,
              variant === 'primary' && styles.btnTextPrimary,
              (variant === 'secondary' || variant === 'ghost') && styles.btnTextSecondary,
              variant === 'danger' && styles.btnTextDanger,
              isDisabled && styles.btnTextDisabled,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export function Input({
  label,
  error,
  containerStyle,
  ...props
}: TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}) {
  return (
    <View style={[{ marginBottom: spacing.lg }, containerStyle]}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, error ? styles.inputError : null, props.style]}
        {...props}
      />
      {error ? <Text style={styles.inputErrorText}>{error}</Text> : null}
    </View>
  );
}

export function Card({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          shadow.sm,
          pressed && { opacity: 0.92 },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, shadow.sm, style]}>{children}</View>;
}

export function SectionTitle({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Badge({
  label,
  tone = 'primary',
}: {
  label: string;
  tone?: 'primary' | 'muted' | 'success' | 'warning' | 'danger';
}) {
  const bg =
    tone === 'primary'
      ? colors.yellowSoft
      : tone === 'success'
        ? colors.successSoft
        : tone === 'warning'
          ? colors.warningSoft
          : tone === 'danger'
            ? colors.dangerSoft
            : colors.peachSoft;
  const fg =
    tone === 'primary'
      ? colors.brown
      : tone === 'success'
        ? colors.success
        : tone === 'warning'
          ? colors.warning
          : tone === 'danger'
            ? colors.danger
            : colors.muted;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function ListRow({
  title,
  subtitle,
  icon,
  onPress,
  right,
  danger,
}: {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.listRow,
        pressed && onPress && { backgroundColor: colors.peachSoft },
      ]}
    >
      {icon ? (
        <View style={[styles.listIcon, danger && { backgroundColor: colors.dangerSoft }]}>
          <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.brown} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={[styles.listTitle, danger && { color: colors.danger }]}>{title}</Text>
        {subtitle ? <Text style={styles.listSub}>{subtitle}</Text> : null}
      </View>
      {right}
      {onPress && !right ? (
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      ) : null}
    </Pressable>
  );
}

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  subtitle,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={40} color={colors.muted} />
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySub}>{subtitle}</Text> : null}
    </View>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    marginBottom: spacing.sm,
  },
  headerSide: {
    width: 48,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...typography.h3,
    color: colors.ink,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  btn: {
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  btnPrimary: {
    backgroundColor: colors.yellow,
  },
  btnSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.brown,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnDanger: {
    backgroundColor: colors.danger,
  },
  btnDisabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    fontFamily: fonts.displayMedium,
    fontSize: 17,
    letterSpacing: 0.3,
  },
  btnTextPrimary: {
    color: colors.brown,
  },
  btnTextSecondary: {
    color: colors.brown,
  },
  btnTextDanger: {
    color: colors.white,
  },
  btnTextDisabled: {
    color: colors.muted,
  },
  inputLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputErrorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.ink,
  },
  sectionAction: {
    ...typography.captionBold,
    color: colors.brownSoft,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: fonts.bodySemi,
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTitle: {
    ...typography.bodyBold,
    color: colors.ink,
  },
  listSub: {
    ...typography.caption,
    color: colors.muted,
    marginTop: 2,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.bodyBold,
    color: colors.inkSoft,
  },
  emptySub: {
    ...typography.caption,
    color: colors.muted,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
