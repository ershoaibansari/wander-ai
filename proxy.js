export { auth as proxy } from "@/session/auth";

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|icon.svg|brand|avatars|community|window.svg|globe.svg|next.svg|vercel.svg|file.svg|login|register).*)",
  ],
};
