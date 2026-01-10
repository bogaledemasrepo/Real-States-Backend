import db from '../models';
import { propertyTable } from '../models/schema';
import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

export const propertyController = {
  // 1. Create a new property
  createProperty: async (req: Request, res: Response) => {
    try {
      const newProperty = await db
        .insert(propertyTable)
        .values(req.body)
        .returning();
      return res.status(201).json(newProperty[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to create property' });
    }
  },

  // 2. Get all properties with Agent and Review details
  getAllProperties: async (req: Request, res: Response) => {
    try {
      const properties = await db.query.propertyTable.findMany({
        with: {
          reviews: true,
        },
      });
      return res.json(properties);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to fetch properties' });
    }
  },

  // 3. Get a single property by ID
  getPropertyById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(400).json({ error: 'Property ID is required' });
      const property = await db.query.propertyTable.findFirst({
        where: eq(propertyTable.id, id),
        with: {
          reviews: {
            with: { user: { columns: { name: true, avatar: true } } },
          },
        },
      });

      if (!property)
        return res.status(404).json({ error: 'Property not found' });
      return res.json(property);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error fetching property' });
    }
  },

  // 4. Update property
  updateProperty: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(400).json({ error: 'Property ID is required' });
      const updated = await db
        .update(propertyTable)
        .set(req.body)
        .where(eq(propertyTable.id, id))
        .returning();

      return res.json(updated[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Update failed' });
    }
  },

  // 5. Delete property
  deleteProperty: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(400).json({ error: 'Property ID is required' });
      await db.delete(propertyTable).where(eq(propertyTable.id, id));
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Delete failed' });
    }
  },
};
