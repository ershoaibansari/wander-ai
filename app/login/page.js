import Link from "next/link";
import { LoginForm } from "@/components/AuthForms";
import { BrandBadges, Footer, Logo } from "@/components/Brand";

export default function LoginPage() {
  const demoEnabled = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true";

  return (
    <div className="app-bg">
      <header className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <Logo />
        <BrandBadges />
      </header>
      <main id="main-content" className="container pb-10">
        <LoginForm demoEnabled={demoEnabled} />
        <p className="mt-6 text-center">
          New to WanderAI? <Link className="font-black text-[var(--primary-strong)]" href="/register">Create an account</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
