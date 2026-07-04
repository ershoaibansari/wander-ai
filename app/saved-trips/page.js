import { AppShell } from "@/components/AppShell";
import { getDashboardData } from "@/lib/db";
import { TripList } from "@/components/Lists";
import { auth } from "@/session/auth";

export default async function SavedTripsPage() {
  const session = await auth();
  const data = await getDashboardData(session?.user?.id);
  return (
    <AppShell>
      <PageIntro title="Saved Trips" body="Your saved cultural trip ideas and Gemini recommendations." />
      <TripList trips={data.savedTrips} />
    </AppShell>
  );
}

function PageIntro({ title, body }) {
  return <section className="card mb-6 p-6"><p className="kicker">WanderAI</p><h1 className="page-title mt-3">{title}</h1><p className="muted mt-3">{body}</p></section>;
}
