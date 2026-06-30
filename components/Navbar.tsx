"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Languages } from "lucide-react";
import { useLanguage } from "@/lib/translations";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { lang, t, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("navbar.home"), href: "/" },
    { name: t("navbar.menu"), href: "/menu" },
    { name: t("navbar.about"), href: "/about" },
    { name: t("navbar.dashboard"), href: "/dashboard" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo and Branding */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-brand-gold/30 group-hover:border-brand-gold transition-colors duration-300">
            <Image
              src="/images/logo.jpeg"
              alt="Take Five Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-sans text-xl font-bold tracking-wider text-white group-hover:text-brand-gold transition-colors duration-300">
            TAKE <span className="text-brand-gold">FIVE</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-1 text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                  isActive ? "text-brand-gold" : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold rounded-full" />
                )}
              </Link>
            );
          })}
          
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(lang === "en" ? "ar" : "en")}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-brand-gold/50 rounded-full text-white/90 hover:text-brand-gold hover:scale-105 transition-all duration-300 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 cursor-pointer"
          >
            <Languages size={14} />
            <span>{lang === "en" ? "العربية" : "English"}</span>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-brand-gold p-1 focus:outline-none transition-colors duration-300"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-x-0 top-0 bottom-0 bg-black/98 backdrop-blur-xl z-40 md:hidden flex flex-col items-center justify-center gap-8 px-6 text-center transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ height: "100vh" }}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-6 text-white hover:text-brand-gold p-1 focus:outline-none"
        >
          <X size={28} />
        </button>
        
        <nav className="flex flex-col items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-2xl font-bold tracking-widest uppercase transition-colors duration-300 ${
                  isActive ? "text-brand-gold" : "text-white hover:text-brand-gold"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Mobile Language Toggle */}
          <button
            onClick={() => {
              setLanguage(lang === "en" ? "ar" : "en");
              setIsOpen(false);
            }}
            className="w-full min-w-[200px] py-3.5 px-6 text-sm font-bold uppercase tracking-wider border border-white/10 hover:border-brand-gold/50 rounded-full text-white/90 hover:text-brand-gold transition-all duration-300 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 mt-4 cursor-pointer"
          >
            <Languages size={16} />
            <span>{lang === "en" ? "العربية" : "English"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
