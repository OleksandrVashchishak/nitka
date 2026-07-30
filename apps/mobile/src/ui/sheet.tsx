import type { ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hapticSoft } from "@/lib/haptics";
import { useKeyboardHeight } from "@/lib/use-keyboard-height";
import { colors, radius } from "@/theme";

const DISMISS_DY = 110;
const DISMISS_VY = 1.15;

export function Sheet({
  visible,
  title,
  onClose,
  children,
  footer,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const keyboardHeight = useKeyboardHeight();

  useEffect(() => {
    if (visible) translateY.setValue(0);
  }, [visible, translateY]);

  useEffect(() => {
    if (!visible || keyboardHeight <= 0) return;
    const t = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(t);
  }, [keyboardHeight, visible]);

  function finishClose() {
    hapticSoft();
    translateY.setValue(0);
    onClose();
  }

  function snapBack() {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }

  function flingAway() {
    Animated.timing(translateY, {
      toValue: 640,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) finishClose();
    });
  }

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          keyboardHeight === 0 &&
          g.dy > 10 &&
          Math.abs(g.dy) > Math.abs(g.dx) * 1.4,
        onPanResponderMove: (_, g) => {
          if (g.dy > 0) translateY.setValue(g.dy);
        },
        onPanResponderRelease: (_, g) => {
          if (g.dy > DISMISS_DY || g.vy > DISMISS_VY) flingAway();
          else snapBack();
        },
        onPanResponderTerminate: () => snapBack(),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keyboardHeight],
  );

  const backdropOpacity = translateY.interpolate({
    inputRange: [0, 320],
    outputRange: [1, 0.25],
    extrapolate: "clamp",
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdropRoot}>
        <Animated.View
          style={[styles.backdropFill, { opacity: backdropOpacity }]}
        >
          <Pressable
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheetWrap,
            {
              marginBottom: keyboardHeight,
              maxHeight: keyboardHeight > 0 ? "70%" : "92%",
              transform: [{ translateY }],
            },
          ]}
        >
          <SafeAreaView
            style={styles.sheet}
            edges={keyboardHeight > 0 ? [] : ["bottom"]}
          >
            <View {...panResponder.panHandlers} style={styles.dragZone}>
              <View style={styles.handle} />
              <View style={styles.head}>
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
                <Pressable
                  onPress={onClose}
                  hitSlop={12}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeText}>Готово</Text>
                </Pressable>
              </View>
            </View>

            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.body}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              bounces
            >
              {children}
            </ScrollView>
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function ChipRow({
  options,
  value,
  onChange,
}: {
  options: Array<{ id: string; label: string }>;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chips}
      keyboardShouldPersistTaps="handled"
    >
      {options.map((o) => {
        const on = o.id === value;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            hitSlop={4}
            style={[styles.chip, on && styles.chipOn]}
          >
            <Text style={[styles.chipText, on && styles.chipTextOn]}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backdropRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdropFill: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlay,
  },
  sheetWrap: {
    width: "100%",
  },
  sheet: {
    maxHeight: "100%",
    backgroundColor: colors.mist,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  dragZone: {
    paddingBottom: 4,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.champagne,
    marginTop: 8,
    marginBottom: 4,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.primary,
  },
  body: { paddingHorizontal: 16, paddingBottom: 24 },
  footer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: colors.paper,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    gap: 8,
  },
  chips: {
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    minHeight: 36,
    borderRadius: radius.full,
    backgroundColor: colors.blush,
    justifyContent: "center",
  },
  chipOn: { backgroundColor: colors.ink },
  chipText: { fontSize: 14, fontWeight: "600", color: colors.inkSoft },
  chipTextOn: { color: colors.white },
});
