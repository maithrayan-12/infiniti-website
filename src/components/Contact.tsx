"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Reveal } from "./Reveal";
import { Split } from "./Split";
import { Icon } from "./Sprite";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: { name: string; email: string; message: string }): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!emailRe.test(v.email.trim())) e.email = "Please enter a valid work email.";
  if (v.message.trim().length < 10) e.message = "Tell us a little about the roles (10+ characters).";
  return e;
}

export default function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const found = validate({ name: data.name ?? "", email: data.email ?? "", message: data.message ?? "" });
    setErrors(found);
    setStatus("");
    const first = (["name", "email", "message"] as const).find((k) => found[k]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setSending(true);
    try {
      // On Netlify the enquiry is stored by Netlify Forms (see public/__forms.html); elsewhere it goes to /api/contact.
      const res =
        process.env.NEXT_PUBLIC_FORM_TARGET === "netlify"
          ? await fetch("/__forms.html", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({ "form-name": "contact", ...data }).toString(),
            })
          : await fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
      if (!res.ok) throw new Error("Request failed");
      setStatus(`Thanks, ${data.name.trim().split(" ")[0]}! We'll be in touch within one business day.`);
      form.reset();
    } catch {
      setStatus("Something went wrong. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  }

  const field = (name: keyof Errors) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": `${name}-err`,
  });

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="aurora soft" aria-hidden="true">
        <i className="orb o1" />
        <i className="orb o2" />
      </div>

      <div className="container">
        <Reveal className="cta-card glass">
          <div className="cta-rings" aria-hidden="true">
            <i /><i /><i />
          </div>

          <div className="cta-copy">
            <p className="eyebrow">Let&apos;s talk</p>
            <Split id="contact-title">
              Ready to hire without the <em>headaches?</em>
            </Split>
            <p>
              Tell us what you&apos;re hiring for and we&apos;ll come back within one business day with a plan and a
              no-obligation quote.
            </p>
            <ul className="contact-list">
              <li>
                <span className="clay-ico sm"><Icon name="mail" /></span>
                <a href="mailto:hello@infiniti.com">hello@infiniti.com</a>
              </li>
              <li>
                <span className="clay-ico sm"><Icon name="phone" /></span>
                <a href="tel:+15550100199">+1 (555) 010-0199</a>
              </li>
              <li><span className="clay-ico sm"><Icon name="pin" /></span> Your city, Your country</li>
            </ul>
          </div>

          <form className="form glass-light" onSubmit={onSubmit} noValidate>
            <div className="row">
              <div className={`field${errors.name ? " invalid" : ""}`}>
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" type="text" autoComplete="name" required {...field("name")} />
                <small className="err" id="name-err" role="alert">{errors.name}</small>
              </div>
              <div className={`field${errors.email ? " invalid" : ""}`}>
                <label htmlFor="email">Work email</label>
                <input id="email" name="email" type="email" autoComplete="email" required {...field("email")} />
                <small className="err" id="email-err" role="alert">{errors.email}</small>
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" autoComplete="organization" />
              </div>
              <div className="field">
                <label htmlFor="volume">Hires you plan this year</label>
                <select id="volume" name="volume" defaultValue="1–10">
                  <option>1–10</option>
                  <option>11–50</option>
                  <option>51–200</option>
                  <option>200+</option>
                </select>
              </div>
            </div>
            <div className={`field${errors.message ? " invalid" : ""}`}>
              <label htmlFor="message">What are you hiring for?</label>
              <textarea id="message" name="message" rows={4} required {...field("message")} />
              <small className="err" id="message-err" role="alert">{errors.message}</small>
            </div>
            {/* spam trap: real visitors never see or fill this; bots do */}
            <p className="hp" aria-hidden="true">
              <label>
                Leave this field empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>
            <button className="btn btn-clay btn-lg magnetic" type="submit" disabled={sending}>
              {sending ? "Sending…" : "Send message"} <Icon name="arrow" />
            </button>
            <p className="form-status" role="status">{status}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
