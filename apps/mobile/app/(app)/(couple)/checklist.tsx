import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  formatMonthYearUk,
  monthKeyFromIso,
  suggestedDueDate,
} from "@/lib/checklist-helpers";
import { confirmAction } from "@/lib/confirm";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import {
  createTask,
  deleteTask,
  getMyWedding,
  updateTask,
} from "@/lib/weddings-api";
import type { TaskStatus, Wedding, WeddingTask } from "@/lib/types";
import { colors, spacing } from "@/theme";
import { DateField, formatDateUk } from "@/ui/date-field";
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

type StatusFilter = "ALL" | "OPEN" | "DONE";
type ViewMode = "list" | "phases";

const PLAN_PHASES = [
  { id: 1, label: "Основа", hint: "Починаємо" },
  { id: 2, label: "Команда", hint: "Бронюємо" },
  { id: 3, label: "Деталі", hint: "Збираємо" },
  { id: 4, label: "Фініш", hint: "Завершуємо" },
];

const PHASE_SLUGS: Record<number, string[]> = {
  1: ["date", "venue", "vibe", "guests", "budget", "photo"],
  2: [
    "invitations",
    "music",
    "catering",
    "website",
    "registry",
    "decor",
    "officiant",
  ],
  3: ["beauty", "planner", "attire", "invite-guests", "cake", "favorites"],
  4: ["rsvp", "requests", "married"],
};

function statusTone(status: TaskStatus): "ok" | "warn" | "muted" {
  if (status === "DONE") return "ok";
  if (status === "IN_PROGRESS") return "warn";
  return "muted";
}

function statusLabel(status: TaskStatus) {
  if (status === "DONE") return "Готово";
  if (status === "IN_PROGRESS") return "В процесі";
  return "Todo";
}

function StatusMark({ status }: { status: TaskStatus }) {
  const mark =
    status === "DONE" ? "✓" : status === "IN_PROGRESS" ? "◐" : "○";
  return <Text style={styles.check}>{mark}</Text>;
}

function cycleStatus(status: TaskStatus): TaskStatus {
  if (status === "TODO") return "IN_PROGRESS";
  if (status === "IN_PROGRESS") return "DONE";
  return "TODO";
}

