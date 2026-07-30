import type { ReactNode, Ref } from "react";
import {
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type ScrollViewProps,
} from "react-native";
import { useKeyboardHeight } from "@/lib/use-keyboard-height";

/** ScrollView що додає місце під клавіатуру — кнопки внизу лишаються досяжні. */
export function FormScroll({
  children,
  contentContainerStyle,
  scrollRef,
  ...rest
}: {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollRef?: Ref<ScrollView>;
} & Omit<ScrollViewProps, "contentContainerStyle" | "children">) {
  const keyboardHeight = useKeyboardHeight();

  return (
    <ScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.base,
        contentContainerStyle,
        keyboardHeight > 0 ? { paddingBottom: keyboardHeight + 24 } : null,
      ]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  base: {
    flexGrow: 1,
  },
});
