import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import {
  getVendorRequests,
  sendRequestMessage,
  updateVendorRequestStatus,
} from "@/lib/requests-api";
import type { RequestStatus } from "@/lib/types";
import { colors } from "@/theme";
import { ChipRow } from "@/ui/sheet";
import {
  Badge,
  Button,
  Card,
  ErrorBox,
  FormScroll,
  Input,
  Loading,
  Screen,
  Subtitle,
  Title,
} from "@/ui";

const STATUSES: RequestStatus[] = ["NEW", "CONTACTED", "DONE", "CLOSED"];

export default function VendorRequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [phone, setPhone] = useState("");
  const [msgError, setMsgError] = useState<string | null>(null);

  const listQuery = useQuery({
    queryKey: ["vendor-requests"],
    queryFn: getVendorRequests,
  });

  const request = useMemo(
    () => listQuery.data?.find((r) => r.id === id),
    [listQuery.data, id],
  );

  const statusMutation = useMutation({
    mutationFn: (status: RequestStatus) =>
      updateVendorRequestStatus(id!, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["vendor-requests"] });
      void qc.invalidateQueries({ queryKey: ["notifications"] });
      void qc.invalidateQueries({ queryKey: ["vendor-dashboard"] });
    },
  });

  const messageMutation = useMutation({
    mutationFn: () =>
      sendRequestMessage(id!, {
        body: body.trim(),
        phone: phone.trim() || undefined,
      }),
    onSuccess: () => {
      setBody("");
      setPhone("");
      setMsgError(null);
      void qc.invalidateQueries({ queryKey: ["vendor-requests"] });
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (e: Error) => setMsgError(e.message),
  });

  if (listQuery.isLoading) return <Loading />;

  if (listQuery.error) {
    return (
      <Screen>
        <ErrorBox message={(listQuery.error as Error).message} />
      </Screen>
    );
  }

  if (!request) {
    return (
      <Screen>
        <ErrorBox message="Заявку не знайдено" />
      </Screen>
    );
  }

  const closed = request.status === "CLOSED";
  const messages = [...(request.messages ?? [])].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <>
      <Stack.Screen options={{ title: request.user.name }} />
      <Screen style={styles.screen}>
        <FormScroll contentContainerStyle={styles.content}>
          <Title>{request.user.name}</Title>
          <Subtitle>{request.user.email}</Subtitle>

          <Card>
            <Text style={styles.meta}>
              {request.city} ·{" "}
              {new Date(request.eventDate).toLocaleDateString("uk-UA")}
            </Text>
            <Text style={styles.meta}>
              {request.guests} гостей · бюджет {request.budget} ₴
            </Text>
            <Text style={styles.message}>{request.message}</Text>
            <Badge label={statusUk(request.status)} />
          </Card>

          <Text style={styles.sectionTitle}>Статус</Text>
          <ChipRow
            options={STATUSES.map((s) => ({ id: s, label: statusUk(s) }))}
            value={request.status}
            onChange={(id) => statusMutation.mutate(id as RequestStatus)}
          />

          <Text style={styles.sectionTitle}>Переписка</Text>
          {messages.length ? (
            messages.map((m) => (
              <Card key={m.id}>
                <Text style={styles.msgAuthor}>
                  {m.author.name} · {m.authorRole}
                </Text>
                <Text style={styles.msgBody}>{m.body}</Text>
                {m.phone ? (
                  <Text
                    style={styles.phone}
                    onPress={() => void Linking.openURL(`tel:${m.phone}`)}
                  >
                    Тел: {m.phone}
                  </Text>
                ) : null}
                <Text style={styles.time}>
                  {new Date(m.createdAt).toLocaleString("uk-UA")}
                </Text>
              </Card>
            ))
          ) : (
            <Text style={styles.emptyMsg}>Повідомлень ще немає</Text>
          )}

          {closed ? (
            <Subtitle>Заявка закрита</Subtitle>
          ) : (
            <>
              <Input
                label="Нове повідомлення"
                multiline
                value={body}
                onChangeText={setBody}
                style={{ minHeight: 80, textAlignVertical: "top" }}
              />
              <Input
                label="Телефон (опційно)"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              {msgError ? <ErrorBox message={msgError} /> : null}
              <Button
                label="Надіслати"
                loading={messageMutation.isPending}
                disabled={!body.trim()}
                onPress={() => messageMutation.mutate()}
              />
            </>
          )}
        </FormScroll>
      </Screen>
    </>
  );
}

function statusUk(s: RequestStatus) {
  if (s === "NEW") return "Нова";
  if (s === "CONTACTED") return "В роботі";
  if (s === "DONE") return "Готово";
  if (s === "CLOSED") return "Закрита";
  return s;
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  content: { padding: 16, paddingBottom: 40 },
  meta: { fontSize: 14, color: colors.inkSoft, marginBottom: 4 },
  message: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },
  msgAuthor: { fontWeight: "600", color: colors.ink, marginBottom: 4 },
  msgBody: { color: colors.inkSoft, lineHeight: 20 },
  phone: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: colors.primaryDeep,
  },
  time: { marginTop: 6, fontSize: 11, color: colors.inkSoft },
  emptyMsg: { color: colors.inkSoft, marginBottom: 12 },
});
