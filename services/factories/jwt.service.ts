import { Dictionary } from "async";
export interface JwtOptions {
  jwtIssuer: string;
  jwtSecret: string;
  expiryTimeMS: number;
}
export interface JwtSignOptions {
  expires: boolean;
  customClaims: Dictionary<string | number>;
  override_expiry_time_ms?: number;
  override_jwt_secret?: string;
}
export interface BaseJwtPayload {
  iss: string;
  sub: number | string;
  aud: string;
  type: string;
  iat: number;
  [key: string]: string | number;
}
export interface UserJwtPayload extends BaseJwtPayload {
  type: "user";
}
export { JsonWebTokenError } from "jsonwebtoken";
