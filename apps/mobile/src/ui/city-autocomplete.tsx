import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { filterUaCities } from "@/lib/ua-cities";
import { colors, radius } from "@/theme";
import { Input } from "@/ui";

type Props = {
  label?: string;
  value: string;
  onChangeText: (city: string) => void;
  placeholder?: string;
};

export function CityAutocomplete({
  label,
  value,
  onChangeText,
  placeholder = "Почни вводити місто…",
}: Props) {
  const [open, setOpen] = useState(false);
  const suggestions = useMemo(
    () => filterUaCities(value, 8),
    [value],
  );

  return (
    <View style={styles.wrap}>
      <Input
        label={label}
        value={value}
        onChangeText={(v) => {
          onChangeText(v);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoCorrect={false}
      />
      {open && suggestions.length > 0 ? (
        <View style={styles.list}>
          {suggestions.map((city) => (
            <Pressable
              key={city}
              style={({ pressed }) => [
                styles.item,
                pressed && styles.itemPressed,
              ]}
              onPress={() => {
                onChangeText(city);
                setOpen(false);
              }}
            >
              <Text style={styles.itemText}>{city}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 4, zIndex: 2 },
  list: {
    marginTop: -6,
    marginBottom: 10,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    overflow: "hidden",
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  itemPressed: { backgroundColor: colors.mist },
  itemText: { fontSize: 15, color: colors.ink },
});
