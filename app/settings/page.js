import { AppShell } from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell>
      <section className="card p-6">
        <p className="kicker">Preferences</p>
        <h1 className="page-title mt-3">Settings</h1>
        <div className="mt-6 grid-auto">
          <article className="surface p-5"><h2 className="font-black">Light and dark mode</h2><p className="muted mt-2">WanderAI follows the device color scheme with accessible contrast.</p></article>
          <article className="surface p-5"><h2 className="font-black">Demo mode</h2><p className="muted mt-2">Controlled by NEXT_PUBLIC_ENABLE_DEMO_MODE.</p></article>
          <article className="surface p-5"><h2 className="font-black">Privacy</h2><p className="muted mt-2">Gemini requests are sent only through secure server-side route handlers.</p></article>
        </div>
      </section>
    </AppShell>
  );
}
