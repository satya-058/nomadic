export enum View {
  DASHBOARD,
  BUDDIES,
  DISCOVER,
  MAPS,
  HOTELS,
  PROFILE,
  EMERGENCY,
}

export interface UserProfile {
  name: string;
  age: number | '';
  home: string;
  interests: string;
  profilePicUrl: string;
}

export interface TravelerProfile {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  interests: string[];
  home: string;
  destination: string;
  destinationCoordinates: { lat: number; lng: number };
  travelDates: {
    start: string;
    end: string;
  };
  profilePicUrl: string;
  coordinates: { lat: number; lng: number };
}

export interface Destination {
  name: string;
  description: string;
  attractions: string[];
  safetyTips: string;
  image: string;
}

export interface Review {
  id: number;
  username: string;
  date: string; // ISO 8601 date string
  rating: number; // 1 to 5
  comment: string;
}

export interface OffbeatLocation {
  id: number;
  name: string;
  location: string;
  bestSeason: string;
  description: string;
  imageUrl: string;
  reviews: Review[];
}

export interface Room {
    type: 'Single' | 'Double' | 'Deluxe' | 'Suite';
    price: number;
    availability: number; // number of rooms left
}

export interface Hotel {
    id: number;
    name: string;
    coordinates: { lat: number; lng: number };
    images: string[];
    address: string;
    amenities: string[];
    pricePerNight: number;
    reviews: Review[];
    rooms: Room[];
}

export interface DangerZone {
  id: string;
  coordinates: { lat: number; lng: number };
  radius: number; // in meters
  level: 'High' | 'Medium' | 'Low';
  type: string;
  description: string;
}

// FIX: Export Language type for use in i18n/index.tsx
export type Language = 'en' | 'hi' | 'te' | 'ta';


// A comprehensive type for storing all user registration details.
export interface UserAccount {
  fullName: string;
  email: string;
  phone: string;
  aadhaarLast4: string;
  password: string; // In a real app, this would be a hash.
  securityQuestion: string;
  securityAnswer: string;
}

export interface ConnectionRequest {
  buddyId: number;
  destination: string;
  startDate: string;
  endDate: string;
  travelStyle: string;
  budget: number;
  message: string;
}