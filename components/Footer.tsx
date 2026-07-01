"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/translations";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-black border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-brand-gold/30">
            <Image
              src="/images/logo.jpeg"
              alt="Take Five Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-sans text-lg font-bold tracking-wider text-white">
            TAKE <span className="text-brand-gold">FIVE</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center gap-8 text-sm text-white/60">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-gold transition-colors duration-300"
          >
            {t("footer.facebook")}
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-gold transition-colors duration-300"
          >
            {t("footer.instagram")}
          </a>
          <Link
            href="/about#contact"
            className="hover:text-brand-gold transition-colors duration-300"
          >
            {t("footer.contactUs")}
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-white/40 tracking-wider">
          {t("footer.copyright", { year: currentYear })}
        </p>
      </div>
    </footer>
  );
}
