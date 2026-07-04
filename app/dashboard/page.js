import { AppShell } from "@/components/AppShell";
import { DashboardView } from "@/components/Dashboard";
import { getDashboardData } from "@/lib/db";
import { auth } from "@/session/auth";

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardData(session?.user?.id);

  return (
    <AppShell>
      <DashboardView data={data} />
    </AppShell>
  );
}
