import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Linking } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { href } from "@/lib/href";
import { getMyRequests, sendRequestMessage } from "@/lib/requests-api";
import type { CoupleRequest, RequestStatus } from "@/lib/types";
import { colors } from "@/theme";
import {
  Badge,
  Button,
  Card,
  Empty,
  ErrorBox,
  FormScroll,
  Input,
  Loading,
  Subtitle,
  Title,
} from "@/ui";

function statusLabel(s: string) {
  if (s === "NEW") return "Новий";
  if (s === "CONTACTED") return "На звʼязку";
  if (s === "DONE") return "Готово";
  return "Закрито";
}

function statusTone(s: string): "ok" | "warn" | "muted" | "sage" {
  if (s === "DONE") return "ok";
  if (s === "CONTACTED") return "sage";
  if (s === "NEW") return "warn";
  return "muted";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("uk-UA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Timeline({ item }: { item: CoupleRequest }) {
  const vendorReply = item.messages.find((m) => m.authorRole === "VENDOR");
  const steps = [
    {
      key: "sent",
      label: "Надіслано",
      done: true,
      at: item.createdAt,
      hint: "Заявку отримав підрядник",
    },
    {
      key: "replied",
      label: "Підрядник відповів",
      done: Boolean(vendorReply) || item.status !== "NEW",
      at:
        vendorReply?.createdAt ??
        (item.status !== "NEW" ? item.updatedAt : null),
      hint: "Чекаємо текст і контакт",
    },
    {
      key: "done",
      label: item.status === "CLOSED" ? "Закрито" : "Домовлено",
      done: item.status === "DONE" || item.status === "CLOSED",
      at:
        item.status === "DONE" || item.status === "CLOSED"
          ? item.updatedAt
          : null,
      hint:
        item.status === "CLOSED"
          ? "Заявку закрито"
          : "Фінальний статус",
    },
  ];

  return (
    <View style={tlStyles.wrap}>
      {steps.map((step, i) => (
        <View key={step.key} style={tlStyles.row}>
          <View style={tlStyles.dotCol}>
            <View
              style={[tlStyles.dot, step.done && tlStyles.dotDone]}
            />
            {i < steps.length - 1 ? (
              <View
                style={[
                  tlStyles.line,
                  step.done && tlStyles.lineDone,
                ]}
              />
            ) : null}
          </View>
          <View style={tlStyles.textCol}>
            <Text
              style={[
                tlStyles.label,
                step.done && tlStyles.labelDone,
              ]}
            >
              {step.label}
            </Text>
            <Text style={tlStyles.hint}>
              {step.at ? formatDate(step.at) : step.hint}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const tlStyles = StyleSheet.create({
  wrap: { marginVertical: 10 },
  row: { flexDirection: "row", minHeight: 40 },
  dotCol: { width: 20, alignItems: "center" },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    marginTop: 3,
  },
  dotDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.line,
    marginVertical: 2,
  },
  lineDone: { backgroundColor: colors.primary },
  textCol: { flex: 1, paddingLeft: 8, paddingBottom: 8 },
  label: { fontSize: 14, color: colors.inkSoft },
  labelDone: { fontWeight: "600", color: colors.ink },
  hint: { fontSize: 12, color: colors.inkSoft, marginTop: 2 },
});

export default function RequestThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [body, setBody] = useState("");

  const q = useQuery({
    queryKey: ["requests"],
    queryFn: getMyRequests,
  });

  const sendMut = useMutation({
    mutationFn: (text: string) => sendRequestMessage(id!, { body: text }),
    onSuccess: () => {
      setBody("");
      void qc.invalidateQueries({ queryKey: ["requests"] });
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (q.isLoading) return <Loading />;
  if (q.isError) {
    return (
      <View style={styles.safe}>
        <ErrorBox
          message={q.error instanceof Error ? q.error.message : "Помилка"}
        />
      </View>
    );
  }

  const request = (q.data ?? []).find((r) => r.id === id);
  if (!request) {
    return (
      <View style={styles.safe}>
        <Empty title="Запит не знайдено" />
      </View>
    );
  }

  const closed = request.status === "CLOSED";
  const messages = [...request.messages].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <View style={styles.safe}>
      <FormScroll contentContainerStyle={styles.pad}>
        <Title>{request.vendor.name}</Title>
        <Subtitle>
          {request.city} · {request.eventDate.slice(0, 10)}
        </Subtitle>
        <Badge
          label={statusLabel(request.status)}
          tone={statusTone(request.status)}
        />

        <Card>
          <Text style={styles.meta}>
            {request.guests} гостей · бюджет {request.budget} ₴
          </Text>
          <Text style={styles.summary}>{request.message}</Text>
          {request.vendor.slug ? (
            <Button
              label="Профіль підрядника"
              variant="ghost"
              onPress={() =>
                router.push(href(`/vendors/${request.vendor.slug}`))
              }
            />
          ) : null}
        </Card>

        <Timeline item={request} />

        <Text style={styles.section}>Переписка</Text>
        {messages.length === 0 ? (
          <Empty title="Поки без повідомлень" hint="Напиши першим" />
        ) : (
          messages.map((m) => (
            <Card key={m.id}>
              <Text style={styles.author}>
                {m.author.name} · {m.authorRole}
              </Text>
              <Text style={styles.body}>{m.body}</Text>
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
        )}

        {closed ? (
          <Subtitle>Запит закрито — писати не можна</Subtitle>
        ) : (
          <>
            <Input
              label="Повідомлення"
              value={body}
              onChangeText={setBody}
              multiline
            />
            <Button
              label="Надіслати"
              loading={sendMut.isPending}
              disabled={!body.trim()}
              onPress={() => sendMut.mutate(body.trim())}
            />
          </>
        )}
        {sendMut.isError ? (
          <ErrorBox
            message={
              sendMut.error instanceof Error
                ? sendMut.error.message
                : "Не вдалося надіслати"
            }
          />
        ) : null}
        <View style={{ height: 24 }} />
      </FormScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  pad: { padding: 16, paddingBottom: 32 },
  meta: { fontSize: 13, color: colors.inkSoft, marginBottom: 6 },
  summary: { fontSize: 15, lineHeight: 21, color: colors.ink },
  section: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },
  author: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primaryDeep,
    marginBottom: 4,
  },
  body: { fontSize: 15, color: colors.ink },
  phone: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: colors.primaryDeep,
  },
  time: { marginTop: 6, fontSize: 11, color: colors.inkSoft },
});
