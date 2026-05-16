import { Airport, Flight, Seat } from './types';

export const AIRPORTS: Airport[] = [
  { code: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', country: 'US' },
  { code: 'MXP', name: 'Malpensa Airport', city: 'Milan', country: 'Italy' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'GRU', name: 'Guarulhos Intl', city: 'São Paulo', country: 'Brazil' }
];

export const INITIAL_FLIGHTS: Flight[] = [
  {
    id: '1',
    flightNo: 'LH 401',
    airlineName: 'Lufthansa',
    airlineLogoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=120&auto=format&fit=crop', // Beautiful flight pic
    from: 'JFK',
    to: 'MXP',
    departureTime: '06:30 AM',
    arrivalTime: '08:15 AM',
    basePrice: 450,
    duration: '7h 45m',
    aircraft: 'A350-900',
    distance: 6470,
    status: 'Airborne',
    progress: 36,
    gate: 'A14'
  },
  {
    id: '2',
    flightNo: 'DL 102',
    airlineName: 'Delta Air',
    airlineLogoUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=120&auto=format&fit=crop',
    from: 'JFK',
    to: 'CDG',
    departureTime: '10:45 PM',
    arrivalTime: '11:55 AM',
    basePrice: 380,
    duration: '7h 10m',
    aircraft: 'Boeing 777-300ER',
    distance: 5830,
    status: 'Scheduled',
    progress: 0,
    gate: 'B22'
  },
  {
    id: '3',
    flightNo: 'EK 201',
    airlineName: 'Emirates',
    airlineLogoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=120&auto=format&fit=crop',
    from: 'EWR',
    to: 'DXB',
    departureTime: '08:20 PM',
    arrivalTime: '05:35 PM',
    basePrice: 1120,
    duration: '12h 15m',
    aircraft: 'Airbus A380-800',
    distance: 11020,
    status: 'Boarding',
    progress: 5,
    gate: 'C09'
  },
  {
    id: '4',
    flightNo: 'AF 007',
    airlineName: 'Air France',
    airlineLogoUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=120&auto=format&fit=crop',
    from: 'CDG',
    to: 'HND',
    departureTime: '01:15 PM',
    arrivalTime: '09:40 AM',
    basePrice: 980,
    duration: '11h 25m',
    aircraft: 'Boeing 787-9',
    distance: 9710,
    status: 'Scheduled',
    progress: 0,
    gate: 'E11'
  },
  {
    id: '5',
    flightNo: 'UA 904',
    airlineName: 'United Airlines',
    airlineLogoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=120&auto=format&fit=crop',
    from: 'GRU',
    to: 'LHR',
    departureTime: '09:50 PM',
    arrivalTime: '01:20 PM',
    basePrice: 850,
    duration: '11h 30m',
    aircraft: 'Boeing 777-200',
    distance: 9450,
    status: 'Delayed',
    progress: 0,
    gate: 'G03'
  }
];

export const generateSeatsForClass = (classType: 'First' | 'Business' | 'Economy'): Seat[] => {
  const seats: Seat[] = [];
  const rows = classType === 'First' ? ['A', 'B'] : classType === 'Business' ? ['C', 'D', 'E'] : ['H', 'J', 'K', 'L', 'M', 'N'];
  const maxSeatsPerRow = classType === 'First' ? 4 : classType === 'Business' ? 6 : 8;

  rows.forEach((row) => {
    for (let i = 1; i <= maxSeatsPerRow; i++) {
      // Seed pre-occupied seats randomly for realism
      const seedVal = Math.floor(Math.abs(Math.sin((row.charCodeAt(0) * 10) + i) * 100));
      const isOccupied = seedVal % 3 === 0;

      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        class: classType,
        isOccupied
      });
    }
  });

  return seats;
};
