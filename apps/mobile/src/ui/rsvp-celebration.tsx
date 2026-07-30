import { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

const DOTS = 14;

/** Short burst after RSVP «Так» — без важких libs */
export function RsvpCelebration({
  active,
  onDone,
}: {
  active: boolean;
  onDone?: () => void;
}) {
  const pulse = useRef(new Animated.Value(0)).current;
  const dots = useMemo(
    () =>
      Array.from({ length: DOTS }, (_, i) => ({
        id: i,
        angle: (i / DOTS) * Math.PI * 2,
        dist: 48 + (i % 4) * 18,
        size: 6 + (i % 3) * 2,
        color: ["#3f6b55", "#c9b18a", "#6b8f71", "#e8a0bf", "#7a9eb5"][i % 5]!,
        anim: new Animated.Value(0),
      })),
    [],
  );

  useEffect(() => {
    if (!active) return;
    pulse.setValue(0);
    dots.forEach((d) => d.anim.setValue(0));

    Animated.parallel([
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      ...dots.map((d, i) =>
        Animated.timing(d.anim, {
          toValue: 1,
          duration: 700 + (i % 5) * 40,
          delay: i * 18,
          useNativeDriver: true,
        }),
      ),
    ]).start(({ finished }) => {
      if (finished) onDone?.();
    });
  }, [active, dots, onDone, pulse]);

  if (!active) return null;

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.12],
  });

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Animated.View style={[styles.pulse, { transform: [{ scale }], opacity: pulse }]}>
        <Text style={styles.heart}>♡</Text>
      </Animated.View>
      {dots.map((d) => {
        const tx = d.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(d.angle) * d.dist],
        });
        const ty = d.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(d.angle) * d.dist],
        });
        const opacity = d.anim.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [0, 1, 0],
        });
        return (
          <Animated.View
            key={d.id}
            style={[
              styles.dot,
              {
                width: d.size,
                height: d.size,
                borderRadius: d.size / 2,
                backgroundColor: d.color,
                opacity,
                transform: [{ translateX: tx }, { translateY: ty }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  pulse: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(63,107,85,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  heart: {
    fontSize: 28,
    color: colors.primary,
  },
  dot: {
    position: "absolute",
  },
});
