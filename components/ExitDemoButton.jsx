"use client";

import { signOut } from "next-auth/react";

export function ExitDemoButton() {
  return (
    <button className="btn btn-danger" type="button" onClick={() => signOut({ callbackUrl: "/login" })}>
      Exit Demo
    </button>
  );
}
