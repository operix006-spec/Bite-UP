import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { products as initialProducts } from '../data/products';
import type { Product } from '../data/products';
import { defaultContent, defaultMenuCategories } from '../data/defaultContent';
import type { SiteContent, MenuCategory } from '../data/defaultContent';
import { locations as initialLocations } from '../data/locations';
import type { Location } from '../data/locations';

interface AdminContextType {
  products: Product[];
  siteContent: SiteContent;
  locations: Location[];
  categories: MenuCategory[];
  loading: boolean;
  updateProduct: (product: Product) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  reorderProducts: (products: Product[]) => Promise<void>;
  updateSiteContent: (content: SiteContent) => Promise<void>;
  addCategory: (category: MenuCategory) => Promise<void>;
  updateCategory: (oldId: string, updated: MenuCategory) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categories: MenuCategory[]) => Promise<void>;
  addLocation: (loc: Location) => Promise<void>;
  updateLocation: (loc: Location) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const CACHE_KEYS = {
  products: 'biteup_products_cache_v2',
  content: 'biteup_content_cache_v2',
  locations: 'biteup_locations_cache_v2'
};

const getCached = <T,>(key: string, fallback: T): { data: T; hasCache: boolean } => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (parsed) return { data: parsed, hasCache: true };
    }
  } catch {
    // Ignore storage parse errors
  }
  return { data: fallback, hasCache: false };
};

