import * as ImagePicker from "expo-image-picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { uploadImage } from "@/lib/uploads-api";
import {
  getCategories,
  getMyVendorProfile,
  upsertMyVendorProfile,
} from "@/lib/vendors-api";
import { colors } from "@/theme";
import { ChipRow } from "@/ui/sheet";
import {
  Badge,
  Button,
  ErrorBox,
  FormScroll,
  Input,
  Loading,
  Screen,
  Subtitle,
  Title,
} from "@/ui";

export default function VendorProfileScreen() {
  const qc = useQueryClient();
  const profileQuery = useQuery({
    queryKey: ["my-vendor-profile"],
    queryFn: getMyVendorProfile,
  });
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    categoryId: "",
    city: "",
    priceFrom: "",
    priceTo: "",
    phone: "",
    website: "",
    instagram: "",
  });
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const p = profileQuery.data;
    if (!p) return;
    setForm({
      name: p.name ?? "",
      tagline: p.tagline ?? "",
      description: p.description ?? "",
      categoryId: p.category?.id ?? "",
      city: p.city ?? "",
      priceFrom: String(p.priceFrom ?? ""),
      priceTo: p.priceTo != null ? String(p.priceTo) : "",
      phone: p.phone ?? "",
      website: p.website ?? "",
      instagram: p.instagram ?? "",
    });
    setPhotoUrls((p.photos ?? []).map((ph) => ph.url));
  }, [profileQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      upsertMyVendorProfile({
        name: form.name.trim(),
        tagline: form.tagline.trim() || undefined,
        description: form.description.trim(),
        categoryId: form.categoryId,
        city: form.city.trim(),
        priceFrom: Number(form.priceFrom) || 0,
        priceTo: form.priceTo.trim() ? Number(form.priceTo) : null,
        phone: form.phone.trim() || undefined,
        website: form.website.trim() || undefined,
        instagram: form.instagram.trim() || undefined,
        photoUrls,
      }),
    onSuccess: () => {
      setMsg("Збережено");
      void qc.invalidateQueries({ queryKey: ["my-vendor-profile"] });
      void qc.invalidateQueries({ queryKey: ["vendor-dashboard"] });
    },
    onError: (e: Error) => setMsg(e.message),
  });

  async function addPhoto() {
    setMsg(null);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setMsg("Немає доступу до галереї");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    setUploading(true);
    try {
      const asset = result.assets[0];
      const uploaded = await uploadImage(
        asset.uri,
        asset.fileName ?? "photo.jpg",
      );
      setPhotoUrls((prev) => [...prev, uploaded.url]);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Аплоад не вдався");
    } finally {
      setUploading(false);
    }
  }

  if (profileQuery.isLoading || categoriesQuery.isLoading) {
    return <Loading />;
  }

  if (profileQuery.error || categoriesQuery.error) {
    return (
      <Screen>
        <ErrorBox
          message={
            (profileQuery.error as Error)?.message ||
            (categoriesQuery.error as Error)?.message ||
            "Помилка"
          }
        />
      </Screen>
    );
  }

  const categories = categoriesQuery.data ?? [];

  return (
    <Screen style={styles.screen}>
      <FormScroll contentContainerStyle={styles.content}>
        <Title>Профіль</Title>
        <Subtitle>Дані для каталогу</Subtitle>
        {profileQuery.data?.status ? (
          <Badge label={statusUk(profileQuery.data.status)} />
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.photos}>
            {photoUrls.map((url) => (
              <View key={url} style={styles.photoWrap}>
                <Image source={{ uri: url }} style={styles.thumb} />
                <Pressable
                  style={styles.removePhoto}
                  onPress={() =>
                    setPhotoUrls((prev) => prev.filter((u) => u !== url))
                  }
                >
                  <Text style={styles.removePhotoText}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
        <Button
          label="Додати фото"
          variant="ghost"
          loading={uploading}
          onPress={() => void addPhoto()}
        />

        <Input
          label="Назва"
          value={form.name}
          onChangeText={(v) => setForm((s) => ({ ...s, name: v }))}
        />
        <Input
          label="Слоган"
          value={form.tagline}
          onChangeText={(v) => setForm((s) => ({ ...s, tagline: v }))}
        />
        <Input
          label="Опис"
          multiline
          value={form.description}
          onChangeText={(v) => setForm((s) => ({ ...s, description: v }))}
          style={{ minHeight: 100, textAlignVertical: "top" }}
        />

        <Text style={styles.label}>Категорія</Text>
        <ChipRow
          options={categories.map((c) => ({ id: c.id, label: c.name }))}
          value={form.categoryId}
          onChange={(id) => setForm((s) => ({ ...s, categoryId: id }))}
        />

        <Input
          label="Місто"
          value={form.city}
          onChangeText={(v) => setForm((s) => ({ ...s, city: v }))}
        />
        <Input
          label="Ціна від"
          keyboardType="number-pad"
          value={form.priceFrom}
          onChangeText={(v) => setForm((s) => ({ ...s, priceFrom: v }))}
        />
        <Input
          label="Ціна до"
          keyboardType="number-pad"
          value={form.priceTo}
          onChangeText={(v) => setForm((s) => ({ ...s, priceTo: v }))}
        />
        <Input
          label="Телефон"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => setForm((s) => ({ ...s, phone: v }))}
        />
        <Input
          label="Сайт"
          autoCapitalize="none"
          value={form.website}
          onChangeText={(v) => setForm((s) => ({ ...s, website: v }))}
        />
        <Input
          label="Instagram"
          autoCapitalize="none"
          value={form.instagram}
          onChangeText={(v) => setForm((s) => ({ ...s, instagram: v }))}
        />

        {msg ? <Text style={styles.hint}>{msg}</Text> : null}
        <Button
          label="Зберегти"
          loading={saveMutation.isPending}
          disabled={!form.name || !form.categoryId || !form.description.trim()}
          onPress={() => {
            setMsg(null);
            saveMutation.mutate();
          }}
        />
      </FormScroll>
    </Screen>
  );
}

function statusUk(s: string) {
  if (s === "APPROVED") return "Схвалено";
  if (s === "PENDING") return "На перевірці";
  if (s === "REJECTED") return "Відхилено";
  return s;
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  content: { padding: 16, paddingBottom: 40 },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: 10,
    backgroundColor: colors.mist,
  },
  photos: { flexDirection: "row", gap: 8, paddingVertical: 4 },
  photoWrap: { position: "relative" },
  removePhoto: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(22,26,23,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  removePhotoText: { color: "#fff", fontSize: 16, fontWeight: "700", lineHeight: 18 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
    marginBottom: 6,
  },
  hint: { marginBottom: 8, color: colors.primary, fontWeight: "600" },
});
