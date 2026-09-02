import { Redirect, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getApiUrl } from "@/lib/api-url";
import { useAuthStore } from "@/lib/auth-store";
import { href } from "@/lib/href";
import { peekPendingPartnerInvite } from "@/lib/partner-invite-pending";
import { colors, fonts, radius } from "@/theme";

export default function LoginScreen() {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    if (user.role === "VENDOR") return <Redirect href={href("/(app)/(vendor)")} />;
    if (user.role === "ADMIN") return <Redirect href={href("/(app)/(admin)")} />;
    return <Redirect href={href("/(app)/(couple)")} />;
  }

  async function redirectAfterAuth() {
    const role = useAuthStore.getState().user?.role;
    if (role === "VENDOR") {
      router.replace(href("/(app)/(vendor)"));
      return;
    }
    if (role === "ADMIN") {
      router.replace(href("/(app)/(admin)"));
      return;
    }
    const pending = await peekPendingPartnerInvite();
    if (pending) {
      router.replace(href(`/partner-invite/${pending}`));
      return;
    }
    router.replace(href("/(app)/(couple)"));
  }

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      await redirectAfterAuth();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Не вдалося увійти";
      setError(
        msg.includes("зв") || msg.toLowerCase().includes("fetch")
          ? `${msg}\nAPI: ${getApiUrl()}`
          : msg,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.hero}>
                    <Text style={styles.brand}>fata</Text>
          <Text style={styles.subtitle}>Планування весілля в телефоні</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="you@email.com"
            placeholderTextColor={colors.inkMuted}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Пароль</Text>
          <TextInput
            autoComplete="password"
            placeholder="••••••••"
            placeholderTextColor={colors.inkMuted}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            disabled={loading || !email || !password}
            onPress={onSubmit}
            style={({ pressed }) => [
              styles.button,
              (loading || !email || !password) && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Увійти</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push("/register")}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>Немає акаунту? Зареєструватись</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.mist,
  },
  flex: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  hero: {
    marginBottom: 40,
  },
  brand: {
    fontFamily: fonts.displayBold,
    fontSize: 48,
    letterSpacing: 1,
    color: colors.primaryDeep,
  },
  subtitle: {
    marginTop: 10,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.inkSoft,
  },
  form: {
    gap: 8,
  },
  label: {
    marginTop: 8,
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.inkSoft,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
  },
  error: {
    marginTop: 8,
    fontFamily: fonts.sans,
    color: colors.danger,
    fontSize: 14,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    backgroundColor: colors.primaryDeep,
  },
  buttonText: {
    fontFamily: fonts.sansBold,
    color: colors.white,
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontFamily: fonts.sansSemi,
    color: colors.primary,
    fontSize: 14,
  },
});
