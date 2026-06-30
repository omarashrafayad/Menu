"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMenuItems, getCategories, MenuItem, Category } from "@/lib/menuService";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Language toggle: English ("en") or Arabic ("ar")
  const [lang, setLang] = useState<"en" | "ar">("en");

  // Fetch menu items and categories from Firestore using React Query
  const { data: menuItems = [], isLoading: isLoadingItems, error: itemsError } = useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
  });

  const { data: dbCategories = [], isLoading: isLoadingCategories, error: categoriesError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = [
    { id: "all", name: lang === "ar" ? "الكل" : "All" },
    ...dbCategories.map((cat) => ({ 
      id: cat.id, 
      name: lang === "ar" ? cat.nameAr : cat.nameEn 
    })),
  ];

  const sections = dbCategories.map((cat, index) => {
    const isEven = index % 2 === 0;
    return {
      id: cat.id,
      name: lang === "ar" ? cat.nameAr : cat.nameEn,
      colorClass: isEven ? "text-brand-gold" : "text-brand-red",
      borderClass: isEven ? "border-brand-gold/35" : "border-brand-red/35",
    };
  });

  const isLoading = isLoadingItems || isLoadingCategories;
  const error = itemsError || categoriesError;

  // Loader Skeletons for Premium UX
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 flex flex-col gap-12 overflow-x-hidden">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 text-center max-w-xl mx-auto w-full animate-pulse">
          <div className="h-10 bg-white/5 rounded-2xl w-3/4 mx-auto"></div>
          <div className="h-4 bg-white/5 rounded-xl w-1/2 mx-auto"></div>
        </div>

        {/* Categories Skeleton */}
        <div className="flex items-center justify-start md:justify-center gap-3 overflow-x-auto pb-4 -mx-4 px-4 select-none">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="h-9 bg-white/5 rounded-full w-24 animate-pulse"></div>
          ))}
        </div>

        {/* Menu Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-card-bg border border-white/5 rounded-3xl overflow-hidden h-[340px] flex flex-col animate-pulse"
            >
              <div className="w-full aspect-[16/10] bg-white/5" />
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center gap-4">
                  <div className="h-5 bg-white/5 rounded w-2/3" />
                  <div className="h-6 bg-white/5 rounded w-16" />
                </div>
                <div className="h-4 bg-white/5 rounded w-full mt-2" />
                <div className="h-4 bg-white/5 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center flex flex-col items-center justify-center gap-4" dir={lang === "ar" ? "rtl" : "ltr"}>
        <span className="text-4xl">⚠️</span>
        <h2 className="text-xl font-bold text-brand-red uppercase">
          {lang === "ar" ? "خطأ في الاتصال" : "Connection Error"}
        </h2>
        <p className="text-white/60 max-w-md font-light">
          {lang === "ar" 
            ? "تعذر تحميل قائمة المنيو. يرجى التحقق من اتصال الإنترنت وقواعد أمان Firestore الخاصة بك." 
            : "Could not load the menu items. Please check your internet connection and Firestore rules configuration."}
        </p>
      </div>
    );
  }

  // Seed Empty State
  if (menuItems.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center flex flex-col items-center justify-center gap-6" dir={lang === "ar" ? "rtl" : "ltr"}>
        <span className="text-5xl">🍽️</span>
        <h2 className="text-2xl font-extrabold text-white">
          {lang === "ar" ? "قائمة الطعام فارغة" : "Your Menu is Empty"}
        </h2>
        <p className="text-white/60 max-w-md font-light leading-relaxed">
          {lang === "ar" 
            ? "يبدو أنك لم تقم بإضافة أي أطباق إلى قاعدة البيانات بعد. اذهب إلى لوحة التحكم للبدء وتعبئة القائمة." 
            : "It looks like you haven't added any items to Firestore yet. Head over to the Dashboard to create your menu or seed the default items."}
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-gold text-black hover:scale-105 hover:bg-brand-gold/90 transition-all duration-300 shadow-lg shadow-brand-gold/15"
        >
          {lang === "ar" ? "فتح لوحة التحكم" : "Open Menu Dashboard"}
        </Link>
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 flex flex-col gap-12 overflow-x-hidden transition-all duration-300"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      
      {/* Header with Language Selector */}
      <div className="relative flex flex-col gap-4 text-center max-w-xl mx-auto w-full">
        {/* Language Floating Selector */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex bg-card-bg border border-white/5 rounded-full p-1 text-xs shadow-md select-none">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-full font-bold uppercase transition-all ${
              lang === "en" ? "bg-brand-gold text-black" : "text-white/50 hover:text-white"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang("ar")}
            className={`px-3 py-1 rounded-full font-bold uppercase transition-all ${
              lang === "ar" ? "bg-brand-gold text-black" : "text-white/50 hover:text-white"
            }`}
          >
            العربية
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mt-4">
          {lang === "ar" ? (
            <>تذوق متعة <span className="text-brand-red uppercase">الجرأة</span></>
          ) : (
            <>Taste the <span className="text-brand-red uppercase">Boldness</span></>
          )}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed">
          {lang === "ar" 
            ? "استكشف قائمة طعام الشارع الحضري الخاصة بنا، والمصممة لمن يقدرون السرعة والمذاق الرائع."
            : "Explore our urban street-inspired menu, crafted for those who value speed and flavor."}
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
                  ? category.id === "all"
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
                  {sectionItems.map((item) => {
                    const title = lang === "ar" ? item.titleAr : item.titleEn;
                    const desc = lang === "ar" ? item.descriptionAr : item.descriptionEn;

                    return (
                      <div
                        key={item.id}
                        id={item.id}
                        className="bg-card-bg border border-white/5 hover:border-brand-gold/25 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-350 flex flex-col group w-full"
                      >
                        {/* Image container */}
                        <div className="relative w-full aspect-[16/10] bg-black/30 overflow-hidden">
                          <div className="relative w-full h-full">
                            <Image
                              src={item.image}
                              alt={title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>

                        {/* Content details */}
                        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                          <div className="flex flex-col gap-2">
                            {/* Title and Price */}
                            <div className="flex items-start justify-between gap-3 w-full">
                              <h3 className={`text-base sm:text-lg font-bold text-white group-hover:text-brand-gold transition-colors duration-300 flex-1 leading-snug ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                                {title}
                              </h3>
                              <span className="text-sm sm:text-base font-bold text-brand-gold font-mono whitespace-nowrap bg-black/40 px-2 py-0.5 rounded border border-white/5">
                                {item.price}
                              </span>
                            </div>
                            {/* Description */}
                            <p className={`text-xs sm:text-sm text-white/60 leading-relaxed font-light mt-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                              {desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

    </div>
  );
}
