import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToastStore } from "@/lib/toast-store";
import { colors, radius, shadows, spacing } from "@/theme";

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (!toasts.length) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { bottom: Math.max(insets.bottom, 12) + 56 }]}
    >
      {toasts.map((t) => (
        <Pressable
          key={t.id}
          onPress={() => dismiss(t.id)}
          style={[
            styles.toast,
            t.tone === "ok" && styles.ok,
            t.tone === "warn" && styles.warn,
          ]}
        >
          <Text style={styles.title} numberOfLines={1}>
            {t.title}
          </Text>
          {t.message ? (
            <Text style={styles.message} numberOfLines={2}>
              {t.message}
            </Text>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...shadows.fab,
  },
  ok: { backgroundColor: colors.sage },
  warn: { backgroundColor: colors.primaryDeep },
  title: { color: "#fff", fontSize: 15, fontWeight: "700" },
  message: { color: "rgba(255,255,255,0.82)", fontSize: 13, marginTop: 2 },
});
