import * as Clipboard from "expo-clipboard";
import * as DocumentPicker from "expo-document-picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { confirmAction, notify } from "@/lib/confirm";
import { parseGuestCsv, parseImportText } from "@/lib/guest-import";
import {
  createGuest,
  deleteGuest,
  getGuestList,
  importGuests,
  updateGuest,
  type GuestInput,
} from "@/lib/guests-api";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import { href } from "@/lib/href";
import type { Guest, GuestSide, RsvpStatus } from "@/lib/types";
import { colors, fonts, spacing } from "@/theme";
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
  ScreenHeader,
  SkeletonScreen,
} from "@/ui";

const WEB_BASE = process.env.EXPO_PUBLIC_WEB_URL || "https://nitka.ua";

const RSVP_FILTERS = [
  { id: "ALL", label: "Усі" },
  { id: "PENDING", label: "Чекаємо" },
  { id: "YES", label: "Так" },
  { id: "NO", label: "Ні" },
  { id: "MAYBE", label: "Може" },
  { id: "ALLERGIES", label: "Алергії" },
];

const RSVP_CYCLE: RsvpStatus[] = ["PENDING", "YES", "MAYBE", "NO"];

const SIDE_FILTERS = [
  { id: "ALL", label: "Усі сторони" },
  { id: "BRIDE", label: "Наречена" },
  { id: "GROOM", label: "Наречений" },
  { id: "BOTH", label: "Спільні" },
  { id: "OTHER", label: "Інше" },
];

const SIDES: Array<{ id: GuestSide; label: string }> = [
  { id: "BRIDE", label: "Наречена" },
  { id: "GROOM", label: "Наречений" },
  { id: "BOTH", label: "Спільні" },
  { id: "OTHER", label: "Інше" },
];

function rsvpLabel(s: RsvpStatus) {
  if (s === "YES") return "Так";
  if (s === "NO") return "Ні";
  if (s === "MAYBE") return "Може";
  return "Очікуємо";
}

function rsvpTone(s: RsvpStatus): "ok" | "warn" | "muted" | "sage" {
  if (s === "YES") return "ok";
  if (s === "NO") return "warn";
  if (s === "MAYBE") return "sage";
  return "muted";
}

function nextRsvp(s: RsvpStatus): RsvpStatus {
  const i = RSVP_CYCLE.indexOf(s);
  return RSVP_CYCLE[(i + 1) % RSVP_CYCLE.length]!;
}

function inviteUrl(token: string) {
  return `${WEB_BASE.replace(/\/$/, "")}/rsvp/${token}`;
}

function buzz(light = true) {
  if (light) hapticLight();
  else hapticSuccess();
}

