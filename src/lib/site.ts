/**
 * Canonical site URL used for metadata, sitemap and robots.
 * On Netlify the build provides `URL` (your primary domain); set NEXT_PUBLIC_SITE_URL to override it.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.URL ??
  "http://localhost:3000"
).replace(/\/$/, "");
