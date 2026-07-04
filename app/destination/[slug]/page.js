import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default async function DestinationDetailsPage({ params }) {
  const { slug } = await params;
  const destination = slug.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ");

  return (
    <AppShell>
      <section className="card p-6">
        <p className="kicker">Destination Details</p>
        <h1 className="page-title mt-3">{destination}</h1>
        <p className="muted mt-4 max-w-3xl text-lg">
          A culture-first destination hub with quick paths into hidden gems, etiquette, storytelling, phrases, food, events, and one-day plans.
        </p>
        <div className="mt-6 grid-auto">
          {[
            ["Discover hidden gems", "/discover"],
            ["Generate cultural story", "/story"],
            ["Build one-day itinerary", "/itinerary"],
            ["Open cultural passport", "/passport"],
          ].map(([label, href]) => (
            <Link className="surface p-5 text-xl font-black" href={href} key={label}>{label}</Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
