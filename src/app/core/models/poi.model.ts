// master - MARSISCA - BEGIN 2026-01-18
import { Location } from './location.model';

export interface POI {
  id: number;
  nameSpanish: string;
  nameEnglish: string;
  description?: string;
  latitude: number;
  longitude: number;
  category?: string;
  locationId?: number;
  location?: Location;
  createdAt: string;
  updatedAt: string;
}

export interface POIsResponse {
  success: boolean;
  message: string;
  data: POI[];
}

export interface POIResponse {
  success: boolean;
  message: string;
  data?: POI;
}

export interface CreatePOIRequest {
  nameSpanish: string;
  nameEnglish: string;
  description?: string;
  latitude: number;
  longitude: number;
  category?: string;
  locationId?: number;
}

export interface UpdatePOIRequest {
  nameSpanish?: string;
  nameEnglish?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  locationId?: number;
}

export interface DeletePOIResponse {
  success: boolean;
  message: string;
}
// master - MARSISCA - END 2026-01-18