const saveCached = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize directly from browser cache (contains yesterday's edits) or initial defaults
  const cachedProds = getCached<Product[]>(CACHE_KEYS.products, initialProducts);
  const cachedContent = getCached<SiteContent>(CACHE_KEYS.content, defaultContent);
  const cachedLocs = getCached<Location[]>(CACHE_KEYS.locations, initialLocations);

  // Auto-upgrade chatbot settings if empty or unconfigured or using old prompt
  const initialContentData = { ...defaultContent, ...cachedContent.data };
  if (!initialContentData.chatbotApiKey || initialContentData.chatbotApiKey.trim() === '') {
    initialContentData.chatbotApiKey = defaultContent.chatbotApiKey;
    initialContentData.chatbotApiProvider = defaultContent.chatbotApiProvider;
    initialContentData.chatbotModel = defaultContent.chatbotModel;
    initialContentData.chatbotApiUrl = defaultContent.chatbotApiUrl;
  }
  if (!initialContentData.chatbotApiUrl || !initialContentData.chatbotApiUrl.endsWith('/chat/completions')) {
    initialContentData.chatbotApiUrl = defaultContent.chatbotApiUrl;
  }
  if (!initialContentData.chatbotSystemPrompt || !initialContentData.chatbotSystemPrompt.includes('تحدث دائماً بلغة العميل')) {
    initialContentData.chatbotSystemPrompt = defaultContent.chatbotSystemPrompt;
    initialContentData.chatbotKnowledgeBase = defaultContent.chatbotKnowledgeBase;
    initialContentData.chatbotQuickSuggestions = defaultContent.chatbotQuickSuggestions;
    initialContentData.chatbotWelcomeHeading = defaultContent.chatbotWelcomeHeading;
    initialContentData.chatbotWelcomeSubtext = defaultContent.chatbotWelcomeSubtext;
    initialContentData.chatbotAssistantName = defaultContent.chatbotAssistantName;
  }
  if (!initialContentData.menuCategories) {
    initialContentData.menuCategories = defaultContent.menuCategories;
  }

  const hasCachedData = cachedProds.hasCache || cachedContent.hasCache || cachedLocs.hasCache;

  const [products, setProductsState] = useState<Product[]>(cachedProds.data);
  const [siteContent, setSiteContentState] = useState<SiteContent>(initialContentData);
  const [locations, setLocationsState] = useState<Location[]>(cachedLocs.data);
  // If we already have cached edits, show them instantly (loading = false).
  // If first visit without cache, show brief loading until Supabase completes (loading = true).
  const [loading, setLoading] = useState(!hasCachedData);

  // Synchronized state setters that persist to localStorage
  const setProducts: React.Dispatch<React.SetStateAction<Product[]>> = (val) => {
    setProductsState(prev => {
      const next = typeof val === 'function' ? (val as (p: Product[]) => Product[])(prev) : val;
      saveCached(CACHE_KEYS.products, next);
      return next;
    });
  };

  const setLocations: React.Dispatch<React.SetStateAction<Location[]>> = (val) => {
    setLocationsState(prev => {
      const next = typeof val === 'function' ? (val as (l: Location[]) => Location[])(prev) : val;
      saveCached(CACHE_KEYS.locations, next);
      return next;
    });
  };

  const setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>> = (val) => {
    setSiteContentState(prev => {
      const next = typeof val === 'function' ? (val as (c: SiteContent) => SiteContent)(prev) : val;
      saveCached(CACHE_KEYS.content, next);
      return next;
    });
  };

  useEffect(() => {
    // Safety timeout: on first visit without cache, allow sufficient time (7s) for Supabase to deliver fresh data over mobile networks
    const timeout = setTimeout(() => {
      setLoading(false);
    }, hasCachedData ? 1500 : 7000);

    fetchData();

    return () => clearTimeout(timeout);
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, locRes, contentRes] = await Promise.all([
        supabase.from('products').select('*').order('orderIndex', { ascending: true }),
        supabase.from('locations').select('*').order('created_at', { ascending: true }),
        supabase.from('site_content').select('*')
      ]);

      let hasData = false;
      let finalProducts = prodRes.data || [];
      let finalLocations = locRes.data || [];
      let finalContent = { ...defaultContent };

      if (prodRes.data && prodRes.data.length > 0) hasData = true;
      if (locRes.data && locRes.data.length > 0) hasData = true;
      if (contentRes.data && contentRes.data.length > 0) {
        hasData = true;
        const mappedContent: Record<string, string> = {};
        contentRes.data.forEach(item => {
          mappedContent[item.key] = item.value;
        });
        finalContent = { ...defaultContent, ...mappedContent };
      }

      if (!hasData) {
        // Initialize Supabase with defaults if completely empty
        await initializeDefaults();
      } else {
        // NORMALIZE & SANITIZE PRODUCTS: guarantees prices are numbers and images exist
        const safeProducts = (finalProducts.length > 0 ? finalProducts : initialProducts).map((p: any, i: number) => ({
          ...p,
          price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
          calories: p.calories ? Number(p.calories) : null,
          protein: p.protein ? Number(p.protein) : null,
          carbs: p.carbs ? Number(p.carbs) : null,
          fat: p.fat ? Number(p.fat) : null,
          image: p.image || initialProducts[i % initialProducts.length]?.image || '/images/products/pudding-brownie.png'
        }));

        // NORMALIZE LOCATIONS
        const safeLocations = (finalLocations.length > 0 ? finalLocations : initialLocations).map((l: any) => ({
          ...l,
          name: l.name || '',
          area: l.area || '',
          city: l.city || 'Amman',
          category: l.category || 'supermarket'
        }));

        // NORMALIZE CONTENT: guarantee every single field has a fallback to defaultContent
        const safeContent = { ...defaultContent, ...finalContent };
        Object.keys(defaultContent).forEach(k => {
          const key = k as keyof SiteContent;
          if (!safeContent[key] || typeof safeContent[key] !== 'string') {
            (safeContent as any)[key] = (defaultContent as any)[key] || '';
          }
        });

        // Preserve cached chatbotApiKey if cloud doesn't have it
        if (!safeContent.chatbotApiKey || safeContent.chatbotApiKey.trim() === '') {
          safeContent.chatbotApiKey = cachedContent.data?.chatbotApiKey || defaultContent.chatbotApiKey;
          safeContent.chatbotApiProvider = defaultContent.chatbotApiProvider;
          safeContent.chatbotModel = defaultContent.chatbotModel;
          safeContent.chatbotApiUrl = defaultContent.chatbotApiUrl;
        }
        if (!safeContent.chatbotApiUrl || !safeContent.chatbotApiUrl.endsWith('/chat/completions')) {
          safeContent.chatbotApiUrl = defaultContent.chatbotApiUrl;
        }

        if (!safeContent.chatbotSystemPrompt || !safeContent.chatbotSystemPrompt.includes('تحدث دائماً بلغة العميل')) {
          safeContent.chatbotSystemPrompt = defaultContent.chatbotSystemPrompt;
          safeContent.chatbotKnowledgeBase = defaultContent.chatbotKnowledgeBase;
          safeContent.chatbotQuickSuggestions = defaultContent.chatbotQuickSuggestions;
          safeContent.chatbotWelcomeHeading = defaultContent.chatbotWelcomeHeading;
          safeContent.chatbotWelcomeSubtext = defaultContent.chatbotWelcomeSubtext;
          safeContent.chatbotAssistantName = defaultContent.chatbotAssistantName;
        }

        if (!safeContent.menuCategories) {
          safeContent.menuCategories = defaultContent.menuCategories;
        }

        setProducts(safeProducts as Product[]);
        setLocations(safeLocations as Location[]);
        setSiteContent(safeContent);
      }
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      if (!hasCachedData) {
        setProducts(initialProducts);
        setLocations(initialLocations);
        setSiteContent(defaultContent);
      }
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaults = async () => {
    try {
      const productsToInsert = initialProducts.map((p, i) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        calories: p.calories || null,
        protein: p.protein || null,
        carbs: p.carbs || null,
        fat: p.fat || null,
        sugarNote: p.sugarNote || null,
        image: p.image,
        featured: p.featured || false,
        nutritionFeatured: p.nutritionFeatured || false,
        nutritionTabName: p.nutritionTabName || null,
        orderIndex: i
      }));
      await supabase.from('products').insert(productsToInsert);

      const locationsToInsert = initialLocations.map(l => ({
        id: l.id,
        name: l.name,
        area: l.area,
        city: l.city,
        category: l.category,
        mapUrl: l.mapUrl || ''
      }));
      await supabase.from('locations').insert(locationsToInsert);

      const contentEntries = Object.entries(defaultContent).map(([key, value]) => ({
        key,
        value
      }));
      await supabase.from('site_content').insert(contentEntries);

      setProducts(initialProducts);
      setLocations(initialLocations);
      setSiteContent(defaultContent);
    } catch (err) {
      console.error('Error initializing defaults:', err);
    }
  };

  const addProduct = async (product: Product) => {
    try {
      const dbProduct = { ...product, orderIndex: products.length };
      await supabase.from('products').insert(dbProduct);
      setProducts(prev => [...prev, product]);
    } catch (e) {
      console.error(e);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p)); // Optimistic UI
      await supabase.from('products').update(product).eq('id', product.id);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setProducts(prev => prev.filter(p => p.id !== id)); // Optimistic UI
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.error(e);
    }
  };

  const reorderProducts = async (newOrder: Product[]) => {
    try {
      setProducts(newOrder); // Optimistic UI
      
      const updates = newOrder.map((p, index) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        image: p.image,
        orderIndex: index
      }));
      
      await supabase.from('products').upsert(updates);
    } catch (e) {
      console.error(e);
    }
  };

  const updateSiteContent = async (content: SiteContent) => {
    try {
      setSiteContent(content); // Optimistic UI
      const upsertData = Object.entries(content).map(([key, value]) => ({ key, value: value.toString() }));
      await supabase.from('site_content').upsert(upsertData);
    } catch (e) {
      console.error(e);
    }
  };

  const addLocation = async (loc: Location) => {
    try {
      setLocations(prev => [...prev, loc]); // Optimistic UI
      await supabase.from('locations').insert(loc);
    } catch (e) {
      console.error(e);
    }
  };

  const updateLocation = async (loc: Location) => {
    try {
      setLocations(prev => prev.map(l => l.id === loc.id ? loc : l)); // Optimistic UI
      await supabase.from('locations').update(loc).eq('id', loc.id);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      setLocations(prev => prev.filter(l => l.id !== id)); // Optimistic UI
      await supabase.from('locations').delete().eq('id', id);
    } catch (e) {
      console.error(e);
    }
  };

  const categories: MenuCategory[] = React.useMemo(() => {
    try {
      if (siteContent.menuCategories) {
        const parsed = JSON.parse(siteContent.menuCategories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing menuCategories:', e);
    }
    return defaultMenuCategories;
  }, [siteContent.menuCategories]);

  const addCategory = async (cat: MenuCategory) => {
    try {
      const nextCats = [...categories, cat];
      const newContent = { ...siteContent, menuCategories: JSON.stringify(nextCats) };
      await updateSiteContent(newContent);
    } catch (e) {
      console.error(e);
    }
  };

  const updateCategory = async (oldId: string, updated: MenuCategory) => {
    try {
      const nextCats = categories.map(c => c.id === oldId ? updated : c);
      const newContent = { ...siteContent, menuCategories: JSON.stringify(nextCats) };
      await updateSiteContent(newContent);

      // If ID changed, cascade update all products that used oldId
      if (oldId !== updated.id) {
        const updatedProducts = products.map(p => p.category === oldId ? { ...p, category: updated.id } : p);
        setProducts(updatedProducts);
        try {
          await supabase.from('products').update({ category: updated.id }).eq('category', oldId);
        } catch (err) {
          console.error('Failed to cascade category change to products:', err);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const nextCats = categories.filter(c => c.id !== id);
      const newContent = { ...siteContent, menuCategories: JSON.stringify(nextCats) };
      await updateSiteContent(newContent);
    } catch (e) {
      console.error(e);
    }
  };

  const reorderCategories = async (newOrder: MenuCategory[]) => {
    try {
      const newContent = { ...siteContent, menuCategories: JSON.stringify(newOrder) };
      await updateSiteContent(newContent);
    } catch (e) {
      console.error(e);
    }
  };

  const resetToDefaults = async () => {
    try {
      setLoading(true);
      localStorage.removeItem(CACHE_KEYS.products);
      localStorage.removeItem(CACHE_KEYS.locations);
      localStorage.removeItem(CACHE_KEYS.content);

      await supabase.from('products').delete().neq('id', 'temp_invalid_id');
      await supabase.from('locations').delete().neq('id', 'temp_invalid_id');
      await supabase.from('site_content').delete().neq('key', 'temp_invalid_id');
      
      await initializeDefaults();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        siteContent,
        locations,
        categories,
        loading,
        updateProduct,
        addProduct,
        deleteProduct,
        reorderProducts,
        updateSiteContent,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addLocation,
        updateLocation,
        deleteLocation,
        resetToDefaults,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
