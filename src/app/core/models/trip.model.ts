// master - MARSISCA - BEGIN 2025-10-11
export interface Trip {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  rating: number | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TripsResponse {
  success: boolean;
  message: string;
  data: Trip[];
}
// master - MARSISCA - END 2025-10-11
