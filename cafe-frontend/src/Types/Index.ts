// Matches the backend's EventDto
export interface EventDto {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;        // ✅ Added
} 

// Matches the backend's current-user response
export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];   // e.g., ["Admin"] or []
}

// Payload for logging in
export interface LoginDto {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Payload for registering a new customer
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}