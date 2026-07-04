import Link from "next/link";
import { BADGE_CATALOG } from "@/lib/constants";
import { formatDate, slugify } from "@/lib/utils";

export function EmptyState({ title, body, actionHref, actionLabel }) {
  return (
    <section className="surface p-6 text-center">
      <h2 className="section-title">{title}</h2>
      <p className="muted mx-auto mt-2 max-w-xl">{body}</p>
      {actionHref && <Link className="btn btn-primary mt-5" href={actionHref}>{actionLabel}</Link>}
    </section>
  );
}

export function TripList({ trips }) {
  if (!trips?.length) {
    return <EmptyState title="No saved trips yet" body="Ask Gemini for a destination discovery, then save the ideas that feel like you." actionHref="/discover" actionLabel="Discover places" />;
  }
  return (
    <div className="grid-auto">
      {trips.map((trip) => (
        <article key={trip.id} className="surface p-5">
          <h2 className="text-xl font-black">{trip.destination}</h2>
          <p className="muted mt-2">{trip.summary || trip.highlight}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(trip.tags || []).map((tag) => <span className="brand-chip" key={tag}>{tag}</span>)}
          </div>
          <Link className="btn btn-secondary mt-5" href={`/destination/${slugify(trip.destination)}`}>View details</Link>
        </article>
      ))}
    </div>
  );
}

export function HistoryList({ trips }) {
  if (!trips?.length) {
    return <EmptyState title="No trip history yet" body="Your visited destinations and story highlights will appear here." actionHref="/discover" actionLabel="Plan first trip" />;
  }
  return (
    <ol className="space-y-4">
      {trips.map((trip) => (
        <li key={trip.id} className="surface p-5">
          <h2 className="text-xl font-black">{trip.destination}</h2>
          <p className="muted mt-1">{formatDate(trip.visitedAt || trip.createdAt)}</p>
          <p className="mt-3">{trip.highlight}</p>
        </li>
      ))}
    </ol>
  );
}

export function PassportList({ stamps }) {
  if (!stamps?.length) {
    return <EmptyState title="No passport stamps yet" body="Explore a destination and complete cultural actions to earn stamps." actionHref="/discover" actionLabel="Earn first stamp" />;
  }
  return (
    <div className="grid-auto">
      {stamps.map((stamp, index) => (
        <article key={`${stamp.destination}-${index}`} className="surface p-5">
          <p className="text-4xl" aria-hidden="true">{stamp.emoji}</p>
          <h2 className="mt-3 text-xl font-black">{stamp.destination}</h2>
          <p className="muted">{stamp.country}</p>
        </article>
      ))}
    </div>
  );
}

export function BadgeList({ badgeIds }) {
  if (!badgeIds?.length) {
    return <EmptyState title="No badges yet" body="Complete quizzes, share stories, and collect passport stamps to earn badges." actionHref="/passport" actionLabel="Open passport" />;
  }
  return (
    <div className="grid-auto">
      {badgeIds.map((badgeId) => {
        const badge = BADGE_CATALOG[badgeId] || badgeId;
        return (
          <article key={badge.id || badgeId} className="surface p-5">
            <p className="text-4xl" aria-hidden="true">{badge.emoji || "★"}</p>
            <h2 className="mt-3 text-xl font-black">{badge.name || badgeId}</h2>
            <p className="muted">{badge.description || "WanderAI achievement"}</p>
          </article>
        );
      })}
    </div>
  );
}
