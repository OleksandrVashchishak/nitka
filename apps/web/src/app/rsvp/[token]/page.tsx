import { notFound } from "next/navigation";
import { PublicRsvpForm } from "@/components/public-rsvp-form";
import { getPublicInvite } from "@/lib/guests-api";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function RsvpPage({ params }: Props) {
  const { token } = await params;
  let invite;
  try {
    invite = await getPublicInvite(token);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <PublicRsvpForm invite={invite} />
    </main>
  );
}
