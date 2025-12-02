import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact · Siyo",
};

export default function ContactPage() {
  return (
    <div className="mx-auto space-y-12">
      <header className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-6 px-2.5 rounded-full bg-green-500/10 text-green-500 dark:text-green-400 text-[11px] font-medium uppercase tracking-wider flex items-center">
              Contact
            </div>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-fg-1">Get in touch</h1>
          <p className="text-base text-muted leading-relaxed max-w-lg">
            If you have an idea, a side project, or just want to talk about product and interfaces, feel free to reach out.
          </p>
        </div>
      </header>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-fg-1">Email</h3>
            <Link
              href="mailto:siyo@example.com"
              className="block text-sm text-muted hover:text-fg-primary transition-colors"
            >
              siyo@example.com
            </Link>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-fg-1">Socials</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="https://github.com/your-github"
                className="text-sm text-muted hover:text-fg-primary transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </Link>
              <Link
                href="https://twitter.com/your-twitter"
                className="text-sm text-muted hover:text-fg-primary transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface-muted/50 border border-border-subtle space-y-4">
          <p className="text-sm text-muted leading-relaxed">
            I&apos;m currently more interested in remote-friendly, product-focused collaborations.
          </p>
          <p className="text-sm text-muted leading-relaxed">
            A casual email is always welcome — good ideas often start from small, open conversations.
          </p>
        </div>
      </div>
    </div>
  );
}
