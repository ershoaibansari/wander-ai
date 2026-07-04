import { AppShell } from "@/components/AppShell";
import { DashboardView, getDemoDashboard } from "@/components/Dashboard";
import { auth } from "@/session/auth";

export default async function DashboardPage() {
  const session = await auth();
  const data = getDemoDashboard(session?.user?.id);

  return (
    <AppShell>
      <DashboardView data={data} />
    </AppShell>
  );
}
