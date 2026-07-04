import { AppShell } from "@/components/AppShell";
import { getDemoDashboard } from "@/components/Dashboard";
import { BadgeList } from "@/components/Lists";
import { auth } from "@/session/auth";

export default async function BadgesPage() {
  const session = await auth();
  const data = getDemoDashboard(session?.user?.id);
  return (
    <AppShell>
      <section className="card mb-6 p-6"><p className="kicker">Achievements</p><h1 className="page-title mt-3">Badges</h1><p className="muted mt-3">Rewards for cultural curiosity, quizzes, stamps, food exploration, and community contributions.</p></section>
      <BadgeList badgeIds={data.user.badges} />
    </AppShell>
  );
}
