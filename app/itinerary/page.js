import dynamic from "next/dynamic";
import { AppShell } from "@/components/AppShell";

const ItineraryTool = dynamic(
  () => import("@/components/AiTools").then((mod) => mod.ItineraryTool)
);

export default function ItineraryPage() {
  return (
    <AppShell>
      <ItineraryTool />
    </AppShell>
  );
}
