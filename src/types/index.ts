export type AnimalType = 'Dog' | 'Cat' | 'Rabbit' | 'Bird' | 'Other';

export interface PetWellnessSnapshot {
  nutrition: number; // 0-100 engagement indicator
  hydration: number;
  activity: number;
  vaccinations: number;
  reminders: number;
}

export interface Pet {
  id: string;
  name: string;
  animalType: AnimalType;
  breed: string;
  age: number; // years
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Neutered Male' | 'Spayed Female';
  weight: number; // in kg
  activityLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  allergies: string;
  dietaryRestrictions: string;
  indoorOutdoor: 'Indoor' | 'Outdoor' | 'Both';
  photoUrl: string;
  microchipId?: string;
  wellness: PetWellnessSnapshot;
  lastCheckupDate?: string;
}

export interface FeedingMeal {
  id: string;
  time: string; // e.g. "07:30 AM"
  name: string;
  portion: string;
  completed: boolean;
  notes?: string;
}

export type ReminderType = 
  | 'vaccination'
  | 'feeding'
  | 'grooming'
  | 'medication'
  | 'vet'
  | 'dental';

export interface Reminder {
  id: string;
  petId: string;
  type: ReminderType;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:00 AM"
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  completed: boolean;
  notes?: string;
}

export type VetSpecialty = 
  | 'General Practice'
  | 'Dermatology'
  | 'Dental Health'
  | 'Clinical Nutrition'
  | 'Orthopedics & Surgery'
  | 'Internal Medicine';

export interface Veterinarian {
  id: string;
  name: string;
  credentials: string;
  qualification: string;
  clinic: string;
  specialty: VetSpecialty;
  location: string;
  rating: number;
  reviewCount: number;
  distance: string;
  consultationFee: number;
  currency: string; // e.g. '₹' or '$'
  whatsAppPhone: string; // international digits only, e.g. '919876543210'
  displayPhone: string; // e.g. '+91 98765 43210'
  availableDates: string[]; // e.g. ['Today', 'Tomorrow', '5 Oct 2026', '6 Oct 2026']
  availableSlots: string[]; // e.g. ['10:00 AM', '11:30 AM', '04:00 PM', '06:30 PM']
  unavailableSlots?: string[]; // for disabled slots display e.g. ['01:00 PM', '02:30 PM']
  consultationType: 'In-person' | 'Tele-Health Video' | 'In-person & Video';
  bio: string;
  avatarColor: string;
  photoUrl?: string;
}

export type AppointmentStatus = 
  | 'Awaiting confirmation'
  | 'Confirmed'
  | 'Cancelled'
  | 'Completed';

export interface VetAppointment {
  id: string;
  petId: string;
  petName: string;
  petBreed?: string;
  petAge?: string | number;
  vetId: string;
  vetName: string;
  clinic: string;
  specialty: string;
  date: string;
  time: string;
  consultationType: string;
  consultationFee?: number;
  currency?: string;
  reason: string;
  additionalInfo?: string;
  status: AppointmentStatus;
  bookingMethod: 'whatsapp' | 'in-app';
  whatsAppUrl?: string;
  vetPhone?: string;
  createdAt: string;
}

export type ProductCategory = 
  | 'Food'
  | 'Treats'
  | 'Toys'
  | 'Grooming'
  | 'Beds'
  | 'Bowls'
  | 'Leashes'
  | 'Hygiene';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  forSpecies: AnimalType[];
  inStock: boolean;
  tag?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
}

export type NavTab = 
  | 'home'
  | 'pet'
  | 'feeding'
  | 'seasonal'
  | 'vet'
  | 'store'
  | 'reminders'
  | 'assistant';
