"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, Phone } from "lucide-react";
import { CLINIC_INFO, buildWhatsAppBookingUrl } from "@/lib/clinic-config";

const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Specialities", href: "/#specialities" },
  { label: "Facilities", href: "/#facilities" },
  { label: "Asthma Care", href: "/#patient-information" },
  { label: "Contact", href: "/#contact" },
];

export function ClinicLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-xs ring-1 ring-navy/10">
        <Image
          src="/images/logo.png"
          alt="Saanvika Advanced Chest Care Centre Logo"
          fill
          sizes="44px"
          className="object-contain p-0.5"
        />
      </div>
      <div className="leading-tight">
        <span className="block text-sm font-bold tracking-wide text-navy sm:text-base">
          SAANVIKA
        </span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-teal sm:text-[11px]">
          Advanced Chest Care Centre
        </span>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-navy/10 bg-white/95 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="#home" aria-label={CLINIC_INFO.name}>
          <ClinicLogo />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden items-center gap-6 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-navy/80 transition-colors hover:text-teal"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={CLINIC_INFO.phoneHref}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-surface"
          >
            <Phone className="h-4 w-4 text-teal" />
            <span>{CLINIC_INFO.phoneDisplay}</span>
          </a>
          <a
            href={buildWhatsAppBookingUrl({})}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal hover:shadow-md"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Book Appointment</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-xl border border-navy/15 p-2 text-navy transition-colors hover:bg-surface lg:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-navy/10 bg-white lg:hidden"
          >
            <div className="space-y-1 px-4 pb-5 pt-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-3.5 py-2.5 text-base font-medium text-navy transition-colors hover:bg-surface hover:text-teal"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-2.5 border-t border-navy/10 pt-4">
                <a
                  href={CLINIC_INFO.phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy/20 px-4 py-2.5 text-sm font-semibold text-navy"
                >
                  <Phone className="h-4 w-4 text-teal" />
                  <span>Call {CLINIC_INFO.phoneDisplay}</span>
                </a>
                <a
                  href={buildWhatsAppBookingUrl({})}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Book Appointment</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

