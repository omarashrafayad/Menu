import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch
} from "firebase/firestore";
import { uploadImage as cloudinaryUpload } from "./cloudinary";

export interface MenuItem {
  id: string; // Firestore document ID
  titleAr: string; // Arabic Title
  titleEn: string; // English Title
  descriptionAr: string; // Arabic Description
  descriptionEn: string; // English Description
  price: string;
  image: string;
  category: string; // References Category ID (e.g., 'mains', or a generated Firestore ID)
  // For backward compatibility
  title?: string;
  description?: string;
}

export interface Category {
  id: string; // Firestore document ID
  nameAr: string; // Arabic Category Name
  nameEn: string; // English Category Name
  descriptionAr: string; // Arabic Category Description
  descriptionEn: string; // English Category Description
  order?: number; // Sorting/display order of category
  // For backward compatibility
  name?: string;
}

const MENU_COLLECTION = "menuItems";
const CATEGORY_COLLECTION = "categories";

const initialMenuItems: Omit<MenuItem, "id">[] = [
  // Appetizers
  {
    titleAr: "أجنحة أوربان",
    titleEn: "Urban Wings",
    descriptionAr: "أجنحة جامبو مغموسة في صلصة البوفالو بالبهارات الخمسة الخاصة بنا.",
    descriptionEn: "Jumbo wings tossed in our signature five-spice buffalo sauce.",
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80",
    category: "appetizers",
  },
  {
    titleAr: "بطاطس مقلية بالترافل",
    titleEn: "Truffle Loaded Fries",
    descriptionAr: "بطاطس مقلية مقطعة يدوياً، زيت الترافل، جبنة البارميزان، ومايونيز بالثوم المشوي.",
    descriptionEn: "Hand-cut fries, truffle oil, parmesan, and roasted garlic aioli.",
    price: "$10.50",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    category: "appetizers",
  },
  // Main Courses
  {
    titleAr: "برجر بيج فايف",
    titleEn: "The Big Five Burger",
    descriptionAr: "شريحتين لحم واجيو، مايونيز بلمسة الذهب، مخلل منزلي، وجبنة شيدر معتقة.",
    descriptionEn: "Double Wagyu patties, gold-infused mayo, house pickles, and aged cheddar.",
    price: "$18.00",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    category: "mains",
  },
  {
    titleAr: "بايلا نيون ستريت",
    titleEn: "Neon Street Paella",
    descriptionAr: "أرز بالزعفران، قريدس النمر المشوي، كلماري، وسجق كوريزو حار.",
    descriptionEn: "Saffron rice, grilled tiger prawns, calamari, and spicy chorizo.",
    price: "$24.50",
    image: "https://images.unsplash.com/photo-1534080391025-a87e89948c7c?auto=format&fit=crop&w=600&q=80",
    category: "mains",
  },
  // Desserts
  {
    titleAr: "كعكة الحمم البركانية",
    titleEn: "Midnight Lava Cake",
    descriptionAr: "كعكة كاكاو داكنة 70% بقلب دافئ ذائب وصلصة التوت البري.",
    descriptionEn: "70% dark cocoa cake with a warm melting heart and raspberry coulis.",
    price: "$9.50",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    category: "desserts",
  },
  // Drinks
  {
    titleAr: "الساعة الذهبية",
    titleEn: "The Golden Hour",
    descriptionAr: "بوربون مصنوع يدوياً، عسل مخفض بالزنجبيل، ونكهة الليمون المنعشة.",
    descriptionEn: "Craft bourbon, honey ginger reduction, and lemon essence.",
    price: "$14.00",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
    category: "drinks",
  },
];

// --- Menu Items CRUD Operations ---
export async function getMenuItems(): Promise<MenuItem[]> {
  const querySnapshot = await getDocs(collection(db, MENU_COLLECTION));
  const items: MenuItem[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    items.push({
      id: doc.id,
      titleAr: data.titleAr || data.title || "",
      titleEn: data.titleEn || data.title || "",
      descriptionAr: data.descriptionAr || data.description || "",
      descriptionEn: data.descriptionEn || data.description || "",
      price: data.price || "",
      image: data.image || "",
      category: data.category || "mains",
      // Include legacy fields as fallback
      title: data.title || "",
      description: data.description || ""
    });
  });
  return items;
}

