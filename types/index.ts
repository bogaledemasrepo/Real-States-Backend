
export interface AuthUser {
  sub: string;         // The User UUID
  email: string;
  role: 'ADMIN' | 'CUSTOMER' | 'AGENT';
  iat?: number;
  exp?: number;
}