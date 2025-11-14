import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact · Siyo",
};

export default function ContactPage() {
  return (
    <div className="surface-card p-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <section className="space-y-4">
        <div className="badge">
          <span className="badge-dot" />
          <span>Contact</span>
        </div>
        <div className="space-y-3">
          <h1 className="text-lg font-medium text-slate-900">Get in touch</h1>
          <p className="text-sm text-muted max-w-md">
            If you have an idea, a side project, or just want to talk about
            product and interfaces, feel free to reach out.
          </p>
        </div>

        <div className="surface-muted p-4 space-y-3">
          <div>
            <p className="text-xs text-soft">Email</p>
            <Link
              href="mailto:siyo@example.com"
              className="text-sm text-slate-900 underline-offset-4 hover:underline"
            >
              siyo@example.com
            </Link>
          </div>
          <div>
            <p className="text-xs text-soft">GitHub</p>
            <Link
              href="https://github.com/your-github"
              className="text-sm text-slate-900 underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              github.com/your-github
            </Link>
          </div>
        </div>
      </section>

      <section className="surface-muted p-4 space-y-3 text-xs text-soft">
        <p>
          I&apos;m currently more interested in remote-friendly, product-focused
          collaborations.
        </p>
        <p>
          A casual email is always welcome — good ideas often start from small,
          open conversations.
        </p>
      </section>
    </div>
  );
}
