"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  seedInitialMenuItems, 
  uploadImage,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  MenuItem,
  Category
} from "@/lib/menuService";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  Sparkles, 
  Search, 
  Filter, 
  Upload,
  Check,
  X,
  FileImage,
  FolderPlus,
  LayoutGrid,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/translations";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Tab Management: "items" or "categories"
  const [activeTab, setActiveTab] = useState<"items" | "categories">("items");
  
  // Dashboard view language toggle connected to global context
  const { lang, t } = useLanguage();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // File Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Menu Form State (Bilingual)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    price: "",
    image: "",
    category: ""
  });

  // Category Form State (Bilingual)
  const [catNameAr, setCatNameAr] = useState("");
  const [catNameEn, setCatNameEn] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // Queries
  const { data: menuItems = [], isLoading: isItemsLoading, error: itemsError } = useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: getMenuItems
  });

  const { data: categories = [], isLoading: isCategoriesLoading, error: categoriesError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  // Auto-select first category if available when form loads
  useEffect(() => {
    if (categories.length > 0 && !formData.category && !editingId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({ ...prev, category: categories[0].id }));
    }
  }, [categories, formData.category, editingId]);

  // Mutations - Menu Items
  const addMutation = useMutation({
    mutationFn: addMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      showFeedback(t("dashboard.successAdd"), "success");
      resetForm();
    },
    onError: () => {
      showFeedback("Failed to add item.", "error");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<MenuItem, "id">> }) => 
      updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      showFeedback(t("dashboard.successUpdate"), "success");
      resetForm();
    },
    onError: () => {
      showFeedback("Failed to update item.", "error");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      showFeedback(t("dashboard.successDelete"), "success");
    },
    onError: () => {
      showFeedback("Failed to delete item.", "error");
    }
  });

  // Mutations - Categories
  const addCatMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showFeedback(t("dashboard.successAddCat"), "success");
      clearCatForm();
    },
    onError: () => {
      showFeedback("Failed to add category.", "error");
    }
  });

  const updateCatMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Category, "id">> }) => 
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showFeedback(t("dashboard.successUpdateCat"), "success");
      clearCatForm();
    },
    onError: () => {
      showFeedback("Failed to update category.", "error");
    }
  });

  const deleteCatMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      showFeedback(t("dashboard.successDeleteCat"), "success");
    },
    onError: () => {
      showFeedback("Failed to delete category.", "error");
    }
  });

  const seedMutation = useMutation({
    mutationFn: seedInitialMenuItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      showFeedback(t("dashboard.successSeed"), "success");
    },
    onError: () => {
      showFeedback("Failed to seed database.", "error");
    }
  });

  const showFeedback = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      titleAr: "",
      titleEn: "",
      descriptionAr: "",
      descriptionEn: "",
      price: "",
      image: "",
      category: categories[0]?.id || ""
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearCatForm = () => {
    setCatNameAr("");
    setCatNameEn("");
    setEditingCatId(null);
  };

  // Submit Menu Item
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titleEn || !formData.titleAr || !formData.price || !formData.category) {
      showFeedback(t("dashboard.requiredFieldsError"), "error");
      return;
    }

    let finalImageUrl = formData.image.trim();

    if (imageFile) {
      setIsUploading(true);
      try {
        finalImageUrl = await uploadImage(imageFile);
      } catch (err) {
        console.error(err);
        showFeedback(t("dashboard.cloudinaryUploadError"), "error");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    if (!finalImageUrl) {
      finalImageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
    }

    let formattedPrice = formData.price.trim();
    if (!formattedPrice.startsWith("$")) {
      const num = parseFloat(formattedPrice);
      if (!isNaN(num)) {
        formattedPrice = `$${num.toFixed(2)}`;
      } else {
        formattedPrice = `$${formattedPrice}`;
      }
    }

    const payload: Omit<MenuItem, "id"> = {
      titleAr: formData.titleAr.trim(),
      titleEn: formData.titleEn.trim(),
      descriptionAr: formData.descriptionAr.trim(),
      descriptionEn: formData.descriptionEn.trim(),
      price: formattedPrice,
      image: finalImageUrl,
      category: formData.category
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  // Submit Category
  const handleCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameEn.trim() || !catNameAr.trim()) {
      showFeedback(t("dashboard.categoryRequiredError"), "error");
      return;
    }

    const payload = {
      nameAr: catNameAr.trim(),
      nameEn: catNameEn.trim()
    };

    if (editingCatId) {
      updateCatMutation.mutate({ id: editingCatId, data: payload });
    } else {
      addCatMutation.mutate(payload);
    }
  };

  const startEditItem = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData({
      titleAr: item.titleAr || item.title || "",
      titleEn: item.titleEn || item.title || "",
      descriptionAr: item.descriptionAr || item.description || "",
      descriptionEn: item.descriptionEn || item.description || "",
      price: item.price,
      image: item.image,
      category: item.category
    });
    setImagePreview(item.image);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const startEditCat = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatNameAr(cat.nameAr || cat.name || "");
    setCatNameEn(cat.nameEn || cat.name || "");
  };

  // Filter items based on search and category selector
  const filteredItems = menuItems.filter(item => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;
    
    return (
      (item.titleEn && item.titleEn.toLowerCase().includes(searchLower)) || 
      (item.titleAr && item.titleAr.toLowerCase().includes(searchLower)) || 
      (item.descriptionEn && item.descriptionEn.toLowerCase().includes(searchLower)) ||
      (item.descriptionAr && item.descriptionAr.toLowerCase().includes(searchLower))
    );
  });

  const isLoading = isItemsLoading || isCategoriesLoading;
  const hasError = itemsError || categoriesError;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 flex flex-col gap-8">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {lang === "ar" ? (
              <>لوحة <span className="text-brand-gold uppercase">التحكم</span></>
            ) : (
              <>Menu <span className="text-brand-gold uppercase">Dashboard</span></>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-light mt-1">
            {t("dashboard.desc")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/menu" 
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-card-bg border border-white/5 hover:border-white/20 transition-all text-white flex items-center gap-2"
          >
            {t("dashboard.viewLive")}
          </Link>
          {menuItems.length === 0 && categories.length === 0 && !isLoading && (
            <button
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-red text-white hover:scale-105 transition-all flex items-center gap-2"
            >
              {seedMutation.isPending ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Sparkles size={14} />
              )}
              {t("dashboard.seedBtn")}
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-white/5 gap-2 pb-px select-none">
        <button
          onClick={() => { setActiveTab("items"); resetForm(); }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "items"
              ? "border-brand-gold text-brand-gold"
              : "border-transparent text-white/50 hover:text-white"
          }`}
        >
          <LayoutGrid size={14} /> {t("dashboard.tabItems")} ({menuItems.length})
        </button>
        <button
          onClick={() => { setActiveTab("categories"); clearCatForm(); }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "categories"
              ? "border-brand-gold text-brand-gold"
              : "border-transparent text-white/50 hover:text-white"
          }`}
        >
          <Settings size={14} /> {t("dashboard.tabCategories")} ({categories.length})
        </button>
      </div>

      {/* Toast Notification */}
      {message && (
        <div className={`fixed bottom-5 right-5 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border transition-all duration-300 animate-slide-up ${
          message.type === "success" 
            ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300" 
            : "bg-brand-red/90 border-brand-red/30 text-white"
        }`}>
          {message.type === "success" ? <Check size={18} /> : <X size={18} />}
          <span className="text-xs sm:text-sm font-semibold">{message.text}</span>
        </div>
      )}

      {/* TAB 1: Menu Items Management */}
      {activeTab === "items" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form: Left (cols 4) */}
          <div className="lg:col-span-4 bg-card-bg border border-white/5 rounded-3xl p-6 flex flex-col gap-6 sticky top-24">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                {editingId ? t("dashboard.editItem") : t("dashboard.createItem")}
              </h2>
              <p className="text-[11px] text-white/50 mt-1">
                {t("dashboard.itemFormDesc")}
              </p>
            </div>

            <form onSubmit={handleItemSubmit} className="flex flex-col gap-4">
              
              {/* Title (English) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="titleEn" className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center justify-between">
                  <span>{t("dashboard.fieldTitleEn")} <span className="text-brand-red">*</span></span>
                  <span className="text-[10px] text-brand-gold lowercase select-none">EN</span>
                </label>
                <input
                  id="titleEn"
                  type="text"
                  required
                  placeholder={t("dashboard.fieldTitleEnPlaceholder")}
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full bg-black border border-white/10 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Title (Arabic) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="titleAr" className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center justify-between">
                  <span>{t("dashboard.fieldTitleAr")} <span className="text-brand-red">*</span></span>
                  <span className="text-[10px] text-brand-gold lowercase select-none">AR (العربية)</span>
                </label>
                <input
                  id="titleAr"
                  type="text"
                  required
                  dir="rtl"
                  placeholder={t("dashboard.fieldTitleArPlaceholder")}
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  className="w-full bg-black border border-white/10 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all text-right"
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="price" className="text-xs font-bold text-white/70 uppercase tracking-wider">
                    {t("dashboard.fieldPrice")} <span className="text-brand-red">*</span>
                  </label>
                  <input
                    id="price"
                    type="text"
                    required
                    placeholder={t("dashboard.fieldPricePlaceholder")}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-black border border-white/10 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="category" className="text-xs font-bold text-white/70 uppercase tracking-wider">
                    {t("dashboard.fieldCategory")} <span className="text-brand-red">*</span>
                  </label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-white/10 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                  >
                    {categories.length === 0 ? (
                      <option value="" disabled>{t("dashboard.noCategoriesAvailable")}</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {lang === "ar" ? cat.nameAr : cat.nameEn}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Description (English) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="descriptionEn" className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center justify-between">
                  <span>{t("dashboard.fieldDescEn")}</span>
                  <span className="text-[10px] text-brand-gold lowercase select-none">EN</span>
                </label>
                <textarea
                  id="descriptionEn"
                  rows={2}
                  placeholder={t("dashboard.fieldDescEnPlaceholder")}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full bg-black border border-white/10 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Description (Arabic) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="descriptionAr" className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center justify-between">
                  <span>{t("dashboard.fieldDescAr")}</span>
                  <span className="text-[10px] text-brand-gold lowercase select-none">AR (العربية)</span>
                </label>
                <textarea
                  id="descriptionAr"
                  rows={2}
                  dir="rtl"
                  placeholder={t("dashboard.fieldDescArPlaceholder")}
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  className="w-full bg-black border border-white/10 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all text-right resize-none"
                />
              </div>

              {/* Image Upload Area */}
              <div className="flex flex-col gap-2 p-4 bg-black/40 border border-dashed border-white/10 rounded-2xl">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                  <Upload size={12} className="text-brand-gold" /> {t("dashboard.dragDrop")}
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-white/50 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
                />
                {imagePreview ? (
                  <div className="relative w-full h-24 rounded-lg overflow-hidden border border-white/10 mt-1.5 bg-black">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-white/40 text-center py-2 flex items-center justify-center gap-1 select-none">
                    <FileImage size={12} />
                    {t("dashboard.previewPlaceholder")}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2.5 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-bold uppercase transition-all"
                  >
                    {t("dashboard.cancelBtn")}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={addMutation.isPending || updateMutation.isPending || isUploading}
                  className="flex-[2] py-2.5 bg-brand-gold hover:bg-brand-gold/90 text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/10 hover:scale-[1.02]"
                >
                  {(addMutation.isPending || updateMutation.isPending || isUploading) ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : editingId ? (
                    t("dashboard.saveBtn")
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Plus size={14} /> {t("dashboard.addBtn")}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Table List View: Right (cols 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6 w-full">
            
            {/* Search and category filter */}
            <div className="bg-card-bg border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Search */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="text"
                  placeholder={t("dashboard.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black border border-white/10 focus:border-brand-gold rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Dynamic Filter Pills */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="text-white/40 flex-shrink-0" size={16} />
                <div className="flex gap-1 overflow-x-auto scrollbar-none py-1 select-none w-full">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border flex-shrink-0 ${
                      selectedCategory === "all"
                        ? "bg-brand-gold border-brand-gold text-black"
                        : "bg-black/50 border-white/5 text-white/60 hover:text-white hover:border-white/10"
                    }`}
                  >
                    {t("menu.all")}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border flex-shrink-0 ${
                        selectedCategory === cat.id
                          ? "bg-brand-gold border-brand-gold text-black"
                          : "bg-black/50 border-white/5 text-white/60 hover:text-white hover:border-white/10"
                      }`}
                    >
                      {lang === "ar" ? cat.nameAr : cat.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List Output */}
            {isLoading ? (
              <div className="flex flex-col gap-4 py-12 items-center justify-center text-white/50 bg-card-bg border border-white/5 rounded-3xl">
                <Loader2 className="animate-spin text-brand-gold" size={32} />
                <span className="text-sm font-medium">{lang === "ar" ? "جاري التحميل..." : "Loading items..."}</span>
              </div>
            ) : hasError ? (
              <div className="bg-brand-red/10 border border-brand-red/20 rounded-2xl p-6 text-center text-brand-red">
                {lang === "ar" ? "فشل تحميل المحتوى. يرجى التحقق من قواعد Firestore." : "Failed to load content. Please refresh or verify Firestore rules."}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-card-bg border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
                <span className="text-3xl">🍔</span>
                <h3 className="text-base font-bold text-white mt-1">{t("dashboard.noItems")}</h3>
              </div>
            ) : (
              <div className="overflow-x-auto w-full border border-white/5 rounded-3xl bg-card-bg shadow-xl">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/2 text-white/40 uppercase tracking-widest text-[9px] font-extrabold select-none">
                      <th className="p-4 w-20">{lang === "ar" ? "الصورة" : "Image"}</th>
                      <th className="p-4">{t("dashboard.itemDetails")} ({lang.toUpperCase()})</th>
                      <th className="p-4">{t("dashboard.fieldCategory")}</th>
                      <th className="p-4">{lang === "ar" ? "السعر" : "Price"}</th>
                      <th className="p-4 text-right w-24">{t("dashboard.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredItems.map((item) => {
                      const cat = categories.find(c => c.id === item.category);
                      const categoryName = cat ? (lang === "ar" ? cat.nameAr : cat.nameEn) : item.category;
                      const title = lang === "ar" ? item.titleAr : item.titleEn;
                      const desc = lang === "ar" ? item.descriptionAr : item.descriptionEn;

                      return (
                        <tr key={item.id} className="hover:bg-white/2 transition-colors duration-200">
                          
                          <td className="p-4">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/5">
                              <Image 
                                src={item.image} 
                                alt={title} 
                                fill 
                                sizes="48px"
                                className="object-cover" 
                              />
                            </div>
                          </td>

                          <td className="p-4 max-w-xs">
                            <div className="font-bold text-white truncate text-sm sm:text-base leading-snug">
                              {title}
                            </div>
                            <div className="text-xs text-white/40 font-light truncate mt-0.5" title={desc}>
                              {desc || (lang === "ar" ? "لا يوجد وصف." : "No description.")}
                            </div>
                            {/* Subtitle with alternative language */}
                            <div className="text-[10px] text-white/30 italic truncate mt-0.5">
                              {lang === "ar" ? "الاسم الآخر" : "Alt"}: {lang === "ar" ? item.titleEn : item.titleAr}
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-black/50 px-2.5 py-1 rounded-md border border-white/5 text-white/70">
                              {categoryName}
                            </span>
                          </td>

                          <td className="p-4 font-mono font-bold text-brand-gold text-sm">
                            {item.price}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => startEditItem(item)}
                                title={t("dashboard.edit")}
                                className="p-1.5 text-white/50 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-all"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(lang === 'ar' ? `هل أنت متأكد من رغبتك في حذف "${item.titleAr}"؟` : `Are you sure you want to delete "${item.titleEn}"?`)) {
                                    deleteMutation.mutate(item.id);
                                  }
                                }}
                                disabled={deleteMutation.isPending}
                                title={t("dashboard.delete")}
                                className="p-1.5 text-white/50 hover:text-brand-red hover:bg-white/5 rounded-lg transition-all"
                              >
                                {deleteMutation.isPending ? (
                                  <Loader2 className="animate-spin text-brand-red" size={15} />
                                ) : (
                                  <Trash2 size={15} />
                                )}
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && !hasError && filteredItems.length > 0 && (
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest text-right mr-2">
                {lang === "ar" 
                  ? `عرض ${filteredItems.length} من أصل ${menuItems.length} أطباق`
                  : `Showing ${filteredItems.length} of ${menuItems.length} items`
                }
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB 2: Categories Management */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Category Form: Left (cols 4) */}
          <div className="lg:col-span-4 bg-card-bg border border-white/5 rounded-3xl p-6 flex flex-col gap-6 sticky top-24">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderPlus size={16} className="text-brand-gold" />
                {editingCatId ? t("dashboard.editCat") : t("dashboard.createCat")}
              </h2>
              <p className="text-[11px] text-white/50 mt-1">
                {t("dashboard.catFormDesc")}
              </p>
            </div>

            <form onSubmit={handleCatSubmit} className="flex flex-col gap-4">
              
              {/* English Category Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="catNameEn" className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center justify-between">
                  <span>{t("dashboard.fieldCatNameEn")} <span className="text-brand-red">*</span></span>
                  <span className="text-[10px] text-brand-gold lowercase select-none">EN</span>
                </label>
                <input
                  id="catNameEn"
                  type="text"
                  required
                  placeholder={t("dashboard.fieldCatNameEnPlaceholder")}
                  value={catNameEn}
                  onChange={(e) => setCatNameEn(e.target.value)}
                  className="w-full bg-black border border-white/10 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Arabic Category Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="catNameAr" className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center justify-between">
                  <span>{t("dashboard.fieldCatNameAr")} <span className="text-brand-red">*</span></span>
                  <span className="text-[10px] text-brand-gold lowercase select-none">AR (العربية)</span>
                </label>
                <input
                  id="catNameAr"
                  type="text"
                  required
                  dir="rtl"
                  placeholder={t("dashboard.fieldCatNameArPlaceholder")}
                  value={catNameAr}
                  onChange={(e) => setCatNameAr(e.target.value)}
                  className="w-full bg-black border border-white/10 focus:border-brand-gold rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all text-right"
                />
              </div>

              <div className="flex gap-3 mt-2">
                {editingCatId && (
                  <button
                    type="button"
                    onClick={clearCatForm}
                    className="flex-1 py-2.5 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-bold uppercase transition-all"
                  >
                    {t("dashboard.cancelBtn")}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={addCatMutation.isPending || updateCatMutation.isPending}
                  className="flex-[2] py-2.5 bg-brand-gold hover:bg-brand-gold/90 text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/10 hover:scale-[1.02]"
                >
                  {(addCatMutation.isPending || updateCatMutation.isPending) ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : editingCatId ? (
                    t("dashboard.saveCatBtn")
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Plus size={14} /> {t("dashboard.addCatBtn")}
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="p-4 bg-brand-red/5 border border-brand-red/10 rounded-2xl text-[10px] text-white/60 leading-relaxed font-light">
              <span className="font-bold text-brand-red block mb-1">⚠️ {lang === "ar" ? "تحذير" : "Warning"}</span>
              {lang === "ar" 
                ? "حذف التصنيف لن يحذف الأطباق التابعة له تلقائياً. يرجى التأكد من نقل الأطباق لتصنيف آخر قبل الحذف."
                : "Deleting a category will not automatically delete its menu items. Make sure to update items to a new category before deletion."
              }
            </div>
          </div>

          {/* Categories List: Right (cols 8) */}
          <div className="lg:col-span-8 w-full">
            {isLoading ? (
              <div className="flex flex-col gap-4 py-12 items-center justify-center text-white/50 bg-card-bg border border-white/5 rounded-3xl">
                <Loader2 className="animate-spin text-brand-gold" size={32} />
                <span className="text-sm font-medium">{lang === "ar" ? "جاري التحميل..." : "Loading categories..."}</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="bg-card-bg border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
                <span className="text-3xl">📁</span>
                <h3 className="text-base font-bold text-white mt-1">{t("dashboard.noCategories")}</h3>
                <p className="text-xs text-white/40 max-w-xs font-light">
                  {lang === "ar" ? "أضف تصنيفات مخصصة من اليسار للبدء." : "Add custom categories on the left to start classifying your items."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full border border-white/5 rounded-3xl bg-card-bg shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/2 text-white/40 uppercase tracking-widest text-[9px] font-extrabold select-none">
                      <th className="p-4">{t("dashboard.categoryList")} (English / العربية)</th>
                      <th className="p-4">Document ID</th>
                      <th className="p-4 text-right w-24">{t("dashboard.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-white/2 transition-colors duration-200">
                        <td className="p-4">
                          <span className="font-bold text-white">{cat.nameEn}</span>
                          <span className="text-white/40 mx-2">/</span>
                          <span className="font-bold text-brand-gold" dir="rtl">{cat.nameAr}</span>
                        </td>
                        <td className="p-4 font-mono text-xs text-white/40">{cat.id}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => startEditCat(cat)}
                              title={t("dashboard.edit")}
                              className="p-1.5 text-white/50 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-all"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(lang === "ar" ? `هل أنت متأكد من رغبتك في حذف التصنيف "${cat.nameAr}"؟` : `Are you sure you want to delete Category "${cat.nameEn}"?`)) {
                                  deleteCatMutation.mutate(cat.id);
                                }
                              }}
                              disabled={deleteCatMutation.isPending}
                              title={t("dashboard.delete")}
                              className="p-1.5 text-white/50 hover:text-brand-red hover:bg-white/5 rounded-lg transition-all"
                            >
                              {deleteCatMutation.isPending ? (
                                <Loader2 className="animate-spin text-brand-red" size={15} />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
