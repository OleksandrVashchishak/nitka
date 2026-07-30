import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, shadows, spacing } from "@/theme";

/* ─── Typography ──────────────────────────────────────────── */

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

/** Large iOS-style screen header */
export function ScreenHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.largeTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

/* ─── Screen ──────────────────────────────────────────────── */

export function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

/* ─── Button ──────────────────────────────────────────────── */

export function Button({
  label,
  onPress,
  loading,
  disabled,
  variant = "primary",
  size = "md",
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger" | "soft";
  size?: "sm" | "md";
}) {
  const small = size === "sm";
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.btn,
        small && styles.btnSm,
        variant === "ghost" && styles.btnGhost,
        variant === "soft" && styles.btnSoft,
        variant === "danger" && styles.btnDanger,
        (disabled || loading) && styles.btnDisabled,
        pressed && styles.btnPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "ghost" || variant === "soft"
              ? colors.primary
              : colors.white
          }
        />
      ) : (
        <Text
          style={[
            styles.btnText,
            small && styles.btnTextSm,
            variant === "ghost" && styles.btnTextGhost,
            variant === "soft" && styles.btnTextSoft,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

/** Floating action button — bottom-right primary action */
export function Fab({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        shadows.fab,
        pressed && styles.fabPressed,
      ]}
    >
      <Text style={styles.fabText}>{label}</Text>
    </Pressable>
  );
}

/* ─── Input ───────────────────────────────────────────────── */

export function Input(props: TextInputProps & { label?: string }) {
  const { label, style, ...rest } = props;
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.inkMuted}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

/* ─── Card ────────────────────────────────────────────────── */

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/* ─── Grouped list (iOS Settings style) ───────────────────── */

export function ListGroup({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header?: string;
  footer?: string;
}) {
  return (
    <View style={styles.listGroupWrap}>
      {header ? <Text style={styles.listGroupHeader}>{header}</Text> : null}
      <View style={styles.listGroup}>{children}</View>
      {footer ? <Text style={styles.listGroupFooter}>{footer}</Text> : null}
    </View>
  );
}

export function ListRow({
  title,
  subtitle,
  right,
  onPress,
  onLongPress,
  icon,
  last,
  destructive,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  icon?: string;
  last?: boolean;
  destructive?: boolean;
}) {
  const content = (
    <>
      {icon ? (
        <View style={styles.listIconWrap}>
          <Text style={styles.listIcon}>{icon}</Text>
        </View>
      ) : null}
      <View style={[styles.listRowBody, !last && styles.listRowBorder]}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text
            style={[styles.rowTitle, destructive && styles.rowDestructive]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.rowSub} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right ??
          (onPress ? <Text style={styles.rowArrow}>›</Text> : null)}
      </View>
    </>
  );

  if (onPress || onLongPress) {
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={350}
        unstable_pressDelay={30}
        style={({ pressed }) => [
          styles.listRow,
          pressed && styles.listRowPressed,
        ]}
      >
        {content}
      </Pressable>
    );
  }
  return <View style={styles.listRow}>{content}</View>;
}

/* ─── Empty / Loading / Error ─────────────────────────────── */

export function Empty({
  title,
  hint,
  actionLabel,
  onAction,
}: {
  title: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {hint ? <Text style={styles.emptyHint}>{hint}</Text> : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: 14, alignSelf: "stretch" }}>
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

export function Loading() {
  return (
    <SafeAreaView style={styles.loading}>
      <ActivityIndicator color={colors.primary} size="large" />
    </SafeAreaView>
  );
}

export { SkeletonScreen } from "@/ui/skeleton";
export { ToastHost } from "@/ui/toast";
export { RsvpCelebration } from "@/ui/rsvp-celebration";
export { FormScroll } from "@/ui/form-scroll";

export function ErrorBox({ message }: { message: string }) {
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export function Badge({
  label,
  tone = "sage",
}: {
  label: string;
  tone?: "sage" | "warn" | "ok" | "muted";
}) {
  const map = {
    ok: { bg: colors.successMuted, fg: "#15803d" },
    warn: { bg: colors.warnMuted, fg: "#92400e" },
    sage: { bg: colors.primaryMuted, fg: colors.primaryDeep },
    muted: { bg: colors.blush, fg: colors.inkSoft },
  };
  const c = map[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

/** Standalone row (outside ListGroup) — kept for compatibility */
export function Row({
  title,
  subtitle,
  right,
  onPress,
  icon,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  icon?: string;
}) {
  return (
    <ListGroup>
      <ListRow
        title={title}
        subtitle={subtitle}
        right={right}
        onPress={onPress}
        icon={icon}
        last
      />
    </ListGroup>
  );
}

/* ─── Styles ──────────────────────────────────────────────── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.mist,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.md,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.8,
  },
  headerSub: {
    marginTop: 2,
    fontSize: 15,
    color: colors.inkSoft,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 2,
    letterSpacing: -0.8,
    paddingHorizontal: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.inkSoft,
    marginBottom: spacing.md,
    lineHeight: 21,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: spacing.lg,
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    minHeight: 50,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSm: { minHeight: 40, paddingVertical: 10, paddingHorizontal: 18 },
  btnGhost: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  btnSoft: { backgroundColor: colors.primaryMuted },
  btnDanger: { backgroundColor: colors.danger },
  btnDisabled: { opacity: 0.4 },
  btnPressed: { opacity: 0.7 },
  btnText: { color: colors.white, fontWeight: "700", fontSize: 16 },
  btnTextSm: { fontSize: 14 },
  btnTextGhost: { color: colors.ink },
  btnTextSoft: { color: colors.primary },

  fab: {
    position: "absolute",
    right: 16,
    bottom: 20,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 22,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  fabPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  fabText: { color: colors.white, fontWeight: "700", fontSize: 16 },

  field: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
    marginBottom: 6,
  },
  input: {
    borderWidth: 0,
    backgroundColor: colors.blush,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
    fontSize: 17,
    color: colors.ink,
  },

  card: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },

  listGroupWrap: { marginBottom: 20 },
  listGroupHeader: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.inkSoft,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  listGroupFooter: {
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  listGroup: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    paddingLeft: 16,
  },
  listRowPressed: { opacity: 0.72 },
  listIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  listIcon: { fontSize: 16 },
  listRowBody: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    paddingVertical: 12,
    paddingRight: 16,
  },
  listRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  rowTitle: { fontSize: 17, fontWeight: "400", color: colors.ink },
  rowDestructive: { color: colors.danger },
  rowSub: { marginTop: 2, fontSize: 13, color: colors.inkSoft },
  rowArrow: {
    fontSize: 22,
    color: colors.inkMuted,
    fontWeight: "300",
    marginLeft: 4,
  },

  empty: { paddingVertical: 64, alignItems: "center", paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: colors.ink },
  emptyHint: {
    marginTop: 8,
    color: colors.inkSoft,
    textAlign: "center",
    lineHeight: 21,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mist,
  },
  errorBox: {
    backgroundColor: colors.dangerMuted,
    padding: 14,
    borderRadius: radius.md,
    marginBottom: 12,
    marginHorizontal: 4,
  },
  errorText: { color: colors.danger, fontSize: 14, fontWeight: "500" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.2 },
});
