import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/theme";

export function BackHeader({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <View style={styles.bar}>
      <Pressable
        onPress={onBack ?? (() => router.back())}
        hitSlop={12}
        style={styles.backBtn}
      >
        <Text style={styles.backText}>← Назад</Text>
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.mist,
    gap: 8,
  },
  backBtn: { minWidth: 72 },
  backText: {
    color: colors.primary,
    fontFamily: fonts.sansSemi,
    fontSize: 15,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontFamily: fonts.sansBold,
    color: colors.ink,
  },
  spacer: { minWidth: 72 },
});
