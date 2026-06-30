"use client";

import React from "react";
import Image from "next/image";
import { Clock, Phone, Mail, MapPin, Navigation } from "lucide-react";
import { useLanguage } from "@/lib/translations";

export default function AboutPage() {
  const { t } = useLanguage();

  const openingTimes = [
    { days: t("about.days.monThu"), hours: "11:00 AM - 10:00 PM" },
    { days: t("about.days.friSat"), hours: "11:00 AM - 12:00 AM" },
    { days: t("about.days.sunday"), hours: "12:00 PM - 09:00 PM" },
  ];

  const team = [
    {
      name: "Sarah",
      role: t("about.team.chef"),
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Marco",
      role: t("about.team.sousChef"),
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Jen",
      role: t("about.team.front"),
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 flex flex-col gap-16 md:gap-24 pb-20">
      
      {/* Our Story Section */}
      <section className="flex flex-col gap-8">
        {/* Story Banner */}
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/45 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80"
            alt="Take Five Kitchen Staff"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-widest text-white uppercase text-center drop-shadow-lg">
              {t("about.title")}
            </h1>
          </div>
        </div>

        {/* Story Text Box (Gold-Border Card) */}
        <div className="gold-gradient-border rounded-3xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto">
          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed font-light text-center sm:text-start flex flex-col gap-6">
            <span>
              {t("about.storyP1")}
            </span>
            <span>
              {t("about.storyP2")}
            </span>
          </p>
        </div>
      </section>

      {/* Info Cards Grid (Opening Times & Contact) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        
        {/* Opening Times Card */}
        <div className="bg-card-bg border border-white/5 rounded-3xl p-8 flex flex-col justify-between gap-6 hover:border-brand-gold/20 transition-colors duration-300">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 text-brand-gold">
              <Clock size={22} />
              <h2 className="text-xl font-bold uppercase tracking-wide">{t("about.openingTimes")}</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {openingTimes.map((time) => (
                <div key={time.days} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white/60 font-light">{time.days}</span>
                  <span className="text-brand-gold font-mono font-medium">{time.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kitchen closing alert box */}
          <div className="bg-brand-red/10 border border-brand-red/20 rounded-2xl p-4 text-center mt-4">
            <p className="text-xs font-semibold text-brand-red uppercase tracking-wider">
              {t("about.closesAlert")}
            </p>
          </div>
        </div>

        {/* Get in Touch Card */}
        <div className="bg-card-bg border border-white/5 rounded-3xl p-8 flex flex-col gap-6 hover:border-brand-gold/20 transition-colors duration-300" id="contact">
          <div className="flex items-center gap-3 text-brand-gold">
            <Phone size={22} className="rotate-0" />
            <h2 className="text-xl font-bold uppercase tracking-wide">{t("about.getInTouch")}</h2>
          </div>

          <div className="flex flex-col gap-6 my-auto">
            {/* Phone */}
            <a
              href="tel:+1234567890"
              className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/5 transition-all duration-350 border border-transparent hover:border-white/5"
            >
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone size={18} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs text-white/40 uppercase tracking-wider">{t("about.phone")}</span>
                <span className="text-sm font-semibold text-white group-hover:text-brand-gold transition-colors font-mono">
                  +1 (234) 567-890
                </span>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:hello@takefive.com"
              className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/5 transition-all duration-350 border border-transparent hover:border-white/5"
            >
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail size={18} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs text-white/40 uppercase tracking-wider">{t("about.email")}</span>
                <span className="text-sm font-semibold text-white group-hover:text-brand-gold transition-colors font-mono">
                  hello@takefive.com
                </span>
              </div>
            </a>
          </div>
        </div>

      </section>

      {/* Find Us Map Section */}
      <section className="max-w-4xl mx-auto w-full flex flex-col gap-6">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-center md:text-start text-white">
          {t("about.findUs")}
        </h2>
        
        {/* Map Card Wrapper */}
        <div className="bg-card-bg border border-white/5 rounded-3xl overflow-hidden hover:border-brand-gold/20 transition-all duration-300 shadow-2xl">
          
          {/* Mock Map Image/Illustration */}
          <div className="relative h-64 sm:h-80 w-full bg-zinc-950 flex flex-col items-center justify-center gap-2">
            
            {/* Dark stylized grid overlay for map style */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-brand-gold text-black flex items-center justify-center animate-bounce shadow-lg shadow-brand-gold/20">
                <MapPin size={22} className="fill-current text-black" />
              </div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-gold bg-black/80 px-3 py-1 rounded-full border border-brand-gold/20">
                {t("about.hq")}
              </span>
            </div>

            {/* Faux map lines */}
            <svg className="absolute inset-0 w-full h-full text-white/5 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-10 100 Q 100 80, 200 120 T 500 90 T 900 130" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M100 -20 Q 150 120, 120 250 T 160 400" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M350 -20 Q 300 180, 360 250 T 400 400" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>

          {/* Address & Actions */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/5 bg-black/40">
            <div className="flex items-center gap-3">
              <MapPin className="text-brand-gold flex-shrink-0" size={20} />
              <p className="text-sm text-white/80 font-light leading-relaxed">
                {t("about.address")}
              </p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-brand-gold text-brand-gold font-semibold uppercase tracking-wider text-xs hover:bg-brand-gold hover:text-black transition-all duration-350 active:scale-95"
            >
              <Navigation size={12} />
              {t("about.direction")}
            </a>
          </div>

        </div>
      </section>

      {/* Faces of Take Five */}
      <section className="max-w-4xl mx-auto w-full flex flex-col gap-10">
        <div className="flex flex-col gap-3 text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
            {t("about.facesTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light">
            {t("about.facesDesc")}
          </p>
        </div>

        {/* Team Members List */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-16 md:gap-24">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center gap-4 group">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-brand-gold transition-colors duration-300 shadow-xl">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-gold transition-colors">
                  {member.name}
                </h3>
                <span className="text-xs text-white/50 font-light uppercase tracking-wider">
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
