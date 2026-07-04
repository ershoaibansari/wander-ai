import { AppShell } from "@/components/AppShell";
import { getDemoDashboard } from "@/components/Dashboard";
import { HistoryList } from "@/components/Lists";
import { auth } from "@/session/auth";

export default async function TripHistoryPage() {
  const session = await auth();
  const data = getDemoDashboard(session?.user?.id);
  return (
    <AppShell>
      <section className="card mb-6 p-6"><p className="kicker">WanderAI</p><h1 className="page-title mt-3">Trip History</h1><p className="muted mt-3">Places visited, lessons learned, and story highlights.</p></section>
      <HistoryList trips={data.tripHistory} />
    </AppShell>
  );
}
