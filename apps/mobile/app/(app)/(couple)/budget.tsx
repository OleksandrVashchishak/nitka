import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BUDGET_CATEGORIES,
  categoryLabel,
  createBudgetItem,
  deleteBudgetItem,
  getBudget,
  updateBudgetItem,
  updateBudgetPlan,
} from "@/lib/budget-api";
import { confirmAction } from "@/lib/confirm";
import { hapticLight, hapticSuccess } from "@/lib/haptics";
import type { BudgetItem, BudgetResponse } from "@/lib/types";
import { colors, radius, spacing } from "@/theme";
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

function money(n: number) {
  return `${Math.round(n).toLocaleString("uk-UA")} грн`;
}

export default function BudgetScreen() {
  const qc = useQueryClient();
  const budgetQ = useQuery({ queryKey: ["budget"], queryFn: getBudget });

  const [plan, setPlan] = useState("");
  const [editingPlan, setEditingPlan] = useState(false);
  const [mode, setMode] = useState<"budget" | "payments">("budget");
  const [catFilter, setCatFilter] = useState("ALL");
  const [showAdd, setShowAdd] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategorySlug, setNewCategorySlug] = useState<string>(
    BUDGET_CATEGORIES[0]!.value,
  );
  const [editing, setEditing] = useState<BudgetItem | null>(null);

  const [title, setTitle] = useState("");
  const [estimated, setEstimated] = useState("");
  const [category, setCategory] = useState<string>(BUDGET_CATEGORIES[0]!.value);

  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    estimated: "",
    actual: "",
    notes: "",
    paid: false,
  });

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["budget"] });
    void qc.invalidateQueries({ queryKey: ["insights"] });
  };

  const planMut = useMutation({
    mutationFn: (n: number) => updateBudgetPlan(n),
    onSuccess: () => {
      setEditingPlan(false);
      invalidate();
    },
  });

  const addMut = useMutation({
    mutationFn: createBudgetItem,
    onSuccess: () => {
      setTitle("");
      setEstimated("");
      setShowAdd(false);
      setShowNewCategory(false);
      invalidate();
    },
  });

  const updateMut = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Parameters<typeof updateBudgetItem>[1];
    }) => updateBudgetItem(id, input),
    onSuccess: () => {
      setEditing(null);
      invalidate();
    },
  });

  const togglePaidMut = useMutation({
    mutationFn: ({ id, paid }: { id: string; paid: boolean }) =>
      updateBudgetItem(id, { paid }),
    onMutate: async ({ id, paid }) => {
      await qc.cancelQueries({ queryKey: ["budget"] });
      const prev = qc.getQueryData<BudgetResponse>(["budget"]);
      qc.setQueryData<BudgetResponse>(["budget"], (old) => {
        if (!old) return old;
        const items = old.items.map((i) =>
          i.id === id ? { ...i, paid } : i,
        );
        const paidSum = items
          .filter((i) => i.paid)
          .reduce((sum, i) => sum + (i.actual || i.estimated || 0), 0);
        return {
          ...old,
          items,
          summary: { ...old.summary, paid: paidSum },
        };
      });
      if (paid) hapticSuccess();
      else hapticLight();
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["budget"], ctx.prev);
    },
    onSettled: () => invalidate(),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteBudgetItem(id),
    onSuccess: () => {
      setEditing(null);
      invalidate();
    },
  });

  function openEdit(item: BudgetItem) {
    setEditing(item);
    setEditForm({
      title: item.title,
      category: item.category,
      estimated: String(item.estimated),
      actual: String(item.actual),
      notes: item.notes ?? "",
      paid: item.paid,
    });
  }

  function togglePaid(item: BudgetItem) {
    togglePaidMut.mutate({ id: item.id, paid: !item.paid });
  }

  const items = useMemo(() => {
    const all = budgetQ.data?.items ?? [];
    return all.filter((i) => {
      if (catFilter !== "ALL" && i.category !== catFilter) return false;
      if (mode === "payments") return true; // show all, unpaid can be toggled
      return true;
    });
  }, [budgetQ.data, catFilter, mode]);

  const paymentItems = useMemo(() => {
    if (mode !== "payments") return items;
    return [...items].sort((a, b) => Number(a.paid) - Number(b.paid));
  }, [items, mode]);

  const list = mode === "payments" ? paymentItems : items;

  const paidTotal = useMemo(
    () =>
      (budgetQ.data?.items ?? [])
        .filter((i) => i.paid)
        .reduce((sum, i) => sum + (i.actual || i.estimated || 0), 0),
    [budgetQ.data],
  );

  if (budgetQ.isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <SkeletonScreen variant="list" />
      </SafeAreaView>
    );
  }
  if (budgetQ.isError) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ErrorBox
          message={
            budgetQ.error instanceof Error ? budgetQ.error.message : "Помилка"
          }
        />
      </SafeAreaView>
    );
  }

  const data = budgetQ.data;
  if (!data) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Empty title="Немає бюджету" hint="Створи весілля спочатку" />
      </SafeAreaView>
    );
  }

  const { summary } = data;
  const usedCategories = new Set((data.items ?? []).map((i) => i.category));
  const unusedCategories = BUDGET_CATEGORIES.filter(
    (c) => !usedCategories.has(c.value),
  );
  const categoryChoices = unusedCategories.length
    ? unusedCategories
    : BUDGET_CATEGORIES;
  const catOptions = [
    { id: "ALL", label: "Усі" },
    ...[...usedCategories].map((slug) => ({
      id: slug,
      label: categoryLabel(slug),
    })),
    ...BUDGET_CATEGORIES.filter((c) => !usedCategories.has(c.value)).map(
      (c) => ({ id: c.value, label: c.label }),
    ),
  ];
  // dedupe catOptions by id
  const seen = new Set<string>();
  const uniqueCatOptions = catOptions.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.pad}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={budgetQ.isRefetching && !budgetQ.isLoading}
            onRefresh={() => void budgetQ.refetch()}
            tintColor={colors.primary}
          />
        }
      >
        <ScreenHeader
          title="Бюджет"
          subtitle={
            mode === "budget"
              ? `План ${money(summary.totalBudget)} · лишилось ${money(summary.remaining)}`
              : `Сплачено ${money(paidTotal)}`
          }
        />

        <ChipRow
          options={[
            { id: "budget", label: "Бюджет" },
            { id: "payments", label: "Платежі" },
          ]}
          value={mode}
          onChange={(id) => setMode(id as "budget" | "payments")}
        />

        <View style={styles.summary}>
          <Text style={styles.summaryMain}>{money(summary.remaining)}</Text>
          <Text style={styles.summaryHint}>залишок</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.meta}>Оцінка {money(summary.estimated)}</Text>
            <Text style={styles.meta}>Факт {money(summary.actual)}</Text>
            <Text style={styles.meta}>Сплачено {money(summary.paid)}</Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.min(100, Math.round((summary.progress || 0) * 100))}%`,
                },
              ]}
            />
          </View>
        </View>

        {editingPlan ? (
          <ListGroup>
            <View style={{ padding: 16 }}>
              <Input
                label="Новий план, грн"
                keyboardType="number-pad"
                value={plan}
                onChangeText={setPlan}
              />
              <Button
                label="Зберегти план"
                loading={planMut.isPending}
                onPress={() => planMut.mutate(Number(plan) || 0)}
              />
              <View style={{ height: 8 }} />
              <Button
                label="Скасувати"
                variant="ghost"
                onPress={() => setEditingPlan(false)}
              />
            </View>
          </ListGroup>
        ) : (
        <ListGroup>
          <ListRow
            title="Змінити план"
            subtitle={money(summary.totalBudget)}
            onPress={() => {
              setPlan(String(summary.totalBudget));
              setEditingPlan(true);
            }}
          />
          <ListRow
            title="Нова категорія"
            subtitle="Додати з пресетів"
            onPress={() => {
              setNewCategorySlug(categoryChoices[0]!.value);
              setShowNewCategory(true);
            }}
            last
          />
        </ListGroup>
        )}

        <ChipRow
          options={uniqueCatOptions}
          value={catFilter}
          onChange={setCatFilter}
        />

        {list.length === 0 ? (
          <Empty
            title={
              (budgetQ.data?.items.length ?? 0) === 0
                ? "Ще немає витрат"
                : "Нічого за фільтром"
            }
            hint={
              (budgetQ.data?.items.length ?? 0) === 0
                ? "Додай першу витрату або нову категорію"
                : "Обери іншу категорію"
            }
            actionLabel={
              (budgetQ.data?.items.length ?? 0) === 0
                ? "Додати витрату"
                : undefined
            }
            onAction={
              (budgetQ.data?.items.length ?? 0) === 0
                ? () => setShowAdd(true)
                : undefined
            }
          />
        ) : (
          <ListGroup
            header={mode === "payments" ? "Платежі" : "Витрати"}
            footer={
              mode === "payments"
                ? "Тап по ✓ — сплачено/ні · довгий тап — редагувати"
                : "Тап — редагувати"
            }
          >
            {list.map((item, i) => (
              <ListRow
                key={item.id}
                title={item.title}
                subtitle={
                  mode === "payments"
                    ? `${categoryLabel(item.category)} · ${money(item.actual || item.estimated)}`
                    : `${categoryLabel(item.category)} · оцінка ${money(item.estimated)}${
                        item.actual ? ` · факт ${money(item.actual)}` : ""
                      }`
                }
                right={
                  mode === "payments" ? (
                    <Pressable
                      hitSlop={10}
                      onPress={() => togglePaid(item)}
                      style={[
                        styles.paidBtn,
                        item.paid && styles.paidBtnOn,
                      ]}
                    >
                      <Text
                        style={[
                          styles.paidBtnText,
                          item.paid && styles.paidBtnTextOn,
                        ]}
                      >
                        {item.paid ? "✓" : "○"}
                      </Text>
                    </Pressable>
                  ) : (
                    <Badge
                      label={item.paid ? "Сплачено" : "Ні"}
                      tone={item.paid ? "ok" : "muted"}
                    />
                  )
                }
                last={i === list.length - 1}
                onPress={() =>
                  mode === "payments" ? togglePaid(item) : openEdit(item)
                }
                onLongPress={() => openEdit(item)}
              />
            ))}
          </ListGroup>
        )}
        <View style={{ height: 72 }} />
      </ScrollView>

      <Fab label="+ Витрата" onPress={() => setShowAdd(true)} />

      <Sheet
        visible={showNewCategory}
        title="Нова категорія"
        onClose={() => setShowNewCategory(false)}
        footer={
          <Button
            label="Додати"
            loading={addMut.isPending}
            onPress={() => {
              const cat = BUDGET_CATEGORIES.find(
                (c) => c.value === newCategorySlug,
              );
              setCatFilter(newCategorySlug);
              addMut.mutate({
                category: newCategorySlug,
                title: cat?.label ?? newCategorySlug,
                estimated: 0,
              });
            }}
          />
        }
      >
        <Text style={styles.catLabel}>Обери категорію</Text>
        <ChipRow
          options={categoryChoices.map((c) => ({
            id: c.value,
            label: c.label,
          }))}
          value={newCategorySlug}
          onChange={setNewCategorySlug}
        />
      </Sheet>

      <Sheet
        visible={showAdd}
        title="Нова витрата"
        onClose={() => setShowAdd(false)}
        footer={
          <Button
            label="Додати"
            loading={addMut.isPending}
            disabled={!title.trim()}
            onPress={() =>
              addMut.mutate({
                category,
                title: title.trim(),
                estimated: Number(estimated) || 0,
              })
            }
          />
        }
      >
        <Input label="Назва" value={title} onChangeText={setTitle} />
        <Input
          label="Оцінка, грн"
          keyboardType="number-pad"
          value={estimated}
          onChangeText={setEstimated}
        />
        <Text style={styles.catLabel}>Категорія</Text>
        <ChipRow
          options={BUDGET_CATEGORIES.map((c) => ({
            id: c.value,
            label: c.label,
          }))}
          value={category}
          onChange={setCategory}
        />
      </Sheet>

      <Sheet
        visible={!!editing}
        title={editing?.title ?? "Витрата"}
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
                    category: editForm.category,
                    estimated: Number(editForm.estimated) || 0,
                    actual: Number(editForm.actual) || 0,
                    paid: editForm.paid,
                    notes: editForm.notes.trim() || null,
                  },
                });
              }}
            />
            <Button
              label={
                editForm.paid
                  ? "Позначити несплаченим"
                  : "Позначити сплаченим"
              }
              variant="ghost"
              onPress={() => setEditForm((s) => ({ ...s, paid: !s.paid }))}
            />
            <Button
              label="Видалити"
              variant="danger"
              onPress={() => {
                if (!editing) return;
                confirmAction("Видалити витрату?", editing.title, () =>
                  delMut.mutate(editing.id),
                );
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
        <Text style={styles.catLabel}>Категорія</Text>
        <ChipRow
          options={BUDGET_CATEGORIES.map((c) => ({
            id: c.value,
            label: c.label,
          }))}
          value={editForm.category}
          onChange={(id) => setEditForm((s) => ({ ...s, category: id }))}
        />
        <Input
          label="Оцінка, грн"
          keyboardType="number-pad"
          value={editForm.estimated}
          onChangeText={(v) => setEditForm((s) => ({ ...s, estimated: v }))}
        />
        <Input
          label="Факт, грн"
          keyboardType="number-pad"
          value={editForm.actual}
          onChangeText={(v) => setEditForm((s) => ({ ...s, actual: v }))}
        />
        <Input
          label="Нотатки"
          value={editForm.notes}
          onChangeText={(v) => setEditForm((s) => ({ ...s, notes: v }))}
          multiline
        />
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  pad: { paddingHorizontal: spacing.md, paddingBottom: 40 },
  summary: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 16,
  },
  summaryMain: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.5,
  },
  summaryHint: { fontSize: 13, color: colors.inkSoft, marginBottom: 10 },
  summaryRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  meta: { fontSize: 13, color: colors.inkSoft },
  barTrack: {
    marginTop: 12,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blush,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: colors.primary },
  catLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
    marginBottom: 6,
    marginTop: 8,
  },
  paidBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  paidBtnOn: {
    backgroundColor: colors.successMuted,
    borderColor: colors.success,
  },
  paidBtnText: { fontSize: 16, color: colors.inkMuted },
  paidBtnTextOn: { color: "#15803d", fontWeight: "700" },
});
