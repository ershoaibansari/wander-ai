import dynamic from "next/dynamic";
import { AppShell } from "@/components/AppShell";

const StoryTool = dynamic(
  () => import("@/components/AiTools").then((mod) => mod.StoryTool)
);

export default function StoryPage() {
  return (
    <AppShell>
      <StoryTool />
    </AppShell>
  );
}
