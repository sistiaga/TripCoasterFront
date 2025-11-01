// master - MARSISCA - BEGIN 2025-11-01
export interface TripPhoto {
  id: number;
  url: string;
  filename: string;
  tripId: number;
  createdAt: string;
}

export interface Trip {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  rating: number | null;
  userId: number;
  photos?: TripPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface TripsResponse {
  success: boolean;
  message: string;
  data: Trip[];
}
// master - MARSISCA - END 2025-11-01
