import { AppShell } from "@/components/AppShell";
import { CommunityPostCard } from "@/components/CommunityPostCard";
import { getDemoCommunityPosts } from "@/lib/demo-data";

export default function CommunityPage() {
  const posts = getDemoCommunityPosts();

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="card p-6">
          <p className="kicker">Community feed</p>
          <h1 className="page-title mt-3">Local stories from travelers</h1>
          <p className="muted mt-4 max-w-3xl text-lg">
            Share destination photos, memories, hidden gems, local food discoveries, and cultural stories. Media files belong in Firebase Storage; Firestore stores their URLs.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {posts.map((post) => <CommunityPostCard key={post.id} post={post} />)}
        </div>
      </section>
    </AppShell>
  );
}
