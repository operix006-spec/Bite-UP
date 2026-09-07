export interface Location {
  id: string;
  name: string;
  area: string;
  city: string;
  category: 'supermarket' | 'coffee-spot';
  mapUrl?: string;
}

export const locations: Location[] = [
  { id: 'l1', name: 'Mota 3', area: 'Marj Al Hamam', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l2', name: 'Mota 7', area: 'Marj Al Hamam', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l3', name: 'Mota 10', area: 'Marj Al Hamam', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l4', name: 'Mota 12', area: 'Marj Al Hamam', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l5', name: 'Ghannam Stores', area: 'Marj Al Hamam', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l6', name: 'Janna Razan Supermarket', area: 'Al Jubeiha', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l7', name: 'Sarees Supermarket', area: 'Al Jubeiha', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l8', name: 'Al-Jazira Markets', area: 'Dahiyat Al Rashid', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l9', name: 'Saqeili Supermarket', area: 'Sweileh', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l10', name: 'Sabah Al Asal Supermarket', area: 'Abu Nsair', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l11', name: 'Premium Market', area: 'Tabarbour', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l12', name: 'Pit Stop Market', area: 'Wadi Saqra', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l13', name: 'Carmel Coffee Corner', area: 'Shmeisani', city: 'Amman, Jordan', category: 'coffee-spot' },
  { id: 'l14', name: 'Bawabet Umm Al Summaq Supermarket', area: 'Khalda', city: 'Amman, Jordan', category: 'supermarket' },
  { id: 'l15', name: 'Eves Bloom Gy', area: 'Additional Location', city: 'Amman, Jordan', category: 'supermarket' } // Kept generic as requested
];
