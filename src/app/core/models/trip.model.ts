// master - MARSISCA - BEGIN 2025-12-08
export interface TripPhoto {
  id: number;
  url: string;
  path?: string;
  filename: string;
  originalName?: string;
  tripId: number;
  isMain?: boolean;
  latitude?: number;
  longitude?: number;
  metadata?: any;
  mimeType?: string;
  size?: number;
  cameraMake?: string;
  cameraModel?: string;
  dateTaken?: string;
  caption?: string;
  createdAt: string;
  updatedAt?: string;
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

export interface PhotoUpdateRequest {
  isMain?: boolean;
}

export interface PhotoResponse {
  success: boolean;
  message: string;
  data?: TripPhoto;
}
// master - MARSISCA - END 2025-12-08
