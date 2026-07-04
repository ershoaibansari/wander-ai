"use client";

import { signOut } from "next-auth/react";

export function ExitDemoButton() {
  return (
    <button className="btn btn-danger" type="button" onClick={() => signOut({ callbackUrl: "/login" })}>
      Exit Demo
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      className="btn btn-secondary text-sm font-bold min-h-[2.2rem] px-4 cursor-pointer"
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Sign Out
    </button>
  );
}
