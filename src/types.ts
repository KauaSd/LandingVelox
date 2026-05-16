export type CabinClass = 'First' | 'Business' | 'Economy';

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Flight {
  id: string;
  flightNo: string;
  airlineName: string;
  airlineLogoUrl: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  basePrice: number;
  duration: string;
  aircraft: string;
  distance: number;
  status: 'Airborne' | 'Boarding' | 'Scheduled' | 'Delayed' | 'Landed';
  progress?: number; // 0 to 100
  gate?: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  class: CabinClass;
  isOccupied: boolean;
  isSelected?: boolean;
}

export interface PassengerDetails {
  fullName: string;
  email: string;
  passportNumber: string;
  mealPreference: 'Standard' | 'Vegan' | 'Halal' | 'Kosher' | 'None';
  loyaltyNumber: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'alert';
  timestamp: string;
}
