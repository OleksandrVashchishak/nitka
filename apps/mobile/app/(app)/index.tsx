import { Redirect } from "expo-router";
import { useAuthStore } from "@/lib/auth-store";
import { href } from "@/lib/href";

export default function AppIndex() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Redirect href="/login" />;
  return <Redirect href={href("/(app)/(couple)")} />;
}
