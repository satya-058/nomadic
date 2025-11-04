
import type { TravelerProfile, OffbeatLocation, Hotel, DangerZone } from './types';

export const MOCK_TRAVELER_PROFILES: TravelerProfile[] = [
  {
    id: 1,
    name: 'Alex',
    age: 28,
    gender: 'Male',
    interests: ['Hiking', 'Photography', 'History'],
    home: 'Vancouver, CA',
    destination: 'Patagonia, AR',
    travelDates: { start: '2024-11-20', end: '2024-12-05' },
    profilePicUrl: 'https://picsum.photos/seed/alex/200/200',
    coordinates: { lat: 49.28, lng: -123.12 },
    destinationCoordinates: { lat: -50.0, lng: -70.0 },
  },
  {
    id: 2,
    name: 'Maria',
    age: 31,
    gender: 'Female',
    interests: ['Foodie', 'Art', 'Museums'],
    home: 'Rome, IT',
    destination: 'Kyoto, JP',
    travelDates: { start: '2024-10-10', end: '2024-10-22' },
    profilePicUrl: 'https://picsum.photos/seed/maria/200/200',
    coordinates: { lat: 41.90, lng: 12.49 },
    destinationCoordinates: { lat: 35.01, lng: 135.76 },
  },
  {
    id: 3,
    name: 'Kenji',
    age: 25,
    gender: 'Male',
    interests: ['Nightlife', 'Music', 'Urban Exploration'],
    home: 'Tokyo, JP',
    destination: 'Berlin, DE',
    travelDates: { start: '2024-09-05', end: '2024-09-15' },
    profilePicUrl: 'https://picsum.photos/seed/kenji/200/200',
    coordinates: { lat: 35.67, lng: 139.65 },
    destinationCoordinates: { lat: 52.52, lng: 13.40 },
  },
  {
    id: 4,
    name: 'Priya',
    age: 29,
    gender: 'Female',
    interests: ['Yoga', 'Beaches', 'Spirituality'],
    home: 'Goa, IN',
    destination: 'Bali, ID',
    travelDates: { start: '2025-01-15', end: '2025-01-30' },
    profilePicUrl: 'https://picsum.photos/seed/priya/200/200',
    coordinates: { lat: 15.29, lng: 74.12 },
    destinationCoordinates: { lat: -8.34, lng: 115.09 },
  },
   {
    id: 5,
    name: 'Sam',
    age: 27,
    gender: 'Other',
    interests: ['Backpacking', 'Volunteering', 'Languages'],
    home: 'Melbourne, AU',
    destination: 'Cusco, PE',
    travelDates: { start: '2024-09-20', end: '2024-10-18' },
    profilePicUrl: 'https://picsum.photos/seed/sam/200/200',
    coordinates: { lat: -37.81, lng: 144.96 },
    destinationCoordinates: { lat: -13.53, lng: -71.96 },
  },
  {
    id: 6,
    name: 'Chloe',
    age: 33,
    gender: 'Female',
    interests: ['Architecture', 'Cafes', 'Reading'],
    home: 'Paris, FR',
    destination: 'Prague, CZ',
    travelDates: { start: '2024-12-01', end: '2024-12-08' },
    profilePicUrl: 'https://picsum.photos/seed/chloe/200/200',
    coordinates: { lat: 48.85, lng: 2.35 },
    destinationCoordinates: { lat: 50.07, lng: 14.43 },
  },
];

export const MOCK_OFFBEAT_LOCATIONS: OffbeatLocation[] = [
    {
      id: 1,
      name: 'The Whispering Caves',
      location: 'Andalusia, Spain',
      bestSeason: 'Spring',
      description: 'A network of subterranean caves known for their unique acoustic properties. The main cavern is said to echo whispers for minutes.',
      imageUrl: 'https://picsum.photos/seed/caves/600/400',
      reviews: [
        { id: 1, username: 'Alex', date: '2024-07-15T10:00:00Z', rating: 5, comment: 'An absolutely surreal experience. The acoustics in the main cavern are mind-bending. A must-visit for adventurers!' },
        { id: 2, username: 'Maria', date: '2024-06-22T14:30:00Z', rating: 4, comment: 'Beautiful and eerie. It gets a bit crowded on weekends, so try to go on a weekday morning.' },
      ]
    },
    {
      id: 2,
      name: 'Sunken City Bookstore',
      location: 'Venice, Italy',
      bestSeason: 'Autumn',
      description: 'A charming, chaotic bookstore where books are kept in bathtubs and gondolas to protect them from the frequent floods.',
      imageUrl: 'https://picsum.photos/seed/bookstore/600/400',
      reviews: [
        { id: 3, username: 'Maria', date: '2024-08-01T11:00:00Z', rating: 5, comment: 'Felt like stepping into another world. It\'s a tiny, charming place with an incredible collection of rare books. The owner is a gem.' },
        { id: 4, username: 'Kenji', date: '2024-07-28T18:00:00Z', rating: 5, comment: 'So unique! I spent hours just browsing. The cats that live there are a bonus.' },
        { id: 5, username: 'Priya', date: '2024-05-10T09:15:00Z', rating: 4, comment: 'A bit hard to find but worth the effort. It is quite small, so it can feel cramped.' },
      ]
    },
    {
      id: 3,
      name: 'Neon Alley Market',
      location: 'Shinjuku, Tokyo',
      bestSeason: 'All Year',
      description: 'A hidden alleyway that comes alive after midnight with incredible street food stalls, tiny bars, and a cyberpunk vibe.',
      imageUrl: 'https://picsum.photos/seed/market/600/400',
      reviews: [
        { id: 6, username: 'Kenji', date: '2024-07-19T23:30:00Z', rating: 5, comment: 'This place is my jam! Amazing street food and an incredible cyberpunk vibe. Not for the faint of heart!' },
      ]
    }
];

