import * as Haptics from "expo-haptics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import {
  getPublicInvite,
  submitPublicRsvp,
} from "@/lib/guests-api";
import { normalizeInvitationContent } from "@/lib/invitations-api";
import type { RsvpStatus } from "@/lib/types";
import { colors } from "@/theme";
import { InvitationCard } from "@/ui/invitation-card";
import { RsvpCelebration } from "@/ui/rsvp-celebration";
import {
  Button,
  Card,
  ErrorBox,
  FormScroll,
  Input,
  Screen,
  SkeletonScreen,
  Subtitle,
  Title,
} from "@/ui";

const OPTIONS: Array<{ status: Exclude<RsvpStatus, "PENDING">; label: string }> =
  [
    { status: "YES", label: "Так, буду" },
    { status: "MAYBE", label: "Можливо" },
    { status: "NO", label: "Не зможу" },
  ];

export default function PublicRsvpScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const qc = useQueryClient();

  const inviteQuery = useQuery({
    queryKey: ["public-invite", token],
    queryFn: () => getPublicInvite(token!),
    enabled: !!token,
  });

  const invite = inviteQuery.data;
  const [done, setDone] = useState(false);
  const [savedStatus, setSavedStatus] = useState<RsvpStatus>("PENDING");
  const [rsvpStatus, setRsvpStatus] =
    useState<Exclude<RsvpStatus, "PENDING">>("YES");
  const [plusOneAttending, setPlusOneAttending] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [prefilled, setPrefilled] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (!invite || prefilled) return;
    setRsvpStatus(
      invite.rsvpStatus === "PENDING" ? "YES" : invite.rsvpStatus,
    );
    setPlusOneAttending(invite.plusOneAttending === true);
    setPlusOneName(invite.plusOneName ?? "");
    setAllergies(invite.allergies ?? "");
    setNotes(invite.notes ?? "");
    setDone(invite.rsvpStatus !== "PENDING");
    setSavedStatus(invite.rsvpStatus);
    setPrefilled(true);
  }, [invite, prefilled]);

  const mutation = useMutation({
    mutationFn: () =>
      submitPublicRsvp(token!, {
        rsvpStatus,
        plusOneAttending: invite?.plusOne ? plusOneAttending : undefined,
        plusOneName: invite?.plusOne ? plusOneName.trim() || undefined : undefined,
        allergies: allergies.trim() || undefined,
        notes: notes.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      }),
    onSuccess: (res) => {
      setSavedStatus(res.rsvpStatus);
      setDone(true);
      void qc.invalidateQueries({ queryKey: ["public-invite", token] });
      if (rsvpStatus === "YES") {
        if (Platform.OS !== "web") {
          void Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          );
        }
        setCelebrate(true);
      } else if (Platform.OS !== "web") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
  });

  if (inviteQuery.isLoading) {
    return (
      <Screen>
        <SkeletonScreen variant="detail" />
      </Screen>
    );
  }

  if (inviteQuery.error || !invite) {
    return (
      <Screen>
        <ErrorBox
          message={
            (inviteQuery.error as Error)?.message || "Запрошення недійсне"
          }
        />
      </Screen>
    );
  }

  const design = invite.invitation;

  return (
    <Screen style={styles.screen}>
      <RsvpCelebration active={celebrate} onDone={() => setCelebrate(false)} />
      <FormScroll contentContainerStyle={styles.content}>
        {design ? (
          <InvitationCard
            templateId={design.templateId}
            content={normalizeInvitationContent(design.content)}
            guestName={invite.name}
            compact
          />
        ) : (
          <>
            <Title>{invite.wedding.coupleName}</Title>
            <Subtitle>
              Привіт, {invite.name}
              {invite.wedding.city ? ` · ${invite.wedding.city}` : ""}
              {invite.wedding.date
                ? ` · ${new Date(invite.wedding.date).toLocaleDateString("uk-UA")}`
                : ""}
            </Subtitle>
          </>
        )}

        <Card>
          {done ? (
            <View>
              <Text style={styles.ok}>Дякуємо! Відповідь збережено.</Text>
              <Text style={styles.current}>
                {savedStatus === "YES"
                  ? "Чекаємо на тебе."
                  : savedStatus === "NO"
                    ? "Шкода, що не вийде."
                    : "Тримаємо місце, поки думаєш."}
              </Text>
              <Button
                label="Змінити відповідь"
                variant="ghost"
                onPress={() => setDone(false)}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.label}>Твоя відповідь</Text>
              <View style={styles.actions}>
                {OPTIONS.map((o) => (
                  <Pressable
                    key={o.status}
                    onPress={() => setRsvpStatus(o.status)}
                    style={[
                      styles.choice,
                      rsvpStatus === o.status && styles.choiceOn,
                    ]}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        rsvpStatus === o.status && styles.choiceTextOn,
                      ]}
                    >
                      {o.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {invite.plusOne ? (
                <View style={styles.plusBlock}>
                  <Text style={styles.label}>Plus-one</Text>
                  <Button
                    label={
                      plusOneAttending
                        ? "Буде з супутником/цею"
                        : "Без супутника"
                    }
                    variant="ghost"
                    onPress={() => setPlusOneAttending((v) => !v)}
                  />
                  {plusOneAttending ? (
                    <Input
                      label="Імʼя +1"
                      value={plusOneName}
                      onChangeText={setPlusOneName}
                    />
                  ) : null}
                </View>
              ) : null}

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Input
                label="Телефон"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <Input
                label="Алергії / харчування"
                value={allergies}
                onChangeText={setAllergies}
              />
              <Input
                label="Коментар"
                value={notes}
                onChangeText={setNotes}
                multiline
              />

              {mutation.isError ? (
                <ErrorBox
                  message={
                    mutation.error instanceof Error
                      ? mutation.error.message
                      : "Помилка"
                  }
                />
              ) : null}

              <Button
                label="Надіслати"
                loading={mutation.isPending}
                onPress={() => mutation.mutate()}
              />
            </View>
          )}
        </Card>
      </FormScroll>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkMuted,
    marginBottom: 8,
  },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  choice: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  choiceOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  choiceText: { color: colors.ink, fontWeight: "600", fontSize: 14 },
  choiceTextOn: { color: "#fff" },
  plusBlock: { marginBottom: 8 },
  ok: { fontSize: 16, fontWeight: "700", color: colors.ink, marginBottom: 6 },
  current: { color: colors.inkMuted, marginBottom: 12, lineHeight: 20 },
});
