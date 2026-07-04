import Link from "next/link";
import { auth } from "@/session/auth";
import { APP_TAGLINE } from "@/lib/constants";
import { BrandBadges, Footer, Logo } from "@/components/Brand";
import { ExitDemoButton } from "@/components/ExitDemoButton";
import dynamic from "next/dynamic";

const FloatingAssistant = dynamic(
  () => import("@/components/FloatingAssistant").then((mod) => mod.FloatingAssistant)
);

const navItems = [
  ["Dashboard", "/dashboard"],
  ["Discover", "/discover"],
  ["AI Story", "/story"],
  ["Itinerary", "/itinerary"],
  ["Community", "/community"],
  ["Passport", "/passport"],
  ["Profile", "/profile"],
];

export async function AppShell({ children }) {
  const session = await auth();
  const isDemo = Boolean(session?.user?.isDemo);

  return (
    <div className="app-bg">
      <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--background)_86%,transparent)] backdrop-blur">
        <div className="container flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <Logo compact />
            <p className="muted hidden max-w-xs text-sm md:block">{APP_TAGLINE}</p>
          </div>
          <nav aria-label="Main navigation" className="flex flex-wrap gap-3">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="brand-chip">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {isDemo && (
        <div className="border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--gold)_18%,var(--background))]">
          <div className="container flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
            <p className="font-bold">Demo Mode: You are exploring WanderAI using a hackathon demo account.</p>
            <ExitDemoButton />
          </div>
        </div>
      )}
      <main id="main-content" className="container py-12 md:py-14">
        <div className="mb-10">
          <BrandBadges />
        </div>
        {children}
      </main>
      <div className="container pb-12">
        <FloatingAssistant />
      </div>
      <Footer />
    </div>
  );
}
