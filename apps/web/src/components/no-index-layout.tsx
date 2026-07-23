import type { Metadata } from "next";
import { noIndexRobots } from "@/lib/site";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
