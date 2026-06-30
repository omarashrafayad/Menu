import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function Home() {
  const popularBites = [
    {
      id: "urban-double",
      title: "Urban Double",
      description: "Two smashed patties, triple cheese, secret Take Five sauce, caramelised onions on a brioche bun.",
      price: "$14.50",
      image: "/images/hero.png", // Reusing our high-quality generated hero burger
      tag: "POPULAR",
      tagColor: "bg-brand-red",
    },
    {
      id: "pepperoni-pizza",
      title: "Hot Honey Pepperoni",
      description: "Crispy pepperoni cups, organic tomato sauce, mozzarella, drizzled with sweet and spicy hot honey.",
      price: "$18.00",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
      tag: "POPULAR",
      tagColor: "bg-brand-red",
    },
    {
      id: "truffle-fries",
      title: "Truffle Loaded Fries",
      description: "Hand-cut crispy fries, premium truffle oil, freshly grated parmesan, and roasted garlic aioli.",
      price: "$10.50",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
      tag: "POPULAR",
      tagColor: "bg-brand-red",
    },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 md:pt-16 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Typography */}
          <div className="flex flex-col gap-6 lg:col-span-7 text-center lg:text-left items-center lg:items-start order-2 lg:order-1 z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-xl text-white">
              Experience the <span className="text-brand-gold relative inline-block">Taste<span className="absolute left-0 bottom-0 w-full h-[6px] bg-brand-gold/20 rounded-full"></span></span> of Take Five
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-lg leading-relaxed font-light">
              Modern urban flavors crafted with passion. Bold ingredients, premium quality, delivered to your door.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/menu"
                className="px-8 py-4 bg-brand-gold text-black font-semibold rounded-full text-center hover:bg-brand-gold/90 transition-all duration-350 shadow-lg shadow-brand-gold/10 hover:scale-105 active:scale-95"
              >
                View Menu
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 border border-white/20 hover:border-brand-gold text-white font-semibold rounded-full text-center transition-all duration-350 hover:bg-white/5"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] group">
              <div className="absolute inset-0 bg-brand-gold/10 rounded-full blur-3xl group-hover:bg-brand-gold/15 transition-all duration-500"></div>
              <Image
                src="/images/hero.png"
                alt="Take Five Gourmet Burger"
                fill
                priority
                className="object-contain drop-shadow-[0_20px_50px_rgba(227,154,60,0.25)] hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Popular Bites Section */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Popular Bites
          </h2>
          <Link
            href="/menu"
            className="flex items-center gap-2 text-sm font-semibold text-brand-gold hover:text-brand-gold/80 transition-colors duration-300 group"
          >
            See All{" "}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Horizontal scroll container for mobile, grid for desktop */}
        <div className="flex overflow-x-auto lg:overflow-visible gap-6 pb-6 lg:pb-0 scrollbar-none snap-x snap-mandatory lg:grid lg:grid-cols-3">
          {popularBites.map((bite) => (
            <div
              key={bite.id}
              className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-start bg-card-bg border border-white/5 rounded-3xl overflow-hidden hover:border-brand-gold/30 hover:shadow-2xl hover:shadow-brand-gold/5 transition-all duration-350 flex flex-col justify-between group"
            >
              {/* Product Image and Badge */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-black/40">
                {bite.tag && (
                  <span className={`absolute top-4 right-4 z-10 text-[10px] font-extrabold uppercase tracking-widest text-white px-3 py-1 rounded-full ${bite.tagColor} shadow-md`}>
                    {bite.tag}
                  </span>
                )}
                <Image
                  src={bite.image}
                  alt={bite.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-brand-gold transition-colors duration-300">
                    {bite.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed font-light line-clamp-3">
                    {bite.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-lg font-bold text-brand-gold font-mono">
                    {bite.price}
                  </span>
                  <Link
                    href={`/menu#${bite.id}`}
                    className="text-xs uppercase tracking-wider font-semibold text-white/80 hover:text-white border-b border-transparent hover:border-white transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rewards Section */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="relative glass-panel rounded-3xl p-8 md:p-12 overflow-hidden border border-brand-gold/15 max-w-3xl mx-auto shadow-2xl">
          {/* Subtle glowing backgrounds */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl"></div>

          <div className="relative flex flex-col items-center text-center gap-6 z-10">
            {/* Star badge */}
            <div className="w-14 h-14 rounded-full bg-brand-gold flex items-center justify-center text-black shadow-lg shadow-brand-gold/20 scale-100 hover:scale-110 transition-transform duration-350">
              <Star size={24} className="fill-current text-black" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-gold">
              Take Five Rewards
            </h2>
            <p className="text-sm sm:text-base text-white/70 max-w-md leading-relaxed font-light">
              Join our inner circle and earn points for every dollar spent. It's time your appetite paid you back.
            </p>

            {/* Progress bar container */}
            <div className="w-full max-w-md mt-2 flex flex-col gap-2">
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-gold to-brand-gold/80 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <p className="text-xs text-white/50 font-light tracking-wide mt-1">
                You're 250 points away from a FREE Urban Double!
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

