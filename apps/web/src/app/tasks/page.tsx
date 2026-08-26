import type { Metadata } from "next";
import { DevTasksBoard } from "@/components/dev-tasks-board";

export const metadata: Metadata = {
  title: "Tasks",
  robots: { index: false, follow: false },
};

export default function TasksPage() {
  return <DevTasksBoard />;
}
