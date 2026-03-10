export interface AuthUser {
  id: string;                           
  email: string;
  name: string;
  avatar?: string;
  role: "USER" | "ADMIN";
  provider: "LOCAL" | "GOOGLE";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}