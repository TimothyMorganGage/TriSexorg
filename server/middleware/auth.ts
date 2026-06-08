import { Request, Response, NextFunction } from "express";

// TriSex.org has no role hierarchy: every authenticated member is an equal
// co-operator. Access is gated only on being signed in, never on a role.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}
