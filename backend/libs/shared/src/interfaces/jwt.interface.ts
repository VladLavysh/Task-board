export interface IJWTPayload {
  sub: string; // User ID
  email: string; // User email
  iat?: number;
}
