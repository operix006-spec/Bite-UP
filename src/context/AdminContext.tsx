import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { products as initialProducts } from '../data/products';
import type { Product } from '../data/products';
import { defaultContent } from '../data/defaultContent';
import type { SiteContent } from '../data/defaultContent';
import { locations as initialLocations } from '../data/locations';
import type { Location } from '../data/locations';

interface AdminContextType {
  products: Product[];
  siteContent: SiteContent;
  locations: Location[];
  loading: boolean;
  updateProduct: (product: Product) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  reorderProducts: (products: Product[]) => Promise<void>;
  updateSiteContent: (content: SiteContent) => Promise<void>;
  addLocation: (loc: Location) => Promise<void>;
  updateLocation: (loc: Location) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
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
        setProducts(finalProducts as Product[]);
        setLocations(finalLocations as Location[]);
        setSiteContent(finalContent);
      }
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      // Resilient fallback ensures site never stays blank
      setProducts(initialProducts);
      setLocations(initialLocations);
      setSiteContent(defaultContent);
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

  const resetToDefaults = async () => {
    try {
      setLoading(true);
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
        loading,
        updateProduct,
        addProduct,
        deleteProduct,
        reorderProducts,
        updateSiteContent,
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
