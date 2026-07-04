"use client";

import { useState, useEffect } from "react";

export default function Navbar({ siteName }: { siteName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#projects", label: "Projects" },
    { href: "#team", label: "Team" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a
          href="#home"
          className={`text-2xl font-display tracking-wider ${
            scrolled ? "text-arch-black" : "text-white"
          }`}
        >
          {siteName}
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wider uppercase hover:text-arch-accent transition-colors ${
                scrolled ? "text-arch-dark" : "text-white/80"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/admin"
            className="text-sm tracking-wider uppercase text-arch-accent hover:text-arch-accent-dark transition-colors"
          >
            Admin
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 ${scrolled ? "text-arch-black" : "text-white"}`}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="px-6 py-4 space-y-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm tracking-wider uppercase text-arch-dark hover:text-arch-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/admin"
              className="block text-sm tracking-wider uppercase text-arch-accent hover:text-arch-accent-dark transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
