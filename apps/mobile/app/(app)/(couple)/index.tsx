import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { daysUntil } from "@/lib/checklist-helpers";
import { useAuthStore } from "@/lib/auth-store";
import { getGuestList } from "@/lib/guests-api";
import { href } from "@/lib/href";
import { getNotificationsSummary } from "@/lib/misc-api";
import { isOnboardingCompleted } from "@/lib/onboarding";
import {
  getDashboardInsights,
  getMyWedding,
} from "@/lib/weddings-api";
import { colors, radius, spacing } from "@/theme";
import {
  Button,
  ErrorBox,
  ListGroup,
  ListRow,
  ScreenHeader,
  SkeletonScreen,
} from "@/ui";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("uk-UA");
  } catch {
    return iso;
  }
}

function money(n: number) {
  return `${Math.round(n).toLocaleString("uk-UA")} грн`;
}

export default function CoupleHomeScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const weddingQ = useQuery({ queryKey: ["wedding"], queryFn: getMyWedding });
  const insightsQ = useQuery({
    queryKey: ["insights"],
    queryFn: getDashboardInsights,
    enabled: !!weddingQ.data,
  });
  const guestsQ = useQuery({
    queryKey: ["guests"],
    queryFn: getGuestList,
    enabled: !!weddingQ.data,
  });
  const notifQ = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotificationsSummary,
  });

  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    const w = weddingQ.data;
    if (weddingQ.isLoading) return;
    if (!w) {
      setOnboardingDone(false);
      return;
    }
    void isOnboardingCompleted(w.id).then(setOnboardingDone);
  }, [weddingQ.data, weddingQ.isLoading]);

  async function onLogout() {
    await logout();
    router.replace("/login");
  }

  if (weddingQ.isLoading || onboardingDone === null) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <SkeletonScreen variant="home" />
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

  const wedding = weddingQ.data;
  const insights = insightsQ.data;
  const guestTotal = guestsQ.data?.stats.total ?? 0;
  const needsOnboarding =
    !wedding ||
    (!onboardingDone && guestTotal === 0);

  if (needsOnboarding) {
    return <Redirect href={href("/(app)/(couple)/onboarding")} />;
  }

  if (!wedding) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <SkeletonScreen variant="home" />
      </SafeAreaView>
    );
  }

  const refreshing =
    (weddingQ.isRefetching ||
      insightsQ.isRefetching ||
      guestsQ.isRefetching ||
      notifQ.isRefetching) &&
    !weddingQ.isLoading;

  async function onRefresh() {
    await Promise.all([
      weddingQ.refetch(),
      insightsQ.refetch(),
      guestsQ.refetch(),
      notifQ.refetch(),
    ]);
  }

  const notif = notifQ.data;
  const days = daysUntil(wedding.date);
  const rawProg = insights?.plan.progress ?? 0;
  const planPct = Math.round(rawProg > 1 ? rawProg : rawProg * 100);

  const starterSteps = [
    {
      id: "guests",
      done: guestTotal > 0,
      icon: "👥",
      title: "Додай гостей",
      subtitle: guestTotal > 0 ? `${guestTotal} у списку` : "Хоча б близьких",
      href: "/(app)/(couple)/guests",
    },
    {
      id: "budget",
      done: (insights?.budget.total ?? 0) > 0,
      icon: "💰",
      title: "Задай бюджет",
      subtitle:
        (insights?.budget.total ?? 0) > 0
          ? money(insights!.budget.total)
          : "План на весілля",
      href: "/(app)/(couple)/budget",
    },
    {
      id: "checklist",
      done: (insights?.plan.done ?? 0) > 0,
      icon: "✅",
      title: "Відзнач чекліст",
      subtitle:
        (insights?.plan.done ?? 0) > 0
          ? `${insights!.plan.done} готово`
          : "Перші задачі",
      href: "/(app)/(couple)/checklist",
    },
  ];
  const showStarter = starterSteps.some((s) => !s.done);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.pad}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh()}
            tintColor={colors.primary}
          />
        }
      >
        <ScreenHeader
          title={`${wedding.partnerOneName} & ${wedding.partnerTwoName}`}
          subtitle={`${formatDate(wedding.date)} · ${
            wedding.cityUndecided ? "місто ще вирішуємо" : wedding.city
          }${wedding.guestsUndecided ? " · гості TBD" : ""}`}
        />

        {days != null && days >= 0 ? (
          <View style={styles.countdown}>
            <Text style={styles.countNum}>{days}</Text>
            <View>
              <Text style={styles.countLabel}>днів до весілля</Text>
              <Text style={styles.countHint}>ти на правильному шляху</Text>
            </View>
          </View>
        ) : null}

        {showStarter ? (
          <ListGroup header="Далі по плану">
            {starterSteps.map((s, i) => (
              <ListRow
                key={s.id}
                icon={s.done ? "✓" : s.icon}
                title={s.title}
                subtitle={s.subtitle}
                onPress={() => router.push(href(s.href))}
                last={i === starterSteps.length - 1}
              />
            ))}
          </ListGroup>
        ) : null}

        {insights ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.metrics}
          >
            <Metric
              label="Чекліст"
              value={`${planPct}%`}
              hint={`${insights.plan.done}/${insights.plan.total}`}
              onPress={() => router.push(href("/(app)/(couple)/checklist"))}
            />
            <Metric
              label="Так"
              value={insights.rsvp.yes}
              hint={`чекає ${insights.rsvp.pending}`}
              onPress={() => router.push(href("/(app)/(couple)/guests"))}
            />
            <Metric
              label="Залишок"
              value={
                insights.budget.total
                  ? `${Math.round(insights.budget.remaining / 1000)}к`
                  : "—"
              }
              hint={money(insights.budget.total)}
              onPress={() => router.push(href("/(app)/(couple)/budget"))}
            />
          </ScrollView>
        ) : null}

        {insights ? (
          <ListGroup header="Прогрес">
            <ListRow
              title="Чекліст"
              subtitle={`${insights.plan.done} з ${insights.plan.total} · ${planPct}%`}
              right={<ProgressRing pct={planPct} />}
              onPress={() => router.push(href("/(app)/(couple)/checklist"))}
            />
            <ListRow
              title="Запрошення"
              subtitle={`Так ${insights.rsvp.yes} · Може ${insights.rsvp.maybe} · Ні ${insights.rsvp.no} · Чекає ${insights.rsvp.pending}`}
              onPress={() => router.push(href("/(app)/(couple)/guests"))}
            />
            <ListRow
              title="Бюджет"
              subtitle={`Залишок ${money(insights.budget.remaining)}`}
              onPress={() => router.push(href("/(app)/(couple)/budget"))}
              last
            />
          </ListGroup>
        ) : null}

        {(() => {
          const coupleNotifs = (notif?.items ?? []).filter(
            (item) =>
              !item.key.toLowerCase().includes("vendor") &&
              !item.key.toLowerCase().includes("request") &&
              !item.label.toLowerCase().includes("вендор") &&
              !item.label.toLowerCase().includes("запит"),
          );
          if (!coupleNotifs.length) return null;
          return (
            <ListGroup header="Сповіщення">
              {coupleNotifs.map((item, i) => (
                <ListRow
                  key={item.key}
                  icon="🔔"
                  title={item.label}
                  right={
                    item.count ? (
                      <Text style={styles.metricHint}>{item.count}</Text>
                    ) : undefined
                  }
                  last={i === coupleNotifs.length - 1}
                  onPress={() => {
                    if (item.href?.includes("guest")) {
                      router.push(href("/(app)/(couple)/guests"));
                    } else if (item.href?.includes("budget")) {
                      router.push(href("/(app)/(couple)/budget"));
                    } else if (item.href?.includes("checklist")) {
                      router.push(href("/(app)/(couple)/checklist"));
                    }
                  }}
                />
              ))}
            </ListGroup>
          );
        })()}

        <ListGroup header="Ще">
          <ListRow
            icon="📅"
            title="План дня"
            onPress={() => router.push(href("/(app)/(couple)/day-plan"))}
          />
          <ListRow
            icon="🪑"
            title="Розсадка"
            subtitle="Столи та місця"
            onPress={() => router.push(href("/(app)/(couple)/seating"))}
          />
          <ListRow
            icon="🌐"
            title="Весільний сайт"
            subtitle="Лінк для гостей"
            onPress={() => router.push(href("/(app)/(couple)/website"))}
          />
          <ListRow
            icon="✉️"
            title="Запрошення"
            subtitle="Дизайн для гостей"
            onPress={() => router.push(href("/(app)/(couple)/invitations"))}
          />
          <ListRow
            icon="💍"
            title="Весілля"
            subtitle="Дата, місто, гості"
            onPress={() => router.push(href("/(app)/(couple)/wedding"))}
          />
          <ListRow
            icon="⚙️"
            title="Усі налаштування"
            onPress={() => router.push(href("/(app)/(couple)/more"))}
            last
          />
        </ListGroup>

        <Button label="Вийти" variant="ghost" onPress={onLogout} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({
  label,
  value,
  hint,
  onPress,
}: {
  label: string;
  value: string | number;
  hint?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.metric, pressed && styles.metricPressed]}
    >
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      {hint ? <Text style={styles.metricHint}>{hint}</Text> : null}
    </Pressable>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  return (
    <View style={styles.ring}>
      <View style={styles.ringTrack}>
        <View style={[styles.ringFill, { width: `${Math.min(100, pct)}%` }]} />
      </View>
      <Text style={styles.ringText}>{pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  pad: { paddingHorizontal: spacing.md, paddingBottom: 40 },
  countdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 20,
  },
  countNum: {
    fontSize: 44,
    fontWeight: "800",
    color: colors.primaryDeep,
    letterSpacing: -1,
  },
  countLabel: { fontSize: 17, fontWeight: "700", color: colors.ink },
  countHint: { fontSize: 13, color: colors.inkSoft, marginTop: 2 },
  metrics: { gap: 10, paddingBottom: 8, paddingRight: 8 },
  metric: {
    width: 132,
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    padding: 14,
  },
  metricPressed: { opacity: 0.7 },
  metricLabel: { fontSize: 12, color: colors.inkSoft, fontWeight: "600" },
  metricValue: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  metricHint: { fontSize: 12, color: colors.inkMuted, marginTop: 2 },
  ring: { alignItems: "flex-end", minWidth: 64 },
  ringTrack: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.blush,
    overflow: "hidden",
    marginBottom: 4,
  },
  ringFill: { height: "100%", backgroundColor: colors.primary },
  ringText: { fontSize: 12, fontWeight: "700", color: colors.inkSoft },
});
