import React, { createContext, useContext, useState, useEffect } from 'react';
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
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  reorderProducts: (products: Product[]) => void;
  updateSiteContent: (content: SiteContent) => void;
  addLocation: (loc: Location) => void;
  updateLocation: (loc: Location) => void;
  deleteLocation: (id: string) => void;
  resetToDefaults: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('upbite_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('upbite_content');
    return saved ? { ...defaultContent, ...JSON.parse(saved) } : defaultContent;
  });

  const [locations, setLocations] = useState<Location[]>(() => {
    const saved = localStorage.getItem('upbite_locations');
    return saved ? JSON.parse(saved) : initialLocations;
  });

  useEffect(() => {
    localStorage.setItem('upbite_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('upbite_content', JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem('upbite_locations', JSON.stringify(locations));
  }, [locations]);

  // Product CRUD
  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  const reorderProducts = (newOrder: Product[]) => {
    setProducts(newOrder);
  };

  // Content Update
  const updateSiteContent = (content: SiteContent) => {
    setSiteContent(content);
  };

  // Location CRUD
  const addLocation = (loc: Location) => {
    setLocations((prev) => [...prev, loc]);
  };
  const updateLocation = (updatedLoc: Location) => {
    setLocations((prev) => prev.map((l) => (l.id === updatedLoc.id ? updatedLoc : l)));
  };
  const deleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const resetToDefaults = () => {
    setProducts(initialProducts);
    setSiteContent(defaultContent);
    setLocations(initialLocations);
    localStorage.removeItem('upbite_products');
    localStorage.removeItem('upbite_content');
    localStorage.removeItem('upbite_locations');
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        siteContent,
        locations,
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
