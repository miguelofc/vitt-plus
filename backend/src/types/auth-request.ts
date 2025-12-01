import { Request } from "express";

export interface AuthPayload {
  uid: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
