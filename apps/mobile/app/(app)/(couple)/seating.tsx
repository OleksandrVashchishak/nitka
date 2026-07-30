import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getGuestList, updateGuest } from "@/lib/guests-api";
import { href } from "@/lib/href";
import type { Guest } from "@/lib/types";
import { colors, spacing } from "@/theme";
import { ChipRow, Sheet } from "@/ui/sheet";
import {
  Badge,
  Button,
  Empty,
  ErrorBox,
  Fab,
  Input,
  ListGroup,
  ListRow,
  Loading,
  ScreenHeader,
} from "@/ui";

const UNASSIGNED = "__none__";

function formatTable(label: string | null | undefined) {
  if (!label?.trim()) return "Без столу";
  const t = label.trim();
  return t.toLowerCase().startsWith("стіл") ? t : `Стіл ${t}`;
}

function normalizeTableKey(label: string | null | undefined) {
  return label?.trim() || UNASSIGNED;
}

export default function SeatingScreen() {
  const qc = useQueryClient();
  const listQ = useQuery({ queryKey: ["guests"], queryFn: getGuestList });
  const [tableFilter, setTableFilter] = useState("ALL");
  const [assigning, setAssigning] = useState<Guest | null>(null);
  const [pickedTable, setPickedTable] = useState("");
  const [newTable, setNewTable] = useState("");
  const [showNewTable, setShowNewTable] = useState(false);
  const [draftTableName, setDraftTableName] = useState("");
  const [pickGuestForTable, setPickGuestForTable] = useState<string | null>(
    null,
  );

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["guests"] });
    void qc.invalidateQueries({ queryKey: ["insights"] });
  };

  const assignMut = useMutation({
    mutationFn: ({
      id,
      tableLabel,
    }: {
      id: string;
      tableLabel: string | null;
    }) => updateGuest(id, { tableLabel }),
    onSuccess: () => {
      setAssigning(null);
      setPickGuestForTable(null);
      setShowNewTable(false);
      setDraftTableName("");
      setNewTable("");
      invalidate();
    },
  });

  const guests = listQ.data?.guests ?? [];

  const tables = useMemo(() => {
    const set = new Set<string>();
    for (const g of guests) {
      if (g.tableLabel?.trim()) set.add(g.tableLabel.trim());
    }
    return [...set].sort((a, b) =>
      a.localeCompare(b, "uk", { numeric: true }),
    );
  }, [guests]);

  const unassigned = useMemo(
    () => guests.filter((g) => !g.tableLabel?.trim()),
    [guests],
  );

  const tableChips = useMemo(
    () => [
      { id: "ALL", label: `Усі (${guests.length})` },
      { id: UNASSIGNED, label: `Без столу (${unassigned.length})` },
      ...tables.map((t) => {
        const n = guests.filter((g) => g.tableLabel?.trim() === t).length;
        return { id: t, label: `${formatTable(t)} (${n})` };
      }),
    ],
    [guests, tables, unassigned.length],
  );

  const visible = useMemo(() => {
    return guests.filter((g) => {
      const key = normalizeTableKey(g.tableLabel);
      if (tableFilter === "ALL") return true;
      return key === tableFilter;
    });
  }, [guests, tableFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, Guest[]>();
    for (const g of visible) {
      const key = normalizeTableKey(g.tableLabel);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(g);
    }
    const keys = [...map.keys()].sort((a, b) => {
      if (a === UNASSIGNED) return 1;
      if (b === UNASSIGNED) return -1;
      return a.localeCompare(b, "uk", { numeric: true });
    });
    return keys.map((key) => ({
      key,
      label: key === UNASSIGNED ? "Без столу" : formatTable(key),
      rows: map.get(key)!,
    }));
  }, [visible]);

  function openAssign(g: Guest) {
    setAssigning(g);
    setPickedTable(g.tableLabel?.trim() || UNASSIGNED);
    setNewTable("");
  }

  function saveAssign() {
    if (!assigning) return;
    const label =
      pickedTable === UNASSIGNED
        ? null
        : pickedTable === "__new__"
          ? newTable.trim() || null
          : pickedTable;
    assignMut.mutate({ id: assigning.id, tableLabel: label });
  }

  function startNewTable() {
    const name = draftTableName.trim();
    if (!name) return;
    setShowNewTable(false);
    setDraftTableName("");
    setTableFilter(name);
    if (unassigned.length > 0) {
      setPickGuestForTable(name);
    }
  }

  if (listQ.isLoading) return <Loading />;
  if (listQ.isError) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ErrorBox
          message={
            listQ.error instanceof Error ? listQ.error.message : "Помилка"
          }
        />
      </SafeAreaView>
    );
  }

  if (!listQ.data) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Empty title="Немає весілля" hint="Створи його на Домі" />
      </SafeAreaView>
    );
  }

  const assignChips = [
    { id: UNASSIGNED, label: "Без столу" },
    ...tables.map((t) => ({ id: t, label: formatTable(t) })),
    { id: "__new__", label: "+ Новий" },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.pad}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader
          title="Розсадка"
          subtitle={`${guests.length} гостей · ${tables.length} столів · ${unassigned.length} без місця`}
        />

        <ChipRow
          options={tableChips}
          value={tableFilter}
          onChange={setTableFilter}
        />

        {grouped.length === 0 ? (
          <Empty
            title="Порожньо"
            hint="Немає гостей для розсадки"
            actionLabel="До гостей"
            onAction={() => router.push(href("/(app)/(couple)/guests"))}
          />
        ) : (
          grouped.map((g) => (
            <ListGroup
              key={g.key}
              header={`${g.label} · ${g.rows.length}`}
              footer="Тап — призначити стіл"
            >
              {g.rows.map((guest, i) => (
                <ListRow
                  key={guest.id}
                  title={guest.name}
                  subtitle={
                    guest.rsvpStatus === "YES"
                      ? "Так"
                      : guest.rsvpStatus === "NO"
                        ? "Ні"
                        : guest.rsvpStatus === "MAYBE"
                          ? "Може"
                          : "Чекаємо відповіді"
                  }
                  right={
                    <Badge
                      label={
                        guest.tableLabel?.trim()
                          ? formatTable(guest.tableLabel)
                          : "—"
                      }
                      tone={guest.tableLabel?.trim() ? "sage" : "muted"}
                    />
                  }
                  last={i === g.rows.length - 1}
                  onPress={() => openAssign(guest)}
                />
              ))}
            </ListGroup>
          ))
        )}
        <View style={{ height: 72 }} />
      </ScrollView>

      <Fab label="+ Стіл" onPress={() => setShowNewTable(true)} />

      <Sheet
        visible={!!assigning}
        title={assigning?.name ?? "Стіл"}
        onClose={() => setAssigning(null)}
        footer={
          <Button
            label="Зберегти"
            loading={assignMut.isPending}
            onPress={saveAssign}
          />
        }
      >
        <Text style={styles.fieldLabel}>Стіл</Text>
        <ChipRow
          options={assignChips}
          value={pickedTable}
          onChange={setPickedTable}
        />
        {pickedTable === "__new__" ? (
          <Input
            label="Назва столу"
            value={newTable}
            onChangeText={setNewTable}
            placeholder="1 / Сімʼя нареченої…"
          />
        ) : null}
      </Sheet>

      <Sheet
        visible={showNewTable}
        title="Новий стіл"
        onClose={() => setShowNewTable(false)}
        footer={
          <Button
            label={unassigned.length ? "Обрати гостя" : "Готово"}
            disabled={!draftTableName.trim()}
            onPress={startNewTable}
          />
        }
      >
        <Input
          label="Назва"
          value={draftTableName}
          onChangeText={setDraftTableName}
          placeholder="Стіл 3"
        />
        <Text style={styles.hint}>
          {unassigned.length
            ? "Далі обереш, кого посадити за цей стіл."
            : "Усі вже розсаджені — стіл зʼявиться, коли призначиш гостя."}
        </Text>
      </Sheet>

      <Sheet
        visible={!!pickGuestForTable}
        title={`Хто за ${formatTable(pickGuestForTable)}?`}
        onClose={() => setPickGuestForTable(null)}
      >
        {unassigned.length === 0 ? (
          <Empty title="Немає вільних" hint="Усі вже мають стіл" />
        ) : (
          <ListGroup>
            {unassigned.map((g, i) => (
              <ListRow
                key={g.id}
                title={g.name}
                last={i === unassigned.length - 1}
                onPress={() => {
                  if (!pickGuestForTable) return;
                  assignMut.mutate({
                    id: g.id,
                    tableLabel: pickGuestForTable,
                  });
                }}
              />
            ))}
          </ListGroup>
        )}
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  pad: { paddingHorizontal: spacing.md, paddingBottom: 40 },
  fieldLabel: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
  },
  hint: {
    marginTop: 8,
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 18,
  },
});
