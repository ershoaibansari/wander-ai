import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { getDashboardData } from "@/lib/db";
import { BadgeList, PassportList, TripList } from "@/components/Lists";
import { SignOutButton } from "@/components/ExitDemoButton";
import { auth } from "@/session/auth";

export default async function ProfilePage() {
  const session = await auth();
  const data = await getDashboardData(session?.user?.id);
  const user = data.user;

  return (
    <AppShell>
      <section className="card p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <Image src={user.avatar} alt={`${user.name} profile photo`} width={110} height={110} className="rounded-full" />
            <div>
              <p className="kicker">Traveler profile</p>
              <h1 className="page-title mt-2">{user.name}</h1>
              <p className="muted mt-2">{user.country} · {user.role}</p>
              <p className="mt-3 max-w-2xl">{user.description}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <SignOutButton />
          </div>
        </div>
      </section>
      <section className="mt-6 grid-auto">
        <article className="surface p-5"><h2 className="font-black">Travel style</h2><p className="muted mt-2">{user.travelStyle}</p></article>
        <article className="surface p-5"><h2 className="font-black">Interests</h2><p className="muted mt-2">{user.interests.join(", ")}</p></article>
        <article className="surface p-5"><h2 className="font-black">Budget preference</h2><p className="muted mt-2">{user.budget}</p></article>
      </section>
      <section className="mt-8"><h2 className="section-title mb-4">Saved trips</h2><TripList trips={data.savedTrips} /></section>
      <section className="mt-8"><h2 className="section-title mb-4">Passport stamps</h2><PassportList stamps={data.passport} /></section>
      <section className="mt-8"><h2 className="section-title mb-4">Badges</h2><BadgeList badgeIds={user.badges || data.badges} /></section>
    </AppShell>
  );
}
