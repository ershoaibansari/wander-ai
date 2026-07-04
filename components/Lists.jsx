import Link from "next/link";
import { BADGE_CATALOG } from "@/lib/constants";
import { formatDate, slugify } from "@/lib/utils";

/**
 * Standard Empty State card to show when user list queries return no documents.
 * @param {Object} props - Empty state parameters.
 * @param {string} props.title - Action title header.
 * @param {string} props.body - Explanatory body text.
 * @param {string} [props.actionHref] - Redirection destination URL path.
 * @param {string} [props.actionLabel] - Action redirection button label.
 */
export function EmptyState({ title, body, actionHref, actionLabel }) {
  return (
    <section className="surface p-6 text-center">
      <h2 className="section-title">{title}</h2>
      <p className="muted mx-auto mt-2 max-w-xl">{body}</p>
      {actionHref && <Link className="btn btn-primary mt-5" href={actionHref}>{actionLabel}</Link>}
    </section>
  );
}

/**
 * Renders a grid listing of user-saved cultural trips.
 * @param {Object} props - Component properties.
 * @param {Array} props.trips - List of trip profile objects.
 */
export function TripList({ trips }) {
  if (!trips?.length) {
    return <EmptyState title="No saved trips yet" body="Ask Gemini for a destination discovery, then save the ideas that feel like you." actionHref="/discover" actionLabel="Discover places" />;
  }
  return (
    <div className="grid-auto">
      {trips.map((trip) => {
        const destName = typeof trip.destination === "object" ? (trip.destination.name || trip.destination.destination) : trip.destination;
        const tripSummary = typeof trip.summary === "object" ? (trip.summary.description || trip.summary.summary || trip.summary.details || "No summary details") : (trip.summary || trip.highlight);
        return (
          <article key={trip.id} className="surface p-5">
            <h2 className="text-xl font-black">{destName}</h2>
            <p className="muted mt-2">{tripSummary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(trip.tags || []).map((tag, idx) => {
                const tagName = typeof tag === "object" ? (tag.name || tag.details || "Tag") : String(tag);
                return <span className="brand-chip" key={`${tagName}-${idx}`}>{tagName}</span>;
              })}
            </div>
            <Link className="btn btn-secondary mt-5" href={`/destination/${slugify(destName)}`}>View details</Link>
          </article>
        );
      })}
    </div>
  );
}

/**
 * Renders a chronological list of a traveler's visited trip history.
 * @param {Object} props - Component properties.
 * @param {Array} props.trips - List of visited destination logs.
 */
export function HistoryList({ trips }) {
  if (!trips?.length) {
    return <EmptyState title="No trip history yet" body="Your visited destinations and story highlights will appear here." actionHref="/discover" actionLabel="Plan first trip" />;
  }
  return (
    <ol className="space-y-4">
      {trips.map((trip) => {
        const destName = typeof trip.destination === "object" ? (trip.destination.name || trip.destination.destination) : trip.destination;
        return (
          <li key={trip.id} className="surface p-5">
            <h2 className="text-xl font-black">{destName}</h2>
            <p className="muted mt-1">{formatDate(trip.visitedAt || trip.createdAt)}</p>
            <p className="mt-3">{trip.highlight}</p>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Renders a visual passport stamp collection grid.
 * @param {Object} props - Component properties.
 * @param {Array} props.stamps - List of collected stamp objects (emoji, destination, country).
 */
export function PassportList({ stamps }) {
  if (!stamps?.length) {
    return <EmptyState title="No passport stamps yet" body="Explore a destination and complete cultural actions to earn stamps." actionHref="/discover" actionLabel="Earn first stamp" />;
  }
  return (
    <div className="grid-auto">
      {stamps.map((stamp, index) => {
        const destName = typeof stamp.destination === "object" ? (stamp.destination.name || stamp.destination.destination) : stamp.destination;
        return (
          <article key={`${destName}-${index}`} className="surface p-5">
            <p className="text-4xl" aria-hidden="true">{stamp.emoji}</p>
            <h2 className="mt-3 text-xl font-black">{destName}</h2>
            <p className="muted">{stamp.country}</p>
          </article>
        );
      })}
    </div>
  );
}

/**
 * Renders earned traveler milestone badges.
 * @param {Object} props - Component properties.
 * @param {string[]} props.badgeIds - List of unlocked badge identifiers.
 */
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