export default function ChecklistScreen() {
  const qc = useQueryClient();
  const weddingQ = useQuery({ queryKey: ["wedding"], queryFn: getMyWedding });
  const [title, setTitle] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("phases");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [monthFilter, setMonthFilter] = useState("ALL");
  const [showAdd, setShowAdd] = useState(false);
  const [addDue, setAddDue] = useState("");
  const [addPhase, setAddPhase] = useState("1");
  const [editing, setEditing] = useState<WeddingTask | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    dueDate: "",
    status: "TODO" as TaskStatus,
  });

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["wedding"] });
    void qc.invalidateQueries({ queryKey: ["insights"] });
  };

  const updateMut = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Parameters<typeof updateTask>[1];
    }) => updateTask(id, input),
    onSuccess: () => {
      setEditing(null);
      invalidate();
    },
  });

  const cycleMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTask(id, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["wedding"] });
      const prev = qc.getQueryData<Wedding | null>(["wedding"]);
      qc.setQueryData<Wedding | null>(["wedding"], (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        };
      });
      if (status === "DONE") hapticSuccess();
      else hapticLight();
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev !== undefined) {
        qc.setQueryData(["wedding"], ctx.prev);
      }
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ["wedding"] });
      void qc.invalidateQueries({ queryKey: ["insights"] });
    },
  });

  function onCycle(task: WeddingTask) {
    cycleMut.mutate({ id: task.id, status: cycleStatus(task.status) });
  }

  const addMut = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setTitle("");
      setAddDue("");
      setAddPhase("1");
      setShowAdd(false);
      invalidate();
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      setEditing(null);
      invalidate();
    },
  });

  const wedding = weddingQ.data;
  const weddingDate = wedding?.date;

  const enriched = useMemo(() => {
    const tasks = [...(wedding?.tasks ?? [])].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
    return tasks.map((task) => {
      const effectiveDue =
        task.dueDate?.slice(0, 10) ??
        (weddingDate
          ? suggestedDueDate(weddingDate, task.sortOrder)
          : null);
      return {
        task,
        effectiveDue,
        monthKey: effectiveDue ? monthKeyFromIso(effectiveDue) : null,
      };
    });
  }, [wedding, weddingDate]);

  const monthOptions = useMemo(() => {
    const map = new Map<string, number>();
    let undated = 0;
    for (const row of enriched) {
      if (!row.monthKey) {
        undated += 1;
        continue;
      }
      map.set(row.monthKey, (map.get(row.monthKey) ?? 0) + 1);
    }
    const months = [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, count]) => ({
        id: key,
        label: `${formatMonthYearUk(key)} (${count})`,
      }));
    return [
      { id: "ALL", label: "Усі місяці" },
      ...months,
      ...(undated ? [{ id: "NONE", label: `Без дати (${undated})` }] : []),
    ];
  }, [enriched]);

  const visible = useMemo(() => {
    return enriched.filter(({ task, monthKey }) => {
      if (statusFilter === "DONE" && task.status !== "DONE") return false;
      if (statusFilter === "OPEN" && task.status === "DONE") return false;
      if (monthFilter === "NONE") return !monthKey;
      if (monthFilter !== "ALL" && monthKey !== monthFilter) return false;
      return true;
    });
  }, [enriched, statusFilter, monthFilter]);

  const grouped = useMemo(() => {
    const groups: Array<{ key: string; label: string; rows: typeof visible }> =
      [];
    const map = new Map<string, typeof visible>();
    for (const row of visible) {
      const key = row.monthKey ?? "NONE";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(row);
    }
    const keys = [...map.keys()].sort((a, b) => {
      if (a === "NONE") return 1;
      if (b === "NONE") return -1;
      return a.localeCompare(b);
    });
    for (const key of keys) {
      groups.push({
        key,
        label: key === "NONE" ? "Без дати" : formatMonthYearUk(key),
        rows: map.get(key)!,
      });
    }
    return groups;
  }, [visible]);

  function openEdit(task: WeddingTask) {
    setEditing(task);
    setEditForm({
      title: task.title,
      dueDate: task.dueDate?.slice(0, 10) ?? "",
      status: task.status,
    });
  }

  if (weddingQ.isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <SkeletonScreen variant="list" />
      </SafeAreaView>
    );
  }
  if (weddingQ.isError) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ErrorBox
          message={
            weddingQ.error instanceof Error
              ? weddingQ.error.message
              : "Помилка"
          }
        />
      </SafeAreaView>
    );
  }

  if (!wedding) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Empty title="Спочатку створи весілля" hint="На вкладці Дім" />
      </SafeAreaView>
    );
  }

  const tasks = wedding.tasks ?? [];
  const done = tasks.filter((t) => t.status === "DONE").length;
  const customUnphased = tasks.filter(
    (t) =>
      t.isCustom &&
      !(t.categorySlug?.startsWith("phase-") ?? false),
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.pad}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        refreshControl={
          <RefreshControl
            refreshing={weddingQ.isRefetching && !weddingQ.isLoading}
            onRefresh={() => void weddingQ.refetch()}
            tintColor={colors.primary}
          />
        }
      >
        <ScreenHeader
          title="Чекліст"
          subtitle={`${done}/${tasks.length} готово · тап = статус`}
        />

        <ChipRow
          options={[
            { id: "phases", label: "Фази" },
            { id: "list", label: "Список" },
          ]}
          value={viewMode}
          onChange={(id) => setViewMode(id as ViewMode)}
        />

        {viewMode === "list" ? (
          <>
            <ChipRow
              options={[
                { id: "ALL", label: "Усі" },
                { id: "OPEN", label: "Відкриті" },
                { id: "DONE", label: "Готові" },
              ]}
              value={statusFilter}
              onChange={(id) => setStatusFilter(id as StatusFilter)}
            />
            <ChipRow
              options={monthOptions}
              value={monthFilter}
              onChange={setMonthFilter}
            />
          </>
        ) : null}

        {viewMode === "phases" ? (
          <>
            {PLAN_PHASES.map((phase) => {
              const slugs = PHASE_SLUGS[phase.id] ?? [];
              const templateTasks = slugs
                .map((slug) =>
                  tasks.find((t) => !t.isCustom && t.categorySlug === slug),
                )
                .filter(Boolean) as WeddingTask[];
              const customInPhase = tasks.filter(
                (t) =>
                  t.isCustom && t.categorySlug === `phase-${phase.id}`,
              );
              const phaseTasks = [...templateTasks, ...customInPhase];
              const doneCnt = phaseTasks.filter(
                (t) => t.status === "DONE",
              ).length;
              const total = phaseTasks.length || slugs.length;
              const pct = total ? Math.round((doneCnt / total) * 100) : 0;

              return (
                <ListGroup
                  key={phase.id}
                  header={`${phase.id}. ${phase.label} · ${phase.hint}`}
                  footer={`${doneCnt}/${total} · ${pct}%`}
                >
                  {phaseTasks.length === 0 ? (
                    <ListRow title="Немає задач" last />
                  ) : (
                    phaseTasks.map((task, i) => (
                      <ListRow
                        key={task.id}
                        title={task.title}
                        subtitle={
                          task.isCustom
                            ? `Своє · ${statusLabel(task.status)}`
                            : statusLabel(task.status)
                        }
                        right={<StatusMark status={task.status} />}
                        last={i === phaseTasks.length - 1}
                        onPress={() => onCycle(task)}
                        onLongPress={() => openEdit(task)}
                      />
                    ))
                  )}
                </ListGroup>
              );
            })}

            {customUnphased.length > 0 ? (
              <ListGroup header="Мої задачі (без фази)">
                {customUnphased.map((task, i) => (
                  <ListRow
                    key={task.id}
                    title={task.title}
                    subtitle={statusLabel(task.status)}
                    right={
                      <View style={styles.badgeSlot}>
                        <Badge
                          label={statusLabel(task.status)}
                          tone={statusTone(task.status)}
                        />
                      </View>
                    }
                    last={i === customUnphased.length - 1}
                    onPress={() => onCycle(task)}
                    onLongPress={() => openEdit(task)}
                  />
                ))}
              </ListGroup>
            ) : null}
          </>
        ) : visible.length === 0 ? (
          <Empty title="Порожньо" hint="Додай або зміни фільтр" />
        ) : (
          grouped.map((g) => (
            <ListGroup key={g.key} header={g.label}>
              {g.rows.map(({ task, effectiveDue }, i) => (
                <ListRow
                  key={task.id}
                  title={task.title}
                  subtitle={
                    effectiveDue
                      ? `до ${formatDateUk(effectiveDue)}${!task.dueDate ? " · орієнтовно" : ""}`
                      : undefined
                  }
                  right={
                    <View style={styles.badgeSlot}>
                      <Badge
                        label={statusLabel(task.status)}
                        tone={statusTone(task.status)}
                      />
                    </View>
                  }
                  last={i === g.rows.length - 1}
                  onPress={() => onCycle(task)}
                  onLongPress={() => openEdit(task)}
                />
              ))}
            </ListGroup>
          ))
        )}

        <Text style={styles.hint}>Тап — статус · довгий тап — редагувати</Text>
        <View style={{ height: 72 }} />
      </ScrollView>

      <Fab label="+ Задача" onPress={() => setShowAdd(true)} />

      <Sheet
        visible={showAdd}
        title="Нова задача"
        onClose={() => setShowAdd(false)}
        footer={
          <Button
            label="Додати"
            loading={addMut.isPending}
            disabled={!title.trim()}
            onPress={() =>
              addMut.mutate({
                title: title.trim(),
                categorySlug: `phase-${addPhase}`,
                dueDate: addDue.trim() || undefined,
              })
            }
          />
        }
      >
        <Input label="Назва" value={title} onChangeText={setTitle} />
        <Text style={styles.fieldLabel}>Фаза</Text>
        <ChipRow
          options={PLAN_PHASES.map((p) => ({
            id: String(p.id),
            label: `${p.id}. ${p.label}`,
          }))}
          value={addPhase}
          onChange={setAddPhase}
        />
        <DateField
          label="Дедлайн"
          value={addDue}
          onChange={setAddDue}
          allowClear
          placeholder="Без дати"
        />
      </Sheet>

      <Sheet
        visible={!!editing}
        title="Редагувати"
        onClose={() => setEditing(null)}
        footer={
          <>
            <Button
              label="Зберегти"
              loading={updateMut.isPending}
              disabled={!editForm.title.trim()}
              onPress={() => {
                if (!editing) return;
                updateMut.mutate({
                  id: editing.id,
                  input: {
                    title: editForm.title.trim(),
                    dueDate: editForm.dueDate.trim() || null,
                    status: editForm.status,
                  },
                });
              }}
            />
            {editing?.isCustom ? (
              <Button
                label="Видалити"
                variant="danger"
                onPress={() => {
                  if (!editing) return;
                  confirmAction("Видалити задачу?", editing.title, () =>
                    delMut.mutate(editing.id),
                  );
                }}
              />
            ) : null}
          </>
        }
      >
        <Input
          label="Назва"
          value={editForm.title}
          onChangeText={(v) => setEditForm((s) => ({ ...s, title: v }))}
        />
        <DateField
          label="Дедлайн"
          value={editForm.dueDate}
          onChange={(v) => setEditForm((s) => ({ ...s, dueDate: v }))}
          allowClear
          placeholder="Без дати"
        />
        <Text style={styles.fieldLabel}>Статус</Text>
        <ChipRow
          options={[
            { id: "TODO", label: "Todo" },
            { id: "IN_PROGRESS", label: "В процесі" },
            { id: "DONE", label: "Готово" },
          ]}
          value={editForm.status}
          onChange={(id) =>
            setEditForm((s) => ({ ...s, status: id as TaskStatus }))
          }
        />
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  pad: { paddingHorizontal: spacing.md, paddingBottom: 40 },
  check: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: "700",
    width: 28,
    textAlign: "center",
  },
  badgeSlot: { minWidth: 88, alignItems: "flex-end" },
  hint: {
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: 8,
  },
  fieldLabel: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
  },
});
