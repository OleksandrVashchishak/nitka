import { Redirect, router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { checkEmailAvailable } from "@/lib/auth-api";
import { useAuthStore } from "@/lib/auth-store";
import { href } from "@/lib/href";
import { peekPendingPartnerInvite } from "@/lib/partner-invite-pending";
import { colors } from "@/theme";
import { Button, ErrorBox, Input, Title } from "@/ui";

export default function RegisterScreen() {
  const user = useAuthStore((s) => s.user);
  const register = useAuthStore((s) => s.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailHint, setEmailHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEmailChange = useCallback((value: string) => {
    setEmail(value);
    setEmailHint(null);
    if (emailTimer.current) clearTimeout(emailTimer.current);
    const trimmed = value.trim();
    if (!trimmed || !trimmed.includes("@")) return;
    emailTimer.current = setTimeout(async () => {
      try {
        const { available } = await checkEmailAvailable(trimmed);
        if (!available) setEmailHint("Цей email вже зайнятий");
      } catch {
        /* ignore */
      }
    }, 600);
  }, []);

  if (user) {
    if (user.role === "VENDOR") return <Redirect href={href("/(app)/(vendor)")} />;
    if (user.role === "ADMIN") return <Redirect href={href("/(app)/(admin)")} />;
    return <Redirect href={href("/(app)/(couple)")} />;
  }

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role: "COUPLE",
      });
      const pending = await peekPendingPartnerInvite();
      if (pending) {
        router.replace(href(`/partner-invite/${pending}`));
        return;
      }
      router.replace(href("/(app)/(couple)"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не вдалося зареєструватись");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = name.trim() && email.trim() && password.length >= 6;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.brand}>NITKA</Text>
          <Title>Реєстрація</Title>
          <Text style={styles.hint}>Кабінет для пари — дата, гості, бюджет</Text>

          <Input
            label="Твоє імʼя"
            value={name}
            onChangeText={setName}
            placeholder="Марія"
            autoComplete="name"
          />
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={onEmailChange}
          />
          {emailHint ? (
            <Text style={styles.emailWarn}>{emailHint}</Text>
          ) : null}
          <Input
            label="Пароль"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <ErrorBox message={error} /> : null}

          <Button
            label="Створити акаунт"
            onPress={onSubmit}
            loading={loading}
            disabled={!canSubmit}
          />

          <Pressable onPress={() => router.push("/login")} style={styles.link}>
            <Text style={styles.linkText}>Вже є акаунт? Увійти</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  flex: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  brand: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 2,
    color: colors.primaryDeep,
    marginBottom: 12,
  },
  hint: { color: colors.inkSoft, marginBottom: 16 },
  emailWarn: { color: "#c45", fontSize: 13, marginTop: -4, marginBottom: 4 },
  link: { marginTop: 20, alignItems: "center" },
  linkText: { color: colors.primary, fontWeight: "600" },
});
