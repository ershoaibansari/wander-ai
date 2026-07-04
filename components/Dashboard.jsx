import Link from "next/link";
import { BADGE_CATALOG } from "@/lib/constants";
import { DEMO_USERS, getDemoCommunityPosts } from "@/lib/demo-data";
import { formatDate, passportProgress } from "@/lib/utils";

export function getDemoDashboard(userId = "demo-emily") {
  const user = DEMO_USERS.find((item) => item.id === userId) || DEMO_USERS[1];
  return {
    user,
    savedTrips: user.savedTrips,
    tripHistory: user.tripHistory,
    passport: user.passportStamps,
    badges: user.badges.map((badgeId) => BADGE_CATALOG[badgeId]).filter(Boolean),
    quizResults: user.quizResults,
    communityPosts: getDemoCommunityPosts(),
  };
}

export function StatCard({ label, value, detail }) {
  return (
    <article className="surface p-6">
      <p className="muted text-sm font-bold">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      <p className="muted mt-1 text-sm">{detail}</p>
    </article>
  );
}

export function DashboardView({ data }) {
  const progress = passportProgress(data.passport.length);
  return (
    <div className="space-y-10">
      <section className="card grid gap-10 p-8 md:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="kicker">WanderAI dashboard</p>
          <h1 className="page-title mt-3">Welcome, {data.user.name}</h1>
          <p className="muted mt-5 max-w-2xl text-lg leading-8">
            Plan with hidden gems, cultural etiquette, local stories, food rituals, festivals, phrases, and a passport that grows with every place you explore.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link className="btn btn-primary" href="/discover">Start discovering</Link>
            <Link className="btn btn-secondary" href="/itinerary">Build itinerary</Link>
          </div>
        </div>
        <div className="surface p-7">
          <p className="font-black">Hidden Gem of the Day</p>
          <h2 className="mt-3 text-2xl font-black">Gion side-lane tea rooms</h2>
          <p className="muted mt-3 leading-7">In Kyoto, step one lane away from the lantern crowds and look for tiny noren curtains. The best stories often start behind the quietest doors.</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard cards">
        <StatCard label="Saved trips" value={data.savedTrips.length} detail="Curated cultural plans" />
        <StatCard label="Passport progress" value={`${progress}%`} detail={`${data.passport.length} stamps collected`} />
        <StatCard label="Culture quiz" value={`${data.quizResults[0]?.score || 0}/5`} detail="Latest score" />
        <StatCard label="Community feed" value={data.communityPosts.length} detail="Stories from travelers" />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <Panel title="Trending destinations">
          {["Kyoto cultural lanes", "Hanoi street-food mornings", "Nepal foothill villages"].map((item) => (
            <li key={item} className="surface p-3 font-bold">{item}</li>
          ))}
        </Panel>
        <Panel title="Today&apos;s Cultural Story">
          <li className="surface p-4">
            <p className="font-bold">The bowl turned twice</p>
            <p className="muted mt-2">A Kyoto tea master teaches that etiquette is not performance. It is a way of noticing who made space for you.</p>
          </li>
        </Panel>
        <Panel title="Upcoming festivals">
          {["Gion Matsuri evening floats", "Montmartre harvest weekend", "Bangkok riverside food fair"].map((item) => (
            <li key={item} className="surface p-3 font-bold">{item}</li>
          ))}
        </Panel>
        <Panel title="Recent searches">
          {data.savedTrips.map((trip) => (
            <li key={trip.id} className="surface p-3">
              <p className="font-bold">{trip.destination}</p>
              <p className="muted text-sm">{formatDate(trip.createdAt)}</p>
            </li>
          ))}
        </Panel>
      </section>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="card p-7">
      <h2 className="section-title">{title}</h2>
      <ul className="mt-4 space-y-3">{children}</ul>
    </section>
  );
}
