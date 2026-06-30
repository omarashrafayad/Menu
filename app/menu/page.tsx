"use client";

import React, { useState } from "react";
import Image from "next/image";

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: "appetizers" | "mains" | "desserts" | "drinks";
  tag?: string;
  tagColor?: string;
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All" },
    { id: "appetizers", name: "Appetizers" },
    { id: "mains", name: "Main Courses" },
    { id: "desserts", name: "Desserts" },
    { id: "drinks", name: "Drinks" },
  ];

  const menuItems: MenuItem[] = [
    // Appetizers
    {
      id: "urban-wings",
      title: "Urban Wings",
      description: "Jumbo wings tossed in our signature five-spice buffalo sauce.",
      price: "$12.99",
      image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80",
      category: "appetizers",
      tag: "POPULAR",
      tagColor: "bg-brand-red",
    },
    {
      id: "truffle-fries",
      title: "Truffle Loaded Fries",
      description: "Hand-cut fries, truffle oil, parmesan, and roasted garlic aioli.",
      price: "$10.50",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
      category: "appetizers",
    },
    // Main Courses
    {
      id: "big-five-burger",
      title: "The Big Five Burger",
      description: "Double Wagyu patties, gold-infused mayo, house pickles, and aged cheddar.",
      price: "$18.00",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      category: "mains",
      tag: "CHEF'S CHOICE",
      tagColor: "bg-brand-red", // Crimson red Chef's choice badge
    },
    {
      id: "neon-paella",
      title: "Neon Street Paella",
      description: "Saffron rice, grilled tiger prawns, calamari, and spicy chorizo.",
      price: "$24.50",
      image: "https://images.unsplash.com/photo-1534080391025-a87e89948c7c?auto=format&fit=crop&w=600&q=80",
      category: "mains",
    },
    // Desserts
    {
      id: "lava-cake",
      title: "Midnight Lava Cake",
      description: "70% dark cocoa cake with a warm melting heart and raspberry coulis.",
      price: "$9.50",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
      category: "desserts",
    },
    // Drinks
    {
      id: "golden-hour",
      title: "The Golden Hour",
      description: "Craft bourbon, honey ginger reduction, and lemon essence.",
      price: "$14.00",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
      category: "drinks",
    },
  ];

  const sections = [
    { id: "appetizers", name: "Appetizers", colorClass: "text-brand-red", borderClass: "border-brand-red/35" },
    { id: "mains", name: "Main Courses", colorClass: "text-brand-gold", borderClass: "border-brand-gold/35" },
    { id: "desserts", name: "Desserts", colorClass: "text-brand-red", borderClass: "border-brand-red/35" },
    { id: "drinks", name: "Drinks", colorClass: "text-brand-gold", borderClass: "border-brand-gold/35" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 flex flex-col gap-12 overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col gap-4 text-center max-w-xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Taste the <span className="text-brand-red uppercase">Boldness</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed">
          Explore our urban street-inspired menu, crafted for those who value speed and flavor.
        </p>
      </div>

      {/* Categories Filter Horizontal Pills */}
      <div className="flex items-center justify-start md:justify-center overflow-x-auto gap-3 pb-4 scrollbar-none snap-x select-none -mx-4 px-4 sm:-mx-6 sm:px-6">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`snap-start flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${isActive
                  ? category.id === "all" || category.id === "mains" || category.id === "drinks"
                    ? "bg-brand-gold text-black border-brand-gold shadow-lg shadow-brand-gold/15"
                    : "bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/15"
                  : "bg-card-bg text-white/70 border-white/5 hover:border-white/20 hover:text-white"
                }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Menu Grid Content */}
      <div className="flex flex-col gap-16 mt-4">
        {sections
          .filter((section) => activeCategory === "all" || activeCategory === section.id)
          .map((section) => {
            const sectionItems = menuItems.filter((item) => item.category === section.id);
            if (sectionItems.length === 0) return null;

            return (
              <div key={section.id} className="flex flex-col gap-8 scroll-mt-24" id={section.id}>
                {/* Section Title */}
                <div className="flex items-center gap-4">
                  <h2 className={`text-xl sm:text-2xl font-extrabold uppercase tracking-widest ${section.colorClass}`}>
                    {section.name}
                  </h2>
                  <div className={`flex-1 h-[1px] border-t border-dashed ${section.borderClass}`} />
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sectionItems.map((item) => (
                    <div
                      key={item.id}
                      id={item.id}
                      className="bg-card-bg border border-white/5 hover:border-brand-gold/25 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-350 flex flex-col group w-full"
                    >
                      {/* Image container */}
                      <div className="relative w-full aspect-[16/10] bg-black/30 overflow-hidden">
                        {item.tag && (
                          <span className={`absolute top-4 right-4 z-10 text-[9px] font-extrabold uppercase tracking-widest text-white px-2.5 py-1 rounded-full ${item.tagColor} shadow-md`}>
                            {item.tag}
                          </span>
                        )}
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Content details */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                        <div className="flex flex-col gap-2">
                          {/* Title and Price */}
                          <div className="flex items-start justify-between gap-3 w-full">
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-gold transition-colors duration-300 flex-1 leading-snug">
                              {item.title}
                            </h3>
                            <span className="text-sm sm:text-base font-bold text-brand-gold font-mono whitespace-nowrap bg-black/40 px-2 py-0.5 rounded border border-white/5">
                              {item.price}
                            </span>
                          </div>
                          {/* Description */}
                          <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

    </div>
  );
}
