import Link from "next/link";
import { RegisterForm } from "@/components/AuthForms";
import { BrandBadges, Footer, Logo } from "@/components/Brand";

export default function RegisterPage() {
  return (
    <div className="app-bg">
      <header className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <Logo />
        <BrandBadges />
      </header>
      <main id="main-content" className="container pb-10">
        <RegisterForm />
        <p className="mt-6 text-center">
          Already have an account? <Link className="font-black text-[var(--primary-strong)]" href="/login">Login</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