export const MOCK_HOTELS: Hotel[] = [
  { 
    id: 1, 
    name: 'The Grand Vista Hotel', 
    coordinates: { lat: 34.0522, lng: -118.2437 }, 
    images: ['https://picsum.photos/seed/vista/800/600', 'https://picsum.photos/seed/vista-room/800/600', 'https://picsum.photos/seed/vista-pool/800/600'],
    address: '123 Vista Blvd, Los Angeles, CA',
    amenities: ['WiFi', 'Pool', 'Gym'],
    pricePerNight: 250,
    reviews: [
        { id: 101, username: 'Chloe', date: '2024-08-10T15:00:00Z', rating: 5, comment: 'Stunning views and impeccable service. The rooftop pool is a must-see!' },
        { id: 102, username: 'Kenji', date: '2024-07-22T11:00:00Z', rating: 4, comment: 'Great location, but the breakfast was a bit pricey for what it was.' },
    ],
    rooms: [
        { type: 'Single', price: 180, availability: 5 },
        { type: 'Double', price: 250, availability: 8 },
        { type: 'Suite', price: 450, availability: 2 },
    ]
  },
  { 
    id: 2, 
    name: 'City Center Inn', 
    coordinates: { lat: 34.055, lng: -118.245 }, 
    images: ['https://picsum.photos/seed/cityinn/800/600', 'https://picsum.photos/seed/cityinn-room/800/600'],
    address: '456 Central Ave, Los Angeles, CA',
    amenities: ['WiFi'],
    pricePerNight: 120,
    reviews: [
        { id: 103, username: 'Alex', date: '2024-08-05T12:00:00Z', rating: 4, comment: 'Can\'t beat the location for the price. Rooms are basic but clean.' },
    ],
    rooms: [
        { type: 'Single', price: 100, availability: 10 },
        { type: 'Double', price: 120, availability: 0 },
    ]
  },
  { 
    id: 3, 
    name: 'Lakeside Resort', 
    coordinates: { lat: 34.06, lng: -118.23 }, 
    images: ['https://picsum.photos/seed/lakeside/800/600', 'https://picsum.photos/seed/lakeside-room/800/600'],
    address: '789 Lakeview Dr, Los Angeles, CA',
    amenities: ['WiFi', 'Pool'],
    pricePerNight: 350,
    reviews: [],
    rooms: [
        { type: 'Deluxe', price: 350, availability: 6 },
        { type: 'Suite', price: 600, availability: 0 },
    ]
  },
   { 
    id: 4, 
    name: 'The Royal Palace', 
    coordinates: { lat: 34.065, lng: -118.24 },
    images: ['https://picsum.photos/seed/royal/800/600'],
    address: '1 Royal Plaza, Los Angeles, CA',
    amenities: ['WiFi', 'Pool', 'Gym'],
    pricePerNight: 500,
    reviews: [],
    rooms: [
        { type: 'Single', price: 0, availability: 0 },
        { type: 'Double', price: 0, availability: 0 },
        { type: 'Deluxe', price: 0, availability: 0 },
        { type: 'Suite', price: 0, availability: 0 },
    ]
  },
];


export const MOCK_DANGER_ZONES: DangerZone[] = [
  { id: 'dz1', coordinates: { lat: 34.045, lng: -118.255 }, radius: 250, level: 'High', type: 'High Crime Report', description: 'Recent reports of theft and robbery in this area. Avoid walking alone at night.' },
  { id: 'dz2', coordinates: { lat: 34.058, lng: -118.245 }, radius: 150, level: 'Medium', type: 'Frequent Accidents', description: 'This intersection is known for a high rate of traffic accidents. Exercise caution when crossing.' },
  { id: 'dz3', coordinates: { lat: 34.051, lng: -118.235 }, radius: 100, level: 'Low', type: 'User Report', description: 'User reported poor street lighting and uneven pavement. Watch your step.' },
];