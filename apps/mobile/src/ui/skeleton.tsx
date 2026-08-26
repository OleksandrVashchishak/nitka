import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "@/theme";

function Bone({
  height = 14,
  width = "100%" as number | `${number}%`,
  style,
}: {
  height?: number;
  width?: number | `${number}%`;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.bone,
        { height, width: width as number | Animated.Value | `${number}%`, opacity },
        style,
      ]}
    />
  );
}

/** Placeholder layout instead of fullscreen spinner */
export function SkeletonScreen({
  variant = "list",
}: {
  variant?: "list" | "home" | "detail";
}) {
  if (variant === "home") {
    return (
      <View style={styles.pad}>
        <Bone height={28} width="70%" />
        <Bone height={12} width="45%" style={{ marginTop: 8 }} />
        <View style={styles.countdown}>
          <Bone height={40} width={56} />
          <View style={{ flex: 1, gap: 8 }}>
            <Bone height={14} width="60%" />
            <Bone height={12} width="40%" />
          </View>
        </View>
        <View style={styles.card}>
          <Bone height={16} width="40%" />
          <Bone height={14} width="90%" style={{ marginTop: 14 }} />
          <Bone height={14} width="75%" style={{ marginTop: 10 }} />
          <Bone height={14} width="80%" style={{ marginTop: 10 }} />
        </View>
        <View style={styles.metrics}>
          <Bone height={72} width={100} style={styles.metric} />
          <Bone height={72} width={100} style={styles.metric} />
          <Bone height={72} width={100} style={styles.metric} />
        </View>
        <View style={styles.card}>
          <Bone height={16} width="30%" />
          <Bone height={44} style={{ marginTop: 12 }} />
          <Bone height={44} style={{ marginTop: 8 }} />
          <Bone height={44} style={{ marginTop: 8 }} />
        </View>
      </View>
    );
  }

  if (variant === "detail") {
    return (
      <View style={styles.pad}>
        <Bone height={24} width="50%" />
        <Bone height={160} style={{ marginTop: 16, borderRadius: radius.lg }} />
        <Bone height={14} width="90%" style={{ marginTop: 16 }} />
        <Bone height={14} width="70%" style={{ marginTop: 8 }} />
        <Bone height={48} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <View style={styles.pad}>
      <Bone height={28} width="40%" />
      <Bone height={12} width="55%" style={{ marginTop: 8 }} />
      <View style={styles.chips}>
        <Bone height={32} width={72} style={styles.chip} />
        <Bone height={32} width={72} style={styles.chip} />
        <Bone height={32} width={72} style={styles.chip} />
      </View>
      <View style={styles.card}>
        {Array.from({ length: 7 }).map((_, i) => (
          <View key={i} style={styles.row}>
            <View style={{ flex: 1, gap: 6 }}>
              <Bone height={14} width={`${70 - (i % 3) * 10}%`} />
              <Bone height={11} width={`${50 - (i % 2) * 10}%`} />
            </View>
            <Bone height={22} width={52} style={{ borderRadius: 999 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { padding: spacing.lg, gap: 4 },
  bone: {
    backgroundColor: colors.blush,
    borderRadius: radius.sm,
  },
  countdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 18,
    marginBottom: 8,
  },
  card: {
    marginTop: 14,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  metrics: { flexDirection: "row", gap: 10, marginTop: 14 },
  metric: { borderRadius: radius.md },
  chips: { flexDirection: "row", gap: 8, marginTop: 16, marginBottom: 4 },
  chip: { borderRadius: 999 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
});
