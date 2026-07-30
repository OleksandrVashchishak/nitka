import * as ImagePicker from "expo-image-picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { uploadImage } from "@/lib/uploads-api";
import { getMyWedding, upsertWedding } from "@/lib/weddings-api";
import { colors } from "@/theme";
import { BackHeader } from "@/ui/back-header";
import { CityAutocomplete } from "@/ui/city-autocomplete";
import { DateField } from "@/ui/date-field";
import { ChipRow } from "@/ui/sheet";
import {
  Button,
  Empty,
  ErrorBox,
  FormScroll,
  Input,
  Loading,
  Subtitle,
  Title,
} from "@/ui";

export default function WeddingEditScreen() {
  const qc = useQueryClient();
  const weddingQ = useQuery({ queryKey: ["wedding"], queryFn: getMyWedding });

  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [partnerOne, setPartnerOne] = useState("");
  const [partnerTwo, setPartnerTwo] = useState("");
  const [cityUndecided, setCityUndecided] = useState(false);
  const [guestsUndecided, setGuestsUndecided] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const w = weddingQ.data;
    if (!w) return;
    setDate(w.date.slice(0, 10));
    setCity(w.cityUndecided ? "" : w.city === "—" ? "" : w.city);
    setGuests(w.guestsUndecided ? "" : String(w.guests || ""));
    setBudget(String(w.budget || ""));
    setPartnerOne(w.partnerOneName);
    setPartnerTwo(w.partnerTwoName);
    setPhotoUrl(w.couplePhotoUrl);
    setCityUndecided(!!w.cityUndecided);
    setGuestsUndecided(!!w.guestsUndecided);
  }, [weddingQ.data]);

  const saveMut = useMutation({
    mutationFn: upsertWedding,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["wedding"] });
      void qc.invalidateQueries({ queryKey: ["insights"] });
      void qc.invalidateQueries({ queryKey: ["budget"] });
      router.back();
    },
  });

  async function pickPhoto() {
    setError(null);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError("Немає доступу до галереї");
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
      setPhotoUrl(uploaded.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Аплоад не вдався");
    } finally {
      setUploading(false);
    }
  }

  if (weddingQ.isLoading) return <Loading />;
  if (weddingQ.isError) {
    return (
      <SafeAreaView style={styles.safe}>
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

  if (!weddingQ.data) {
    return (
      <SafeAreaView style={styles.safe}>
        <Empty title="Спочатку створи весілля" hint="На вкладці Дім" />
      </SafeAreaView>
    );
  }

  async function onSave() {
    setError(null);
    if (!date) {
      setError("Дата обовʼязкова (орієнтовна теж ок)");
      return;
    }
    if (!cityUndecided && !city.trim()) {
      setError("Місто або познач «ще не вирішили»");
      return;
    }
    if (!guestsUndecided) {
      const n = Number(guests);
      if (!Number.isFinite(n) || n < 1) {
        setError("Кількість гостей або «ще не вирішили»");
        return;
      }
    }
    try {
      await saveMut.mutateAsync({
        date,
        city: cityUndecided ? city.trim() || "Ще вирішуємо" : city.trim(),
        guests: guestsUndecided ? 1 : Number(guests),
        budget: Number(budget) || 0,
        partnerOneName: partnerOne.trim() || undefined,
        partnerTwoName: partnerTwo.trim() || undefined,
        couplePhotoUrl: photoUrl,
        cityUndecided,
        guestsUndecided,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не вдалося зберегти");
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <BackHeader title="Весілля" />
      <FormScroll contentContainerStyle={styles.pad}>
        <Title>Весілля</Title>
        <Subtitle>Онови деталі</Subtitle>

        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.photo} />
        ) : null}
        <Button
          label={photoUrl ? "Змінити фото" : "Додати фото пари"}
          variant="ghost"
          loading={uploading}
          onPress={() => void pickPhoto()}
        />

        <DateField label="Дата весілля" value={date} onChange={setDate} />
        <Text style={styles.note}>
          Дата потрібна для чекліста й відліку — можна орієнтовну.
        </Text>

        <Text style={styles.fieldLabel}>Місто</Text>
        <ChipRow
          options={[
            { id: "known", label: "Знаємо" },
            { id: "later", label: "Ще не вирішили" },
          ]}
          value={cityUndecided ? "later" : "known"}
          onChange={(id) => setCityUndecided(id === "later")}
        />
        {!cityUndecided ? (
          <CityAutocomplete label="" value={city} onChangeText={setCity} />
        ) : null}

        <Text style={styles.fieldLabel}>Гості</Text>
        <ChipRow
          options={[
            { id: "known", label: "Знаємо" },
            { id: "later", label: "Ще не вирішили" },
          ]}
          value={guestsUndecided ? "later" : "known"}
          onChange={(id) => setGuestsUndecided(id === "later")}
        />
        {!guestsUndecided ? (
          <Input
            label="Кількість гостей"
            keyboardType="number-pad"
            value={guests}
            onChangeText={setGuests}
          />
        ) : null}

        <Input
          label="Бюджет, грн"
          keyboardType="number-pad"
          value={budget}
          onChangeText={setBudget}
        />
        <Input
          label="Партнер 1"
          value={partnerOne}
          onChangeText={setPartnerOne}
        />
        <Input
          label="Партнер 2"
          value={partnerTwo}
          onChangeText={setPartnerTwo}
        />

        {weddingQ.data.members?.length ? (
          <View style={styles.members}>
            <Text style={styles.membersTitle}>Учасники кабінету</Text>
            {weddingQ.data.members.map((m) => (
              <Text key={m.id} style={styles.member}>
                {m.user.name} · {m.role === "OWNER" ? "власник" : "партнер"}
              </Text>
            ))}
          </View>
        ) : null}

        {error ? <ErrorBox message={error} /> : null}

        <Button
          label="Зберегти"
          onPress={onSave}
          loading={saveMut.isPending}
        />
      </FormScroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  pad: { padding: 16, paddingBottom: 32 },
  photo: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: colors.mist,
  },
  fieldLabel: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
  },
  note: {
    marginTop: -4,
    marginBottom: 8,
    fontSize: 12,
    color: colors.inkMuted,
    lineHeight: 16,
  },
  members: {
    marginTop: 8,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.mist,
  },
  membersTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primaryDeep,
    marginBottom: 6,
  },
  member: { fontSize: 14, color: colors.ink, marginBottom: 2 },
});
