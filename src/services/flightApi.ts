import { Flight } from '../types';

export interface FlightSearchParams {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}

// Simulador da Aviation Stack / Amadeus API
export const fetchFlights = async (params: FlightSearchParams): Promise<Flight[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulação de erro aleatório de rede (10% de chance para testar handling)
      if (Math.random() > 0.95) {
        reject(new Error('AviationStack API Rate Limit Exceeded or Network Error'));
        return;
      }

      const mockResponse: Flight[] = [
        {
          id: `live-${Date.now()}-1`,
          flightNo: `VX ${Math.floor(100 + Math.random() * 800)}`,
          airlineName: 'Lufthansa',
          airlineLogoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=120&auto=format&fit=crop',
          from: params.from,
          to: params.to,
          departureTime: '10:30 AM',
          arrivalTime: '02:45 PM',
          basePrice: 450 + Math.floor(Math.random() * 200),
          duration: '4h 15m',
          aircraft: 'A350-900',
          distance: 3800,
          status: 'Scheduled',
          progress: 0,
          gate: 'T2',
        },
        {
          id: `live-${Date.now()}-2`,
          flightNo: `DL ${Math.floor(100 + Math.random() * 800)}`,
          airlineName: 'Delta Air',
          airlineLogoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=120&auto=format&fit=crop',
          from: params.from,
          to: params.to,
          departureTime: '01:00 PM',
          arrivalTime: '05:30 PM',
          basePrice: 510 + Math.floor(Math.random() * 150),
          duration: '4h 30m',
          aircraft: 'B787-10',
          distance: 3800,
          status: 'Scheduled',
          progress: 0,
          gate: 'B12',
        }
      ];

      resolve(mockResponse);
    }, 1500); // 1.5s delay simulando rede
  });
};
