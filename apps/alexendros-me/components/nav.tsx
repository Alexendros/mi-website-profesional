import Link from "next/link";
import { siteConfig } from "../lib/site";

export function Nav() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-3xl px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          {siteConfig.name}
        </Link>
        <ul className="flex items-center gap-6">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
