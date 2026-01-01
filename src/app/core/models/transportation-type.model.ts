// master - MARSISCA - BEGIN 2025-12-31
export interface TransportationType {
  id: number;
  nameSpanish: string;
  nameEnglish: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportationTypesResponse {
  success: boolean;
  message: string;
  data: TransportationType[];
}

export interface TransportationTypeResponse {
  success: boolean;
  message: string;
  data: TransportationType;
}

export interface CreateTransportationTypeRequest {
  nameSpanish: string;
  nameEnglish: string;
  icon?: string;
}

export interface UpdateTransportationTypeRequest {
  nameSpanish?: string;
  nameEnglish?: string;
  icon?: string;
}
// master - MARSISCA - END 2025-12-31
