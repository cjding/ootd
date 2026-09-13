export const SEEDED_OUTFITS = [
  {
    id: 'o1', name: 'Cream knit & navy trousers',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85',
    temperatureBands: ['cold', 'mild'], use: 'work', rainFriendly: false,
    detail: 'Add the slim burgundy belt.', favorite: true, status: 'available', lastWorn: '2026-08-22',
  },
  {
    id: 'o2', name: 'Navy dress & ivory blazer',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85',
    temperatureBands: ['mild', 'warm'], use: 'work', rainFriendly: false,
    detail: 'Wear the sculptural gold hoops.', favorite: false, status: 'available', lastWorn: '2026-08-29',
  },
  {
    id: 'o3', name: 'White shirt & olive trousers',
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=85',
    temperatureBands: ['mild', 'warm'], use: 'work', rainFriendly: false,
    detail: 'Tie the small silk scarf at the neck.', favorite: true, status: 'available', lastWorn: '2026-09-02',
  },
  {
    id: 'o4', name: 'Stone summer tailoring',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85',
    temperatureBands: ['warm'], use: 'work', rainFriendly: false,
    detail: 'Finish with the textured cuff.', favorite: false, status: 'available', lastWorn: '2026-08-18',
  },
  {
    id: 'o5', name: 'Blue shirt & raincoat',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
    temperatureBands: ['cold', 'mild'], use: 'work', rainFriendly: true,
    detail: 'Roll the poplin cuffs once.', favorite: false, status: 'available', lastWorn: '2026-08-11',
  },
  {
    id: 'o6', name: 'Modern pinstripe suit',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=900&q=85',
    temperatureBands: ['cold', 'mild'], use: 'work', rainFriendly: false,
    detail: 'Let the fine pinstripe be the detail.', favorite: true, status: 'available', lastWorn: '2026-09-07',
  },
  {
    id: 'o7', name: 'White tee & dark denim',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=85',
    temperatureBands: ['mild', 'warm'], use: 'casual', rainFriendly: false,
    detail: 'Add the woven leather belt.', favorite: false, status: 'available', lastWorn: '2026-09-10',
  },
];

export const DEFAULT_SETTINGS = {
  name: 'Alex',
  location: 'New York',
  latitude: 40.7128,
  longitude: -74.006,
};

export const SEED_HISTORY = [
  { id: 'w1', date: '2026-09-10', outfitId: 'o7', weather: '24°C · Clear' },
  { id: 'w2', date: '2026-09-07', outfitId: 'o6', weather: '19°C · Cloudy' },
  { id: 'w3', date: '2026-09-02', outfitId: 'o3', weather: '23°C · Clear' },
];
