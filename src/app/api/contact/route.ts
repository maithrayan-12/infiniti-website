import { NextResponse } from "next/server";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  // honeypot: bots fill the hidden field — pretend success and drop it
  if (String(body["bot-field"] ?? "").trim()) return NextResponse.json({ ok: true });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const company = String(body.company ?? "").trim().slice(0, 120);
  const volume = String(body.volume ?? "").trim().slice(0, 20);
  const message = String(body.message ?? "").trim();

  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 120) errors.name = "Please enter your name.";
  if (!emailRe.test(email) || email.length > 200) errors.email = "Please enter a valid email.";
  if (message.length < 10 || message.length > 4000) errors.message = "Please describe what you're hiring for.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Nothing delivers enquiries from this route yet. In production, fail loudly instead of reporting a success that
  // would silently lose the visitor's message (on Netlify the form uses Netlify Forms and never reaches this route).
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Contact delivery is not configured." }, { status: 501 });
  }

  // TODO: deliver the enquiry — send an email (Resend / SendGrid / SES), post to your CRM, or write to a database.
  // Intentionally not logging the visitor's personal details here.
  void { company, volume };

  return NextResponse.json({ ok: true });
}
