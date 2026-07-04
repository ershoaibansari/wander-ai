import Image from "next/image";
import Link from "next/link";
import { APP_NAME, APP_TAGLINE, FOOTER_TEXT } from "@/lib/constants";

export function Logo({ compact = false }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={`${APP_NAME} home`}>
      <Image src="/brand/wanderai-logo.svg" alt="WanderAI logo" width={compact ? 138 : 190} height={47} priority />
      {!compact && <span className="sr-only">{APP_TAGLINE}</span>}
    </Link>
  );
}

export function BrandBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Hackathon partners">
      <span className="brand-chip" title="Google Developer Groups">
        GDG
      </span>
      <span className="brand-chip" title="Hack2skill">
        Hack2skill
      </span>
      <span className="brand-chip" title="PromptWars Build with AI">
        PromptWars
      </span>
      <span className="brand-chip" title="Built with Google Gemini AI">
        Gemini AI
      </span>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-8">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-bold">{FOOTER_TEXT}</p>
          <p className="muted text-sm">{APP_TAGLINE}</p>
        </div>
        <BrandBadges />
      </div>
    </footer>
  );
}
