export interface IJWTPayload {
  sub: string; // user ID
  email: string;
  iat?: number; // issued at time
  exp?: number; // expiration time
}
