"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Eli5Toggle } from "./Eli5";

// Primary links (always visible on desktop) + secondary links (in a "More"
// dropdown on desktop). Mobile shows everything in the hamburger menu.
const primary = [
  { href: "/learn", label: "Learn" },
  { href: "/modern", label: "Modern JS" },
  { href: "/practice", label: "Practice" },
  { href: "/labs", label: "Labs" },
  { href: "/progress", label: "Progress" },
];

const secondary = [
  { href: "/internals", label: "Internals" },
  { href: "/interview", label: "Interview" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/revision", label: "Revision" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile menu
  const [moreOpen, setMoreOpen] = useState(false); // desktop "More" dropdown

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const linkCls = (href: string) =>
    "rounded-md px-3 py-1.5 text-sm font-medium transition " +
    (isActive(href) ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-800">
          <span className="text-xl">🧪</span>
          <span>Frontend <span className="text-brand-600">Logic Lab</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {primary.map((link) => (
            <Link key={link.href} href={link.href} className={linkCls(link.href)}>
              {link.label}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
            <button
              onClick={() => setMoreOpen((o) => !o)}
              onMouseEnter={() => setMoreOpen(true)}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              More ▾
            </button>
            {moreOpen && (
              <div className="absolute right-0 mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {secondary.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className={
                      "block px-4 py-2 text-sm " +
                      (isActive(link.href) ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100")
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="ml-1 border-l border-slate-200 pl-2">
            <Eli5Toggle />
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t border-slate-200 px-4 py-2 md:hidden">
          {[...primary, ...secondary].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={
                "rounded-md px-3 py-2 text-sm font-medium " +
                (isActive(link.href) ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100")
              }
            >
              {link.label}
            </Link>
          ))}
          <div className="px-3 py-2">
            <Eli5Toggle />
          </div>
        </div>
      )}
    </header>
  );
}