export default function GuestsScreen() {
  const qc = useQueryClient();
  const listQ = useQuery({ queryKey: ["guests"], queryFn: getGuestList });
  const [filter, setFilter] = useState("ALL");
  const [sideFilter, setSideFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addSide, setAddSide] = useState<GuestSide>("BOTH");
  const [addPlusOne, setAddPlusOne] = useState(false);
  const [importText, setImportText] = useState("");
  const [editForm, setEditForm] = useState<GuestInput>({ name: "" });

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["guests"] });
    void qc.invalidateQueries({ queryKey: ["insights"] });
    void qc.invalidateQueries({ queryKey: ["notifications"] });
  };

  const addMut = useMutation({
    mutationFn: createGuest,
    onSuccess: () => {
      setName("");
      setPhone("");
      setEmail("");
      setAddSide("BOTH");
      setAddPlusOne(false);
      setShowAdd(false);
      invalidate();
    },
  });

  const importMut = useMutation({
    mutationFn: importGuests,
    onSuccess: (res) => {
      setImportText("");
      setShowImport(false);
      invalidate();
      notify("Імпорт", `Додано: ${res.imported}`, "ok");
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<GuestInput> }) =>
      updateGuest(id, input),
    onSuccess: () => {
      setEditing(null);
      invalidate();
    },
  });

  const quickRsvpMut = useMutation({
    mutationFn: ({ id, rsvpStatus }: { id: string; rsvpStatus: RsvpStatus }) =>
      updateGuest(id, { rsvpStatus }),
    onSuccess: () => {
      invalidate();
      buzz(true);
    },
  });

  const delMut = useMutation({
    mutationFn: deleteGuest,
    onSuccess: () => {
      setEditing(null);
      invalidate();
      notify("Видалено", undefined, "ok");
    },
  });

  function openEdit(g: Guest) {
    setEditing(g);
    setEditForm({
      name: g.name,
      email: g.email ?? undefined,
      phone: g.phone ?? undefined,
      side: g.side,
      rsvpStatus: g.rsvpStatus,
      plusOne: g.plusOne,
      plusOneName: g.plusOneName ?? undefined,
      plusOneAttending: g.plusOneAttending,
      allergies: g.allergies ?? undefined,
      tableLabel: g.tableLabel ?? undefined,
      notes: g.notes ?? undefined,
    });
  }

  async function shareInvite(g: Guest) {
    const url = inviteUrl(g.inviteToken);
    try {
      await Share.share({ message: `${g.name}: ${url}`, url });
    } catch {
      await Clipboard.setStringAsync(url);
      notify("Скопійовано", url);
    }
  }

  async function copyAllLinks(guests: Guest[]) {
    const text = guests
      .map((g) => `${g.name}: ${inviteUrl(g.inviteToken)}`)
      .join("\n");
    await Clipboard.setStringAsync(text);
    notify("Скопійовано", `${guests.length} лінків`);
  }

  async function pickCsvFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values", "text/plain", "*/*"],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];
      let text = "";
      if (Platform.OS === "web" && asset.file) {
        text = await asset.file.text();
      } else {
        const res = await fetch(asset.uri);
        text = await res.text();
      }
      const rows = parseGuestCsv(text);
      if (!rows.length) {
        notify("Порожньо", "У файлі немає валідних рядків");
        return;
      }
      importMut.mutate(rows);
    } catch (e) {
      notify(
        "Помилка",
        e instanceof Error ? e.message : "Не вдалося прочитати файл",
      );
    }
  }

  const allergyCount = useMemo(
    () =>
      (listQ.data?.guests ?? []).filter((g) => g.allergies?.trim()).length,
    [listQ.data],
  );

  const guests = useMemo(() => {
    const all = listQ.data?.guests ?? [];
    const q = search.trim().toLowerCase();
    return all.filter((g) => {
      if (filter === "ALLERGIES") {
        if (!g.allergies?.trim()) return false;
      } else if (filter !== "ALL" && g.rsvpStatus !== filter) {
        return false;
      }
      if (sideFilter !== "ALL" && g.side !== sideFilter) return false;
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        (g.email?.toLowerCase().includes(q) ?? false) ||
        (g.phone?.toLowerCase().includes(q) ?? false) ||
        (g.tableLabel?.toLowerCase().includes(q) ?? false) ||
        (g.allergies?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [listQ.data, filter, sideFilter, search]);

  if (listQ.isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <SkeletonScreen variant="list" />
      </SafeAreaView>
    );
  }
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

  const data = listQ.data;
  if (!data) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Empty title="Немає весілля" hint="Створи його на Домі" />
      </SafeAreaView>
    );
  }

  const { stats } = data;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.pad}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={listQ.isRefetching && !listQ.isLoading}
            onRefresh={() => void listQ.refetch()}
            tintColor={colors.primary}
          />
        }
      >
        <ScreenHeader
          title="Гості"
          subtitle={`${stats.total} у списку · headcount ${stats.headcount}${
            allergyCount ? ` · алергії ${allergyCount}` : ""
          }`}
          right={
            <Button
              label="Імпорт"
              variant="soft"
              size="sm"
              onPress={() => setShowImport(true)}
            />
          }
        />

        <View style={styles.stats}>
          <Stat n={stats.yes} l="Так" />
          <Stat n={stats.maybe} l="Може" />
          <Stat n={stats.no} l="Ні" />
          <Stat n={stats.pending} l="Чекаємо" />
        </View>

        <ChipRow options={RSVP_FILTERS} value={filter} onChange={setFilter} />
        <ChipRow
          options={SIDE_FILTERS}
          value={sideFilter}
          onChange={setSideFilter}
        />
        <Input
          placeholder="Пошук за імʼям, телефоном…"
          value={search}
          onChangeText={setSearch}
        />

        {data.guests.length > 0 ? (
          <ListGroup>
            <ListRow
              title="Скопіювати всі лінки запрошень"
              onPress={() => void copyAllLinks(data.guests)}
            />
            <ListRow
              title="Розсадка за столами"
              subtitle="Призначити місця"
              onPress={() => router.push(href("/(app)/(couple)/seating"))}
              last
            />
          </ListGroup>
        ) : null}

        {guests.length === 0 ? (
          <Empty
            title={
              data.guests.length === 0
                ? "Список гостей порожній"
                : "Нікого за фільтром"
            }
            hint={
              data.guests.length === 0
                ? "Почни з найближчих — мама, тато, свідки"
                : "Скинь фільтр або пошук"
            }
            actionLabel={
              data.guests.length === 0 ? "Додати першого гостя" : undefined
            }
            onAction={
              data.guests.length === 0 ? () => setShowAdd(true) : undefined
            }
          />
        ) : (
          <ListGroup header={`Список · ${guests.length}`}>
            {guests.map((g, i) => (
              <GuestSwipeRow
                key={g.id}
                guest={g}
                last={i === guests.length - 1}
                onPress={() => openEdit(g)}
                onShare={() => void shareInvite(g)}
                onCycleRsvp={() => {
                  const next = nextRsvp(g.rsvpStatus);
                  quickRsvpMut.mutate({ id: g.id, rsvpStatus: next });
                  notify(g.name, `Статус: ${rsvpLabel(next)}`, "ok");
                }}
                onDelete={() =>
                  confirmAction("Видалити гостя?", g.name, () =>
                    delMut.mutate(g.id),
                  )
                }
              />
            ))}
          </ListGroup>
        )}
        <View style={{ height: 72 }} />
      </ScrollView>

      <Fab label="+ Гість" onPress={() => setShowAdd(true)} />

      <Sheet
        visible={showAdd}
        title="Новий гість"
        onClose={() => setShowAdd(false)}
        footer={
          <Button
            label="Зберегти"
            loading={addMut.isPending}
            disabled={!name.trim()}
            onPress={() =>
              addMut.mutate({
                name: name.trim(),
                phone: phone.trim() || undefined,
                email: email.trim() || undefined,
                side: addSide,
                plusOne: addPlusOne,
              })
            }
          />
        }
      >
        <Input label="Імʼя" value={name} onChangeText={setName} />
        <Text style={styles.fieldLabel}>Сторона</Text>
        <ChipRow
          options={SIDES.map((s) => ({ id: s.id, label: s.label }))}
          value={addSide}
          onChange={(id) => setAddSide(id as GuestSide)}
        />
        <Input
          label="Телефон"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Button
          label={addPlusOne ? "Plus-one: так" : "Plus-one: ні"}
          variant="ghost"
          onPress={() => setAddPlusOne((v) => !v)}
        />
      </Sheet>

      <Sheet
        visible={showImport}
        title="Імпорт гостей"
        onClose={() => setShowImport(false)}
        footer={
          <Button
            label="Імпортувати текст"
            loading={importMut.isPending}
            disabled={!importText.trim()}
            onPress={() => {
              const rows = parseImportText(importText);
              if (!rows.length) {
                notify("Порожньо", "Немає валідних рядків");
                return;
              }
              importMut.mutate(rows);
            }}
          />
        }
      >
        <Button
          label="Обрати CSV-файл"
          variant="soft"
          loading={importMut.isPending}
          onPress={() => void pickCsvFile()}
        />
        <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
          Або встав список (Імʼя;телефон;email)
        </Text>
        <Input
          label="Список"
          value={importText}
          onChangeText={setImportText}
          multiline
          style={{ minHeight: 140, textAlignVertical: "top" }}
          placeholder={"Анна;+380...\nБогдан;;bogdan@mail.com"}
        />
      </Sheet>

      <Sheet
        visible={!!editing}
        title={editing?.name ?? "Гість"}
        onClose={() => setEditing(null)}
        footer={
          <>
            <Button
              label="Зберегти"
              loading={updateMut.isPending}
              disabled={!editForm.name?.trim()}
              onPress={() => {
                if (!editing) return;
                updateMut.mutate({
                  id: editing.id,
                  input: {
                    ...editForm,
                    plusOneAttending: editForm.plusOne
                      ? editForm.plusOneAttending ?? false
                      : null,
                  },
                });
              }}
            />
            <Button
              label="Поділитись запрошенням"
              variant="ghost"
              onPress={() => editing && void shareInvite(editing)}
            />
            <Button
              label="Видалити"
              variant="danger"
              onPress={() => {
                if (!editing) return;
                confirmAction("Видалити гостя?", editing.name, () =>
                  delMut.mutate(editing.id),
                );
              }}
            />
          </>
        }
      >
        <ChipRow
          options={RSVP_FILTERS.filter((f) => f.id !== "ALL")}
          value={editForm.rsvpStatus ?? "PENDING"}
          onChange={(id) =>
            setEditForm((s) => ({ ...s, rsvpStatus: id as RsvpStatus }))
          }
        />
        <Input
          label="Імʼя"
          value={editForm.name}
          onChangeText={(v) => setEditForm((s) => ({ ...s, name: v }))}
        />
        <Text style={styles.fieldLabel}>Сторона</Text>
        <ChipRow
          options={SIDES.map((s) => ({ id: s.id, label: s.label }))}
          value={editForm.side ?? "BOTH"}
          onChange={(id) =>
            setEditForm((s) => ({ ...s, side: id as GuestSide }))
          }
        />
        <Input
          label="Телефон"
          value={editForm.phone ?? ""}
          onChangeText={(v) => setEditForm((s) => ({ ...s, phone: v }))}
          keyboardType="phone-pad"
        />
        <Input
          label="Email"
          value={editForm.email ?? ""}
          onChangeText={(v) => setEditForm((s) => ({ ...s, email: v }))}
          autoCapitalize="none"
        />
        <Input
          label="Стіл"
          value={editForm.tableLabel ?? ""}
          onChangeText={(v) => setEditForm((s) => ({ ...s, tableLabel: v }))}
        />
        <Input
          label="Алергії"
          value={editForm.allergies ?? ""}
          onChangeText={(v) => setEditForm((s) => ({ ...s, allergies: v }))}
        />
        <Input
          label="Нотатки"
          value={editForm.notes ?? ""}
          onChangeText={(v) => setEditForm((s) => ({ ...s, notes: v }))}
          multiline
        />
        <Button
          label={editForm.plusOne ? "Plus-one: так" : "Plus-one: ні"}
          variant="ghost"
          onPress={() =>
            setEditForm((s) => ({ ...s, plusOne: !s.plusOne }))
          }
        />
        {editForm.plusOne ? (
          <>
            <Input
              label="Імʼя +1"
              value={editForm.plusOneName ?? ""}
              onChangeText={(v) =>
                setEditForm((s) => ({ ...s, plusOneName: v }))
              }
            />
            <Button
              label={
                editForm.plusOneAttending
                  ? "+1 буде: так"
                  : "+1 буде: ні / невідомо"
              }
              variant="ghost"
              onPress={() =>
                setEditForm((s) => ({
                  ...s,
                  plusOneAttending: !s.plusOneAttending,
                }))
              }
            />
          </>
        ) : null}
      </Sheet>
    </SafeAreaView>
  );
}

function GuestSwipeRow({
  guest: g,
  last,
  onPress,
  onShare,
  onCycleRsvp,
  onDelete,
}: {
  guest: Guest;
  last: boolean;
  onPress: () => void;
  onShare: () => void;
  onCycleRsvp: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<Swipeable | null>(null);

  const actions = (
    <View style={styles.swipeActions}>
      <Pressable
        style={[styles.swipeBtn, styles.swipeShare]}
        onPress={() => {
          ref.current?.close();
          onShare();
        }}
      >
        <Text style={styles.swipeText}>Шер</Text>
      </Pressable>
      <Pressable
        style={[styles.swipeBtn, styles.swipeRsvp]}
        onPress={() => {
          ref.current?.close();
          onCycleRsvp();
        }}
      >
        <Text style={styles.swipeText}>RSVP</Text>
      </Pressable>
      <Pressable
        style={[styles.swipeBtn, styles.swipeDel]}
        onPress={() => {
          ref.current?.close();
          onDelete();
        }}
      >
        <Text style={styles.swipeText}>✕</Text>
      </Pressable>
    </View>
  );

  return (
    <Swipeable
      ref={ref}
      friction={2}
      overshootRight={false}
      renderRightActions={() => actions}
    >
      <View style={styles.swipeRowBg}>
        <ListRow
          title={g.name}
          subtitle={
            [
              g.phone || g.email,
              g.tableLabel
                ? g.tableLabel.toLowerCase().startsWith("стіл")
                  ? g.tableLabel
                  : `Стіл ${g.tableLabel}`
                : null,
              g.plusOne
                ? g.plusOneAttending === true
                  ? "+1 так"
                  : g.plusOneAttending === false
                    ? "+1 ні"
                    : "+1"
                : null,
              g.allergies?.trim() ? `алергії: ${g.allergies.trim()}` : null,
            ]
              .filter(Boolean)
              .join(" · ") || undefined
          }
          right={
            <Badge label={rsvpLabel(g.rsvpStatus)} tone={rsvpTone(g.rsvpStatus)} />
          }
          last={last}
          onPress={onPress}
        />
      </View>
    </Swipeable>
  );
}

function Stat({ n, l }: { n: number; l: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statN}>{n}</Text>
      <Text style={styles.statL}>{l}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  pad: { paddingHorizontal: spacing.md, paddingBottom: 40 },
  stats: { flexDirection: "row", gap: 8, marginBottom: 12 },
  stat: {
    flex: 1,
    backgroundColor: colors.paper,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 10,
    alignItems: "center",
  },
  statN: {
    fontSize: 18,
    fontFamily: fonts.displayBold,
    color: colors.ink,
  },
  statL: {
    fontSize: 11,
    fontFamily: fonts.sansSemi,
    color: colors.inkSoft,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  fieldLabel: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 13,
    fontFamily: fonts.sansSemi,
    color: colors.inkSoft,
  },
  swipeRowBg: { backgroundColor: colors.paper },
  swipeActions: { flexDirection: "row", height: "100%" },
  swipeBtn: {
    width: 68,
    alignItems: "center",
    justifyContent: "center",
  },
  swipeShare: { backgroundColor: colors.primarySoft },
  swipeRsvp: { backgroundColor: colors.primary },
  swipeDel: { backgroundColor: colors.danger },
  swipeText: {
    color: "#fff",
    fontFamily: fonts.sansBold,
    fontSize: 13,
  },
});
