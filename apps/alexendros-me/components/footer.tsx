import Link from "next/link";
import { siteConfig } from "../lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-3xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          &copy; {year} {siteConfig.fullName}. Todos los derechos reservados.
        </p>
        <nav className="flex items-center gap-4">
          {siteConfig.legalNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
