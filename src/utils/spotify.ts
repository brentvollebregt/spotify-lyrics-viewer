import { Dictionary, Request } from "express-serve-static-core";

export function isStoredTokenValid(req: Request<Dictionary<string>>): boolean {
  if (req.session === null) throw new Error("Session has not been set");

  if (!("access_token" in req.session) || !("expires_at" in req.session)) {
    return false; // Not stored
  }

  if (new Date(req.session.expires_at) < new Date()) {
    req.session.access_token = undefined;
    req.session.expires_at = undefined;
    req.session.refresh_token = undefined;
    return false; // Expired
  }

  return true;
}
