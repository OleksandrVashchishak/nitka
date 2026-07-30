import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { createElement, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { colors, radius } from "@/theme";

function parseIso(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateUk(iso: string): string {
  const d = parseIso(iso);
  if (!d) return "";
  return d.toLocaleDateString("uk-UA");
}

type Props = {
  label: string;
  value: string;
  onChange: (isoDate: string) => void;
  placeholder?: string;
  allowClear?: boolean;
  style?: ViewStyle;
};

export function DateField({
  label,
  value,
  onChange,
  placeholder = "Обери дату",
  allowClear = false,
  style,
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = parseIso(value) ?? new Date();

  function onNativeChange(event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === "android") setOpen(false);
    if (event.type === "dismissed") {
      setOpen(false);
      return;
    }
    if (date) onChange(toIsoDate(date));
  }

  if (Platform.OS === "web") {
    return (
      <View style={[styles.field, style]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={styles.webRow}>
          {createElement("input", {
            type: "date",
            value: value || "",
            onChange: (e: { target: { value: string } }) =>
              onChange(e.target.value),
            style: {
              flex: 1,
              border: "none",
              background: colors.blush,
              borderRadius: radius.md,
              padding: "14px 16px",
              minHeight: 48,
              fontSize: 17,
              color: colors.ink,
              fontFamily: "inherit",
              boxSizing: "border-box",
              width: "100%",
            },
          })}
          {allowClear && value ? (
            <Pressable onPress={() => onChange("")} hitSlop={8}>
              <Text style={styles.clear}>Очистити</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.field, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.input, pressed && styles.pressed]}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? formatDateUk(value) : placeholder}
        </Text>
      </Pressable>
      {allowClear && value ? (
        <Pressable onPress={() => onChange("")} style={styles.clearBtn}>
          <Text style={styles.clear}>Очистити</Text>
        </Pressable>
      ) : null}
      {open ? (
        <>
          <DateTimePicker
            value={selected}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onNativeChange}
            locale="uk-UA"
          />
          {Platform.OS === "ios" ? (
            <Pressable onPress={() => setOpen(false)} style={styles.done}>
              <Text style={styles.doneText}>Готово</Text>
            </Pressable>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.blush,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
    justifyContent: "center",
  },
  pressed: { opacity: 0.75 },
  value: { fontSize: 17, color: colors.ink },
  placeholder: { fontSize: 17, color: colors.inkMuted },
  webRow: { gap: 8 },
  clearBtn: { marginTop: 6, alignSelf: "flex-start" },
  clear: { fontSize: 13, color: colors.primary, fontWeight: "600" },
  done: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  doneText: { fontSize: 16, fontWeight: "700", color: colors.primary },
});
