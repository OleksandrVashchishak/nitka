import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { confirmAction } from "@/lib/confirm";
import {
  createExternalVendor,
  getVendorPipeline,
  removeExternalVendor,
  removeFavorite,
  updateCatalogVendorPipeline,
  updateExternalVendor,
} from "@/lib/favorites-api";
import { href } from "@/lib/href";
import {
  MANUAL_VENDOR_CATEGORIES,
  manualCategoryLabel,
} from "@/lib/manual-categories";
import type {
  ExternalVendor,
  FavoriteItem,
  VendorPipelineStage,
} from "@/lib/types";
import { colors } from "@/theme";
import { BackHeader } from "@/ui/back-header";
import { ChipRow, Sheet } from "@/ui/sheet";
import {
  Badge,
  Button,
  Empty,
  ErrorBox,
  Input,
  Loading,
  Row,
  Subtitle,
  Title,
} from "@/ui";

const STAGES: VendorPipelineStage[] = [
  "SAVED",
  "CONTACTED",
  "MET",
  "COMPARED",
  "CHOSEN",
];

const STAGE_FILTERS = [
  { id: "ALL", label: "Усі" },
  ...STAGES.map((s) => ({ id: s, label: stageLabel(s) })),
];

function stageLabel(s: VendorPipelineStage) {
  const map: Record<VendorPipelineStage, string> = {
    SAVED: "Збережено",
    CONTACTED: "Написала/в",
    MET: "Зустріч",
    COMPARED: "Порівняння",
    CHOSEN: "Обрано",
  };
  return map[s] ?? s;
}

function money(n: number | null | undefined) {
  if (n == null) return null;
  return `${Math.round(n).toLocaleString("uk-UA")} грн`;
}

