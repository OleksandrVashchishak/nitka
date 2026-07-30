import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { confirmAction } from "@/lib/confirm";
import {
  defaultDayEvents,
  labelToMinutes,
  loadDayPlan,
  minutesToLabel,
  resolveStarts,
  saveDayPlan,
  type DayEvent,
} from "@/lib/day-plan";
import { getMyWedding } from "@/lib/weddings-api";
import { colors, spacing } from "@/theme";
import { BackHeader } from "@/ui/back-header";
import { Sheet } from "@/ui/sheet";
import {
  Button,
  Empty,
  ErrorBox,
  Fab,
  Input,
  ListGroup,
  ListRow,
  Loading,
} from "@/ui";

export default function DayPlanScreen() {
  const qc = useQueryClient();
  const weddingQ = useQuery({ queryKey: ["wedding"], queryFn: getMyWedding });
  const [events, setEvents] = useState<DayEvent[] | null>(null);
  const [syncState, setSyncState] = useState<"server" | "local" | "default" | "offline">(
    "server",
  );
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("30");
  const [startLabel, setStartLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<DayEvent | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    duration: "30",
    startLabel: "",
    chain: true,
  });

  const weddingId = weddingQ.data?.id;

  useEffect(() => {
    if (!weddingId) return;
    void loadDayPlan(weddingId).then(({ plan, source }) => {
      setEvents(plan.events);
      setSyncState(source === "server" ? "server" : source);
    });
  }, [weddingId]);

  const resolved = useMemo(
    () => (events ? resolveStarts(events) : []),
    [events],
  );

  async function persist(next: DayEvent[]) {
    if (!weddingId) return;
    setEvents(next);
    setSaving(true);
    try {
      const res = await saveDayPlan(weddingId, { version: 1, events: next });
      setSyncState(res.synced ? "server" : "offline");
      void qc.invalidateQueries({ queryKey: ["day-plan"] });
    } finally {
      setSaving(false);
    }
  }

  function addEvent() {
    if (!title.trim() || !events) return;
    const durationMin = Math.max(5, Number(duration) || 30);
    const startMin = labelToMinutes(startLabel);
    void persist([
      ...events,
      {
        id: `ev-${Math.random().toString(36).slice(2, 9)}`,
        title: title.trim(),
        durationMin,
        startMin,
      },
    ]);
    setTitle("");
    setStartLabel("");
    setShowAdd(false);
  }

  function move(id: string, dir: -1 | 1) {
    if (!events) return;
    const i = events.findIndex((e) => e.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= events.length) return;
    const next = [...events];
    const tmp = next[i]!;
    next[i] = next[j]!;
    next[j] = tmp;
    void persist(next);
  }

  function openEdit(ev: DayEvent) {
    setEditing(ev);
    setEditForm({
      title: ev.title,
      duration: String(ev.durationMin),
      startLabel: ev.startMin != null ? minutesToLabel(ev.startMin) : "",
      chain: ev.startMin == null,
    });
  }

  function saveEdit() {
    if (!editing || !events) return;
    const next = events.map((e) => {
      if (e.id !== editing.id) return e;
      return {
        ...e,
        title: editForm.title.trim() || e.title,
        durationMin: Math.max(5, Number(editForm.duration) || 30),
        startMin: editForm.chain
          ? null
          : labelToMinutes(editForm.startLabel),
      };
    });
    setEditing(null);
    void persist(next);
  }

  function removeEvent(id: string) {
    if (!events) return;
    void persist(events.filter((e) => e.id !== id));
  }

  function resetDefaults() {
    confirmAction(
      "Скинути план?",
      "Повернеться шаблон по замовчуванню",
      () => void persist(defaultDayEvents()),
    );
  }

  if (weddingQ.isLoading || (weddingId && !events)) return <Loading />;
  if (weddingQ.isError) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ErrorBox message="Не вдалося завантажити весілля" />
      </SafeAreaView>
    );
  }
  if (!weddingId) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Empty title="Спочатку створи весілля" hint="Дім → заповни дату й місто" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <BackHeader title="План дня" />
      <ScrollView
        contentContainerStyle={styles.pad}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sub}>
          {syncState === "server"
            ? "Синхронізовано між пристроями"
            : syncState === "offline"
              ? "Офлайн — збережено на пристрої"
              : syncState === "local"
                ? "Підтягнуто з пристрою · синк…"
                : "Шаблон за замовчуванням"}
          {saving ? " · зберігаю…" : ""}
        </Text>

        {resolved.length === 0 ? (
          <Empty title="Порожньо" hint="Додай перший блок або скинь до шаблону" />
        ) : (
          <ListGroup header="Розклад">
            {resolved.map((ev, idx) => (
              <ListRow
                key={ev.id}
                title={ev.title}
                subtitle={`${minutesToLabel(ev.start)}–${minutesToLabel(ev.end)} · ${ev.durationMin} хв${ev.startMin == null ? " · ланцюжок" : ""}`}
                right={
                  <View style={styles.actions}>
                    <Button
                      label="↑"
                      variant="ghost"
                      size="sm"
                      onPress={() => move(ev.id, -1)}
                      disabled={idx === 0}
                    />
                    <Button
                      label="↓"
                      variant="ghost"
                      size="sm"
                      onPress={() => move(ev.id, 1)}
                      disabled={idx === resolved.length - 1}
                    />
                  </View>
                }
                last={idx === resolved.length - 1}
                onPress={() => openEdit(ev)}
              />
            ))}
          </ListGroup>
        )}

        <ListGroup>
          <ListRow
            title="Скинути до шаблону"
            destructive
            onPress={resetDefaults}
            last
          />
        </ListGroup>
        <View style={{ height: 72 }} />
      </ScrollView>

      <Fab label="+ Блок" onPress={() => setShowAdd(true)} />

      <Sheet
        visible={showAdd}
        title="Новий блок"
        onClose={() => setShowAdd(false)}
        footer={
          <Button
            label="Додати"
            onPress={addEvent}
            disabled={!title.trim()}
          />
        }
      >
        <Input label="Назва" value={title} onChangeText={setTitle} />
        <Input
          label="Тривалість (хв)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="number-pad"
        />
        <Input
          label="Старт HH:MM (пусто = після попереднього)"
          value={startLabel}
          onChangeText={setStartLabel}
          placeholder="09:00"
        />
      </Sheet>

      <Sheet
        visible={!!editing}
        title="Редагувати блок"
        onClose={() => setEditing(null)}
        footer={
          <>
            <Button label="Зберегти" onPress={saveEdit} />
            <Button
              label="Видалити"
              variant="danger"
              onPress={() => {
                if (!editing) return;
                const id = editing.id;
                setEditing(null);
                removeEvent(id);
              }}
            />
          </>
        }
      >
        <Input
          label="Назва"
          value={editForm.title}
          onChangeText={(v) => setEditForm((s) => ({ ...s, title: v }))}
        />
        <Input
          label="Тривалість (хв)"
          value={editForm.duration}
          onChangeText={(v) => setEditForm((s) => ({ ...s, duration: v }))}
          keyboardType="number-pad"
        />
        <Button
          label={
            editForm.chain
              ? "Час: після попереднього"
              : "Час: фіксований старт"
          }
          variant="ghost"
          onPress={() => setEditForm((s) => ({ ...s, chain: !s.chain }))}
        />
        {!editForm.chain ? (
          <Input
            label="Старт HH:MM"
            value={editForm.startLabel}
            onChangeText={(v) =>
              setEditForm((s) => ({ ...s, startLabel: v }))
            }
            placeholder="14:00"
          />
        ) : null}
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  pad: { paddingHorizontal: spacing.md, paddingBottom: 40 },
  sub: {
    fontSize: 14,
    color: colors.inkSoft,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  actions: { flexDirection: "row", gap: 4 },
});
