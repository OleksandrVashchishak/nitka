import { AdminContentEditor } from "@/components/admin-content-editor";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminContentEditPage({ params }: Props) {
  const { id } = await params;
  return <AdminContentEditor postId={id} />;
}
