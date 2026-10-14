import { AdminUserDetailPage } from "@/components/admin-user-detail-page";

export default async function AdminUserDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminUserDetailPage userId={id} />;
}
