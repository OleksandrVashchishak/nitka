import type { Metadata } from "next";
import { PartnerInvitePage } from "@/components/partner-invite-page";
import { noIndexRobots } from "@/lib/site";

export const metadata: Metadata = {
  title: "Запрошення партнера",
  robots: noIndexRobots,
};

export default function Page() {
  return <PartnerInvitePage />;
}