export default function FavoritesScreen() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["pipeline"], queryFn: getVendorPipeline });
  const [stageFilter, setStageFilter] = useState("ALL");
  const [showAdd, setShowAdd] = useState(false);
  const [editCatalog, setEditCatalog] = useState<FavoriteItem | null>(null);
  const [editManual, setEditManual] = useState<ExternalVendor | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("photo");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const [catalogForm, setCatalogForm] = useState({
    stage: "SAVED" as VendorPipelineStage,
    quotedPrice: "",
    notes: "",
  });
  const [manualForm, setManualForm] = useState({
    name: "",
    category: "photo",
    city: "",
    phone: "",
    website: "",
    quotedPrice: "",
    notes: "",
    stage: "SAVED" as VendorPipelineStage,
  });

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["pipeline"] });
    void qc.invalidateQueries({ queryKey: ["favorites"] });
  };

  const addMut = useMutation({
    mutationFn: createExternalVendor,
    onSuccess: () => {
      setShowAdd(false);
      setName("");
      setPhone("");
      setCity("");
      invalidate();
    },
  });

  const catalogMut = useMutation({
    mutationFn: ({
      vendorId,
      input,
    }: {
      vendorId: string;
      input: Parameters<typeof updateCatalogVendorPipeline>[1];
    }) => updateCatalogVendorPipeline(vendorId, input),
    onSuccess: () => {
      setEditCatalog(null);
      invalidate();
    },
  });

  const manualMut = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Parameters<typeof updateExternalVendor>[1];
    }) => updateExternalVendor(id, input),
    onSuccess: () => {
      setEditManual(null);
      invalidate();
    },
  });

  const removeCatalogMut = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      setEditCatalog(null);
      invalidate();
    },
  });

  const delMut = useMutation({
    mutationFn: removeExternalVendor,
    onSuccess: () => {
      setEditManual(null);
      invalidate();
    },
  });

  function openCatalog(f: FavoriteItem) {
    setEditCatalog(f);
    setCatalogForm({
      stage: f.stage,
      quotedPrice: f.quotedPrice != null ? String(f.quotedPrice) : "",
      notes: f.notes ?? "",
    });
  }

  function openManual(v: ExternalVendor) {
    setEditManual(v);
    setManualForm({
      name: v.name,
      category: v.category,
      city: v.city ?? "",
      phone: v.phone ?? "",
      website: v.website ?? "",
      quotedPrice: v.quotedPrice != null ? String(v.quotedPrice) : "",
      notes: v.notes ?? "",
      stage: v.stage,
    });
  }

  const catalog = useMemo(() => {
    const all = q.data?.catalog ?? [];
    if (stageFilter === "ALL") return all;
    return all.filter((f) => f.stage === stageFilter);
  }, [q.data, stageFilter]);

  const manual = useMemo(() => {
    const all = q.data?.manual ?? [];
    if (stageFilter === "ALL") return all;
    return all.filter((v) => v.stage === stageFilter);
  }, [q.data, stageFilter]);

  if (q.isLoading) return <Loading />;
  if (q.isError) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorBox
          message={q.error instanceof Error ? q.error.message : "Помилка"}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <BackHeader title="Обране" />
      <ScrollView contentContainerStyle={styles.pad}>
        <Title>Обране</Title>
        <Subtitle>Пайплайн підрядників</Subtitle>

        <ChipRow
          options={STAGE_FILTERS}
          value={stageFilter}
          onChange={setStageFilter}
        />

        <Text style={styles.section}>З каталогу</Text>
        {catalog.length === 0 ? (
          <Empty title="Порожньо" hint="Додай з каталогу підрядників" />
        ) : (
          catalog.map((f) => (
            <Row
              key={f.id}
              title={f.vendor.name}
              subtitle={[
                f.vendor.category.name,
                f.vendor.city,
                money(f.quotedPrice),
              ]
                .filter(Boolean)
                .join(" · ")}
              right={<Badge label={stageLabel(f.stage)} tone="sage" />}
              onPress={() => openCatalog(f)}
            />
          ))
        )}

        <Text style={styles.section}>Свої (вручну)</Text>
        {manual.length === 0 ? (
          <Empty title="Немає ручних" />
        ) : (
          manual.map((v) => (
            <Row
              key={v.id}
              title={v.name}
              subtitle={[
                manualCategoryLabel(v.category),
                v.city || null,
                v.phone,
                money(v.quotedPrice),
              ]
                .filter(Boolean)
                .join(" · ")}
              right={<Badge label={stageLabel(v.stage)} tone="ok" />}
              onPress={() => openManual(v)}
            />
          ))
        )}

        <View style={{ height: 12 }} />
        <Button label="Додати свого підрядника" onPress={() => setShowAdd(true)} />
        <Subtitle>Тап по картці — редагувати</Subtitle>
      </ScrollView>

      <Sheet
        visible={showAdd}
        title="Свій підрядник"
        onClose={() => setShowAdd(false)}
        footer={
          <Button
            label="Зберегти"
            loading={addMut.isPending}
            disabled={!name.trim()}
            onPress={() =>
              addMut.mutate({
                name: name.trim(),
                category,
                city: city.trim() || undefined,
                phone: phone.trim() || undefined,
              })
            }
          />
        }
      >
        <Input label="Імʼя / назва" value={name} onChangeText={setName} />
        <Text style={styles.fieldLabel}>Категорія</Text>
        <ChipRow
          options={MANUAL_VENDOR_CATEGORIES.map((c) => ({
            id: c.slug,
            label: c.name,
          }))}
          value={category}
          onChange={setCategory}
        />
        <Input label="Місто" value={city} onChangeText={setCity} />
        <Input
          label="Телефон"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        {addMut.isError ? (
          <ErrorBox
            message={
              addMut.error instanceof Error ? addMut.error.message : "Помилка"
            }
          />
        ) : null}
      </Sheet>

      <Sheet
        visible={!!editCatalog}
        title={editCatalog?.vendor.name ?? "Підрядник"}
        onClose={() => setEditCatalog(null)}
        footer={
          <>
            <Button
              label="Зберегти"
              loading={catalogMut.isPending}
              onPress={() => {
                if (!editCatalog) return;
                catalogMut.mutate({
                  vendorId: editCatalog.vendor.id,
                  input: {
                    stage: catalogForm.stage,
                    quotedPrice: catalogForm.quotedPrice
                      ? Number(catalogForm.quotedPrice)
                      : null,
                    notes: catalogForm.notes.trim() || null,
                  },
                });
              }}
            />
            {editCatalog?.vendor.slug ? (
              <Button
                label="Відкрити в каталозі"
                variant="ghost"
                onPress={() => {
                  const slug = editCatalog.vendor.slug!;
                  setEditCatalog(null);
                  router.push(href(`/vendors/${slug}`));
                }}
              />
            ) : null}
            <Button
              label="Прибрати з обраного"
              variant="danger"
              onPress={() => {
                if (!editCatalog) return;
                confirmAction(
                  "Прибрати з обраного?",
                  editCatalog.vendor.name,
                  () => removeCatalogMut.mutate(editCatalog.vendor.id),
                );
              }}
            />
          </>
        }
      >
        <Text style={styles.fieldLabel}>Етап</Text>
        <ChipRow
          options={STAGES.map((s) => ({ id: s, label: stageLabel(s) }))}
          value={catalogForm.stage}
          onChange={(id) =>
            setCatalogForm((s) => ({
              ...s,
              stage: id as VendorPipelineStage,
            }))
          }
        />
        <Input
          label="Пропозиція, грн"
          keyboardType="number-pad"
          value={catalogForm.quotedPrice}
          onChangeText={(v) =>
            setCatalogForm((s) => ({ ...s, quotedPrice: v }))
          }
        />
        <Input
          label="Нотатки"
          value={catalogForm.notes}
          onChangeText={(v) => setCatalogForm((s) => ({ ...s, notes: v }))}
          multiline
        />
      </Sheet>

      <Sheet
        visible={!!editManual}
        title={editManual?.name ?? "Підрядник"}
        onClose={() => setEditManual(null)}
        footer={
          <>
            <Button
              label="Зберегти"
              loading={manualMut.isPending}
              disabled={!manualForm.name.trim()}
              onPress={() => {
                if (!editManual) return;
                manualMut.mutate({
                  id: editManual.id,
                  input: {
                    name: manualForm.name.trim(),
                    category: manualForm.category,
                    city: manualForm.city.trim(),
                    phone: manualForm.phone.trim() || null,
                    website: manualForm.website.trim() || null,
                    quotedPrice: manualForm.quotedPrice
                      ? Number(manualForm.quotedPrice)
                      : null,
                    notes: manualForm.notes.trim() || null,
                    stage: manualForm.stage,
                  },
                });
              }}
            />
            <Button
              label="Видалити"
              variant="danger"
              onPress={() => {
                if (!editManual) return;
                confirmAction("Видалити?", editManual.name, () =>
                  delMut.mutate(editManual.id),
                );
              }}
            />
          </>
        }
      >
        <Input
          label="Назва"
          value={manualForm.name}
          onChangeText={(v) => setManualForm((s) => ({ ...s, name: v }))}
        />
        <Text style={styles.fieldLabel}>Категорія</Text>
        <ChipRow
          options={MANUAL_VENDOR_CATEGORIES.map((c) => ({
            id: c.slug,
            label: c.name,
          }))}
          value={manualForm.category}
          onChange={(id) => setManualForm((s) => ({ ...s, category: id }))}
        />
        <Text style={styles.fieldLabel}>Етап</Text>
        <ChipRow
          options={STAGES.map((s) => ({ id: s, label: stageLabel(s) }))}
          value={manualForm.stage}
          onChange={(id) =>
            setManualForm((s) => ({
              ...s,
              stage: id as VendorPipelineStage,
            }))
          }
        />
        <Input
          label="Місто"
          value={manualForm.city}
          onChangeText={(v) => setManualForm((s) => ({ ...s, city: v }))}
        />
        <Input
          label="Телефон"
          value={manualForm.phone}
          onChangeText={(v) => setManualForm((s) => ({ ...s, phone: v }))}
          keyboardType="phone-pad"
        />
        <Input
          label="Сайт"
          value={manualForm.website}
          onChangeText={(v) => setManualForm((s) => ({ ...s, website: v }))}
          autoCapitalize="none"
        />
        <Input
          label="Пропозиція, грн"
          keyboardType="number-pad"
          value={manualForm.quotedPrice}
          onChangeText={(v) =>
            setManualForm((s) => ({ ...s, quotedPrice: v }))
          }
        />
        <Input
          label="Нотатки"
          value={manualForm.notes}
          onChangeText={(v) => setManualForm((s) => ({ ...s, notes: v }))}
          multiline
        />
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  pad: { padding: 16, paddingBottom: 40 },
  section: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "700",
    color: colors.primaryDeep,
  },
  fieldLabel: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
  },
});
