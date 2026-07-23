export type UserRole = "ADMIN" | "STAFF" | "USER";

export type UserType = "PROPIETARIO" | "INQUILINO" | "PERSONAL";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  tipo_usuario: UserType;
  vivienda: string | null;
  is_active: boolean;
}

export interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

export interface Incident {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  urgency: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  image?: string | null;
  image_url?: string | null;
  created_at: string;
  resolved_at: string | null;
  created_by: number;
  assigned_to: number | null;
  resolution_time: number | null;
}

export interface IncidentStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  avg_resolution_hours: number;
}

export interface Facility {
  id: number;
  name: string;
  description: string;
  opening_time: string;
  closing_time: string;
  slot_duration_minutes: number;
  active: boolean;
}

export interface Reservation {
  id: number;
  facility: number;
  facility_name: string;
  user: number;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface Package {
  id: number;
  resident: number;
  carrier: string;
  tracking_number: string;
  description: string;
  delivered: boolean;
  delivered_at: string | null;
}

export interface VisitorAccess {
  id: number;
  resident: number;
  visitor_name: string;
  visitor_dni: string;
  visit_date: string;
}

export interface Work {
  id: number;
  resident: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  company: string;
  workers_count: number;
  status: string;
}
