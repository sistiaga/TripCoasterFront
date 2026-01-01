// master - MARSISCA - BEGIN 2025-12-08
import { TripLocationDetail } from './location.model';

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
  // master - MARSISCA - BEGIN 2024-12-24
  mainPhoto?: TripPhoto | null;
  // master - MARSISCA - END 2024-12-24
  // master - MARSISCA - BEGIN 2025-12-28
  locations?: TripLocationDetail[];
  // master - MARSISCA - END 2025-12-28
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
