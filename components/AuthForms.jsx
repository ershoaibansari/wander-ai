"use client";

import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DEMO_USERS } from "@/lib/demo-data";
import { BUDGET_PREFERENCES, TRAVEL_INTERESTS, TRAVEL_STYLES } from "@/lib/constants";

export function LoginForm({ demoEnabled }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  async function normalLogin(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    if (result?.error) {
      setError("Please check your email and password.");
      return;
    }
    router.push("/dashboard");
  }

  async function demoLogin(demoId) {
    setLoading(demoId);
    const result = await signIn("credentials", { demoId, redirect: false });
    setLoading("");
    if (result?.error) {
      setError("Demo login is currently unavailable.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="card p-6" aria-labelledby="login-title">
        <p className="kicker">Welcome back</p>
        <h1 id="login-title" className="section-title mt-2">
          Continue your cultural travel planning.
        </h1>
        <form onSubmit={normalLogin} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" className="input" autoComplete="email" type="email" required />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input id="password" name="password" className="input" autoComplete="current-password" type="password" required />
          </div>
          {error && (
            <p className="text-sm font-bold text-[var(--accent)]" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-primary w-full" type="submit">
            Login
          </button>
        </form>
      </section>
      {demoEnabled && (
        <section className="card p-6" aria-labelledby="demo-title">
          <p className="kicker">Hackathon demo login</p>
          <h2 id="demo-title" className="section-title mt-2">
            Explore WanderAI Instantly
          </h2>
          <p className="muted mt-2">
            Select a demo traveler profile and explore the full dashboard with preloaded data.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {DEMO_USERS.map((user) => (
              <article key={user.id} className="surface p-4">
                <div className="flex gap-3">
                  <Image src={user.avatar} alt={`${user.name} profile photo`} width={58} height={58} className="rounded-full" />
                  <div>
                    <h3 className="font-black">{user.name}</h3>
                    <p className="muted text-sm">{user.role}</p>
                    <p className="text-sm font-bold">{user.country}</p>
                  </div>
                </div>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="font-bold">Travel style</dt>
                    <dd className="muted">{user.travelStyle}</dd>
                  </div>
                  <div>
                    <dt className="font-bold">Favorite destination</dt>
                    <dd className="muted">{user.favoriteDestination}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-sm">{user.description}</p>
                <button
                  className="btn btn-secondary mt-4 w-full"
                  type="button"
                  onClick={() => demoLogin(user.id)}
                  disabled={loading === user.id}
                  aria-label={`Continue as ${user.name}`}
                >
                  {loading === user.id ? "Loading profile..." : "Continue as this user"}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function register(event) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        country: form.get("country"),
        interests: form.getAll("interests"),
        travelStyle: form.get("travelStyle"),
        budget: form.get("budget"),
      }),
    });
    if (!response.ok) {
      setMessage("Please check the form and try again.");
      return;
    }
    await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    router.push("/dashboard");
  }

  return (
    <form onSubmit={register} className="card mx-auto max-w-3xl p-6">
      <p className="kicker">Create your travel passport</p>
      <h1 className="section-title mt-2">Register for WanderAI</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input className="input" id="name" name="name" required />
        </div>
        <div>
          <label className="label" htmlFor="register-email">Email</label>
          <input className="input" id="register-email" name="email" type="email" required />
        </div>
        <div>
          <label className="label" htmlFor="register-password">Password</label>
          <input className="input" id="register-password" name="password" type="password" minLength={8} required />
        </div>
        <div>
          <label className="label" htmlFor="country">Country</label>
          <input className="input" id="country" name="country" required />
        </div>
        <div>
          <label className="label" htmlFor="travelStyle">Preferred travel style</label>
          <select className="select" id="travelStyle" name="travelStyle">
            {TRAVEL_STYLES.map((style) => <option key={style}>{style}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="budget">Budget preference</label>
          <select className="select" id="budget" name="budget">
            {BUDGET_PREFERENCES.map((budget) => <option key={budget}>{budget}</option>)}
          </select>
        </div>
      </div>
      <fieldset className="mt-5">
        <legend className="label">Travel interests</legend>
        <div className="grid-auto">
          {TRAVEL_INTERESTS.map((interest) => (
            <label key={interest} className="surface flex items-center gap-2 p-3">
              <input type="checkbox" name="interests" value={interest} />
              <span>{interest}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {message && <p className="mt-4 text-sm font-bold text-[var(--accent)]">{message}</p>}
      <button className="btn btn-primary mt-6 w-full" type="submit">Create account</button>
    </form>
  );
}
