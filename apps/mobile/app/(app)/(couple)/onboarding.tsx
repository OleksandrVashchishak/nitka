import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/lib/auth-store";
import {
  BUDGET_CATEGORIES,
  createBudgetItem,
  getBudget,
  updateBudgetPlan,
} from "@/lib/budget-api";
import { importGuests, getGuestList } from "@/lib/guests-api";
import { href } from "@/lib/href";
import {
  isOnboardingCompleted,
  markOnboardingCompleted,
} from "@/lib/onboarding";
import { getMyWedding, upsertWedding } from "@/lib/weddings-api";
import { colors, radius, spacing } from "@/theme";
import { CityAutocomplete } from "@/ui/city-autocomplete";
import { DateField } from "@/ui/date-field";
import { ChipRow } from "@/ui/sheet";
import { Button, ErrorBox, FormScroll, Input, Loading } from "@/ui";

const BUDGET_PRESETS = [150_000, 300_000, 450_000, 600_000];

const STARTER_CATEGORIES = ["venue", "catering", "photo", "attire"] as const;

type Step = 1 | 2 | 3;

export default function OnboardingScreen() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const weddingQ = useQuery({ queryKey: ["wedding"], queryFn: getMyWedding });
  const guestsQ = useQuery({
    queryKey: ["guests"],
    queryFn: getGuestList,
    enabled: !!weddingQ.data,
  });
  const budgetQ = useQuery({
    queryKey: ["budget"],
    queryFn: getBudget,
    enabled: !!weddingQ.data,
  });

  const [step, setStep] = useState<Step>(1);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // step 1
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [cityUndecided, setCityUndecided] = useState(false);
  const [partnerOne, setPartnerOne] = useState("");
  const [partnerTwo, setPartnerTwo] = useState("");

  // step 2
  const [guestNames, setGuestNames] = useState("");
  const [guestCount, setGuestCount] = useState("50");
  const [guestsUndecided, setGuestsUndecided] = useState(false);

  // step 3
  const [budget, setBudget] = useState("300000");
  const [seedCategories, setSeedCategories] = useState(true);

  const wedding = weddingQ.data;

  useEffect(() => {
    const w = weddingQ.data;
    if (weddingQ.isLoading) return;
    if (!w) {
      setChecking(false);
      setStep(1);
      setPartnerOne(user?.name || "");
      return;
    }
    void (async () => {
      const done = await isOnboardingCompleted(w.id);
      if (done) {
        router.replace(href("/(app)/(couple)"));
        return;
      }
      setDate(w.date?.slice(0, 10) ?? "");
      setCity(w.cityUndecided ? "" : w.city === "Ще вирішуємо" ? "" : w.city);
      setCityUndecided(!!w.cityUndecided);
      setPartnerOne(w.partnerOneName || user?.name || "");
      setPartnerTwo(w.partnerTwoName || "");
      setGuestCount(w.guestsUndecided ? "50" : String(w.guests || 50));
      setGuestsUndecided(!!w.guestsUndecided);
      setBudget(String(w.budget || 300000));

      const guestTotal = guestsQ.data?.stats.total ?? 0;
      if (!w.date) setStep(1);
      else if (guestTotal === 0) setStep(2);
      else setStep(3);
      setChecking(false);
    })();
  }, [weddingQ.data, weddingQ.isLoading, guestsQ.data?.stats.total, user?.name]);

  const saveWeddingMut = useMutation({
    mutationFn: upsertWedding,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["wedding"] });
      void qc.invalidateQueries({ queryKey: ["insights"] });
      void qc.invalidateQueries({ queryKey: ["budget"] });
    },
  });

  const importMut = useMutation({ mutationFn: importGuests });
  const planMut = useMutation({ mutationFn: updateBudgetPlan });

  const progress = useMemo(() => (step / 3) * 100, [step]);

  async function finish(weddingId: string) {
    await markOnboardingCompleted(weddingId);
    void qc.invalidateQueries({ queryKey: ["wedding"] });
    void qc.invalidateQueries({ queryKey: ["guests"] });
    void qc.invalidateQueries({ queryKey: ["budget"] });
    void qc.invalidateQueries({ queryKey: ["insights"] });
    router.replace(href("/(app)/(couple)"));
  }

  async function onStep1Next() {
    setError(null);
    if (!date) {
      setError("Обери дату — хоча б орієнтовну");
      return;
    }
    if (!cityUndecided && !city.trim()) {
      setError("Місто або «ще не вирішили»");
      return;
    }
    try {
      const w = await saveWeddingMut.mutateAsync({
        date,
        city: cityUndecided ? "Ще вирішуємо" : city.trim(),
        guests: guestsUndecided ? 1 : Number(guestCount) || 1,
        budget: Number(budget) || 0,
        partnerOneName: partnerOne.trim() || user?.name || undefined,
        partnerTwoName: partnerTwo.trim() || undefined,
        cityUndecided,
        guestsUndecided,
      });
      void w;
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не збережено");
    }
  }

  async function onStep2Next() {
    setError(null);
    const w = weddingQ.data ?? (await getMyWedding());
    if (!w) {
      setError("Спочатку збережи дату");
      setStep(1);
      return;
    }
    try {
      await saveWeddingMut.mutateAsync({
        date: w.date.slice(0, 10),
        city: w.city,
        guests: guestsUndecided ? 1 : Number(guestCount) || 1,
        budget: w.budget || Number(budget) || 0,
        partnerOneName: partnerOne.trim() || w.partnerOneName,
        partnerTwoName: partnerTwo.trim() || w.partnerTwoName,
        cityUndecided: w.cityUndecided,
        guestsUndecided,
      });

      const names = guestNames
        .split(/\r?\n|,|;/)
        .map((n) => n.trim())
        .filter((n) => n.length >= 2);
      if (names.length) {
        await importMut.mutateAsync(names.map((name) => ({ name })));
        void qc.invalidateQueries({ queryKey: ["guests"] });
      }
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не збережено гостей");
    }
  }

  async function onStep3Finish() {
    setError(null);
    const w = weddingQ.data ?? (await getMyWedding());
    if (!w) {
      setError("Немає весілля");
      setStep(1);
      return;
    }
    const amount = Number(budget) || 0;
    try {
      await saveWeddingMut.mutateAsync({
        date: w.date.slice(0, 10),
        city: w.city,
        guests: w.guests || 1,
        budget: amount,
        partnerOneName: w.partnerOneName,
        partnerTwoName: w.partnerTwoName,
        cityUndecided: w.cityUndecided,
        guestsUndecided: w.guestsUndecided,
      });
      await planMut.mutateAsync(amount);

      const existing = new Set(
        (budgetQ.data?.items ?? []).map((i) => i.category),
      );
      if (seedCategories) {
        for (const slug of STARTER_CATEGORIES) {
          if (existing.has(slug)) continue;
          const label =
            BUDGET_CATEGORIES.find((c) => c.value === slug)?.label ?? slug;
          await createBudgetItem({
            category: slug,
            title: label,
            estimated: 0,
          });
        }
      }
      await finish(w.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не збережено бюджет");
    }
  }

  async function onSkip() {
    setError(null);
    if (step === 1) return;
    if (step === 2) {
      setStep(3);
      return;
    }
    const w = weddingQ.data;
    if (w) await finish(w.id);
    else router.replace(href("/(app)/(couple)"));
  }

  if (weddingQ.isLoading || checking) return <Loading />;

  const busy =
    saveWeddingMut.isPending ||
    importMut.isPending ||
    planMut.isPending;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <FormScroll contentContainerStyle={styles.pad}>
                <Text style={styles.brand}>fata</Text>
        <Text style={styles.kicker}>Крок {step} з 3</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>

        {step === 1 ? (
          <>
            <Text style={styles.title}>Коли гуляємо?</Text>
            <Text style={styles.sub}>
              Дата потрібна для чекліста й відліку — можна орієнтовну.
            </Text>
            <DateField label="Дата весілля" value={date} onChange={setDate} />
            <Input
              label="Імʼя партнера"
              value={partnerTwo}
              onChangeText={setPartnerTwo}
              placeholder="Андрій"
            />
            {partnerOne.trim() ? (
              <Text style={styles.hint}>Ти: {partnerOne.trim()}</Text>
            ) : null}
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
            {error ? <ErrorBox message={error} /> : null}
            <Button
              label="Далі — гості"
              loading={busy}
              onPress={() => void onStep1Next()}
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Text style={styles.title}>Хто вже точно буде?</Text>
            <Text style={styles.sub}>
              Додай кілька імен зараз — решту й запрошення можна пізніше.
            </Text>
            <Text style={styles.fieldLabel}>Орієнтовна кількість</Text>
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
                label="Гостей орієнтовно"
                keyboardType="number-pad"
                value={guestCount}
                onChangeText={setGuestCount}
              />
            ) : null}
            <Input
              label="Імена (по рядку або через кому)"
              value={guestNames}
              onChangeText={setGuestNames}
              multiline
              style={{ minHeight: 120, textAlignVertical: "top" }}
              placeholder={"Мама\nТато\nХрещені"}
            />
            {guestsQ.data?.stats.total ? (
              <Text style={styles.hint}>
                Уже в списку: {guestsQ.data.stats.total}
              </Text>
            ) : null}
            {error ? <ErrorBox message={error} /> : null}
            <Button
              label="Далі — бюджет"
              loading={busy}
              onPress={() => void onStep2Next()}
            />
            <Button
              label="Пропустити"
              variant="ghost"
              onPress={() => void onSkip()}
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Text style={styles.title}>Скільки плануєте?</Text>
            <Text style={styles.sub}>
              План можна змінити будь-коли. Базові категорії — щоб не
              стартувати з порожнього бюджету.
            </Text>
            <Input
              label="Бюджет, грн"
              keyboardType="number-pad"
              value={budget}
              onChangeText={setBudget}
            />
            <View style={styles.presets}>
              {BUDGET_PRESETS.map((n) => (
                <Pressable
                  key={n}
                  onPress={() => setBudget(String(n))}
                  style={[
                    styles.preset,
                    budget === String(n) && styles.presetOn,
                  ]}
                >
                  <Text
                    style={[
                      styles.presetText,
                      budget === String(n) && styles.presetTextOn,
                    ]}
                  >
                    {Math.round(n / 1000)}к
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              onPress={() => setSeedCategories((v) => !v)}
              style={styles.checkRow}
            >
              <Text style={styles.checkMark}>
                {seedCategories ? "✓" : "○"}
              </Text>
              <Text style={styles.checkLabel}>
                Додати базові категорії (локація, банкет, фото, одяг)
              </Text>
            </Pressable>
            {error ? <ErrorBox message={error} /> : null}
            <Button
              label="Готово — у кабінет"
              loading={busy}
              onPress={() => void onStep3Finish()}
            />
            <Button
              label="Пропустити"
              variant="ghost"
              onPress={() => void onSkip()}
            />
          </>
        ) : null}
      </FormScroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  pad: { padding: spacing.md, paddingBottom: 40 },
  brand: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
    color: colors.primary,
    marginBottom: 12,
  },
  kicker: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
    marginBottom: 8,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blush,
    overflow: "hidden",
    marginBottom: 24,
  },
  fill: { height: "100%", backgroundColor: colors.primary },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    color: colors.inkSoft,
    lineHeight: 22,
    marginBottom: 18,
  },
  fieldLabel: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
  },
  hint: { fontSize: 13, color: colors.inkMuted, marginBottom: 10 },
  presets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  preset: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.blush,
  },
  presetOn: { backgroundColor: colors.ink },
  presetText: { fontSize: 14, fontWeight: "700", color: colors.inkSoft },
  presetTextOn: { color: colors.white },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 18,
    paddingVertical: 4,
  },
  checkMark: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: "700",
    width: 22,
  },
  checkLabel: { flex: 1, fontSize: 15, color: colors.ink, lineHeight: 21 },
});
