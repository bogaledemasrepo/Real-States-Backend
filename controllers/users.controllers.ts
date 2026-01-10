import { eq, sql } from 'drizzle-orm';
import db from '../models';
import { usersTable } from '../models/schema';
import type { Request, Response } from 'express';

export const userController = {
  /**
   * @openapi
   * /users:
   * get:
   * tags: [Users]
   * summary: Get all users
   */
  getAllUser: async (req: Request, res: Response) => {
    try {
      // Selecting specific columns to avoid sending sensitive data like password
      const users = await db.select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        avatar: usersTable.avatar,
        role: usersTable.role,
        createdAt: usersTable.createdAt
      }).from(usersTable);

      res.status(200).json(users);
    } catch (error) {
        console.log(error)
        console.log(error)
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  /**
   * @openapi
   * /users/paged:
   * get:
   * tags: [Users]
   * summary: Get paginated users
   */
  getUsersPaged: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const data = await db.select()
        .from(usersTable)
        .limit(limit)
        .offset(offset);

      // Simple count query for total metadata
      const totalCount = await db.select({ count: sql<number>`count(*)` }).from(usersTable);

      res.status(200).json({
        data,
        meta: {
          total: totalCount[0]?.count,
          page,
          limit
        }
      });
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Pagination query failed" });
    }
  },

  /**
   * @openapi
   * /users/{userId}:
   * get:
   * tags: [Users]
   * summary: Get user details by ID
   */
  getUserDetail: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if(!userId) throw new Error("Please provide userId");
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));

      if (!user) return res.status(404).json({ message: "User not found" });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user; // Strip password
      res.status(200).json(safeUser);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Error retrieving user" });
    }
  },

  /**
   * @openapi
   * /users/{userId}:
   * put:
   * tags: [Users]
   * summary: Update user details
   */
  updateUserDetail: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if(!userId) throw new Error("Please provide userId");
      const body = req.body;

      const [updatedUser] = await db.update(usersTable)
        .set(body)
        .where(eq(usersTable.id, userId))
        .returning();

      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Update failed" });
    }
  },

  /**
   * @openapi
   * /users/{userId}:
   * delete:
   * tags: [Users]
   * summary: Delete a user
   */
  deleteUserDetail: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if(!userId) throw new Error("Please provide userId");
      await db.delete(usersTable).where(eq(usersTable.id, userId));

      res.status(204).send();
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Deletion failed" });
    }
  },
};