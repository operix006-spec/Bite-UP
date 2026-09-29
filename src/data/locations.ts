export interface Location {
  id: string;
  name: string;
  area: string;
  city: string;
  category?: string;
  note?: string;
  mapUrl?: string;
}

const DEFAULT_MAP_URL = 'https://www.google.com/maps/place/Amman/data=!4m2!3m1!1s0x151b5fb85d7981af:0x631c30c0f8dc65e8?sa=X&ved=1t:242&ictx=111';

export const locations: Location[] = [
  { id: 'l1', name: 'Mota 3', area: 'Marj Al Hamam', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l2', name: 'Mota 7', area: 'Marj Al Hamam', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l3', name: 'Mota 10', area: 'Marj Al Hamam', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l4', name: 'Mota 12', area: 'Marj Al Hamam', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l5', name: 'Ghannam Stores', area: 'Marj Al Hamam', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l6', name: 'Janna Razan Supermarket', area: 'Al Jubeiha', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l7', name: 'Sarees Supermarket', area: 'Al Jubeiha', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l8', name: 'Al-Jazira Markets', area: 'Dahiyat Al Rashid', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l9', name: 'Saqeili Supermarket', area: 'Sweileh', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l10', name: 'Sabah Al Asal Supermarket', area: 'Abu Nsair', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l11', name: 'Premium Market', area: 'Tabarbour', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l12', name: 'Pit Stop Market', area: 'Wadi Saqra', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l13', name: 'Carmel Coffee Corner', area: 'Shmeisani', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l14', name: 'Bawabet Umm Al Summaq Supermarket', area: 'Khalda', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL },
  { id: 'l15', name: 'Eves Bloom Gym', area: 'Additional Location', city: 'Amman, Jordan', mapUrl: DEFAULT_MAP_URL }
];
