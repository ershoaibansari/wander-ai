import { AppShell } from "@/components/AppShell";
import { getDemoDashboard } from "@/components/Dashboard";
import { PassportList } from "@/components/Lists";
import { auth } from "@/session/auth";

export default async function PassportPage() {
  const session = await auth();
  const data = getDemoDashboard(session?.user?.id);
  return (
    <AppShell>
      <section className="card mb-6 p-6"><p className="kicker">AI Cultural Passport</p><h1 className="page-title mt-3">Passport</h1><p className="muted mt-3">Visited destinations, quiz results, saved cultural experiences, and stamps earned through exploration.</p></section>
      <PassportList stamps={data.passport} />
    </AppShell>
  );
}
