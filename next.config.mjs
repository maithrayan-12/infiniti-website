import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // where the contact form posts: Netlify Forms when built on Netlify, our own API route everywhere else
  env: {
    NEXT_PUBLIC_FORM_TARGET: process.env.NEXT_PUBLIC_FORM_TARGET ?? (process.env.NETLIFY ? "netlify" : "api"),
  },
  // pin the project root (a stray lockfile in the home folder otherwise confuses root detection)
  turbopack: { root },
  // let phones / tablets on the same Wi-Fi load the dev server (Next 16 blocks unknown dev origins by default)
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*"],
};

export default nextConfig;
