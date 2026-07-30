import { Redirect } from "expo-router";
import { useAuthStore } from "@/lib/auth-store";
import { href } from "@/lib/href";

export default function AppIndex() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Redirect href="/login" />;
  if (user.role === "VENDOR") return <Redirect href={href("/(app)/(vendor)")} />;
  if (user.role === "ADMIN") return <Redirect href={href("/(app)/(admin)")} />;
  return <Redirect href={href("/(app)/(couple)")} />;
}