export async function addMenuItem(item: Omit<MenuItem, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, MENU_COLLECTION), item);
  return docRef.id;
}

export async function updateMenuItem(id: string, item: Partial<Omit<MenuItem, "id">>): Promise<void> {
  const docRef = doc(db, MENU_COLLECTION, id);
  await updateDoc(docRef, item);
}

export async function deleteMenuItem(id: string): Promise<void> {
  const docRef = doc(db, MENU_COLLECTION, id);
  await deleteDoc(docRef);
}

// --- Categories CRUD Operations ---
export async function getCategories(): Promise<Category[]> {
  const querySnapshot = await getDocs(collection(db, CATEGORY_COLLECTION));
  const items: Category[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    items.push({
      id: doc.id,
      nameAr: data.nameAr || data.name || "",
      nameEn: data.nameEn || data.name || "",
      descriptionAr: data.descriptionAr || "",
      descriptionEn: data.descriptionEn || "",
      order: typeof data.order === 'number' ? data.order : 0,
      // Include legacy field as fallback
      name: data.name || ""
    });
  });
  
  // Sort categories by order ascending. If orders are equal, fall back to alphabetical En
  return items.sort((a, b) => {
    const diff = (a.order ?? 0) - (b.order ?? 0);
    if (diff !== 0) return diff;
    return a.nameEn.localeCompare(b.nameEn);
  });
}

export async function addCategory(category: Omit<Category, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, CATEGORY_COLLECTION), category);
  return docRef.id;
}

export async function updateCategory(id: string, category: Partial<Omit<Category, "id">>): Promise<void> {
  const docRef = doc(db, CATEGORY_COLLECTION, id);
  await updateDoc(docRef, category);
}

export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, CATEGORY_COLLECTION, id);
  await deleteDoc(docRef);
}

// --- Seeding Functions ---
export async function seedInitialMenuItems(): Promise<void> {
  // 1. Seed Categories first
  const existingCats = await getCategories();
  if (existingCats.length === 0) {
    const initialCategories = [
      { id: "appetizers", nameAr: "المقبلات", nameEn: "Appetizers", descriptionAr: "بداية شهية لرحلتك مع أطباقنا اللذيذة", descriptionEn: "A delicious start to your meal with our savory bites", order: 1 },
      { id: "mains", nameAr: "الأطباق الرئيسية", nameEn: "Main Courses", descriptionAr: "أطباقنا الحضرية المميزة المحضرة بكل شغف", descriptionEn: "Our signature urban mains crafted with passion", order: 2 },
      { id: "desserts", nameAr: "الحلويات", nameEn: "Desserts", descriptionAr: "نهاية حلوة ومثالية ليومك", descriptionEn: "A sweet and perfect ending to your day", order: 3 },
      { id: "drinks", nameAr: "المشروبات", nameEn: "Drinks", descriptionAr: "مشروبات منعشة لتكتمل تجربتك", descriptionEn: "Refreshing beverages to complete your dining experience", order: 4 }
    ];
    
    const catBatch = writeBatch(db);
    initialCategories.forEach((cat) => {
      const docRef = doc(db, CATEGORY_COLLECTION, cat.id);
      catBatch.set(docRef, { 
        nameAr: cat.nameAr, 
        nameEn: cat.nameEn,
        descriptionAr: cat.descriptionAr,
        descriptionEn: cat.descriptionEn,
        order: cat.order
      });
    });
    await catBatch.commit();
  }

  // 2. Seed Menu Items
  const existingItems = await getMenuItems();
  if (existingItems.length === 0) {
    const batch = writeBatch(db);
    initialMenuItems.forEach((item) => {
      const docRef = doc(collection(db, MENU_COLLECTION));
      batch.set(docRef, item);
    });
    await batch.commit();
  }
}

// --- Image Upload Helpers ---
export async function uploadImage(file: File): Promise<string> {
  return await cloudinaryUpload(file);
}
