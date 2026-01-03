import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { usersTable } from "../models/schema";
import db from "../models";

interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string; avatar: string|null; role: string };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET!;
    if (!secret) {
      throw new Error("JWT_SECRET is not set");
    }
    const decoded = jwt.verify(token||"", secret) as { userId: string; role: string };
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, decoded.userId));

    if (!user) {
      return res.status(401).json({ error: "Invalid token: user not found" });
    }

    req.user = { id: user.id, name: user.name, email: user.email, avatar:user.avatar, role: user.role || "CUSTOMER" };
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};